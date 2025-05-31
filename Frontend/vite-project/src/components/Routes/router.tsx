import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import NavBar from '../Navbar/NavBar.tsx';
import Hero from '../LandingPage/Hero.tsx';
import Category from '../LandingPage/Category.tsx';
import Footer from '../Footer/footer.tsx';
import Login from '../Login/login.tsx';
import Signup from '../SingUp/signup.tsx';
const router = () => {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<><NavBar/><Hero/><Category/><Footer/></>} />
            <Route path="/login" element={<><Login/></>} />
            <Route path="/register" element={<><Signup/></>} />
        </Routes>
    </Router>
  )
}

export default router
