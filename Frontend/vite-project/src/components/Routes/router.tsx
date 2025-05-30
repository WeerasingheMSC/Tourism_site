import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import NavBar from '../Navbar/NavBar.tsx';
import Hero from '../LandingPage/Hero.tsx';
const router = () => {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<><NavBar/><Hero/></>} />
        </Routes>
    </Router>
  )
}

export default router
