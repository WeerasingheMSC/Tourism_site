import React, { useState, useEffect } from 'react';
import { Rate, Button, Input, Pagination, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined, StarOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { 
  submitRating, 
  getVehicleRatings, 
  getUserRating, 
  deleteRating,
  type Rating 
} from '../../api/ratings';
import { getCurrentUser } from '../../utils/authHelper';

const { TextArea } = Input;

interface RatingComponentProps {
  vehicleId: string;
  averageRating?: number;
  totalRatings?: number;
  onRatingUpdate?: (newAverage: number, newTotal: number) => void;
}

const RatingComponent: React.FC<RatingComponentProps> = ({
  vehicleId,
  averageRating = 0,
  totalRatings = 0,
  onRatingUpdate,
}) => {
  const navigate = useNavigate();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [userRating, setUserRating] = useState<Rating | null>(null);
  const [currentRating, setCurrentRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [actualAverageRating, setActualAverageRating] = useState(averageRating);
  const [actualTotalRatings, setActualTotalRatings] = useState(totalRatings);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Check authentication status
  const currentUser = getCurrentUser();
  const isLoggedIn = !!localStorage.getItem("authToken") && !!currentUser;

  // Load ratings and user's rating
  useEffect(() => {
    const initializeComponent = async () => {
      console.log('🎯 RatingComponent initializing for vehicleId:', vehicleId);
      
      // Load ratings data
      console.log('📊 Loading ratings for vehicle:', vehicleId);
      await loadRatings();
      setAuthInitialized(true);
    };

    initializeComponent();
  }, [vehicleId, currentPage]);

  // Load user rating when auth is initialized
  useEffect(() => {
    const currentUser = getCurrentUser();
    const isLoggedIn = !!localStorage.getItem("authToken") && !!currentUser;
    
    if (authInitialized && isLoggedIn) {
      loadUserRating();
    }
  }, [authInitialized, vehicleId]);

  const loadRatings = async () => {
    try {
      console.log('📊 Loading ratings for vehicle:', vehicleId, 'page:', currentPage);
      setLoading(true);
      const response = await getVehicleRatings(vehicleId, currentPage, 5);
      console.log('✅ Ratings loaded successfully:', response.data);
      
      setRatings(response.data.ratings);
      setTotalPages(response.data.totalPages);
      setActualAverageRating(response.data.averageRating);
      setActualTotalRatings(response.data.totalRatings);
      
      // Notify parent component of rating updates
      if (onRatingUpdate) {
        onRatingUpdate(response.data.averageRating, response.data.totalRatings);
      }
    } catch (error) {
      console.error("❌ Failed to load ratings:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserRating = async () => {
    try {
      const response = await getUserRating(vehicleId);
      if (response.data.rating) {
        setUserRating(response.data.rating);
        setCurrentRating(response.data.rating.rating);
        setReview(response.data.rating.review || "");
      }
    } catch (error) {
      console.error("Failed to load user rating:", error);
    }
  };

    const handleSubmitRating = async () => {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      message.info("Please login to submit a rating");
      navigate('/login');
      return;
    }

    if (currentRating === 0) {
      message.warning("Please select a rating");
      return;
    }

    console.log("🔐 Attempting to submit rating with auth status:", {
      hasToken: !!token,
      vehicleId,
      rating: currentRating,
      review: review?.substring(0, 50) + "..." // Log first 50 chars of review
    });

    try {
      setSubmitting(true);
      await submitRating(vehicleId, currentRating, review);
      message.success("Rating submitted successfully!");
      
      // Reload data
      await loadRatings();
      await loadUserRating();
      setShowRatingForm(false);
    } catch (error: any) {
      console.error("Failed to submit rating:", error);
      
      // Provide specific error messages based on the error
      if (error.message.includes("401") || error.message.includes("Unauthorized") || error.message.includes("Token is not valid")) {
        message.error("Your session has expired. Please login again to submit a rating.");
        navigate('/login');
      } else if (error.message.includes("You must be logged in")) {
        message.error("Please login to submit a rating");
        navigate('/login');
      } else {
        message.error(error.message || "Failed to submit rating");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRating = async () => {
    Modal.confirm({
      title: "Delete Rating",
      content: "Are you sure you want to delete your rating? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          setSubmitting(true);
          await deleteRating(vehicleId);
          message.success("Rating deleted successfully!");
          
          // Reset form
          setUserRating(null);
          setCurrentRating(0);
          setReview("");
          setShowRatingForm(false);
          
          // Reload data
          await loadRatings();
        } catch (error: any) {
          console.error("Failed to delete rating:", error);
          message.error(error.message || "Failed to delete rating");
        } finally {
          setSubmitting(false);
        }
      },
    });
  };

  const handleEditRating = () => {
    setShowRatingForm(true);
  };

  const resetForm = () => {
    if (userRating) {
      setCurrentRating(userRating.rating);
      setReview(userRating.review || "");
    } else {
      setCurrentRating(0);
      setReview("");
    }
    setShowRatingForm(false);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-current' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-4 lg:p-6 shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">Ratings & Reviews</h3>
      
      {/* Average Rating Display */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">
            {actualAverageRating > 0 ? actualAverageRating.toFixed(1) : "No rating"}
          </div>
          <Rate disabled value={actualAverageRating} className="text-lg" />
          <div className="text-sm text-gray-600 mt-1">
            {actualTotalRatings} {actualTotalRatings === 1 ? "rating" : "ratings"}
          </div>
        </div>
      </div>

      {/* User Rating Section */}
      {isLoggedIn && (
        <div className="mb-6 p-4 border rounded-lg bg-blue-50">
          {!userRating && !showRatingForm && (
            <div className="text-center">
              <p className="text-gray-700 mb-3">Share your experience with this vehicle</p>
              <Button
                type="primary"
                icon={<StarOutlined />}
                onClick={() => setShowRatingForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Rate This Vehicle
              </Button>
            </div>
          )}

          {userRating && !showRatingForm && (
            <div>
              <h4 className="font-semibold mb-3">Your Rating</h4>
              <div className="flex items-center justify-between">
                <div>
                  <Rate disabled value={userRating.rating} className="mb-2" />
                  <p className="text-sm text-gray-600">
                    Rated on {new Date(userRating.createdAt).toLocaleDateString()}
                  </p>
                  {userRating.review && (
                    <p className="text-gray-700 mt-2 italic">"{userRating.review}"</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={handleEditRating}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={handleDeleteRating}
                    loading={submitting}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}

          {showRatingForm && (
            <div>
              <h4 className="font-semibold mb-3">
                {userRating ? "Update Your Rating" : "Rate This Vehicle"}
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Rating:</label>
                  <Rate
                    value={currentRating}
                    onChange={setCurrentRating}
                    className="text-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Review (Optional):</label>
                  <TextArea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Share your experience with this vehicle..."
                    rows={3}
                    maxLength={500}
                    showCount
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    type="primary"
                    onClick={handleSubmitRating}
                    loading={submitting}
                    disabled={currentRating === 0}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {userRating ? "Update Rating" : "Submit Rating"}
                  </Button>
                  
                  <Button 
                    onClick={resetForm}
                    className="border-gray-300 hover:border-gray-400"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Login Prompt */}
      {!isLoggedIn && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-gray-700 mb-3">Please login to rate and review this vehicle</p>
          <Button
            type="primary"
            icon={<LoginOutlined />}
            onClick={() => navigate('/login')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Login to Rate
          </Button>
        </div>
      )}

      {/* Ratings List */}
      <div>
        <h4 className="font-semibold mb-4">Customer Reviews</h4>
        
        {loading ? (
          <div className="text-center py-8">Loading reviews...</div>
        ) : ratings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No reviews yet. Be the first to review this vehicle!
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {ratings.map((rating) => (
                <div key={rating._id} className="border-b pb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserOutlined className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{rating.userId.name}</span>
                        {renderStars(rating.rating)}
                        <span className="text-xs text-gray-500">
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {rating.review && (
                        <p className="text-gray-700 text-sm">{rating.review}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="mt-6 text-center">
                <Pagination
                  current={currentPage}
                  total={actualTotalRatings}
                  pageSize={5}
                  onChange={setCurrentPage}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RatingComponent;
