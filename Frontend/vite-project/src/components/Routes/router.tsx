import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import NavBar from '../Navbar/NavBar.tsx';
import Hero from '../LandingPage/Hero.tsx';
import Category from '../LandingPage/Category.tsx';
import Footer from '../Footer/footer.tsx';
<<<<<<< HEAD
import TopSelling from '../LandingPage/topSelling.tsx';
=======
import Login from '../Login/login.tsx';
>>>>>>> origin/Nimesh's
const router = () => {
  return (
    <Router>
        <Routes>
<<<<<<< HEAD
            <Route path="/" element={<><NavBar/><Hero/><Category/><TopSelling/><Footer/></>} />
=======
            <Route path="/" element={<><NavBar/><Hero/><Category/><Footer/></>} />
            <Route path="/login" element={<><Login/></>} />
>>>>>>> origin/Nimesh's
        </Routes>
    </Router>
  )
}

export default router
