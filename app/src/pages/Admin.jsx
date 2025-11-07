import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import HeroSection from '../components/HeroSection';

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Vérifier l'authentification et le rôle
  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');

    if (!token || !userData) {
      toast.error('Vous devez être connecté pour accéder à cette page');
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'ADMIN' && parsedUser.role !== 'DEV') {
        toast.error('Accès réservé aux administrateurs et développeurs');
        navigate('/');
        return;
      }
      setUser(parsedUser);
    } catch (error) {
      toast.error('Erreur lors de la vérification de l\'authentification');
      navigate('/login');
    }
  }, [navigate]);

  if (!user) {
    return null;
  }
  const heroStats = [
    { emoji: '👥', value: '~80', label: 'Personnes par événement' },
    { emoji: '💜', value: '64', label: 'Adhérents' },
    { emoji: '🎉', value: '2025', label: 'Ouverture en Juin' },
  ];

  const heroButtons = [
    {
      href: '#gestion',
      text: 'Tableau de bord',
      className:
        'bg-white text-purple-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg',
    },
  ];

  return (
    <>
      <HeroSection
        emoji="🛡️"
        title="Panel Admin"
        subtitle="Gestion de l'association Les Patounes"
        description="Espace réservé aux administrateurs"
        buttons={heroButtons}
        stats={heroStats}
      />

      {/* Section à venir */}
      <section className="py-20 bg-gray-50 paw-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            Panel d'administration en cours de développement
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Cette page sera bientôt disponible avec tous les outils de gestion ! 🐾
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white rounded-2xl p-8 shadow-xl card-hover">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Gestion des membres</h3>
              <p className="text-gray-600">Visualiser et gérer les adhérents</p>
            </div>

            <button
              onClick={() => navigate('/admin/events')}
              className="bg-white rounded-2xl p-8 shadow-xl card-hover hover:shadow-2xl transition-all duration-300 cursor-pointer text-center"
            >
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Gestion des événements</h3>
              <p className="text-gray-600">Créer et modifier les événements</p>
            </button>

            <div className="bg-white rounded-2xl p-8 shadow-xl card-hover">
              <div className="text-5xl mb-4">🪄</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Personnalisation</h3>
              <p className="text-gray-600">Personnaliser les pages facilement</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
