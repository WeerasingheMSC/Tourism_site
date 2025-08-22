import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const useSEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
}: SEOProps) => {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Update meta tags
    const updateMetaTag = (
      name: string,
      content: string,
      property?: boolean
    ) => {
      const selector = property
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;

      if (!meta) {
        meta = document.createElement("meta");
        if (property) {
          meta.setAttribute("property", name);
        } else {
          meta.setAttribute("name", name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    if (description) {
      updateMetaTag("description", description);
      updateMetaTag("og:description", description, true);
      updateMetaTag("twitter:description", description, true);
    }

    if (keywords) {
      updateMetaTag("keywords", keywords);
    }

    if (image) {
      updateMetaTag("og:image", image, true);
      updateMetaTag("twitter:image", image, true);
    }

    if (url) {
      updateMetaTag("og:url", url, true);
      updateMetaTag("twitter:url", url, true);
    }

    if (title) {
      updateMetaTag("og:title", title, true);
      updateMetaTag("twitter:title", title, true);
    }

    updateMetaTag("og:type", type, true);
  }, [title, description, keywords, image, url, type]);
};

// Pre-defined SEO configurations for different pages
export const seoConfigs = {
  home: {
    title: "Sri Lanka Travel Booking | Tour Packages, Hotels & Vehicle Rentals",
    description:
      "Discover Sri Lanka with our comprehensive travel booking platform. Book tour packages to Sigiriya, Kandy, Ella, hotels, and vehicle rentals. Plan your perfect Sri Lankan adventure today!",
    keywords:
      "Sri Lanka travel, tour packages Sri Lanka, hotel booking Sri Lanka, vehicle rental Sri Lanka, Sigiriya tours, Kandy travel, Ella tours",
    url: "https://travelbookingsrilanka.com/",
  },
  packages: {
    title:
      "Sri Lanka Tour Packages | Sigiriya, Kandy, Ella & More | Travel Booking",
    description:
      "Explore amazing Sri Lanka tour packages including Sigiriya Lion Rock, Temple of Tooth Kandy, Ella Nine Arches Bridge, and more. Book your perfect Sri Lankan adventure today!",
    keywords:
      "Sri Lanka tour packages, Sigiriya tours, Kandy packages, Ella tours, Dambulla cave temple, Polonnaruwa tours, Nuwara Eliya packages",
    url: "https://travelbookingsrilanka.com/packages",
  },
  hotels: {
    title: "Hotel Booking Sri Lanka | Best Hotels & Accommodations",
    description:
      "Book the best hotels in Sri Lanka. Find accommodations in Kandy, Colombo, Galle, Ella, Sigiriya and all major tourist destinations. Best rates guaranteed!",
    keywords:
      "hotel booking Sri Lanka, hotels in Kandy, Colombo hotels, Galle hotels, Ella accommodation, Sigiriya hotels",
    url: "https://travelbookingsrilanka.com/hotels",
  },
  vehicles: {
    title: "Vehicle Rental Sri Lanka | Car Hire & Transport Services",
    description:
      "Rent vehicles in Sri Lanka for your perfect tour. Cars, vans, buses with experienced drivers. Explore Sigiriya, Kandy, Ella and all attractions safely and comfortably.",
    keywords:
      "vehicle rental Sri Lanka, car hire Sri Lanka, transport services, Sri Lanka taxi, tour vehicles",
    url: "https://travelbookingsrilanka.com/vehicles",
  },
  customTour: {
    title: "Custom Sri Lanka Tours | Personalized Travel Packages",
    description:
      "Create your perfect Sri Lanka tour with our custom travel packages. Choose your destinations, duration, and activities. Personalized itineraries for Sigiriya, Kandy, Ella and more!",
    keywords:
      "custom Sri Lanka tours, personalized travel packages, tailor made tours Sri Lanka, customized itineraries",
    url: "https://travelbookingsrilanka.com/CustomPackageForm",
  },
};
