import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import NavBar from '../Navbar/NavBar.tsx';
import Hero from '../LandingPage/Hero.tsx';
import Category from '../LandingPage/Category.tsx';
import Footer from '../Footer/footer.tsx';
import TopSelling from '../LandingPage/topSelling.tsx';
import Login from '../Login/login.tsx';
import Signup from '../SingUp/signup.tsx';
import ForgotPasswordPage from '../Login/ForgotPassword.tsx';

const router = () => {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<><NavBar/><Hero/><Category/><TopSelling/><Footer/></>} />
          
            <Route path="/login" element={<><Login/></>} />
            <Route path="/register" element={<><Signup/></>} />
            <Route path="/forgot-password" element={<><ForgotPasswordPage/></>} />

            {/* Add more routes as needed */}
        </Routes>
    </Router>
  )
}

export default router
