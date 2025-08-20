# Vehicle Dashboard - Frontend & Backend Integration Guide

## 🚀 Overview

The Vehicle Dashboard is a comprehensive management system for vehicle rental/booking operations. It provides both frontend interface and backend API for managing vehicles and bookings.

## 🏗️ Architecture

### Backend Components
- **Models**: `VehicleBooking.js`, `Vehicle.js`
- **Controllers**: `vehicleController.js`, `vehicleBookingController.js`
- **Routes**: `/api/vehicles`, `/api/vehicle-bookings`
- **Middleware**: Authentication, validation, error handling

### Frontend Components
- **Dashboard**: `VehicleDashboard.tsx`
- **API Client**: `vehicleBookings.ts`
- **Routing**: Integrated with existing React Router setup

## 🔗 API Endpoints

### Vehicle Management
```
GET    /api/vehicles                    # List all vehicles (with filters)
GET    /api/vehicles/statistics         # Vehicle statistics
GET    /api/vehicles/available         # Available vehicles for dates
GET    /api/vehicles/:id               # Single vehicle details
POST   /api/vehicles                   # Create new vehicle
PUT    /api/vehicles/:id               # Update vehicle
PATCH  /api/vehicles/:id/availability  # Toggle availability
DELETE /api/vehicles/:id               # Delete vehicle
```

### Booking Management
```
GET    /api/vehicle-bookings              # List all bookings (with filters)
GET    /api/vehicle-bookings/statistics   # Booking statistics
GET    /api/vehicle-bookings/:id          # Single booking details
POST   /api/vehicle-bookings              # Create new booking
PUT    /api/vehicle-bookings/:id          # Update booking
PATCH  /api/vehicle-bookings/:id/status   # Update booking status
DELETE /api/vehicle-bookings/:id          # Delete booking
```

## 🎯 Features

### Dashboard Features
- **Real-time Statistics**: Total vehicles, available vehicles, active bookings, revenue
- **Vehicle Management**: CRUD operations for vehicles
- **Booking Management**: View and manage all vehicle bookings
- **Advanced Filtering**: Search, category filter, status filter, date range filter
- **Responsive Design**: Works on desktop and mobile devices

### Backend Features
- **Authentication**: JWT-based auth for all operations
- **Validation**: Comprehensive input validation
- **Business Logic**: Availability checking, conflict detection
- **Error Handling**: Graceful error responses
- **Pagination**: Efficient data loading for large datasets

## 🔧 Setup Instructions

### 1. Backend Setup
The backend is already configured and running on `http://localhost:5001`

### 2. Frontend Setup
The frontend is running on `http://localhost:5174`

### 3. Access the Dashboard
- Navigate to: `http://localhost:5174/vehicle-dashboard`
- Or use the "Vehicle Management" button in the Transport Owner dashboard

## 📱 Usage Guide

### Accessing the Dashboard
1. **Login** with appropriate credentials
2. **Navigate** to Transport Owner dashboard (`/transport-owner-dashboard`)
3. **Click** "Vehicle Management" button
4. **Or directly** visit `/vehicle-dashboard`

### Managing Vehicles
1. **View Vehicles**: Default tab shows all vehicles
2. **Add Vehicle**: Click "Add Vehicle" button
3. **Edit Vehicle**: Click edit icon in actions column
4. **Toggle Availability**: Click enable/disable icon
5. **Delete Vehicle**: Click delete icon (only if no active bookings)

### Managing Bookings
1. **Switch to Bookings Tab**: Click "Bookings" button
2. **View Bookings**: See all vehicle bookings with details
3. **Filter Bookings**: Use search, status, and date filters
4. **Booking Details**: Each booking shows customer, vehicle, dates, pricing

### Filtering & Search
- **Vehicle Filters**: Search by name/plate, filter by category, availability status
- **Booking Filters**: Search by customer/vehicle, filter by status, date range
- **Real-time Updates**: Filters apply immediately

## 🧪 Testing

### Sample Data
Use the test script at `/test-data.js`:
```javascript
// In browser console
createSampleVehicles()  // Creates 3 sample vehicles
createSampleBookings()  // Creates 1 sample booking
```

### Manual Testing
1. **Create Vehicle**: Test vehicle creation form
2. **Check Availability**: Test availability toggle
3. **Create Booking**: Test booking creation with date conflicts
4. **View Statistics**: Verify statistics update correctly

## 🔐 Authentication

### Required for:
- All vehicle management operations
- All booking management operations
- Statistics and analytics

### Token Storage:
- JWT token stored in `localStorage` as 'token'
- Automatically included in API requests
- Handled by axios interceptors

## 🎨 UI Components

### Statistics Cards
- Total Vehicles (Green)
- Available Vehicles (Blue)
- Active Bookings (Purple)
- Total Revenue (Red)

### Data Tables
- **Vehicles Table**: Name, category, details, price, location, status, actions
- **Bookings Table**: ID, customer, vehicle, duration, amount, status

### Forms & Modals
- **Vehicle Form**: Name, license plate, category, brand, model, year, capacity, pricing, location
- **Confirmation Dialogs**: Delete confirmations with business logic checks

## 🚨 Error Handling

### Frontend
- Network errors with retry suggestions
- Authentication errors with login prompts
- Validation errors with field-specific messages
- Loading states during API calls

### Backend
- Input validation with detailed error messages
- Business logic validation (conflicts, constraints)
- Authentication and authorization checks
- Database error handling

## 📊 Analytics & Reporting

### Vehicle Statistics
- Total vehicle count
- Available vs unavailable vehicles
- Utilization rates
- Revenue by category
- Popular vehicles by booking count

### Booking Statistics
- Total bookings by period (week/month/year)
- Revenue trends
- Booking status distribution
- Average booking values

## 🔄 Real-time Updates

### Auto-refresh
- Statistics refresh on data changes
- Filter changes trigger immediate updates
- CRUD operations update lists automatically

### State Management
- Local state for UI interactions
- API state synchronized with backend
- Optimistic updates where appropriate

## 🛠️ Troubleshooting

### Common Issues
1. **Authentication Errors**: Check if logged in, token in localStorage
2. **Network Errors**: Verify backend running on port 5001
3. **CORS Errors**: Backend configured for localhost:5174
4. **Data Not Loading**: Check browser console for API errors

### Debug Tips
- Open browser console for detailed error logs
- Check Network tab for API request/response details
- Verify JWT token validity and permissions
- Test API endpoints directly with curl/Postman

## 🚀 Deployment Notes

### Environment Variables
- Backend: `PORT`, `JWT_SECRET`, `MONGODB_URI`
- Frontend: API base URL configuration

### Production Considerations
- CORS configuration for production domain
- HTTPS for secure token transmission
- Database indexing for performance
- Error logging and monitoring

## 📈 Future Enhancements

### Planned Features
- Real-time notifications for bookings
- Advanced reporting dashboard
- Vehicle maintenance tracking
- Customer rating and review system
- Mobile app integration
- Payment gateway integration

### Performance Optimizations
- Virtual scrolling for large datasets
- Image optimization and CDN
- Caching strategies
- Database query optimization
