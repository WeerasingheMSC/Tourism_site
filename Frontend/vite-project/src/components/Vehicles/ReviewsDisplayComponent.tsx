import React, { useState, useEffect } from 'react';
import { Rate, Pagination, Spin } from 'antd';
import { UserOutlined, StarOutlined } from '@ant-design/icons';
import { getVehicleRatings, type Rating } from '../../api/ratings';

interface ReviewsDisplayComponentProps {
  vehicleId: string;
  averageRating?: number;
  totalRatings?: number;
}

const ReviewsDisplayComponent: React.FC<ReviewsDisplayComponentProps> = ({
  vehicleId,
  averageRating = 0,
  totalRatings = 0,
}) => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actualAverageRating, setActualAverageRating] = useState(averageRating);
  const [actualTotalRatings, setActualTotalRatings] = useState(totalRatings);

  useEffect(() => {
    loadRatings();
  }, [vehicleId, currentPage]);

  const loadRatings = async () => {
    try {
      setLoading(true);
      const response = await getVehicleRatings(vehicleId, currentPage, 5);
      
      setRatings(response.data.ratings);
      setTotalPages(response.data.totalPages);
      setActualAverageRating(response.data.averageRating);
      setActualTotalRatings(response.data.totalRatings);
    } catch (error) {
      console.error("Failed to load ratings:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Date not available';
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading && ratings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
      <h2 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6 flex items-center ">
        <StarOutlined className="mr-2 text-blue-600" />
        Customer Reviews & Ratings
      </h2>

      {/* Rating Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center mb-2">
              <span className="text-3xl font-bold text-blue-600 mr-2">
                {actualAverageRating.toFixed(1)}
              </span>
              <Rate disabled value={actualAverageRating} allowHalf className="text-lg" />
            </div>
            <p className="text-gray-600">
              Based on {actualTotalRatings} review{actualTotalRatings !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      ) : ratings.length > 0 ? (
        <div className="space-y-4">
          {ratings.map((rating) => (
            <div key={rating._id} className="border-b border-gray-100 pb-4 last:border-b-0">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserOutlined className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {rating.userId?.name || 'Anonymous User'}
                      </h4>
                      <div className="flex items-center mt-1">
                        <Rate disabled value={rating.rating} className="text-sm" />
                        <span className="ml-2 text-sm text-gray-600">
                          {rating.rating}/5
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 mt-1 sm:mt-0">
                      {formatDate(rating.createdAt)}
                    </span>
                  </div>
                  {rating.review && (
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {rating.review}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <StarOutlined className="text-gray-300 text-4xl mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Reviews Yet</h3>
          <p className="text-gray-500">Be the first to review this vehicle!</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            current={currentPage}
            total={actualTotalRatings}
            pageSize={5}
            onChange={handlePageChange}
            showSizeChanger={false}
            showQuickJumper={false}
            showTotal={(total, range) => 
              `${range[0]}-${range[1]} of ${total} reviews`
            }
          />
        </div>
      )}
    </div>
  );
};

export default ReviewsDisplayComponent;
