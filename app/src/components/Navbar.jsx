import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Erreur lors de la lecture des données utilisateur:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
        }
      }
    };

    checkAuth();

    // Écouter les changements de localStorage (connexion/déconnexion)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
    toast.info('🐾 Vous avez été déconnecté avec succès !', { position: 'top-center' });
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/events', label: 'Événements' },
    { path: '/partners', label: 'Partenaires' },
    { path: '/shop', label: 'Boutique' },
    { path: '/story', label: 'Histoire' },
    { path: '/photos', label: 'Photos' },
    { path: '/contact', label: 'Contact' },
  ];

  const firstRowLinks = navLinks.slice(0, 4); // Accueil, Événements, Partenaires, Boutique
  const secondRowLinks = navLinks.slice(4); // Histoire, Photos, Contact

  const renderAuthButtons = () => (
    <>
      {user ? (
        <>
          <Link
            to="/profile"
            className="flex items-center space-x-2 px-3 py-2 h-[42px] bg-purple-50 rounded-lg border-2 border-purple-200 hover:bg-purple-100 hover:border-purple-300 transition-all duration-300"
            title="Mon profil"
          >
            <ion-icon name="person-circle" class="text-2xl text-purple-600"></ion-icon>
            <span className="font-semibold text-purple-700 text-sm">
              {user.username || user.firstName || user.email.split('@')[0]}
            </span>
          </Link>
          {user.role === 'ADMIN' && (
            <Link
              to="/admin"
              className="h-[42px] px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2"
              title="Panel Admin"
            >
              <ion-icon name="shield-checkmark-outline" class="text-xl"></ion-icon>
              <span className="text-sm">Admin</span>
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="h-[42px] w-[42px] bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center"
            title="Se déconnecter"
          >
            <ion-icon name="log-out-outline" class="text-2xl"></ion-icon>
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="h-[42px] w-[42px] text-purple-600 border-2 border-purple-600 rounded-lg hover:bg-purple-50 hover:border-purple-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-xl"
            title="Se connecter"
          >
            <ion-icon name="person-circle-outline" class="text-2xl"></ion-icon>
          </Link>
          <Link
            to="https://www.helloasso.com/associations/association-les-patounes/adhesions/adhesions"
            target="_blank"
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl"
          >
            Adhérer
          </Link>
          {/* <Link
            to="/register"
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl"
          >
            Adhérer
          </Link> */}
        </>
      )}
    </>
  );

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Version desktop et tablette */}
        <div className="hidden md:block">
          {/* Configuration pour écrans >= 1140px (xl) : une seule ligne */}
          <div className="xl:flex xl:justify-between xl:items-center xl:h-20 hidden">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/logo.png" alt="Les Patounes" className="h-[3rem] rounded-2xl" />
              <span className="text-2xl font-bold gradient-text">Les Patounes</span>
            </Link>

            <div className="flex items-center gap-x-5">
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
            </div>

            <div className="flex items-center space-x-4">{renderAuthButtons()}</div>
          </div>

          {/* Configuration pour écrans < 1140px (md à lg) : deux lignes */}
          <div className="xl:hidden py-3">
            {/* Première ligne : Logo + premiers liens */}
            <div className="flex justify-between items-center mb-3">
              <Link to="/" className="flex items-center space-x-3">
                <img src="/logo.png" alt="Les Patounes" className="h-[3rem] rounded-2xl" />
                <span className="text-2xl font-bold gradient-text">Les Patounes</span>
              </Link>

              <div className="flex items-center gap-x-5">
                {firstRowLinks.map((link) => (
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
              </div>
            </div>

            {/* Deuxième ligne : Histoire, Photos, Contact + Boutons */}
            <div className="flex justify-end items-center gap-x-5">
              {secondRowLinks.map((link) => (
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
              <div className="flex items-center space-x-4">{renderAuthButtons()}</div>
            </div>
          </div>
        </div>

        {/* Version mobile : bouton hamburger */}
        <div className="md:hidden flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/logo.png" alt="Les Patounes" className="h-[3rem] rounded-2xl" />
            <span className="text-2xl font-bold gradient-text">Les Patounes</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700"
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

      {/* Menu mobile */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-t`}>
        <div className="px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block font-semibold ${
                isActive(link.path) ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center space-x-4 pt-4">
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 h-[42px] bg-purple-50 rounded-lg border-2 border-purple-200 w-fit hover:bg-purple-100 hover:border-purple-300 transition-all duration-300"
                  title="Mon profil"
                >
                  <ion-icon name="person-circle" class="text-2xl text-purple-600"></ion-icon>
                  <span className="font-semibold text-purple-700 text-sm">
                    {user.username || user.firstName || user.email.split('@')[0]}
                  </span>
                </Link>
                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="h-[42px] px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2"
                    title="Panel Admin"
                  >
                    <ion-icon name="shield-checkmark-outline" class="text-xl"></ion-icon>
                    <span className="text-sm">Admin</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="h-[42px] w-[42px] bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center"
                  title="Se déconnecter"
                >
                  <ion-icon name="log-out-outline" class="text-2xl"></ion-icon>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-[42px] w-[42px] text-purple-600 border-2 border-purple-600 rounded-lg hover:bg-purple-50 hover:border-purple-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-xl"
                  title="Se connecter"
                >
                  <ion-icon name="person-circle-outline" class="text-2xl"></ion-icon>
                </Link>
                <Link
                  to="https://www.helloasso.com/associations/association-les-patounes/adhesions/adhesions"
                  target="_blank"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl"
                >
                  Adhérer
                </Link>
                {/* <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl"
                >
                  Adhérer
                </Link> */}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
