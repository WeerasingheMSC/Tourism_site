import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "../Navbar/NavBar.tsx";
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
import Footernew from "../FooterNew/footernew.tsx";
//import CutomizedPackge from '../Customised/personal.tsx';
//import PackageDetails from '../Customised/package.tsx'; // Changed to uppercase
import CustomPackageForm from "../Customised/CustomPackageForm";
import Herooo from "../Customised/Herooo.tsx"; // Assuming hero1 is a component for the customized package form
//import Heroi from "../Customised/Heroi.tsx"; // Assuming Heroi is a component for the customized package form
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
          
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default router;
