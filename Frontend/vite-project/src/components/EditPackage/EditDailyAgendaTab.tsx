// src/components/AddPackage/DailyAgendaTab.tsx
import React, { useState } from "react";
import { createPortal } from "react-dom";

export interface DailyPlan {
  id: string;
  day: number;
  title: string;
  description: unknown;        // ← tolerate any incoming shape
  activities: string[];
  locations: string[];
}

interface DailyAgendaTabProps {
  dailyPlans: DailyPlan[];
  setDailyPlans: React.Dispatch<React.SetStateAction<DailyPlan[]>>;
}

// Normalize any value to a printable string
const toText = (v: unknown): string => {
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v.map(String).join("\n");
  if (v == null) return "";
  try {
    // objects, numbers, booleans, etc.
    return String(v);
  } catch {
    return "";
  }
};

const DailyAgendaTab: React.FC<DailyAgendaTabProps> = ({ dailyPlans, setDailyPlans }) => {
  const [showDailyPlanModal, setShowDailyPlanModal] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const addDailyPlan = () => setShowDailyPlanModal(true);

  const handleAddDailyPlan = () => {
    if (name.trim() && desc.trim()) {
      const plan: DailyPlan = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        day: dailyPlans.length + 1,
        title: name.trim(),
        description: desc.trim(),
        activities: [],
        locations: [],
      };
      setDailyPlans((prev) => [...prev, plan]);
      setName("");
      setDesc("");
      setShowDailyPlanModal(false);
    }
  };

  const handleCancelDailyPlan = () => {
    setName("");
    setDesc("");
    setShowDailyPlanModal(false);
  };

  const removeDailyPlan = (id: string) => {
    setDailyPlans((prev) =>
      prev
        .filter((p) => p.id !== id)
        .map((p, i) => ({ ...p, day: i + 1 }))
    );
  };

  const Modal = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="border-2 border-blue-400 rounded-lg p-6">
          <h2 className="text-3xl font-bold text-center mb-6">
            Add daily plan{" "}
            <span className="text-gray-500 text-lg font-normal">
              ( day {dailyPlans.length + 1} )
            </span>
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="day plan name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              autoFocus
            />
            <textarea
              placeholder="Describe the plan clearly here......."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
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
  );

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Daily plan details</h2>
        <p className="text-gray-600 text-sm">
          Enter your daily agenda one by one <span className="text-gray-400">( up to 10 )</span>
        </p>
      </div>

      <div className="space-y-6">
        {(dailyPlans || []).map((plan) => {
          const descText = toText(plan.description);         // ← normalize here
          const parts = descText.split("\n").filter(Boolean); // ← safe split

          return (
            <div
              key={plan.id}
              className="border border-gray-300 rounded-xl p-6 bg-white/90 mb-2"
              style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.03)" }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {plan.title || "Untitled day"}
                  </h3>
                  <span className="text-gray-500 font-medium">( Day {plan.day} )</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeDailyPlan(plan.id)}
                  className="text-red-400 hover:text-red-600 text-xs border border-red-200 rounded px-2 py-1 ml-4"
                >
                  Remove
                </button>
              </div>

              <div className="mt-4">
                {parts.length > 1 ? (
                  <ul className="list-disc ml-6 text-gray-700">
                    {parts.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700">{descText}</p>
                )}
              </div>
            </div>
          );
        })}

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <button
            type="button"
            onClick={addDailyPlan}
            className="border border-blue-500 text-blue-500 px-6 py-2 rounded-md hover:bg-blue-50 transition-colors font-medium"
          >
            Add daily plan
          </button>
        </div>
      </div>

      {showDailyPlanModal &&
        typeof document !== "undefined" &&
        createPortal(Modal, document.body)}
    </div>
  );
};

export default DailyAgendaTab;
