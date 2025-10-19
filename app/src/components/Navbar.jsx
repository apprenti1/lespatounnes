import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/events', label: 'Événements' },
    { path: '/partners', label: 'Partenaires' },
    { path: '/shop', label: 'Boutique' },
    { path: '/story', label: 'Histoire' },
  ];

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt="Les Patounes"
              className="h-[3rem] rounded-2xl"
            />
            <span className="text-2xl font-bold gradient-text">Les Patounes</span>
          </Link>

          <div className="hidden md:flex md:items-center space-x-5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link font-semibold transition ${
                  isActive(link.path)
                    ? 'text-purple-600 active'
                    : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="h-[42px] w-[42px] text-purple-600 border-2 border-purple-600 rounded-lg hover:bg-purple-50 hover:border-purple-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-xl"
                title="Se connecter"
              >
                <ion-icon name="person-circle-outline" class="text-2xl"></ion-icon>
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl"
              >
                Adhérer
              </Link>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-t`}>
        <div className="px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block font-semibold ${
                isActive(link.path)
                  ? 'text-purple-600'
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center space-x-4 pt-4">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="h-[42px] w-[42px] text-purple-600 border-2 border-purple-600 rounded-lg hover:bg-purple-50 hover:border-purple-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-xl"
              title="Se connecter"
            >
              <ion-icon name="person-circle-outline" class="text-2xl"></ion-icon>
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl"
            >
              Adhérer
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
