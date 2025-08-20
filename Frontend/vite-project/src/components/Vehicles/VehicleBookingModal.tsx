import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Switch, message, Button } from 'antd';
import { CalendarOutlined, UserOutlined, PhoneOutlined, EnvironmentOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { vehicleBookingService } from '../../api/vehicleBookings';
import { getCurrentUser, ensureAuthForTesting } from '../../utils/authHelper';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface VehicleBookingModalProps {
  visible: boolean;
  onCancel: () => void;
  vehicle: any;
  onBookingSuccess?: () => void;
}

const VehicleBookingModal: React.FC<VehicleBookingModalProps> = ({
  visible,
  onCancel,
  vehicle,
  onBookingSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [withDriver, setWithDriver] = useState(false);

  const currentUser = getCurrentUser();

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      // Debug authentication
      const token = localStorage.getItem('authToken');
      console.log('🔐 Auth token exists:', !!token);
      console.log('🔐 Current user:', currentUser);
      
      if (!token) {
        // Try to ensure authentication for development/testing
        await ensureAuthForTesting();
        const newToken = localStorage.getItem('authToken');
        if (!newToken) {
          message.error('You must be logged in to make a booking. Please log in first.');
          setLoading(false);
          return;
        }
      }

      // Calculate pricing
      const startDate = dayjs(values.dateRange[0]);
      const endDate = dayjs(values.dateRange[1]);
      const totalDays = endDate.diff(startDate, 'day') + 1;
      
      const dailyRate = vehicle.pricing?.pricePerDay || vehicle.price?.perDay || 0;
      const subtotal = dailyRate * totalDays;
      const driverCharge = withDriver ? (vehicle.pricing?.driverFee || 20) * totalDays : 0;
      const insurance = subtotal * 0.05; // 5% insurance
      const tax = (subtotal + driverCharge + insurance) * 0.08; // 8% tax
      const totalAmount = subtotal + driverCharge + insurance + tax;

      const bookingData = {
        customer: {
          name: values.customerName,
          email: values.customerEmail,
          phone: values.customerPhone,
          address: values.customerAddress || '',
        },
        vehicleId: vehicle._id,
        booking: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          pickupLocation: values.pickupLocation,
          dropoffLocation: values.dropoffLocation,  // Fixed: use correct form field name
          duration: totalDays,
          driverRequired: withDriver,
        },
        pricing: {
          basePrice: dailyRate,  // Backend expects basePrice
          totalAmount: totalAmount,  // Backend expects totalAmount
        },
        payment: {
          method: 'cash' as const,  // Valid payment method type
          status: 'pending' as const,
        },
        notes: values.notes || '',  // Fixed: use correct form field name
      };      console.log('📤 Submitting booking data:', JSON.stringify(bookingData, null, 2));

      const response = await vehicleBookingService.createBooking(bookingData);
      
      if (response.success) {
        message.success('Vehicle booking submitted successfully! You will receive a confirmation shortly.');
        form.resetFields();
        onCancel();
        if (onBookingSuccess) {
          onBookingSuccess();
        }
      }
    } catch (error: any) {
      console.error('Booking submission error:', error);
      console.error('Full error details:', JSON.stringify(error, null, 2));
      
      // Enhanced error handling to show specific validation errors
      if (error?.errors && Array.isArray(error.errors)) {
        console.error('Validation errors:', error.errors);
        const errorMessages = error.errors.map((err: any) => {
          console.error('Individual error:', err);
          return `${err.path || err.param}: ${err.msg || err.message}`;
        }).join(', ');
        message.error(`Validation Error: ${errorMessages}`);
      } else if (error?.message) {
        message.error(`Error: ${error.message}`);
      } else {
        message.error('Failed to submit booking. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setWithDriver(false);
    onCancel();
  };

  const handleDriverToggle = (checked: boolean) => {
    setWithDriver(checked);
    // Clear license field when switching to "with driver"
    if (checked) {
      form.setFieldsValue({ driverLicense: undefined });
    }
  };

  // Pre-fill form with user data if available
  const initialValues = currentUser ? {
    customerName: currentUser.name,
    customerEmail: currentUser.email,
    customerPhone: currentUser.phone || '',
  } : {};

  return (
    <Modal
      title={
        <div className="flex items-center border-b border-gray-200 pb-3">
          <CalendarOutlined className="mr-3 text-blue-600 text-lg" />
          <div>
            <div className="text-lg font-semibold text-gray-800">
              Book Vehicle: {vehicle?.name || vehicle?.title || `${vehicle?.make || vehicle?.brand} ${vehicle?.model}`}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Complete the form below to submit your booking request
            </div>
          </div>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={900}
      className="vehicle-booking-modal"
      styles={{
        body: { padding: '24px' },
        header: { paddingBottom: '0' }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
        className="mt-4"
      >
        {/* Customer Information */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-800">
            <UserOutlined className="mr-2 text-blue-600" />
            Customer Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="customerName"
              label="Full Name"
              rules={[{ required: true, message: 'Please enter your full name' }]}
            >
              <Input placeholder="Enter full name" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="customerPhone"
              label="Phone Number"
              rules={[
                { required: true, message: 'Please enter your phone number' },
                { pattern: /^[0-9+\-\s()]+$/, message: 'Please enter a valid phone number' }
              ]}
            >
              <Input placeholder="Enter phone number" prefix={<PhoneOutlined />} className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="customerEmail"
              label="Email Address"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input placeholder="Enter email address" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="idNumber"
              label="National ID / Passport Number"
              rules={[{ required: true, message: 'Please enter your ID number' }]}
            >
              <Input placeholder="Enter ID/Passport number" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="customerAddress"
              label="Address"
              className="md:col-span-2"
            >
              <Input placeholder="Enter your address (optional)" className="rounded-lg" />
            </Form.Item>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
            <CalendarOutlined className="mr-2 text-blue-600" />
            Booking Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="dateRange"
              label="Rental Period"
              rules={[{ required: true, message: 'Please select rental dates' }]}
              className="md:col-span-2"
            >
              <RangePicker
                style={{ width: '100%' }}
                className="rounded-lg"
                disabledDate={(current) => current && current < dayjs().startOf('day')}
                placeholder={['Start Date', 'End Date']}
              />
            </Form.Item>

            <Form.Item
              name="pickupLocation"
              label="Pickup Location"
              rules={[{ required: true, message: 'Please enter pickup location' }]}
            >
              <Input placeholder="Enter pickup location" prefix={<EnvironmentOutlined />} className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="dropoffLocation"
              label="Drop-off Location"
              rules={[{ required: true, message: 'Please enter drop-off location' }]}
            >
              <Input placeholder="Enter drop-off location" prefix={<EnvironmentOutlined />} className="rounded-lg" />
            </Form.Item>
          </div>
        </div>

        {/* Driver Selection */}
        <div className="bg-white border border-blue-200 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Driving Option</h3>
          <Form.Item name="withDriver" valuePropName="checked" className="mb-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Switch 
                  checked={withDriver}
                  onChange={handleDriverToggle}
                  style={{
                    backgroundColor: withDriver ? '#1890ff' : '#d9d9d9'
                  }}
                />
                <span className="ml-3 font-medium text-gray-700">
                  {withDriver ? 'With Professional Driver' : 'Self Drive'}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {withDriver ? 'Driver will be provided' : 'You will drive the vehicle'}
              </span>
            </div>
          </Form.Item>

          {/* License Field - Only shown for self driving */}
          {!withDriver && (
            <Form.Item
              name="driverLicense"
              label="Driver License Number"
              rules={[{ required: !withDriver, message: 'Please enter your driver license number for self driving' }]}
            >
              <Input 
                placeholder="Enter your driver license number" 
                className="rounded-lg"
                prefix={<span className="text-blue-600">🪪</span>}
              />
            </Form.Item>
          )}

          {/* Driver Info - Only explanatory text for with driver option */}
          {withDriver && (
            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700 flex items-center">
                <CheckCircleOutlined className="mr-2" />
                A professional driver will be assigned to your booking. Driver details will be provided upon confirmation.
              </p>
            </div>
          )}
        </div>

        {/* Additional Notes */}
        <Form.Item
          name="notes"
          label="Additional Notes"
        >
          <TextArea
            rows={3}
            placeholder="Any special requirements or notes..."
            maxLength={500}
            showCount
          />
        </Form.Item>

        {/* Pricing Summary */}
        <div className="bg-white border-2 border-blue-100 p-6 rounded-lg mb-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center border-b border-gray-200 pb-3">
            <span className="text-blue-600 mr-2 text-xl">💰</span>
            Pricing Information
          </h3>
          
          <div className="space-y-4">
            {/* Daily Rate */}
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">Daily Rate</span>
                <div className="text-xs text-gray-500">Per day rental cost</div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-blue-600">
                  ${vehicle?.pricing?.pricePerDay || vehicle?.price?.perDay || 0}
                </span>
                <div className="text-xs text-gray-500">/day</div>
              </div>
            </div>

            {/* Driver Fee */}
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">Driver Service</span>
                <div className="text-xs text-gray-500">
                  {withDriver ? 'Professional driver included' : 'Self-drive option'}
                </div>
              </div>
              <div className="text-right">
                {withDriver ? (
                  <div>
                    <span className="text-sm font-medium text-orange-600">
                      You can discuss with vehicle owner
                    </span>
                    <div className="text-xs text-gray-500">Negotiable rate</div>
                  </div>
                ) : (
                  <div>
                    <span className="text-sm font-medium text-green-600">Free</span>
                    <div className="text-xs text-gray-500">Self-drive</div>
                  </div>
                )}
              </div>
            </div>

            {/* Included Services */}
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-sm font-medium text-green-800 mb-2">✓ Included in Price</div>
              <div className="grid grid-cols-2 gap-2 text-xs text-green-700">
                <div>• Vehicle Insurance</div>
                <div>• 24/7 Customer Support</div>
                <div>• Basic Maintenance</div>
                <div>• Emergency Assistance</div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="pt-3 border-t border-gray-200">
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Final pricing calculated based on rental duration
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Payment due upon booking confirmation
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Cancellation policy applies as per terms
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button 
            onClick={handleCancel}
            size="large"
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            className="bg-blue-600 hover:bg-blue-700 px-8"
          >
            Submit Booking Request
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default VehicleBookingModal;
