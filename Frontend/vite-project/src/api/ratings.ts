const API_BASE_URL = "http://localhost:5001/api";

export interface Rating {
  _id: string;
  vehicleId: string;
  userId: {
    _id: string;
    name: string;
  };
  rating: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RatingResponse {
  success: boolean;
  data: {
    ratings: Rating[];
    totalRatings: number;
    averageRating: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface UserRatingResponse {
  success: boolean;
  data: {
    rating: Rating | null;
  };
}

export interface RatingSummaryResponse {
  success: boolean;
  data: {
    averageRating: number;
    totalRatings: number;
  };
}

// Submit or update a rating
export const submitRating = async (
  vehicleId: string,
  rating: number,
  review?: string
): Promise<{ success: boolean; message: string; data: Rating }> => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("You must be logged in to submit a rating");
  }

  console.log("🔐 Submitting rating with token:", token ? "Token exists" : "No token");
  
  const response = await fetch(`${API_BASE_URL}/ratings/vehicle/${vehicleId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ rating, review }),
  });

  if (!response.ok) {
    let errorMessage = "Failed to submit rating";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // If we can't parse the error response, use status text
      errorMessage = `${response.status}: ${response.statusText}`;
    }
    
    console.error("🚨 Rating submission failed:", {
      status: response.status,
      statusText: response.statusText,
      error: errorMessage
    });
    
    throw new Error(errorMessage);
  }

  return response.json();
};

// Get all ratings for a vehicle
export const getVehicleRatings = async (
  vehicleId: string,
  page: number = 1,
  limit: number = 10
): Promise<RatingResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/ratings/vehicle/${vehicleId}?page=${page}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Failed to get vehicle ratings");
  }

  return response.json();
};

// Get vehicle rating summary (for vehicle cards)
export const getVehicleRatingSummary = async (vehicleId: string): Promise<RatingSummaryResponse> => {
  const response = await fetch(`${API_BASE_URL}/ratings/vehicle/${vehicleId}/summary`);

  if (!response.ok) {
    throw new Error("Failed to get vehicle rating summary");
  }

  return response.json();
};

// Get user's rating for a specific vehicle
export const getUserRating = async (vehicleId: string): Promise<UserRatingResponse> => {
  const token = localStorage.getItem("authToken");
  
  const response = await fetch(`${API_BASE_URL}/ratings/vehicle/${vehicleId}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get user rating");
  }

  return response.json();
};

// Delete user's rating
export const deleteRating = async (vehicleId: string): Promise<{ success: boolean; message: string }> => {
  const token = localStorage.getItem("authToken");
  
  const response = await fetch(`${API_BASE_URL}/ratings/vehicle/${vehicleId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete rating");
  }

  return response.json();
};
