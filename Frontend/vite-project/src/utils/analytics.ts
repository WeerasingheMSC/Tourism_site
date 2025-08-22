// Google Analytics 4 Setup Guide for Travel Booking Sri Lanka

// 1. First, you need to create a Google Analytics account and get your Measurement ID
// 2. Add this script tag to your index.html file (after implementing)
// 3. Add environment variable for GA_MEASUREMENT_ID

// Add this to your .env file:
// VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
  }
}

export const initGA = (measurementId: string) => {
  // Load Google Analytics script
  const script1 = document.createElement("script");
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  const script2 = document.createElement("script");
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}', {
      page_title: document.title,
      page_location: window.location.href
    });
  `;
  document.head.appendChild(script2);
};

export const trackEvent = ({ action, category, label, value }: GAEvent) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Pre-defined tracking events for your tourism platform
export const trackingEvents = {
  // Package related events
  viewPackages: () =>
    trackEvent({ action: "view_packages", category: "Packages" }),
  viewPackageDetails: (packageId: string) =>
    trackEvent({
      action: "view_package_details",
      category: "Packages",
      label: packageId,
    }),
  bookPackage: (packageId: string, price: number) =>
    trackEvent({
      action: "book_package",
      category: "Booking",
      label: packageId,
      value: price,
    }),

  // Hotel related events
  viewHotels: () => trackEvent({ action: "view_hotels", category: "Hotels" }),
  viewHotelDetails: (hotelId: string) =>
    trackEvent({
      action: "view_hotel_details",
      category: "Hotels",
      label: hotelId,
    }),
  bookHotel: (hotelId: string, price: number) =>
    trackEvent({
      action: "book_hotel",
      category: "Booking",
      label: hotelId,
      value: price,
    }),

  // Vehicle related events
  viewVehicles: () =>
    trackEvent({ action: "view_vehicles", category: "Vehicles" }),
  viewVehicleDetails: (vehicleId: string) =>
    trackEvent({
      action: "view_vehicle_details",
      category: "Vehicles",
      label: vehicleId,
    }),
  bookVehicle: (vehicleId: string, price: number) =>
    trackEvent({
      action: "book_vehicle",
      category: "Booking",
      label: vehicleId,
      value: price,
    }),

  // Custom tour events
  startCustomTour: () =>
    trackEvent({ action: "start_custom_tour", category: "Custom Tour" }),
  submitCustomTour: () =>
    trackEvent({ action: "submit_custom_tour", category: "Custom Tour" }),

  // User actions
  userSignUp: (method: string) =>
    trackEvent({ action: "sign_up", category: "User", label: method }),
  userLogin: (method: string) =>
    trackEvent({ action: "login", category: "User", label: method }),

  // Search events
  search: (searchTerm: string, category: string) =>
    trackEvent({
      action: "search",
      category: "Search",
      label: `${category}: ${searchTerm}`,
    }),

  // Contact events
  contactSubmit: () =>
    trackEvent({ action: "contact_submit", category: "Contact" }),

  // Destination events
  viewDestination: (destination: string) =>
    trackEvent({
      action: "view_destination",
      category: "Destinations",
      label: destination,
    }),
};

/* 
HOW TO IMPLEMENT:

1. Get Google Analytics Measurement ID:
   - Go to https://analytics.google.com
   - Create account for "Travel Booking Sri Lanka"
   - Get your G-XXXXXXXXXX measurement ID

2. Add to .env file:
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

3. Initialize in your main App.tsx or main.tsx:
   import { initGA } from './utils/analytics';
   
   useEffect(() => {
     const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
     if (measurementId) {
       initGA(measurementId);
     }
   }, []);

4. Use tracking events in your components:
   import { trackingEvents } from './utils/analytics';
   
   // In your component
   const handleViewPackages = () => {
     trackingEvents.viewPackages();
     navigate('/packages');
   };

5. Set up Google Search Console:
   - Go to https://search.google.com/search-console
   - Add property: https://travelbookingsrilanka.com
   - Verify ownership
   - Submit your sitemap: https://travelbookingsrilanka.com/sitemap.xml
*/
