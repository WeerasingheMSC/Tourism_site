// types/hotelFormModels.ts

/**
 * Profile data for hotel owner details tab
 */
export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  language: 'English' | 'Sinhala' | 'Tamil';
  profilePicture: File | null;
}

/**
 * Data for the hotel details tab
 */
export interface HotelDetailsData {
  hotelName: string;
  address: string;
  area: string;
  district: 'Colombo' | 'Gampaha' | 'Kalutara' | 'Kandy' | 'Matale' | 'Nuwara Eliya';
  hotelType: 'Luxury hotel' | 'Boutique Hotel' | 'Resort' | 'Guest House' | 'Villa';
  description: string;
  uploadedFiles: File[];
  latitude: string;
  longitude: string;
}

/**
 * Data for the hotel rules tab
 */
export interface HotelRulesData {
  checkIn: string;
  checkOut: string;
  cancellationPolicy: string;
  childrenAndBeds: string;
  ageFrom: string;
  ageTo: string;
  pets: 'allowed' | 'not-allowed';
  paymentMethods: string[];
}

/**
 * A single FAQ item
 */
export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

/**
 * Room type model used in FAQ & facilities tab
 */
export interface RoomTypeModel {
  id: number;
  name: string;
  description: string;
  pricePerNight: number;
  totalRooms: number;
  amenities: string[];
  maxOccupancy: number;
}

/**
 * Data for the FAQ & facilities tab
 */
export interface FAQFacilitiesData {
  facilities: string[];
  uploadedFiles: File[];
  mapLocation: string;
  latitude: string;
  longitude: string;
  faqs: FAQ[];
  roomTypes: RoomTypeModel[];
}
