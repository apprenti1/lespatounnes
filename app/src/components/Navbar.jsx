import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [panelsDropdownOpen, setPanelsDropdownOpen] = useState(false);
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
    /* { path: '/shop', label: 'Boutique' }, */
    { path: '/story', label: 'Histoire' },
    { path: '/photos', label: 'Photos' },
    { path: '/contact', label: 'Contact' },
  ];

  const firstRowLinks = navLinks.slice(0, 4); // Accueil, Événements, Partenaires, Boutique
  const secondRowLinks = navLinks.slice(4); // Histoire, Photos, Contact

  // Fonction pour compter les panneaux disponibles
  const countAvailablePanels = () => {
    if (!user) return 0;
    let count = 0;
    if (user.role === 'ADMIN' || user.role === 'DEV') count++; // Admin panel
    if (user.role === 'DEV') count++; // Dev panel (DEV ONLY)
    if (user.role === 'PHOTOGRAPHER' || user.role === 'ADMIN' || user.role === 'DEV') count++; // Photographer panel
    return count;
  };

  // Fonction pour rendre un panneau unique sans dropdown
  const renderSinglePanel = () => {
    if (!user) return null;

    // ADMIN: 2 panneaux (Admin + Photos) -> dropdown
    if (user.role === 'ADMIN') {
      return null;
    }

    // DEV: 3 panneaux (Admin + Dev + Photos) -> dropdown
    if (user.role === 'DEV') {
      return null;
    }

    // PHOTOGRAPHER: 1 panneau (Photos) -> bouton direct
    if (user.role === 'PHOTOGRAPHER') {
      return (
        <Link
          to="/photographer"
          className="h-[42px] px-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2"
          title="Panel Photographe"
        >
          <ion-icon name="camera-outline" class="text-xl"></ion-icon>
          <span className="text-sm">Photos</span>
        </Link>
      );
    }

    return null;
  };

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

          {/* Afficher soit un bouton unique, soit un dropdown */}
          {renderSinglePanel()}

          {/* Menu déroulant pour les panneaux spéciaux (seulement si plusieurs panneaux) */}
          {countAvailablePanels() > 1 && (
            <div className="relative group">
              <button
                className="h-[42px] px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2"
                title="Panneaux spéciaux"
              >
                <ion-icon name="grid-outline" class="text-xl"></ion-icon>
                <span className="text-sm">Panneaux</span>
                <ion-icon name="chevron-down-outline" class="text-lg"></ion-icon>
              </button>

              {/* Dropdown menu */}
              <div className="absolute right-0 mt-0 w-48 bg-white rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                {(user.role === 'ADMIN' || user.role === 'DEV') && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-orange-50 text-gray-800 hover:text-orange-600 transition-colors first:rounded-t-lg border-b border-gray-100"
                  >
                    <ion-icon name="shield-checkmark-outline" class="text-xl"></ion-icon>
                    <span className="font-semibold">Admin</span>
                  </Link>
                )}
                {user.role === 'DEV' && (
                  <Link
                    to="/dev"
                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-indigo-50 text-gray-800 hover:text-indigo-600 transition-colors border-b border-gray-100"
                  >
                    <ion-icon name="settings-outline" class="text-xl"></ion-icon>
                    <span className="font-semibold">Développeur</span>
                  </Link>
                )}
                {(user.role === 'PHOTOGRAPHER' || user.role === 'ADMIN' || user.role === 'DEV') && (
                  <Link
                    to="/photographer"
                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-cyan-50 text-gray-800 hover:text-cyan-600 transition-colors last:rounded-b-lg"
                  >
                    <ion-icon name="camera-outline" class="text-xl"></ion-icon>
                    <span className="font-semibold">Photos</span>
                  </Link>
                )}
              </div>
            </div>
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

                {/* Afficher soit un bouton unique, soit un dropdown - Mobile */}
                {user.role === 'PHOTOGRAPHER' && (
                  <Link
                    to="/photographer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full h-[42px] px-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <ion-icon name="camera-outline" class="text-xl"></ion-icon>
                    <span className="text-sm">Photos</span>
                  </Link>
                )}

                {/* Menu déroulant pour les panneaux spéciaux - Mobile (seulement si plusieurs panneaux) */}
                {countAvailablePanels() > 1 && (
                  <div className="w-full">
                    <button
                      onClick={() => setPanelsDropdownOpen(!panelsDropdownOpen)}
                      className="w-full h-[42px] px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <ion-icon name="grid-outline" class="text-xl"></ion-icon>
                        <span className="text-sm">Panneaux</span>
                      </div>
                      <ion-icon name={panelsDropdownOpen ? "chevron-up-outline" : "chevron-down-outline"} class="text-lg"></ion-icon>
                    </button>

                    {panelsDropdownOpen && (
                      <div className="mt-2 space-y-2">
                        {(user.role === 'ADMIN' || user.role === 'DEV') && (
                          <Link
                            to="/admin"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setPanelsDropdownOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-3 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition-colors font-semibold"
                          >
                            <ion-icon name="shield-checkmark-outline" class="text-xl"></ion-icon>
                            <span>Admin</span>
                          </Link>
                        )}
                        {user.role === 'DEV' && (
                          <Link
                            to="/dev"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setPanelsDropdownOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors font-semibold"
                          >
                            <ion-icon name="settings-outline" class="text-xl"></ion-icon>
                            <span>Développeur</span>
                          </Link>
                        )}
                        {(user.role === 'PHOTOGRAPHER' || user.role === 'ADMIN' || user.role === 'DEV') && (
                          <Link
                            to="/photographer"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setPanelsDropdownOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-3 bg-cyan-50 hover:bg-cyan-100 text-cyan-600 rounded-lg transition-colors font-semibold"
                          >
                            <ion-icon name="camera-outline" class="text-xl"></ion-icon>
                            <span>Photos</span>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
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
