import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "../../components/ScrollToTop.tsx";
//test 
import Vehicle from "..//Dashboard/PartnerDashboard.tsx"



import MainNav from "../Navbar/MainNav.tsx";
import Hero from "../LandingPage/Hero.tsx";
import Login from "../Login/login.tsx";
import DashBoard from "../Dashboard/dashBoard.tsx";
import SignupHotel from "../SignUp/signupH.tsx";
import SignupTransport from "../SignUp/signupT.tsx";
import Signup from "../SignUp/signup.tsx";
import ForgotPasswordPage from "../Login/ForgotPassword.tsx";
import AdminDash from "../Dashboard/AdminDashbord.tsx";
import HotelOwner from "../Dashboard/HotelOwner.tsx";
import VehicleOwner from "../Dashboard/VehicleOwner.tsx";
import TransportDash from "../Dashboard/VehicleOwner.tsx";
import SignupLanding from "../SignUp/SignRole.tsx";
import Resetpassword from "../Login/ResetPassword.tsx";
import Herooo from "../Customised/Herooo.tsx";
import TravelPackagesPage from "../Packages/Packages.tsx";
import UpdatedFooter from "../Packages/updatedFooter.tsx";
import IndividualPackage from "../IndividualPackage/[id]/IndividualPackage.tsx";
import AddPackagesForm from "../AddPackage/PackageDetailsForm.tsx";
import AdminDashboardPage from "../Admin/AdminDashboardPage.tsx";
import AdminVehiclesPage from "../Admin/AdminVehiclesPage.tsx";
import Decore from "../Packages/Decore.tsx";
import AdminCustomizedPlansAllPage from "../Admin/AdminCustomizedPlansAllPage.tsx";
import AdminCustomizedPlanDetails from "../Admin/AdminCustomizedPlanDetails.tsx";
import EditPackagesForm from "../Admin/EditPackages.tsx";
import TravelBookingSite from "../LandingPage/LandingPage.tsx";
import BookingPage from "../Booking/BookingPage.tsx";
import ProtectedRoute from "../Routes/ProtectedRoute.tsx"; 
import HotelsPage from "../Hotels/HotelsPage.tsx";
import HotelDetailsPage from "../Hotels/HotelDetailsPage.tsx";
import HotelRegistrationForm from "../HotelDashboard/HotelRegistrationForm.tsx";
import AdminHotelTab from "../Admin/AdminHotelTab.tsx";
import OwnerHotelBookingsPage from "../HotelDashboard/Bookings.tsx"; // Owner hotel bookings page
import VehiclesPage from "../Vehicles/VehiclesPage.tsx";
import VehicleDetailsPage from "../Vehicles/VehicleDetailsPage.tsx";
import HotelOwnerDetails from "../HotelDashboard/HotelOwnerDetails.tsx";
import VehicleRegistrationForm from "../VehicleDashboard/RegisterVehicle.tsx";
import EditVehicle from "../VehicleDashboard/EditVehicle.tsx";
import VehicleOwnerDetails from "../VehicleDashboard/VehicleOwnerDetails.tsx";
import PartnerDashboard from "../VehicleDashboard/PartnerDashboard.tsx";
import ContactPage from "../ContactPage/ContactPage.tsx";


