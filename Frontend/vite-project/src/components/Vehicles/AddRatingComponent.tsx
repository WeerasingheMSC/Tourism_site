import React, { useState, useEffect } from 'react';
import { Rate, Button, Input, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, LoginOutlined, StarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { 
  submitRating, 
  getUserRating, 
  deleteRating,
  type Rating 
} from '../../api/ratings';
import { getCurrentUser } from '../../utils/authHelper';

const { TextArea } = Input;

interface AddRatingComponentProps {
  vehicleId: string;
  onRatingUpdate?: (newAverage: number, newTotal: number) => void;
}

const AddRatingComponent: React.FC<AddRatingComponentProps> = ({
  vehicleId,
  onRatingUpdate,
}) => {
  const navigate = useNavigate();
  const [userRating, setUserRating] = useState<Rating | null>(null);
  const [currentRating, setCurrentRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);

  // Check authentication status
  const currentUser = getCurrentUser();
  const isLoggedIn = !!localStorage.getItem("authToken") && !!currentUser;

  useEffect(() => {
    if (isLoggedIn) {
      loadUserRating();
    }
  }, [vehicleId, isLoggedIn]);

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
    if (!isLoggedIn) {
      message.warning("Please login to submit a rating");
      navigate("/login");
      return;
    }

    if (currentRating === 0) {
      message.error("Please select a rating");
      return;
    }

    try {
      setSubmitting(true);
      const response = await submitRating(vehicleId, currentRating, review);
      
      if (response.success) {
        message.success("Rating submitted successfully!");
        setUserRating(response.data);
        setShowRatingForm(false);
        
        // Trigger rating update in parent component
        if (onRatingUpdate) {
          // We'll need to reload the ratings to get the updated average
          window.location.reload(); // Simple solution for now
        }
      }
    } catch (error: any) {
      console.error("Rating submission error:", error);
      message.error(error.response?.data?.message || "Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRating = async () => {
    if (!userRating) return;

    Modal.confirm({
      title: 'Delete Rating',
      content: 'Are you sure you want to delete your rating? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteRating(userRating._id);
          message.success("Rating deleted successfully!");
          setUserRating(null);
          setCurrentRating(0);
          setReview("");
          setShowRatingForm(false);
          
          // Trigger rating update in parent component
          if (onRatingUpdate) {
            window.location.reload(); // Simple solution for now
          }
        } catch (error: any) {
          console.error("Rating deletion error:", error);
          message.error(error.response?.data?.message || "Failed to delete rating");
        }
      }
    });
  };

  const handleEditRating = () => {
    setShowRatingForm(true);
  };

  const handleLoginRedirect = () => {
    message.info("Please login to rate this vehicle");
    navigate("/login");
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
        <h2 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6 flex items-center">
          <StarOutlined className="mr-2 text-blue-600" />
          Rate This Vehicle
        </h2>
        
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <LoginOutlined className="text-blue-600 text-4xl mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Login Required</h3>
          <p className="text-gray-600 mb-4">
            Please login to your account to rate and review this vehicle
          </p>
          <Button 
            type="primary" 
            size="large"
            icon={<LoginOutlined />}
            onClick={handleLoginRedirect}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Login to Rate
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
      <h2 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6 flex items-center">
        <StarOutlined className="mr-2 text-blue-600" />
        Rate This Vehicle
      </h2>

      {!userRating && !showRatingForm ? (
        // Show "Add Rating" button when user hasn't rated yet
        <div className="text-center py-6">
          <p className="text-gray-600 mb-4">Share your experience with this vehicle</p>
          <Button 
            type="primary" 
            size="large"
            onClick={() => setShowRatingForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add Your Rating
          </Button>
        </div>
      ) : userRating && !showRatingForm ? (
        // Show existing rating with edit/delete options
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-medium text-gray-900">Your Rating</h3>
            <div className="flex space-x-2">
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
              >
                Delete
              </Button>
            </div>
          </div>
          <div className="flex items-center mb-2">
            <Rate disabled value={userRating.rating} />
            <span className="ml-2 text-gray-600">{userRating.rating}/5</span>
          </div>
          {userRating.review && (
            <p className="text-gray-700 text-sm">{userRating.review}</p>
          )}
        </div>
      ) : (
        // Show rating form
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating *
            </label>
            <Rate 
              value={currentRating} 
              onChange={setCurrentRating}
              className="text-xl"
            />
            {currentRating > 0 && (
              <span className="ml-2 text-gray-600">{currentRating}/5</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review (Optional)
            </label>
            <TextArea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience with this vehicle..."
              rows={4}
              maxLength={500}
              showCount
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button onClick={() => setShowRatingForm(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              loading={submitting}
              onClick={handleSubmitRating}
              disabled={currentRating === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {userRating ? 'Update Rating' : 'Submit Rating'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRatingComponent;
