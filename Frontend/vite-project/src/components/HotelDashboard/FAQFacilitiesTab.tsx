import React, { useState } from 'react';
import { createPortal } from 'react-dom';

interface FAQFacilitiesTabProps {
  onBack: () => void;
  onValidationError: (message: string) => void;
}

const FAQFacilitiesTab: React.FC<FAQFacilitiesTabProps> = ({ onBack, onValidationError }) => {
  const [showAddFAQ, setShowAddFAQ] = useState(false);
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '' });
  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: "What kind of breakfast is served at Hotel ?",
      answer: "Guests staying at Hotel can enjoy a highly-rated breakfast during their stay (guest review score: 8.4). Breakfast option(s) include: Asian, American"
    }
  ]);
  
  // Form data state
  const [formData, setFormData] = useState({
    facilities: [] as string[],
    uploadedFiles: [] as File[],
    mapLocation: '',
    latitude: '',
    longitude: ''
  });

  const facilities = [
    'Free Wifi', 'Fully AC', 'BBQ Area', 'Swimming pool',
    'Laundry Service', 'Gym', 'SPA', 'Room Service'
  ];

  // Handle facility selection
  const toggleFacility = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };



  

  const addFAQ = () => {
    if (newFAQ.question && newFAQ.answer) {
      const newFAQItem = {
        id: Date.now(),
        question: newFAQ.question,
        answer: newFAQ.answer
      };
      setFaqs(prev => [...prev, newFAQItem]);
      setNewFAQ({ question: '', answer: '' });
      setShowAddFAQ(false);
    }
  };

  // Validate form
  const validateForm = () => {
    return formData.facilities.length > 0 && faqs.length > 0;
  };

  // Handle submit button
  const handleSubmit = () => {
    if (!validateForm()) {
      onValidationError('Please select at least one facility and add at least one FAQ before submitting');
      return;
    }
    onValidationError(''); // Clear any previous errors
    // Handle final submission here
    alert('Form submitted successfully!');
  };

  return (
    <div className="max-w-6xl">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">Facilities</h2>
      <p className="text-gray-600 mb-6">select the facilities in your hotel</p>
        
        {/* Facilities checkboxes */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {facilities.map((facility) => (
            <label key={facility} className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={formData.facilities.includes(facility)}
                onChange={() => toggleFacility(facility)}
                className="rounded text-blue-600 focus:ring-blue-500" 
              />
              <span className="text-sm text-gray-700">{facility}</span>
            </label>
          ))}
        </div>

        

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Frequently asked questions</h3>
          <p className="text-gray-600 text-sm mb-4">Add the questions here ( up to 10 )</p>
          
          {/* Display FAQs */}
          {faqs.map((faq) => (
            <div key={faq.id} className="border border-gray-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-800 mb-2">{faq.question}</h4>
              <p className="text-sm text-gray-600">{faq.answer}</p>
            </div>
          ))}

          {/* Add Question button */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <button 
              onClick={() => setShowAddFAQ(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Add Question
            </button>
          </div>
        </div>

        {/* Modal rendered using portal */}
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
        
        <div className="flex justify-between mt-8">
          <button 
            onClick={onBack}
            className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-400 font-medium"
          >
            Back
          </button>
          <button 
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 font-medium"
          >
            Submit
          </button>
        </div>
    </div>
  );
};

export default FAQFacilitiesTab;