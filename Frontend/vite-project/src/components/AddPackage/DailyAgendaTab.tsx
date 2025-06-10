import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { createNewDailyPlan } from '../../Utils/packageFormUtils';

interface DailyPlan {
  id: string;
  day: number;
  title: string;
  description: string;
  activities: string[];
  locations: string[];
}

interface DailyAgendaTabProps {
  dailyPlans: DailyPlan[];
  setDailyPlans: React.Dispatch<React.SetStateAction<DailyPlan[]>>;
}

const DailyAgendaTab: React.FC<DailyAgendaTabProps> = ({ dailyPlans, setDailyPlans }) => {
  const [showDailyPlanModal, setShowDailyPlanModal] = useState(false);
  const [newDailyPlan, setNewDailyPlan] = useState({ name: '', description: '' });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const addDailyPlan = () => {
    setShowDailyPlanModal(true);
    setValidationErrors([]);
  };

  const validateDailyPlan = (): boolean => {
    const errors: string[] = [];

    if (!newDailyPlan.name.trim()) {
      errors.push('Day plan name is required');
    } else if (newDailyPlan.name.trim().length > 100) {
      errors.push('Day plan name cannot exceed 100 characters');
    }

    if (!newDailyPlan.description.trim()) {
      errors.push('Description is required');
    } else if (newDailyPlan.description.trim().length > 500) {
      errors.push('Description cannot exceed 500 characters');
    }

    // Check if we already have 10 plans (backend limit)
    if (dailyPlans.length >= 10) {
      errors.push('Cannot add more than 10 daily plans');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleAddDailyPlan = () => {
    if (!validateDailyPlan()) {
      return;
    }

    const nextDay = dailyPlans.length > 0 ? Math.max(...dailyPlans.map(p => p.day)) + 1 : 1;
    const plan = createNewDailyPlan(nextDay, newDailyPlan.name, newDailyPlan.description);
    
    setDailyPlans(prev => [...prev, plan]);
    setNewDailyPlan({ name: '', description: '' });
    setShowDailyPlanModal(false);
    setValidationErrors([]);
  };

  const handleCancelDailyPlan = () => {
    setNewDailyPlan({ name: '', description: '' });
    setShowDailyPlanModal(false);
    setValidationErrors([]);
  };

  const removeDailyPlan = (id: string) => {
    setDailyPlans(prev => {
      const filteredPlans = prev.filter(plan => plan.id !== id);
      // Reorder day numbers to be consecutive
      return filteredPlans.map((plan, index) => ({
        ...plan,
        day: index + 1
      }));
    });
  };

  const movePlanUp = (id: string) => {
    setDailyPlans(prev => {
      const planIndex = prev.findIndex(plan => plan.id === id);
      if (planIndex <= 0) return prev;

      const newPlans = [...prev];
      [newPlans[planIndex - 1], newPlans[planIndex]] = [newPlans[planIndex], newPlans[planIndex - 1]];
      
      // Update day numbers
      return newPlans.map((plan, index) => ({
        ...plan,
        day: index + 1
      }));
    });
  };

  const movePlanDown = (id: string) => {
    setDailyPlans(prev => {
      const planIndex = prev.findIndex(plan => plan.id === id);
      if (planIndex < 0 || planIndex >= prev.length - 1) return prev;

      const newPlans = [...prev];
      [newPlans[planIndex], newPlans[planIndex + 1]] = [newPlans[planIndex + 1], newPlans[planIndex]];
      
      // Update day numbers
      return newPlans.map((plan, index) => ({
        ...plan,
        day: index + 1
      }));
    });
  };

  // Enhanced Modal component with validation
  const Modal = React.useMemo(() => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="border-2 border-blue-400 rounded-lg p-6">
          <h2 className="text-3xl font-bold text-center mb-6">
            Add daily plan
            <span className="text-gray-500 text-lg font-normal"> ( day {dailyPlans.length + 1} )</span>
          </h2>
          
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <ul className="text-red-600 text-sm list-disc list-inside">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Day plan name *
              </label>
              <input
                type="text"
                placeholder="e.g., Explore Ancient Temples"
                value={newDailyPlan.name}
                onChange={(e) => {
                  setNewDailyPlan(prev => ({ ...prev, name: e.target.value }));
                  if (validationErrors.length > 0) setValidationErrors([]);
                }}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.some(e => e.includes('name')) ? 'border-red-300' : 'border-gray-300'
                }`}
                maxLength={100}
                autoFocus
              />
              <div className="text-xs text-gray-500 mt-1">
                {newDailyPlan.name.length}/100 characters
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                placeholder="Describe the day's activities and highlights..."
                value={newDailyPlan.description}
                onChange={(e) => {
                  setNewDailyPlan(prev => ({ ...prev, description: e.target.value }));
                  if (validationErrors.length > 0) setValidationErrors([]);
                }}
                rows={4}
                maxLength={500}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  validationErrors.some(e => e.includes('Description')) ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <div className="text-xs text-gray-500 mt-1">
                {newDailyPlan.description.length}/500 characters
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={handleCancelDailyPlan}
                className="px-6 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddDailyPlan}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ), [dailyPlans.length, newDailyPlan.name, newDailyPlan.description, validationErrors, handleCancelDailyPlan, handleAddDailyPlan]);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Daily plan details</h2>
        <p className="text-gray-600 text-sm">
          Enter your daily agenda one by one <span className="text-gray-400">( up to 10 plans )</span>
        </p>
        {dailyPlans.length > 0 && (
          <p className="text-blue-600 text-sm mt-1">
            {dailyPlans.length} of 10 daily plans added
          </p>
        )}
      </div>

      <div className="space-y-6">
        {/* Agenda Cards */}
        {dailyPlans.map((plan, index) => (
          <div
            key={plan.id}
            className="border border-gray-300 rounded-xl p-6 bg-white/90 mb-2"
            style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.03)' }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.title}</h3>
                <span className="text-gray-500 font-medium">( Day {plan.day} )</span>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                {/* Move up/down buttons */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => movePlanUp(plan.id)}
                    className="text-blue-500 hover:text-blue-700 text-xs border border-blue-200 rounded px-2 py-1"
                    title="Move up"
                  >
                    ↑
                  </button>
                )}
                {index < dailyPlans.length - 1 && (
                  <button
                    type="button"
                    onClick={() => movePlanDown(plan.id)}
                    className="text-blue-500 hover:text-blue-700 text-xs border border-blue-200 rounded px-2 py-1"
                    title="Move down"
                  >
                    ↓
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeDailyPlan(plan.id)}
                  className="text-red-400 hover:text-red-600 text-xs border border-red-200 rounded px-2 py-1"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="mt-4">
              {/* Split description by newlines for bullet points if needed */}
              {plan.description.split('\n').length > 1 ? (
                <ul className="list-disc ml-6 text-gray-700">
                  {plan.description.split('\n').map((item, i) =>
                    item.trim() ? <li key={i}>{item}</li> : null
                  )}
                </ul>
              ) : (
                <p className="text-gray-700">{plan.description}</p>
              )}
            </div>
          </div>
        ))}

        {/* Add Daily Plan Button */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <button
            type="button"
            onClick={addDailyPlan}
            disabled={dailyPlans.length >= 10}
            className={`border px-6 py-2 rounded-md font-medium transition-colors ${
              dailyPlans.length >= 10
                ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                : 'border-blue-500 text-blue-500 hover:bg-blue-50'
            }`}
          >
            {dailyPlans.length >= 10 ? 'Maximum plans reached' : 'Add daily plan'}
          </button>
          {dailyPlans.length >= 10 && (
            <p className="text-gray-500 text-sm mt-2">
              You can have a maximum of 10 daily plans
            </p>
          )}
        </div>
      </div>

      {/* Modal rendered using portal */}
      {showDailyPlanModal && createPortal(Modal, document.body)}
    </div>
  );
};

export default DailyAgendaTab;