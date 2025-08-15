import React, { useState } from 'react';
import { createPortal } from 'react-dom';

const ServiceDetailsTab = () => {
  const [showAddFAQ, setShowAddFAQ] = useState(false);
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '' });
  const [serviceData, setServiceData] = useState({
    rentalType: 'Per hour',
    price: '',
    description: '',
    faqs: [
      {
        id: 1,
        question: 'How many of them can travel in this vehicle?',
        answer: 'Up to 30 persons including children, and there is no specific seat for children',
        isEditing: false
      }
    ]
  });

  const handleInputChange = (field: string, value: string) => {
    setServiceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFAQEdit = (id: number, field: 'question' | 'answer', value: string) => {
    setServiceData(prev => ({
      ...prev,
      faqs: prev.faqs.map(faq => 
        faq.id === id ? { ...faq, [field]: value } : faq
      )
    }));
  };

  const toggleFAQEdit = (id: number) => {
    setServiceData(prev => ({
      ...prev,
      faqs: prev.faqs.map(faq => 
        faq.id === id ? { ...faq, isEditing: !faq.isEditing } : faq
      )
    }));
  };

  const addNewFAQ = () => {
    setShowAddFAQ(true);
  };

  const addFAQ = () => {
    if (newFAQ.question && newFAQ.answer) {
      const newFAQItem = {
        id: Date.now(),
        question: newFAQ.question,
        answer: newFAQ.answer,
        isEditing: false
      };
      setServiceData(prev => ({
        ...prev,
        faqs: [...prev.faqs, newFAQItem]
      }));
      setNewFAQ({ question: '', answer: '' });
      setShowAddFAQ(false);
    }
  };

  const removeFAQ = (id: number) => {
    setServiceData(prev => ({
      ...prev,
      faqs: prev.faqs.filter(faq => faq.id !== id)
    }));
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">Hotel Rules</h2>
      <p className="text-gray-600 mb-6">Add your rules here</p>
      
      <div className="space-y-6">
        {/* Rental Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rental Type <span className="text-red-500">**</span>
          </label>
          <select
            required
            value={serviceData.rentalType}
            onChange={(e) => handleInputChange('rentalType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Per hour">Per hour</option>
            <option value="Per day">Per day</option>
            <option value="Per week">Per week</option>
            <option value="Per month">Per month</option>
            <option value="Per trip">Per trip</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price <span className="text-red-500">**</span>
          </label>
          <input
            type="text"
            required
            value={serviceData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder=""
          />
        </div>

        {/* Description About vehicle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description About vehicle <span className="text-red-500">**</span>
          </label>
          <textarea
            required
            value={serviceData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder=""
          />
        </div>

        {/* FAQ Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">Frequently asked questions</h3>
          <p className="text-sm text-gray-600 mb-4">Add the questions here ( up to 10 )</p>
          
          <div className="space-y-4">
            {serviceData.faqs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-lg border border-gray-200 p-4">
                {faq.isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => handleFAQEdit(faq.id, 'question', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your question..."
                    />
                    <textarea
                      value={faq.answer}
                      onChange={(e) => handleFAQEdit(faq.id, 'answer', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your answer..."
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => toggleFAQEdit(faq.id)}
                        className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => removeFAQ(faq.id)}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 mb-2">{faq.question}</h4>
                        <p className="text-gray-600 text-sm">{faq.answer}</p>
                      </div>
                      <button
                        onClick={() => toggleFAQEdit(faq.id)}
                        className="ml-4 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {serviceData.faqs.length < 10 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <button
                  onClick={addNewFAQ}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                >
                  Add Question
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal rendered using portal - unchanged */}
      {showAddFAQ && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4 text-center">Add FAQs</h3>
            
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  value={newFAQ.question}
                  onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the question"
                />
              </div>
              <div>
                <textarea
                  rows={3}
                  required
                  value={newFAQ.answer}
                  onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type your answer here.................."
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowAddFAQ(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={addFAQ}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ServiceDetailsTab;