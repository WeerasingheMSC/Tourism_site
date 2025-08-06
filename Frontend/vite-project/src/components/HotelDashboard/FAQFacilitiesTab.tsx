import React, { type Dispatch, type SetStateAction, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

// FAQ item type
export type FAQ = { id: number; question: string; answer: string };
// Room type definition
export type RoomType = {
  id: number;
  name: string;
  description: string;
  pricePerNight: number;
  totalRooms: number;
  amenities: string[];
  maxOccupancy: number;
};

// Lists of static options
const facilitiesList = [
  "Free Wifi",
  "Fully AC",
  "BBQ Area",
  "Swimming pool",
  "Laundry Service",
  "Gym",
  "SPA",
  "Room Service",
];
const amenitiesList = [
  "Air Conditioning",
  "TV",
  "WiFi",
  "Mini Bar",
  "Desk",
  "Balcony",
];

// Props interface to lift state up
export interface FAQFacilitiesTabProps {
  facilities: string[];
  setFacilities: Dispatch<SetStateAction<string[]>>;
  faqs: FAQ[];
  setFaqs: Dispatch<SetStateAction<FAQ[]>>;
  roomTypes: RoomType[];
  setRoomTypes: Dispatch<SetStateAction<RoomType[]>>;
}

const FAQFacilitiesTab: React.FC<FAQFacilitiesTabProps> = ({
  facilities,
  setFacilities,
  faqs,
  setFaqs,
  roomTypes,
  setRoomTypes,
}) => {
  // Local UI state for modals
  const [showAddFAQ, setShowAddFAQ] = useState(false);
  const [newFAQ, setNewFAQ] = useState({ question: "", answer: "" });
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoom, setNewRoom] = useState<RoomType>({
    id: 0,
    name: "",
    description: "",
    pricePerNight: 0,
    totalRooms: 0,
    amenities: [],
    maxOccupancy: 1,
  });

  // Toggle facility checkbox
  const toggleFacility = (facility: string) => {
    setFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility]
    );
  };

  // Add/remove FAQ handlers
  const addFAQ = () => {
    if (newFAQ.question && newFAQ.answer) {
      const item: FAQ = { ...newFAQ, id: Date.now() };
      setFaqs((prev) => [...prev, item]);
      setNewFAQ({ question: "", answer: "" });
      setShowAddFAQ(false);
    }
  };
  const removeFAQ = (id: number) => setFaqs((prev) => prev.filter((f) => f.id !== id));

  // Add/remove room type handlers
  const addRoomType = () => {
    if (newRoom.name && newRoom.description) {
      const item: RoomType = { ...newRoom, id: Date.now() };
      setRoomTypes((prev) => [...prev, item]);
      setNewRoom({
        id: 0,
        name: "",
        description: "",
        pricePerNight: 0,
        totalRooms: 0,
        amenities: [],
        maxOccupancy: 1,
      });
      setShowAddRoom(false);
    }
  };
  const removeRoomType = (id: number) =>
    setRoomTypes((prev) => prev.filter((r) => r.id !== id));

  // Toggle amenity on newRoom
  const toggleAmenity = (amenity: string) => {
    setNewRoom((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  return (
    <div className="max-w-6xl">
      {/* FACILITIES */}
      <section className="mb-8 ">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Facilities</h2>
        <p className="text-gray-600 mb-4">Select the facilities in your hotel</p>
        <div className="grid grid-cols-4 gap-4">
          {facilitiesList.map((f) => (
            <label key={f} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={facilities.includes(f)}
                onChange={() => toggleFacility(f)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{f}</span>
            </label>
          ))}
        </div>
      </section>

      {/* FAQS */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Frequently Asked Questions
          </h3>
          <button
            onClick={() => setShowAddFAQ(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add FAQ
          </button>
        </div>
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="relative border border-gray-200 rounded-lg p-4 mb-4"
          >
            <button
              onClick={() => removeFAQ(faq.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              aria-label="Remove FAQ"
            >
              <X size={16} />
            </button>
            <h4 className="font-medium text-gray-800 mb-1">{faq.question}</h4>
            <p className="text-sm text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </section>

      {/* ROOM TYPES */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Room Types</h3>
          <button
            onClick={() => setShowAddRoom(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add Room Type
          </button>
        </div>
        {roomTypes.map((room) => (
          <div
            key={room.id}
            className="relative border border-gray-200 rounded-lg p-4 mb-4"
          >
            <button
              onClick={() => removeRoomType(room.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              aria-label="Remove Room Type"
            >
              <X size={16} />
            </button>
            <h4 className="font-medium text-gray-800 mb-1">
              {room.name} - ${room.pricePerNight}/night
            </h4>
            <p className="text-sm text-gray-600 mb-2">{room.description}</p>
            <p className="text-sm text-gray-600">
              Total Rooms: {room.totalRooms} | Max Occupancy: {room.maxOccupancy}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {room.amenities.map((a) => (
                <span
                  key={a}
                  className="text-xs bg-gray-100 px-2 py-1 rounded"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* MODALS */}
      {showAddFAQ &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-semibold mb-4 text-center">Add FAQ</h3>
              <input
                type="text"
                value={newFAQ.question}
                onChange={(e) =>
                  setNewFAQ((prev) => ({ ...prev, question: e.target.value }))
                }
                placeholder="Question"
                className="w-full mb-3 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                rows={3}
                value={newFAQ.answer}
                onChange={(e) =>
                  setNewFAQ((prev) => ({ ...prev, answer: e.target.value }))
                }
                placeholder="Answer"
                className="w-full mb-3 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowAddFAQ(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={addFAQ}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Add
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      {showAddRoom &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-full overflow-auto">
              <h3 className="text-xl font-semibold mb-4 text-center">Add Room Type</h3>
              <h4 className="font-medium mb-2">Name</h4>
              <input
                type="text"
                value={newRoom.name}
                onChange={(e) =>
                  setNewRoom((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Name"
                className="w-full mb-3 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <h4 className="font-medium mb-2">Description</h4>
              <textarea
                rows={2}
                value={newRoom.description}
                onChange={(e) =>
                  setNewRoom((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Description"
                className="w-full mb-3 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <h4 className="font-medium mb-2">Price per night</h4>
                  <input
                    type="number"
                    value={newRoom.pricePerNight}
                    onChange={(e) =>
                      setNewRoom((prev) => ({
                        ...prev,
                        pricePerNight: parseFloat(e.target.value),
                      }))
                    }
                    placeholder="Price per night"
                    className="w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <h4 className="font-medium mb-2">Total rooms</h4>
                  <input
                    type="number"
                    value={newRoom.totalRooms}
                    onChange={(e) =>
                      setNewRoom((prev) => ({
                        ...prev,
                        totalRooms: parseInt(e.target.value),
                      }))
                    }
                    placeholder="Total rooms"
                    className="w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <h4 className="font-medium mb-2">Max occupancy</h4>
                  <input
                    type="number"
                    value={newRoom.maxOccupancy}
                    onChange={(e) =>
                      setNewRoom((prev) => ({
                        ...prev,
                        maxOccupancy: parseInt(e.target.value),
                      }))
                    }
                    placeholder="Max occupancy"
                    className="w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mb-3">
                <h4 className="font-medium mb-2">Amenities</h4>
                <div className="grid grid-cols-2 gap-2">
                  {amenitiesList.map((a) => (
                    <label key={a} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newRoom.amenities.includes(a)}
                        onChange={() => toggleAmenity(a)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{a}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowAddRoom(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={addRoomType}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
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

export default FAQFacilitiesTab;
