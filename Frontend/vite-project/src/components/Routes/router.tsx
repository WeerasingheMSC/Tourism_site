import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "../../components/ScrollToTop.tsx";

import MainNav from "../Navbar/MainNav.tsx";
import NavBar from "../Navbar/NavBar.tsx";
import Hero from "../LandingPage/Hero.tsx";
import Login from "../Login/login.tsx";
import DashBoard from "../Dashboard/dashBoard.tsx";
import SignupHotel from "../SignUp/signupH.tsx";
import SignupTransport from "../SignUp/signupT.tsx";
import Signup from "../SignUp/signup.tsx";
import ForgotPasswordPage from "../Login/ForgotPassword.tsx";
import AdminDash from "../Dashboard/AdminDashbord.tsx";
import HotelOwner from "../Dashboard/HotelOwner.tsx";
import TransportDash from "../Dashboard/TransportOwner.tsx";
import SignupLanding from "../SignUp/SignRole.tsx";
import Resetpassword from "../Login/ResetPassword.tsx";
import NavBarUpdated from "../Navbar/UpdatedNavBar.tsx";
import Herooo from "../Customised/Herooo.tsx";
import TravelPackagesPage from "../Packages/Packages.tsx";
import UpdatedFooter from "../Packages/updatedFooter.tsx";
import IndividualPackage from "../IndividualPackage/[id]/IndividualPackage.tsx";
import AddPackagesForm from "../AddPackage/PackageDetailsForm.tsx";
import AdminDashboardPage from "../Admin/AdminDashboardPage.tsx";
import Decore from "../Packages/Decore.tsx";
import AdminCustomizedPlansAllPage from "../Admin/AdminCustomizedPlansAllPage.tsx";
import AdminCustomizedPlanDetails from "../Admin/AdminCustomizedPlanDetails.tsx";
import EditPackagesForm from "../Admin/EditPackages.tsx";
import TravelBookingSite from "../LandingPage/LandingPage.tsx";
import BookingPage from "../Booking/BookingPage.tsx";

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
              <HotelOwner />
            </>
          }
        />
        <Route
          path="/transport-owner-dashboard"
          element={
            <>
              <TransportDash />
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
          path="/addpackage"
          element={
            <>
              <MainNav />
              <AddPackagesForm />
              <UpdatedFooter />
            </>
          }
        />
        <Route
          path="/admin/editpackage"
          element={
            <>
              <MainNav />
              <EditPackagesForm />
              <UpdatedFooter />
            </>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <>
              <MainNav />
              <Decore />
              <AdminDashboardPage />
              <UpdatedFooter />
            </>
          }
        />
        <Route
          path="/admin/customized-plans"
          element={
            <>
              <MainNav />
              <Decore />
              <AdminCustomizedPlansAllPage />
              <UpdatedFooter />
            </>
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
          path="/admin/customized-plans-details/:id"
          element={
            <>
              <MainNav />
              <Decore />
              <AdminCustomizedPlanDetails />
              <UpdatedFooter />
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default router;
