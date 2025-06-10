
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "../Navbar/NavBar.tsx";
import NavBarUpdated from "../Navbar/UpdatedNavBar.tsx";
import Hero from "../LandingPage/Hero.tsx";
import Category from "../LandingPage/Category.tsx";
import Footer from "../Footer/footer.tsx";
import TopSelling from "../LandingPage/topSelling.tsx";
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
import StepSelect from "../LandingPage/StepsSelect.tsx";
import Testonomial from "../LandingPage/Testonomial.tsx";
import Footernew from "../FooterNew/footernew.tsx";
import CustomPackageForm from "../Customised/CustomPackageForm";
import Herooo from "../Customised/Herooo.tsx"; 
import TravelPackagesPage from "../Packages/Packages.tsx";
import UpdatedFooter from "../Packages/updatedFooter.tsx";
import IndividualPackage from "../IndividualPackage/[id]/IndividualPackage.tsx";
import AddPackagesForm from "../AddPackage/PackageDetailsForm.tsx";
const router = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <NavBar />
              <Hero />
              <Category />
              <TopSelling />
              <StepSelect />
              <Testonomial />
              <Footernew />

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
              <Footer />
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
            <NavBar />
              <Herooo />
              <Footernew/>
              </>}
              />
        <Route
          path="/packages"
          element={
            <>
              <NavBarUpdated />
              <TravelPackagesPage />
              <UpdatedFooter />
            </>
          }
        />
        <Route
          path="/packages/:id"
          element={
            <>
              <NavBarUpdated />
              <IndividualPackage />
              <UpdatedFooter />
            </>
          }
        />
        <Route
          path="/addpackage"
          element={
            <>
              <NavBarUpdated />
              <AddPackagesForm />
              <UpdatedFooter />
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default router;
