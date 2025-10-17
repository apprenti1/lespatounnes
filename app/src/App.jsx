import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/partners" element={<div className="pt-32 text-center">Page Partenaires (À venir)</div>} />
          <Route path="/shop" element={<div className="pt-32 text-center">Page Boutique (À venir)</div>} />
          <Route path="/story" element={<div className="pt-32 text-center">Page Histoire (À venir)</div>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
