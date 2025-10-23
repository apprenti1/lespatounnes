import { useState } from 'react';
import { toast } from 'react-toastify';
import HeroSection from '../components/HeroSection';
import { Link } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la connexion');
      }

      // Stocker le token et les infos utilisateur
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      toast.success(
        `🐾 Bienvenue ${data.user.username || data.user.firstName || data.user.email} ! Vous êtes connecté 💜`,
        { position: 'top-center' }
      );

      // Redirection vers la page d'accueil après un court délai
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (err) {
      setError(err.message);
      toast.error(`❌ ${err.message}`, { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="navbar-padding pb-20 min-h-screen gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 paw-pattern opacity-10"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 text-white fade-in">
            <div className="text-8xl mb-6 floating">🐾</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              Bon retour parmi nous !
            </h1>
            <p className="text-xl md:text-2xl font-light drop-shadow-lg">
              Connectez-vous à votre espace membre
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl pulse-glow">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold gradient-text mb-3">Connexion</h2>
                <p className="text-gray-600 text-lg">Accédez à votre espace personnel 💜</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-3 text-lg">
                    Adresse email
                  </label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-2xl">
                      <ion-icon name="mail-outline"></ion-icon>
                    </span>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-14 pr-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 text-lg transition-all duration-300"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-3 text-lg">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-2xl">
                      <ion-icon name="lock-closed-outline"></ion-icon>
                    </span>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-14 pr-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 text-lg transition-all duration-300"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-2 border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                    <span className="text-gray-700 group-hover:text-purple-600 transition">
                      Se souvenir de moi
                    </span>
                  </label>
                  <a
                    href="#"
                    className="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary text-white py-5 rounded-xl font-bold text-xl shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{loading ? 'Connexion en cours...' : 'Se connecter'}</span>
                  <span className="text-2xl">🐾</span>
                </button>
              </form>

              <div className="mt-10 pt-8 border-t-2 border-gray-100 text-center">
                <p className="text-gray-600 text-lg mb-4">Pas encore membre de la meute ?</p>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300"
                >
                  <span className="text-2xl">✨</span>
                  <span>Rejoindre Les Patounes</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white/95 backdrop-blur rounded-2xl p-6 text-center shadow-xl">
                <div className="text-4xl mb-3">🔒</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Connexion sécurisée</h3>
                <p className="text-gray-600 text-sm">Vos données sont protégées</p>
              </div>

              <div className="bg-white/95 backdrop-blur rounded-2xl p-6 text-center shadow-xl">
                <div className="text-4xl mb-3">💜</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Espace membre</h3>
                <p className="text-gray-600 text-sm">Accès à vos avantages exclusifs</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
