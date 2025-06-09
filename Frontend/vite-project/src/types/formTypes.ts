export interface PersonalDetails {
    fullName: string;
    country: string;
    email: string;
    whatsapp: string;
    adults: number;
    children: number;
    arrivalDate: string;
    departureDate: string;
    flightDetails: string;
  }
  
  export interface PackageDetails {
    budget: string;
    roomType: string;
    specialNeeds: string;
    travelInterests: string[];
    days: number;
    placesToVisit: string;
  }
  
  export interface OtherDetails {
    transportBudget: string;
    airportPickup: string;
    mealPlan: string;
    guideNeeded: string;
    guideLanguage: string;
    tourBudgetFrom: number;
    tourBudgetTo: number;
    specialRequest: string;
    preferredLanguage: string;
  }
  