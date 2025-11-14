import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTop';
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
import AdminEvents from './pages/AdminEvents';
import AdminUsers from './pages/AdminUsers';
import Profile from './pages/Profile';
import Photographer from './pages/Photographer';
import Dev from './pages/Dev';
import MentionsLegales from './pages/MentionsLegales';
import RGPD from './pages/RGPD';
import DevenirPartenaire from './pages/DevenirPartenaire';
import SuggererPartenaire from './pages/SuggererPartenaire';
import Calendar from './pages/Calendar';
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
    // Mettre à jour les infos utilisateur au chargement de la page
    const refreshUserData = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            // Mettre à jour localStorage avec les infos actualisées
            localStorage.setItem('user', JSON.stringify(data.user));
            // Déclencher un événement de stockage pour notifier les autres onglets
            window.dispatchEvent(new Event('storage'));
          }
        } else if (response.status === 401) {
          // Token invalide, déconnecter l'utilisateur
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
      }
    };

    refreshUserData();
  }, []);

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
        <ScrollToTopButton />
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
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/dev" element={<Dev />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/photographer" element={<Photographer />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/rgpd" element={<RGPD />} />
          <Route path="/devenir-partenaire" element={<DevenirPartenaire />} />
          <Route path="/suggerer-partenaire" element={<SuggererPartenaire />} />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
