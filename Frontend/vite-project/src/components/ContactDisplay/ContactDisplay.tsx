import React from 'react';
import hotelIcon from '../../assets/icons/hotel icon.png';
import vehicleIcon from '../../assets/icons/vehicle icon.png';

interface ContactItem {
  id: string;
  name: string;
  contactNumber: string;
}

interface ContactData {
  type: 'hotel' | 'vehicle';
  id: string;
  items: ContactItem[];
}

// Demo data
const demoData: ContactData[] = [
  {
    type: 'hotel',
    id: 'hotels-section',
    items: [
      { id: 'h1', name: 'Grand Hotel Colombo', contactNumber: '+94 11 234 5678' },
      { id: 'h2', name: 'Ocean View Resort', contactNumber: '+94 11 345 6789' },
      { id: 'h3', name: 'Mountain Peak Hotel', contactNumber: '+94 11 456 7890' },
      { id: 'h4', name: 'City Center Inn', contactNumber: '+94 11 567 8901' },
    ]
  },
  {
    type: 'vehicle',
    id: 'vehicles-section',
    items: [
      { id: 'v1', name: 'Sri Lanka Tours & Travels', contactNumber: '+94 77 123 4567' },
      { id: 'v2', name: 'Island Express Rentals', contactNumber: '+94 77 234 5678' },
      { id: 'v3', name: 'Paradise Car Hire', contactNumber: '+94 77 345 6789' },
      { id: 'v4', name: 'Coastal Transport Services', contactNumber: '+94 77 456 7890' },
    ]
  }
];

const ContactDisplay: React.FC = () => {
  const getIcon = (type: 'hotel' | 'vehicle') => {
    return type === 'hotel' ? hotelIcon : vehicleIcon;
  };

  const getTypeLabel = (type: 'hotel' | 'vehicle') => {
    return type === 'hotel' ? 'Hotels' : 'Vehicles';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Contact Information
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {demoData.map((section) => (
            <div key={section.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                <div className="flex items-center justify-center space-x-3">
                  <img 
                    src={getIcon(section.type)} 
                    alt={`${section.type} icon`}
                    className="w-8 h-8 object-contain"
                  />
                  <h2 className="text-2xl font-bold text-white">
                    {getTypeLabel(section.type)}
                  </h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="space-y-4">
                  {section.items.map((item) => (
                    <div 
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">
                            {item.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Contact: {item.contactNumber}
                          </p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => window.open(`tel:${item.contactNumber}`)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                          >
                            <span>📞</span>
                            <span>Call</span>
                          </button>
                          
                          <button 
                            onClick={() => window.open(`https://wa.me/${item.contactNumber.replace(/\s+/g, '').replace('+', '')}`)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                          >
                            <span>💬</span>
                            <span>WhatsApp</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Contact Message */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <img 
                        src={getIcon(section.type)} 
                        alt={`${section.type} icon`}
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-800 mb-1">
                        {section.type === 'hotel' ? 'Hotel X' : 'Vehicle X'}
                      </h4>
                      <p className="text-blue-700 text-sm">
                        We will contact you soon
                      </p>
                      <p className="text-blue-600 text-xs mt-1">
                        For further detail contact us via WhatsApp
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactDisplay;
