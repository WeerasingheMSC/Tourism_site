import React, { useState, useEffect } from 'react';
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
  const [rentalType, setRentalType] = useState('daily'); // 'daily', 'hourly', 'kilometer'

    // Enhanced user data retrieval
  const getUserDetails = () => {
    // Try localStorage first since it has more complete user info
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.name && parsedUser.email) {
          return parsedUser;
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    
    // Fallback to JWT token
    const tokenUser = getCurrentUser();
    return tokenUser;
  };

  const currentUser = getUserDetails();

  // Helper function to get available rental types for the vehicle
  const getAvailableRentalTypes = () => {
    const types = [];
    if (vehicle?.pricing?.pricePerDay || vehicle?.price?.perDay) {
      types.push({ value: 'daily', label: 'Daily Rental', rate: vehicle?.pricing?.pricePerDay || vehicle?.price?.perDay });
    }
    if (vehicle?.pricing?.pricePerHour || vehicle?.price?.perHour) {
      types.push({ value: 'hourly', label: 'Hourly Rental', rate: vehicle?.pricing?.pricePerHour || vehicle?.price?.perHour });
    }
    if (vehicle?.pricing?.pricePerKilometer || vehicle?.price?.perKilometer) {
      types.push({ value: 'kilometer', label: 'Per Kilometer', rate: vehicle?.pricing?.pricePerKilometer || vehicle?.price?.perKilometer });
    }
    return types;
  };

  // Initialize rental type with the first available option
  useEffect(() => {
    const availableTypes = getAvailableRentalTypes();
    if (availableTypes.length > 0 && !rentalType) {
      setRentalType(availableTypes[0].value);
    }
  }, [vehicle, rentalType]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      // Check authentication
      const token = localStorage.getItem('authToken');
      
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

      // Calculate pricing based on rental type
      const startDate = dayjs(values.dateRange[0]);
      const endDate = dayjs(values.dateRange[1]);
      const totalDays = endDate.diff(startDate, 'day') + 1;
      
      let baseRate = 0;
      let subtotal = 0;
      let unit = '';

      if (rentalType === 'daily') {
        baseRate = vehicle.pricing?.pricePerDay || vehicle.price?.perDay || 0;
        subtotal = baseRate * totalDays;
        unit = 'day';
      } else if (rentalType === 'hourly') {
        baseRate = vehicle.pricing?.pricePerHour || vehicle.price?.perHour || 0;
        const estimatedHours = values.estimatedHours || totalDays * 8; // Default 8 hours per day
        subtotal = baseRate * estimatedHours;
        unit = 'hour';
      } else if (rentalType === 'kilometer') {
        baseRate = vehicle.pricing?.pricePerKilometer || vehicle.price?.perKilometer || 0;
        const estimatedKm = values.estimatedKilometers || 100; // Default 100 km
        subtotal = baseRate * estimatedKm;
        unit = 'km';
      }

      const driverCharge = withDriver ? (vehicle.pricing?.driverFee || 20) * totalDays : 0;
      const insurance = subtotal * 0.05; // 5% insurance
      const totalAmount = subtotal + driverCharge + insurance;

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
          basePrice: baseRate,  // Backend expects basePrice
          totalAmount: totalAmount,  // Backend expects totalAmount
          rentalType: rentalType,
          unit: unit,
        },
        payment: {
          method: 'cash' as const,  // Valid payment method type
          status: 'pending' as const,
        },
        notes: values.notes || '',  // Fixed: use correct form field name
      };

      const response = await vehicleBookingService.createBooking(bookingData);
      
      if (response.success) {
        const customerEmail = values.customerEmail;
        message.success(`Vehicle booking submitted successfully! Booking confirmation and tracking updates will be sent to ${customerEmail}`, 6);
        form.resetFields();
        
        // Re-populate user data after successful booking
        if (currentUser) {
          setTimeout(() => {
            form.setFieldsValue({
              customerName: currentUser.name || '',
              customerEmail: currentUser.email || '',
              customerPhone: currentUser.phone || '',
            });
          }, 100);
        }
        
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
    
    // Re-populate user data after reset
    if (currentUser) {
      setTimeout(() => {
        form.setFieldsValue({
          customerName: currentUser.name || '',
          customerEmail: currentUser.email || '',
          customerPhone: currentUser.phone || '',
        });
      }, 0);
    }
    
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
    customerName: currentUser.name || '',
    customerEmail: currentUser.email || '',
    customerPhone: currentUser.phone || '',
  } : {};

  // Auto-fill form when user data becomes available
  useEffect(() => {
    if (currentUser && visible) {
      const formData = {
        customerName: currentUser.name || '',
        customerEmail: currentUser.email || '',
        customerPhone: currentUser.phone || '',
      };
      
      form.setFieldsValue(formData);
    }
  }, [currentUser, visible, form]);

  // Additional effect to force form update when modal becomes visible
  useEffect(() => {
    if (visible && currentUser) {
      // Small delay to ensure form is fully rendered
      setTimeout(() => {
        const userData = {
          customerName: currentUser.name || '',
          customerEmail: currentUser.email || '',
          customerPhone: currentUser.phone || '',
        };
        form.setFieldsValue(userData);
      }, 100);
    }
  }, [visible]);

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
          {!currentUser && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center text-yellow-700">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">
                  You are not logged in. Please enter your details manually or <a href="/login" className="text-blue-600 underline">log in</a> to auto-fill this form.
                </span>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="customerName"
              label="Full Name"
              rules={[{ required: true, message: 'Please enter your full name' }]}
              >
              <Input 
                placeholder="Enter full name" 
                className="rounded-lg"
                style={currentUser ? { backgroundColor: '#f0f9ff' } : {}}
              />
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
              <Input 
                placeholder="Enter email address" 
                className="rounded-lg"
                style={currentUser ? { backgroundColor: '#f0f9ff' } : {}}
                disabled={!!currentUser} // Disable if user is logged in
              />
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

            {/* Rental Type Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rental Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {getAvailableRentalTypes().map((type) => (
                  <div
                    key={type.value}
                    onClick={() => setRentalType(type.value)}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      rentalType === type.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{type.label}</div>
                    <div className="text-sm text-gray-600">{type.rate}$/{type.value === 'daily' ? 'day' : type.value === 'hourly' ? 'hour' : 'km'}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional inputs based on rental type */}
            {rentalType === 'hourly' && (
              <Form.Item
                name="estimatedHours"
                label="Estimated Hours"
                rules={[{ required: true, message: 'Please enter estimated hours' }]}
              >
                <Input 
                  type="number" 
                  placeholder="Enter estimated hours" 
                  className="rounded-lg"
                  min={1}
                />
              </Form.Item>
            )}

            {rentalType === 'kilometer' && (
              <Form.Item
                name="estimatedKilometers"
                label="Estimated Kilometers"
                rules={[{ required: true, message: 'Please enter estimated kilometers' }]}
              >
                <Input 
                  type="number" 
                  placeholder="Enter estimated kilometers" 
                  className="rounded-lg"
                  min={1}
                />
              </Form.Item>
            )}

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
            {/* Base Rate - Dynamic based on rental type */}
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  {rentalType === 'daily' ? 'Daily Rate' : 
                   rentalType === 'hourly' ? 'Hourly Rate' : 
                   'Per Kilometer Rate'}
                </span>
                <div className="text-xs text-gray-500">
                  {rentalType === 'daily' ? 'Per day rental cost' : 
                   rentalType === 'hourly' ? 'Per hour rental cost' : 
                   'Per kilometer rental cost'}
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-blue-600">
                   {
                    rentalType === 'daily' ? (vehicle?.pricing?.pricePerDay || vehicle?.price?.perDay || 0) :
                    rentalType === 'hourly' ? (vehicle?.pricing?.pricePerHour || vehicle?.price?.perHour || 0) :
                    (vehicle?.pricing?.pricePerKilometer || vehicle?.price?.perKilometer || 0)
                  }$
                </span>
                <div className="text-xs text-gray-500">
                  /{rentalType === 'daily' ? 'day' : rentalType === 'hourly' ? 'hour' : 'km'}
                </div>
              </div>
            </div>

            {/* Available Pricing Options */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Available Pricing Options:</div>
              <div className="space-y-1">
                {(vehicle?.pricing?.pricePerDay || vehicle?.price?.perDay) && (
                  <div className="text-xs text-gray-600">Daily: {vehicle?.pricing?.pricePerDay || vehicle?.price?.perDay}$/day</div>
                )}
                {(vehicle?.pricing?.pricePerHour || vehicle?.price?.perHour) && (
                  <div className="text-xs text-gray-600">Hourly: {vehicle?.pricing?.pricePerHour || vehicle?.price?.perHour}$/hour</div>
                )}
                {(vehicle?.pricing?.pricePerKilometer || vehicle?.price?.perKilometer) && (
                  <div className="text-xs text-gray-600">Per Km: {vehicle?.pricing?.pricePerKilometer || vehicle?.price?.perKilometer}$/km</div>
                )}
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
