import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');

    if (!userData || !token) {
      toast.error('Vous devez être connecté pour accéder à cette page');
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        username: parsedUser.username || '',
        email: parsedUser.email || '',
      });
    } catch (error) {
      toast.error('Erreur lors de la vérification de l\'authentification');
      navigate('/login');
    }
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Vous devez être connecté');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/update-profile`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Mettre à jour les infos locales
        const updatedUser = { ...user, ...formData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('storage'));
        toast.success('Profil mis à jour avec succès ! 🐾', { position: 'top-center' });
      } else {
        toast.error(data.message || 'Erreur lors de la mise à jour du profil', { position: 'top-center' });
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour du profil', { position: 'top-center' });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas !', { position: 'top-center' });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères !', { position: 'top-center' });
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Vous devez être connecté');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Mot de passe modifié avec succès ! 🐾', { position: 'top-center' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(data.message || 'Erreur lors du changement de mot de passe', { position: 'top-center' });
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du changement de mot de passe', { position: 'top-center' });
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('⚠️ ATTENTION : Cette action est irréversible !\n\nÊtes-vous absolument sûr de vouloir supprimer votre compte ? Toutes vos données seront définitivement perdues.')) {
      // TODO: Implémenter l'appel API pour supprimer le compte
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      toast.success('Votre compte a été supprimé. Au revoir ! 👋', { position: 'top-center' });
      navigate('/');
    }
  };

  const handleEndMembership = () => {
    if (confirm('Êtes-vous sûr de vouloir mettre fin à votre adhésion ?\n\nVous pourrez toujours vous réinscrire plus tard.')) {
      // TODO: Implémenter l'appel API pour mettre fin à l'adhésion
      toast.info('Votre adhésion a été résiliée. Vous restez connecté mais n\'êtes plus membre.', { position: 'top-center' });
    }
  };

  if (!user) {
    return null;
  }

  const heroButtons = [
    {
      href: '#informations',
      text: 'Mes informations',
      className:
        'bg-white text-purple-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg',
    },
  ];

  return (
    <>
      <HeroSection
        emoji="👤"
        title="Mon Profil"
        subtitle={`Bienvenue ${user.username || 'membre'} ! 🐾`}
        description="Gérez vos informations personnelles et votre compte"
        buttons={heroButtons}
      />

      <section className="py-20 bg-gray-50 paw-pattern">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Informations personnelles */}
          <div id="informations" className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl mb-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="text-4xl">📝</div>
              <h2 className="text-3xl font-bold gradient-text">Informations personnelles</h2>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Pseudo / Nom de scène</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 transition-all duration-300"
                  placeholder="Votre pseudo"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 transition-all duration-300"
                  placeholder="votre@email.com"
                />
              </div>

              <button
                type="submit"
                className="btn-primary text-white px-8 py-4 rounded-xl font-bold shadow-xl flex items-center gap-3"
              >
                <ion-icon name="save-outline" class="text-xl"></ion-icon>
                <span>Enregistrer les modifications</span>
              </button>
            </form>
          </div>

          {/* Changement de mot de passe */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl mb-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="text-4xl">🔐</div>
              <h2 className="text-3xl font-bold gradient-text">Changer le mot de passe</h2>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Mot de passe actuel</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Nouveau mot de passe</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">Minimum 8 caractères</p>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Confirmer le nouveau mot de passe</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary text-white px-8 py-4 rounded-xl font-bold shadow-xl flex items-center gap-3"
              >
                <ion-icon name="key-outline" class="text-xl"></ion-icon>
                <span>Changer le mot de passe</span>
              </button>
            </form>
          </div>

          {/* Zone dangereuse */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-red-200">
            <div className="flex items-center gap-3 mb-8">
              <div className="text-4xl">⚠️</div>
              <h2 className="text-3xl font-bold text-red-600">Zone dangereuse</h2>
            </div>

            <div className="space-y-6">
              {/* Fin d'adhésion */}
              <div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-200">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Mettre fin à mon adhésion</h3>
                <p className="text-gray-700 mb-4">
                  Vous ne serez plus membre de l'association mais votre compte restera actif. Vous pourrez vous réinscrire à tout moment.
                </p>
                <button
                  onClick={handleEndMembership}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition transform hover:scale-105 shadow-md flex items-center gap-2"
                >
                  <ion-icon name="exit-outline" class="text-xl"></ion-icon>
                  <span>Résilier mon adhésion</span>
                </button>
              </div>

              {/* Suppression de compte */}
              <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Supprimer mon compte</h3>
                <p className="text-gray-700 mb-4">
                  <strong>⚠️ Action irréversible :</strong> Toutes vos données seront définitivement supprimées. Cette action ne peut pas être annulée.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition transform hover:scale-105 shadow-md flex items-center gap-2"
                >
                  <ion-icon name="trash-outline" class="text-xl"></ion-icon>
                  <span>Supprimer définitivement mon compte</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
