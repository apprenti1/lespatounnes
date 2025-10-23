import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import Partners from './pages/Partners';
import Shop from './pages/Shop';
import Story from './pages/Story';
import Photos from './pages/Photos';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import MentionsLegales from './pages/MentionsLegales';
import RGPD from './pages/RGPD';
import DevenirPartenaire from './pages/DevenirPartenaire';
import SuggererPartenaire from './pages/SuggererPartenaire';
import './styles/globals.css';

// Composant pour scroll vers le haut à chaque changement de route
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

function App() {
  useEffect(() => {
    // Gestion du smooth scroll pour les ancres
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          const offset = 80; // Hauteur de la navbar
          const elementPosition = element.offsetTop - offset;
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/story" element={<Story />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/rgpd" element={<RGPD />} />
          <Route path="/devenir-partenaire" element={<DevenirPartenaire />} />
          <Route path="/suggerer-partenaire" element={<SuggererPartenaire />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
