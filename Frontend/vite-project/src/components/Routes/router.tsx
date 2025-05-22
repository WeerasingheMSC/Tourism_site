import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import Landing from '../Admin/Landing';
import Kasun from '../Admin/Kasun';
const router = () => {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<><Landing/><Kasun/></>} />
        </Routes>
    </Router>
  )
}

export default router
