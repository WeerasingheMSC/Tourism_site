import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  message,
  Modal,
  Card,
  Descriptions,
  Avatar,
} from "antd";
import {
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  UserOutlined,
  CarOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { vehicleBookingService } from "../../api/vehicleBookings";
import type { VehicleBooking } from "../../api/vehicleBookings";

const VehicleBookingsTable: React.FC = () => {
  const [bookings, setBookings] = useState<VehicleBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<VehicleBooking | null>(
    null
  );
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [statusLoading, setStatusLoading] = useState<string>("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await vehicleBookingService.getAllBookings({
        status: "all",
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      setBookings(response.data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      message.error("Failed to fetch vehicle bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      setStatusLoading(bookingId);
      await vehicleBookingService.updateBookingStatus(bookingId, newStatus);
      message.success(`Booking ${newStatus} successfully`);
      fetchBookings(); // Refresh the list
    } catch (error: any) {
      console.error("Error updating booking status:", error);
      message.error(
        error.response?.data?.message || `Failed to ${newStatus} booking`
      );
    } finally {
      setStatusLoading("");
    }
  };

  const handleViewDetails = (booking: VehicleBooking) => {
    setSelectedBooking(booking);
    setDetailsVisible(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "orange";
      case "confirmed":
        return "blue";
      case "active":
        return "green";
      case "completed":
        return "purple";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
      width: 150,
      className: "pl-4",
      render: (bookingId: string) => (
        <span className="font-mono text-sm pl-4">{bookingId}</span>
      ),
    },
    {
      title: "Customer",
      key: "customer",
      width: 200,
      render: (_: any, record: VehicleBooking) => (
        <div className="flex items-center space-x-3">
          <Avatar icon={<UserOutlined />} size="small" />
          <div>
            <div className="font-medium">{record.customer.name}</div>
            <div className="text-sm text-gray-500">{record.customer.phone}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Vehicle",
      key: "vehicle",
      width: 200,
      render: (_: any, record: VehicleBooking) => (
        <div className="flex items-center space-x-2">
          <CarOutlined className="text-blue-600" />
          <div>
            <div className="font-medium">{record.vehicle.name}</div>
            <div className="text-sm text-gray-500">
              {record.vehicle.licensePlate}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Rental Period",
      key: "period",
      width: 180,
      render: (_: any, record: VehicleBooking) => (
        <div>
          <div className="text-sm">
            {formatDate(record.booking.startDate.toString())}
          </div>
          <div className="text-sm text-gray-500">
            to {formatDate(record.booking.endDate.toString())}
          </div>
          {/* Rental Type and Quantity Display */}
          <div className="text-xs font-medium mt-1">
            {record.pricing.rentalType === 'hourly' ? (
              <div className="bg-blue-50 px-2 py-1 rounded border border-blue-200">
                <span className="text-blue-800 font-semibold">
                  ⏱️ Hourly: {record.pricing.estimatedHours ? `${record.pricing.estimatedHours} hours` : 'Hours not specified'}
                </span>
              </div>
            ) : record.pricing.rentalType === 'kilometer' ? (
              <div className="bg-green-50 px-2 py-1 rounded border border-green-200">
                <span className="text-green-800 font-semibold">
                  📏 Per KM: {record.pricing.estimatedKilometers ? `${record.pricing.estimatedKilometers} km` : 'Distance not specified'}
                </span>
              </div>
            ) : record.pricing.rentalType === 'daily' ? (
              <div className="bg-gray-50 px-2 py-1 rounded border border-gray-200">
                <span className="text-gray-700 font-semibold">📅 Daily rental</span>
              </div>
            ) : record.pricing.unit === 'hour' ? (
              <div className="bg-yellow-50 px-2 py-1 rounded border border-yellow-200">
                <span className="text-yellow-700 font-semibold">⏱️ Hourly (legacy)</span>
              </div>
            ) : record.pricing.unit === 'km' ? (
              <div className="bg-yellow-50 px-2 py-1 rounded border border-yellow-200">
                <span className="text-yellow-700 font-semibold">📏 Per KM (legacy)</span>
              </div>
            ) : (
              <div className="bg-gray-50 px-2 py-1 rounded border border-gray-200">
                <span className="text-gray-700 font-semibold">📅 Daily (default)</span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: ["pricing", "totalAmount"],
      key: "totalAmount",
      width: 120,
      render: (amount: number) => (
        <span className="font-semibold text-green-600">${amount}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string) => (
        <span className="text-sm">{formatDate(date)}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_: any, record: VehicleBooking) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            size="small"
          >
            View
          </Button>
          {record.status === "pending" && (
            <>
              <Button
                type="text"
                icon={<CheckCircleOutlined />}
                onClick={() => handleStatusUpdate(record._id, "confirmed")}
                loading={statusLoading === record._id}
                size="small"
                className="text-green-600"
              >
                Approve
              </Button>
              <Button
                type="text"
                icon={<CloseCircleOutlined />}
                onClick={() => handleStatusUpdate(record._id, "cancelled")}
                loading={statusLoading === record._id}
                size="small"
                className="text-red-600"
              >
                Reject
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={bookings}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} bookings`,
        }}
        scroll={{ x: 1200 }}
        size="small"
      />

      {/* Booking Details Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <CalendarOutlined className="mr-2 text-blue-600" />
            <span>Booking Details - {selectedBooking?.bookingId}</span>
          </div>
        }
        open={detailsVisible}
        onCancel={() => setDetailsVisible(false)}
        footer={null}
        width={800}
      >
        {selectedBooking && (
          <div className="space-y-6">
            {/* Customer Information */}
            <Card title="Customer Information" size="small">
              <Descriptions column={2} size="small">
                <Descriptions.Item label="Name">
                  <div className="flex items-center">
                    <UserOutlined className="mr-2" />
                    {selectedBooking.customer.name}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  <div className="flex items-center">
                    <MailOutlined className="mr-2" />
                    {selectedBooking.customer.email}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  <div className="flex items-center">
                    <PhoneOutlined className="mr-2" />
                    {selectedBooking.customer.phone}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Driver License">
                  {selectedBooking.customer.driverLicense}
                </Descriptions.Item>
                <Descriptions.Item label="ID Number">
                  {selectedBooking.customer.idNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Address">
                  {selectedBooking.customer.address || "Not provided"}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Vehicle Information */}
            <Card title="Vehicle Information" size="small">
              <Descriptions column={2} size="small">
                <Descriptions.Item label="Vehicle">
                  <div className="flex items-center">
                    <CarOutlined className="mr-2" />
                    {selectedBooking.vehicle.name}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="License Plate">
                  {selectedBooking.vehicle.licensePlate}
                </Descriptions.Item>
                <Descriptions.Item label="Category">
                  {selectedBooking.vehicle.category}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Booking Details */}
            <Card title="Booking Details" size="small">
              <Descriptions column={2} size="small">
                <Descriptions.Item label="Start Date">
                  {formatDateTime(selectedBooking.booking.startDate.toString())}
                </Descriptions.Item>
                <Descriptions.Item label="End Date">
                  {formatDateTime(selectedBooking.booking.endDate.toString())}
                </Descriptions.Item>
                <Descriptions.Item label="Duration">
                  {selectedBooking.booking.duration} days
                </Descriptions.Item>
                <Descriptions.Item label="Rental Type">
                  <div className="flex items-center">
                    <div className="inline-block">
                      {selectedBooking.pricing.rentalType === 'hourly' ? (
                        <div className="bg-blue-50 px-3 py-2 rounded border border-blue-200">
                          <span className="text-blue-800 font-bold text-sm">
                            ⏱️ HOURLY BOOKING: {selectedBooking.pricing.estimatedHours ? `${selectedBooking.pricing.estimatedHours} HOURS` : 'HOURS NOT SPECIFIED'}
                          </span>
                        </div>
                      ) : selectedBooking.pricing.rentalType === 'kilometer' ? (
                        <div className="bg-green-50 px-3 py-2 rounded border border-green-200">
                          <span className="text-green-800 font-bold text-sm">
                            📏 PER KILOMETER BOOKING: {selectedBooking.pricing.estimatedKilometers ? `${selectedBooking.pricing.estimatedKilometers} KM` : 'DISTANCE NOT SPECIFIED'}
                          </span>
                        </div>
                      ) : selectedBooking.pricing.rentalType === 'daily' ? (
                        <div className="bg-gray-50 px-3 py-2 rounded border border-gray-200">
                          <span className="text-gray-700 font-bold text-sm">📅 DAILY RENTAL</span>
                        </div>
                      ) : selectedBooking.pricing.unit === 'hour' ? (
                        <div className="bg-yellow-50 px-3 py-2 rounded border border-yellow-200">
                          <span className="text-yellow-700 font-bold text-sm">⏱️ HOURLY (LEGACY)</span>
                        </div>
                      ) : selectedBooking.pricing.unit === 'km' ? (
                        <div className="bg-yellow-50 px-3 py-2 rounded border border-yellow-200">
                          <span className="text-yellow-700 font-bold text-sm">📏 PER KM (LEGACY)</span>
                        </div>
                      ) : (
                        <div className="bg-gray-50 px-3 py-2 rounded border border-gray-200">
                          <span className="text-gray-700 font-bold text-sm">📅 DAILY (DEFAULT)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Pickup Location">
                  <div className="flex items-center">
                    <EnvironmentOutlined className="mr-2" />
                    {selectedBooking.booking.pickupLocation}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Drop-off Location">
                  <div className="flex items-center">
                    <EnvironmentOutlined className="mr-2" />
                    {selectedBooking.booking.dropoffLocation}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="With Driver">
                  {selectedBooking.booking.withDriver ? "Yes" : "No"}
                </Descriptions.Item>
                <Descriptions.Item label="Pickup Time">
                  {selectedBooking.booking.pickupTime || "Not specified"}
                </Descriptions.Item>
                <Descriptions.Item label="Drop-off Time">
                  {selectedBooking.booking.dropoffTime || "Not specified"}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Pricing Information */}
            <Card title="Pricing Information" size="small">
              <Descriptions column={2} size="small">
                <Descriptions.Item label="Subtotal">
                  <div className="flex items-center">
                    <DollarOutlined className="mr-2" />$
                    {selectedBooking.pricing.subtotal}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Driver Charge">
                  ${selectedBooking.pricing.driverCharge || 0}
                </Descriptions.Item>
                <Descriptions.Item label="Insurance">
                  $
                  {(selectedBooking.pricing.insurance || 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Discount">
                  -${selectedBooking.pricing.discount || 0}
                </Descriptions.Item>
                <Descriptions.Item label="Total Amount" span={2}>
                  <span className="text-lg font-bold text-green-600">
                    ${selectedBooking.pricing.totalAmount}
                  </span>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Status & Notes */}
            <Card title="Status & Additional Information" size="small">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Status">
                  <Tag color={getStatusColor(selectedBooking.status)}>
                    {selectedBooking.status.toUpperCase()}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Payment Status">
                  <Tag
                    color={
                      selectedBooking.payment.status === "paid"
                        ? "green"
                        : "orange"
                    }
                  >
                    {selectedBooking.payment.status.toUpperCase()}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Notes">
                  {selectedBooking.notes || "No additional notes"}
                </Descriptions.Item>
                <Descriptions.Item label="Created">
                  {formatDateTime(selectedBooking.createdAt.toString())}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Action Buttons */}
            {selectedBooking.status === "pending" && (
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => {
                    handleStatusUpdate(selectedBooking._id, "confirmed");
                    setDetailsVisible(false);
                  }}
                  loading={statusLoading === selectedBooking._id}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Approve Booking
                </Button>
                <Button
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => {
                    handleStatusUpdate(selectedBooking._id, "cancelled");
                    setDetailsVisible(false);
                  }}
                  loading={statusLoading === selectedBooking._id}
                >
                  Reject Booking
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VehicleBookingsTable;
