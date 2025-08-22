import { useState, useEffect, useMemo } from "react";
import VehicleCard from "./VehicleCard";
import { FilterSection, type Filters } from "./FilterSection";
import vehicleBg from "../../assets/vehiclebg.png";

// Import SEO hooks
import { useSEO, seoConfigs } from "../../hooks/useSEO";

//const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Define types
interface Vehicle {
  _id: string;
  title: string;
  description?: string;
  vehicleType: string;
  make?: string;
  brand?: string;
  model: string;
  year: number;
  registrationNumber?: string;
  licensePlate?: string;
  seatCapacity?: number;
  seatingCapacity?: number;
  transmission?: string;
  fuelType?: string;
  price?: {
    perDay?: number;
    perHour?: number;
    perKilometer?: number;
  };
  images?: string[];
  features?: string[];
  available?: boolean;
  approvalStatus?: {
    status: "pending" | "approved" | "rejected";
  };
  ownerId?:
    | string
    | {
        _id: string;
        name?: string;
        email?: string;
      };
  location?: {
    city?: string;
    area?: string;
  };
  averageRating?: number;
  totalRatings?: number;
  createdAt: Date;
}

// API function to fetch vehicles
const fetchVehicles = async (): Promise<Vehicle[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vehicles`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch vehicles");
    }

    const result = await response.json();
    const vehicles = result.data || result;

    // Filter to show only approved and available vehicles
    return vehicles.filter(
      (vehicle: Vehicle) =>
        vehicle.approvalStatus?.status === "approved" &&
        vehicle.available === true
    );
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return [];
  }
};

const filterButtons: string[] = [
  "car",
  "van",
  "bus",
  "suv",
  "motorcycle",
  "truck",
];

const VehiclesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<Filters>({
    vehicleType: "",
    priceRange: "",
    fuelType: "",
    serviceType: "",
    rating: "",
    rentalType: "",
    brand: "",
    seatCount: "",
    drivingPurpose: "",
    location: "", // Added location filter
    others: [],
  });

  // Initialize SEO for vehicles page
  useSEO(seoConfigs.vehicles);

  // Load vehicles on component mount
  useEffect(() => {
    const loadVehicles = async () => {
      setLoading(true);
      const vehicleData = await fetchVehicles();
      setVehicles(vehicleData);
      setLoading(false);
    };

    loadVehicles();
  }, []);

  // Helper functions to get vehicle data with fallbacks
  const getVehicleName = (vehicle: Vehicle) => {
    return (
      vehicle.title ||
      `${vehicle.make || vehicle.brand || ""} ${vehicle.model || ""}`.trim() ||
      "Unnamed Vehicle"
    );
  };

  const getVehiclePrice = (vehicle: Vehicle) => {
    if (vehicle.price?.perDay) {
      return `${vehicle.price.perDay}$/day`;
    } else if (vehicle.price?.perHour) {
      return `${vehicle.price.perHour}$/hour`;
    } else if (vehicle.price?.perKilometer) {
      return `${vehicle.price.perKilometer}$/km`;
    }
    return "Price on request";
  };

  const getVehicleImage = (vehicle: Vehicle) => {
    return vehicle.images && vehicle.images.length > 0
      ? vehicle.images[0]
      : vehicleBg;
  };

  const getVehicleBrand = (vehicle: Vehicle) => {
    return vehicle.make || vehicle.brand || "Unknown Brand";
  };

  const getVehicleTags = (vehicle: Vehicle) => {
    const tags = [];
    if (vehicle.features && vehicle.features.length > 0) {
      tags.push(...vehicle.features.slice(0, 3)); // Show first 3 features
    }
    if (vehicle.fuelType) {
      tags.push(vehicle.fuelType);
    }
    if (vehicle.transmission) {
      tags.push(vehicle.transmission);
    }
    return tags;
  };

  const getSeatCount = (vehicle: Vehicle) => {
    return (vehicle.seatCapacity || vehicle.seatingCapacity || 0).toString();
  };

  // Memoized filtered vehicles for better performance
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle: Vehicle) => {
      let matches = true;

      // Search query filter - comprehensive search across multiple fields
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const vehicleName = getVehicleName(vehicle).toLowerCase();
        const vehicleBrand = getVehicleBrand(vehicle).toLowerCase();
        const vehicleType = vehicle.vehicleType.toLowerCase();
        const description = vehicle.description?.toLowerCase() || "";
        const registrationNumber =
          vehicle.registrationNumber?.toLowerCase() || "";
        const licensePlate = vehicle.licensePlate?.toLowerCase() || "";
        const model = vehicle.model?.toLowerCase() || "";
        const features =
          vehicle.features?.map((f) => f.toLowerCase()).join(" ") || "";

        const searchMatches =
          vehicleName.includes(query) ||
          vehicleBrand.includes(query) ||
          vehicleType.includes(query) ||
          description.includes(query) ||
          registrationNumber.includes(query) ||
          licensePlate.includes(query) ||
          model.includes(query) ||
          features.includes(query);
        matches = matches && searchMatches;
      }

      // Active filter button
      if (activeFilter) {
        matches =
          matches &&
          vehicle.vehicleType.toLowerCase() === activeFilter.toLowerCase();
      }

      // Sidebar filters
      if (filters.vehicleType) {
        matches =
          matches &&
          vehicle.vehicleType.toLowerCase() ===
            filters.vehicleType.toLowerCase();
      }

      if (filters.brand) {
        const vehicleBrand = getVehicleBrand(vehicle);
        matches =
          matches &&
          vehicleBrand.toLowerCase().includes(filters.brand.toLowerCase());
      }

      if (filters.fuelType) {
        matches =
          matches &&
          vehicle.fuelType?.toLowerCase() === filters.fuelType.toLowerCase();
      }

      if (filters.seatCount) {
        const seatCount = getSeatCount(vehicle);
        const seatCountNum = parseInt(seatCount);
        if (filters.seatCount === "Above") {
          matches = matches && seatCountNum > 10;
        } else {
          matches = matches && seatCountNum === parseInt(filters.seatCount);
        }
      }

      if (filters.location) {
        matches =
          matches &&
          vehicle.location?.city?.toLowerCase() ===
            filters.location.toLowerCase();
      }

      if (filters.priceRange && vehicle.price?.perDay) {
        const price = vehicle.price.perDay;
        const [min, max] = filters.priceRange
          .split(" - ")
          .map((p: string) => parseFloat(p.replace("$", "").replace("+", "")));
        if (filters.priceRange.includes("+")) {
          matches = matches && price >= min;
        } else {
          matches = matches && price >= min && price <= max;
        }
      }

      // Service Type filter (AC, features, etc.)
      if (filters.serviceType) {
        if (filters.serviceType === "With Driver") {
          const hasDriver =
            vehicle.features?.some(
              (feature) =>
                feature.toLowerCase().includes("driver") ||
                feature.toLowerCase().includes("chauffeur")
            ) || false;
          matches = matches && hasDriver;
        } else if (filters.serviceType === "Without Driver") {
          const hasDriver =
            vehicle.features?.some(
              (feature) =>
                feature.toLowerCase().includes("driver") ||
                feature.toLowerCase().includes("chauffeur")
            ) || false;
          matches = matches && !hasDriver;
        }
      }

      // Rental Type filter
      if (filters.rentalType) {
        if (filters.rentalType === "Per Day" && !vehicle.price?.perDay) {
          matches = false;
        } else if (
          filters.rentalType === "Per Hour" &&
          !vehicle.price?.perHour
        ) {
          matches = false;
        } else if (
          filters.rentalType === "Per Kilometer" &&
          !vehicle.price?.perKilometer
        ) {
          matches = false;
        }
      }

      // Rating filter (placeholder for when rating system is implemented)
      if (filters.rating) {
        // For now, assume all vehicles meet rating criteria
        // This can be updated when vehicle rating system is implemented
      }

      // Driving Purpose filter (check if vehicle type matches purpose)
      if (filters.drivingPurpose) {
        if (filters.drivingPurpose === "Long distance touring") {
          matches =
            matches &&
            ["bus", "van", "suv"].includes(vehicle.vehicleType.toLowerCase());
        } else if (filters.drivingPurpose === "Short distance touring") {
          matches =
            matches &&
            ["car", "suv", "van"].includes(vehicle.vehicleType.toLowerCase());
        } else if (filters.drivingPurpose === "Local taxi") {
          matches =
            matches &&
            ["car", "van"].includes(vehicle.vehicleType.toLowerCase());
        }
      }

      // Others filter (Air conditioning, Luggage Capacity)
      if (filters.others.length > 0) {
        const hasAirConditioning =
          vehicle.features?.some(
            (feature) =>
              feature.toLowerCase().includes("air conditioning") ||
              feature.toLowerCase().includes("ac") ||
              feature.toLowerCase().includes("climate control")
          ) || false;

        const hasLuggageCapacity =
          vehicle.features?.some(
            (feature) =>
              feature.toLowerCase().includes("luggage") ||
              feature.toLowerCase().includes("cargo") ||
              feature.toLowerCase().includes("storage")
          ) || false;

        for (const filter of filters.others) {
          if (filter === "Air conditioning" && !hasAirConditioning) {
            matches = false;
            break;
          }
          if (filter === "Luggage Capacity" && !hasLuggageCapacity) {
            matches = false;
            break;
          }
        }
      }

      return matches;
    });
  }, [vehicles, searchQuery, activeFilter, filters]);

  return (
    <div className="bg-white pt-20">
      {/* Hero Section with Background */}
      <div className="relative overflow-hidden">
        {/* Background Image/Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-100"
          style={{
            backgroundImage: `url(${vehicleBg})`,
          }}
        />

        {/* Decorative Lights */}
        <div className="absolute top-10 right-10 w-4 h-4 bg-yellow-300 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-32 w-3 h-3 bg-yellow-200 rounded-full animate-pulse delay-100"></div>
        <div className="absolute top-32 right-20 w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-200"></div>

        <div className="relative z-10 container mx-auto px-4 py-16">
          {/* Header Section */}
          <div className="text-center mb-16">
            <p className="text-blue-200 text-sm mb-2 uppercase tracking-wider">
              FIND THE BEST SERVICE WITH US
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Enjoy the vacation with us
            </h1>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-6 bg-white rounded-full overflow-hidden">
              <div className="relative">
                <input
                  type="text"
                  placeholder="What are you looking for ......."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {filterButtons.map((filter) => (
                <button
                  key={filter}
                  onClick={() =>
                    setActiveFilter(activeFilter === filter ? "" : filter)
                  }
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === filter
                      ? "bg-white text-blue-600"
                      : "bg-blue-500 text-white hover:bg-blue-400"
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Vehicles Section - White Background */}
      <div className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              {/* Filter Button */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                  isFilterOpen
                    ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                    : "text-blue-500 border-blue-500 hover:bg-blue-50"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                  />
                </svg>
                {isFilterOpen ? "Hide Filter" : "Filter"}
              </button>

              {/* Centered Heading */}
              <div className="text-center flex-1">
                <p className="text-gray-500 text-sm uppercase tracking-wider">
                  CATEGORY
                </p>
                <h2 className="text-3xl font-bold text-gray-800">
                  Our Travel Partners
                </h2>
              </div>

              {/* Empty space for balance */}
              <div className="w-24"></div>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Filter Sidebar */}
            <FilterSection
              isOpen={isFilterOpen}
              filters={filters}
              setFilters={setFilters}
              onApplyFilters={() => setIsFilterOpen(false)}
            />

            {/* Vehicles Grid */}
            <div className={`${isFilterOpen ? "flex-1" : "w-full"}`}>
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Loading vehicles...</p>
                </div>
              ) : filteredVehicles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No vehicles found matching your criteria.
                  </p>
                  <button
                    onClick={() => {
                      setFilters({
                        vehicleType: "",
                        priceRange: "",
                        fuelType: "",
                        serviceType: "",
                        rating: "",
                        rentalType: "",
                        brand: "",
                        seatCount: "",
                        drivingPurpose: "",
                        location: "", // Added location reset
                        others: [],
                      });
                      setActiveFilter("");
                      setSearchQuery("");
                    }}
                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVehicles.map((vehicle: Vehicle) => (
                    <VehicleCard
                      key={vehicle._id}
                      id={vehicle._id}
                      image={getVehicleImage(vehicle)}
                      name={getVehicleName(vehicle)}
                      brand={getVehicleBrand(vehicle)}
                      price={getVehiclePrice(vehicle)}
                      rating={vehicle.averageRating || 0}
                      reviewCount={vehicle.totalRatings || 0}
                      tags={getVehicleTags(vehicle)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehiclesPage;
