import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface PackageItem {
  id: string;
  text: string;
}

interface IncludeNotIncludeTabProps {
  includedItems: PackageItem[];
  setIncludedItems: React.Dispatch<React.SetStateAction<PackageItem[]>>;
  notIncludedItems: PackageItem[];
  setNotIncludedItems: React.Dispatch<React.SetStateAction<PackageItem[]>>;
}

const IncludeNotIncludeTab: React.FC<IncludeNotIncludeTabProps> = ({
  includedItems, setIncludedItems, notIncludedItems, setNotIncludedItems
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'included' | 'notIncluded'>('included');
  const [newItemText, setNewItemText] = useState('');

  const handleAddItem = () => {
    if (newItemText.trim()) {
      const newItem: PackageItem = {
        id: Date.now().toString(),
        text: newItemText.trim()
      };

      if (modalType === 'included') {
        setIncludedItems(prev => [...prev, newItem]);
      } else {
        setNotIncludedItems(prev => [...prev, newItem]);
      }

      setNewItemText('');
      setShowModal(false);
    }
  };

  const handleRemoveItem = (id: string, type: 'included' | 'notIncluded') => {
    if (type === 'included') {
      setIncludedItems(prev => prev.filter(item => item.id !== id));
    } else {
      setNotIncludedItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const openModal = (type: 'included' | 'notIncluded') => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setNewItemText('');
  };

  

  // Modal component using useMemo and portal
  const Modal = React.useMemo(() => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Add items</h3>
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Type the option here......"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
          autoFocus
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddItem}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [newItemText, closeModal, handleAddItem]);

  return (
    <div className="space-y-8 p-8">
      {/* Included Items */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Included Items</h3>
        <p className="text-sm text-gray-600 mb-4">what are the items that include this plan</p>

        <div className="bg-white/50 rounded-xl p-6">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">What's included</h4>
          <div className="space-y-3 mb-6">
            {includedItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between group">
                <span className="text-gray-700">{item.text}</span>
                <button
                  onClick={() => handleRemoveItem(item.id, 'included')}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
            <button
              onClick={() => openModal('included')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Not Included Items */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Non Included Items</h3>
        <p className="text-sm text-gray-600 mb-4">what are the items that not include this plan</p>

        <div className="bg-white/50 rounded-xl p-6">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">What's not included</h4>
          <div className="space-y-3 mb-6">
            {notIncludedItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between group">
                <span className="text-gray-700">{item.text}</span>
                <button
                  onClick={() => handleRemoveItem(item.id, 'notIncluded')}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
            <button
              onClick={() => openModal('notIncluded')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>
      {/* Modal rendered using portal */}
      {showModal && createPortal(Modal, document.body)}
    </div>
  );
};

export default IncludeNotIncludeTab;