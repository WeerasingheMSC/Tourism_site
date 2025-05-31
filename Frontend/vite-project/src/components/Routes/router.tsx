import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import NavBar from '../Navbar/NavBar.tsx';
import Hero from '../LandingPage/Hero.tsx';
import Category from '../LandingPage/Category.tsx';
import Footer from '../Footer/footer.tsx';
import TopSelling from '../LandingPage/topSelling.tsx';
const router = () => {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<><NavBar/><Hero/><Category/><TopSelling/><Footer/></>} />
        </Routes>
    </Router>
  )
}

export default router
