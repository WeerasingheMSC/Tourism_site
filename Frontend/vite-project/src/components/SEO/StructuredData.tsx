import { useEffect } from "react";

interface StructuredDataProps {
  data: object;
  id?: string;
}

export const StructuredData: React.FC<StructuredDataProps> = ({
  data,
  id = "structured-data",
}) => {
  useEffect(() => {
    // Remove existing structured data script if it exists
    const existingScript = document.getElementById(id);
    if (existingScript) {
      existingScript.remove();
    }

    // Create new script element
    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const scriptToRemove = document.getElementById(id);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [data, id]);

  return null; // This component doesn't render anything visible
};

// Structured data templates for different types
export const structuredDataTemplates = {
  // Tourist attraction schema
  touristAttraction: (
    name: string,
    description: string,
    image: string,
    location: string
  ) => ({
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: name,
    description: description,
    image: image,
    address: {
      "@type": "PostalAddress",
      addressCountry: "LK",
      addressRegion: location,
    },
  }),

  // Hotel schema
  hotel: (
    name: string,
    description: string,
    image: string,
    priceRange: string,
    address: string
  ) => ({
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: name,
    description: description,
    image: image,
    priceRange: priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressCountry: "LK",
    },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "WiFi" },
      { "@type": "LocationFeatureSpecification", name: "Air Conditioning" },
      { "@type": "LocationFeatureSpecification", name: "Restaurant" },
    ],
  }),

  // Tour package schema
  tourPackage: (
    name: string,
    description: string,
    price: number,
    duration: string,
    destinations: string[]
  ) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: name,
    description: description,
    category: "Travel Package",
    offers: {
      "@type": "Offer",
      price: price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Duration",
        value: duration,
      },
      {
        "@type": "PropertyValue",
        name: "Destinations",
        value: destinations.join(", "),
      },
    ],
  }),

  // Vehicle rental schema
  vehicleRental: (
    name: string,
    description: string,
    pricePerDay: number,
    vehicleType: string
  ) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: name,
    description: description,
    category: "Vehicle Rental",
    offers: {
      "@type": "Offer",
      price: pricePerDay,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Vehicle Type",
        value: vehicleType,
      },
    ],
  }),

  // FAQ schema
  faq: (faqs: Array<{ question: string; answer: string }>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }),

  // Breadcrumbs schema
  breadcrumbs: (items: Array<{ name: string; url: string }>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }),
};

export default StructuredData;