const router = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <MainNav />
              <Hero />
              <TravelBookingSite />
              <UpdatedFooter />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Login />
            </>
          }
        />
        <Route
          path="/dashboard"
          element={
            <>
              <DashBoard />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <Signup />
            </>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <>
              <ForgotPasswordPage />
            </>
          }
        />
        <Route
          path="/reset-password"
          element={
            <>
              <Resetpassword />
            </>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <>
              <AdminDash />
            </>
          }
        />
        <Route
          path="/hotel-owner-dashboard"
          element={
            <>
              <MainNav />
              <HotelOwner />
              <UpdatedFooter />
            </>
          }
        />
        <Route
          path="/vehicle-owner-dashboard"
          element={
            <>
              <MainNav />
              <VehicleOwner />
              <UpdatedFooter />
            </>
          }
        />
        <Route
          path="/transport-owner-dashboard"
          element={
            <>
              <MainNav />
              <TransportDash />
              <UpdatedFooter />
            </>
          }
        />
        <Route
          path="/signup"
          element={
            <>
              <SignupLanding />
            </>
          }
        />
        <Route
          path="/signup/business/hotel"
          element={
            <>
              <SignupHotel />
            </>
          }
        />
        <Route
          path="/signup/business/transport"
          element={
            <>
              <SignupTransport />
            </>
          }
        />
        <Route
          path="/CustomPackageForm"
          element={
            <>
              <MainNav />
              <Herooo />
            </>
          }
        />
        <Route
          path="/packages"
          element={
            <>
              <MainNav />
              <TravelPackagesPage />
              <UpdatedFooter />
            </>
          }
        />
        <Route
          path="/packages/:id"
          element={
            <>
              <MainNav />
              <IndividualPackage />
              <UpdatedFooter />
            </>
          }
        />
        <Route
          path="/hotels"
          element={
            <>
              <MainNav />
              <Decore />
              <HotelsPage />
              <UpdatedFooter />
            </>
          }
        />
        <Route
          path="/hotels/:id"
          element={
            <>
              <MainNav />
              <Decore />
              <HotelDetailsPage />
              <UpdatedFooter />
            </>
          }
        />
        <Route
          path="/vehicles"
          element={
            <>
              <MainNav />
              <Decore />
              <VehiclesPage />
              <UpdatedFooter />
            </>
          }
        />
        <Route
          path="/vehicles/:id"
          element={
            <>
              <MainNav />
              <Decore />
              <VehicleDetailsPage />
              <UpdatedFooter />
            </>
          }
        />
        <Route
          path="/hotel-owner-details"
          element={
            <ProtectedRoute>
              <MainNav />
              <Decore />
              <HotelOwnerDetails />
              <UpdatedFooter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicle-owner-details"
          element={
            <ProtectedRoute>
              <MainNav />
              <Decore />
              <VehicleOwnerDetails />
              <UpdatedFooter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicle-partner-dashboard"
          element={
            <ProtectedRoute>
              <MainNav />
              <Decore />
              <PartnerDashboard type="vehicle" />
              <UpdatedFooter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicle-dashboard"
          element={
            <ProtectedRoute>
              <MainNav />
              <Decore />
              <VehicleOwner />
              <UpdatedFooter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hotel-partner-dashboard"
          element={
            <ProtectedRoute>
              <MainNav />
              <Decore />
              <PartnerDashboard type="hotel" />
              <UpdatedFooter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addpackage"
          element={
            <ProtectedRoute>
              <MainNav />
              <AddPackagesForm />
              <UpdatedFooter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/editpackage"
          element={
            <ProtectedRoute>
              <MainNav />
              <EditPackagesForm />
              <UpdatedFooter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <MainNav />
              <Decore />
              <AdminDashboardPage />
              <UpdatedFooter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/vehicles"
          element={
            <ProtectedRoute>
              <MainNav />
              <Decore />
              <AdminVehiclesPage />
              <UpdatedFooter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/customized-plans"
          element={
            <ProtectedRoute>
              <MainNav />
              <Decore />
              <AdminCustomizedPlansAllPage />
              <UpdatedFooter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking"
          element={
            <>
              <MainNav />
              <BookingPage />
              <UpdatedFooter />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <MainNav />
              <ContactPage />
              <UpdatedFooter />
            </>
          }
        />
        <Route
          path="/admin/customized-plans-details/:id"
          element={
            <ProtectedRoute>
              <MainNav />
              <Decore />
              <AdminCustomizedPlanDetails />
              <UpdatedFooter />
            </ProtectedRoute>
          }
        />
        // Hotel Routes
        <Route
          path="/hotels"
          element={
            <>
              <MainNav />
              <HotelsPage />
              <UpdatedFooter />
            </>
          }
        />
        <Route
          path="/hotels/:id"
          element={
            <>
              <MainNav />
              <Decore />
              <HotelDetailsPage />
              <UpdatedFooter />
            </>
          }
        />
        <Route
          path="/hotel-register"
          element={
            <>
              <MainNav />
              <Decore />
              <HotelRegistrationForm />
              <UpdatedFooter />
            </>
          }
        />
        <Route
          path="/vehicle-register"
          element={
            <>
              <MainNav />
              <Decore />
              <VehicleRegistrationForm />
              <UpdatedFooter />
            </>
          }
        />
        <Route
          path="/vehicle-edit/:id"
          element={
            <>
              <MainNav />
              <Decore />
              <EditVehicle />
              <UpdatedFooter />
            </>
          }
        />
        <Route
          path="/admin/pending-hotels"
          element={
            <ProtectedRoute>
              <MainNav />
              <Decore />
              <AdminHotelTab />
              <UpdatedFooter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/hotels/:hotelId/bookings"
          element={
            <>
              <MainNav />
              <Decore />
              <OwnerHotelBookingsPage />
              <UpdatedFooter />
            </>
          }
        />
        
      </Routes>
    </Router>
  );
};

export default router;
