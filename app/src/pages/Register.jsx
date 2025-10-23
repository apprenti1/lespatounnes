import { useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    pseudo: '',
    prenom: '',
    nom: '',
    naissance: '',
    email: '',
    password: '',
    confirmPassword: '',
    cgu: false,
    newsletter: false,
    adhesion: 'standard', // Adhésion par défaut
  });
  const [loading, setLoading] = useState(false);

  const membershipOptions = [
    {
      id: 'standard',
      name: 'Standard',
      price: 10,
      emoji: '🐾',
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 25,
      emoji: '✨',
    },
    {
      id: 'support',
      name: 'Soutien',
      price: 50,
      emoji: '💜',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.prenom || !formData.nom || !formData.naissance || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('❌ Veuillez remplir tous les champs obligatoires !', { position: 'top-center' });
      return;
    }

    if (!formData.cgu) {
      toast.error("❌ Vous devez accepter les conditions générales d'utilisation pour continuer.", { position: 'top-center' });
      return;
    }

    const birthDate = new Date(formData.naissance);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      toast.error("❌ Vous devez avoir 18 ans ou plus pour adhérer à l'association.", { position: 'top-center' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('❌ Les mots de passe ne correspondent pas !', { position: 'top-center' });
      return;
    }

    if (formData.password.length < 8) {
      toast.error('❌ Le mot de passe doit contenir au moins 8 caractères !', { position: 'top-center' });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.pseudo || null,
          firstName: formData.prenom,
          lastName: formData.nom,
          birthDate: formData.naissance,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'inscription');
      }

      // Stocker le token et les infos utilisateur
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      toast.success(
        `🎉 Compte créé avec succès ${formData.prenom} ! 🐾`,
        { position: 'top-center', autoClose: 2000 }
      );

      // Redirection vers HelloAsso pour le paiement de l'adhésion
      setTimeout(async () => {
        try {
          toast.info('Redirection vers HelloAsso pour votre adhésion...', { position: 'top-center' });

          const selectedMembership = membershipOptions.find(opt => opt.id === formData.adhesion);

          // Créer le checkout HelloAsso
          const checkoutResponse = await fetch('http://localhost:3000/helloasso/create-membership-checkout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              firstName: formData.prenom,
              lastName: formData.nom,
              email: formData.email,
              amount: selectedMembership.price,
            }),
          });

          const checkoutData = await checkoutResponse.json();

          if (checkoutResponse.ok && checkoutData.redirectUrl) {
            // Rediriger vers HelloAsso
            window.location.href = checkoutData.redirectUrl;
          } else {
            throw new Error('Erreur lors de la création du paiement');
          }
        } catch (error) {
          toast.error('Erreur lors de la redirection vers le paiement. Vous pourrez adhérer depuis votre profil.', { position: 'top-center' });
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        }
      }, 1500);
    } catch (err) {
      toast.error(`❌ ${err.message}`, { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="navbar-padding pb-20 min-h-screen gradient-bg relative overflow-hidden">
      <div className="absolute inset-0 paw-pattern opacity-10"></div>

      <div className="navbar-padding relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 text-white fade-in">
          <div className="text-8xl mb-6 floating">🐾</div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Rejoignez la meute !
          </h1>
          <p className="text-xl md:text-2xl font-light drop-shadow-lg">
            Devenez membre des Patounes et profitez d'avantages exclusifs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { emoji: '✨', title: 'Événements exclusifs', desc: 'Accès prioritaire' },
            { emoji: '🎁', title: 'Goodies', desc: 'Cadeaux membres' },
            { emoji: '💰', title: 'Réductions', desc: 'Chez nos partenaires' },
            { emoji: '💜', title: 'Communauté', desc: 'Safe & inclusive' },
          ].map((item, i) => (
            <div key={i} className="bg-white/95 backdrop-blur rounded-2xl p-6 text-center shadow-xl">
              <div className="text-5xl mb-3">{item.emoji}</div>
              <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl pulse-glow">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold gradient-text mb-3">Formulaire d'adhésion</h2>
              <p className="text-gray-600 text-lg">
                Remplissez vos informations pour devenir membre 💜
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Choix de l'adhésion */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                <label className="block text-gray-800 font-bold mb-4 text-xl">
                  Choisissez votre formule d'adhésion *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {membershipOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`cursor-pointer rounded-xl p-4 border-2 transition-all duration-300 ${
                        formData.adhesion === option.id
                          ? 'bg-purple-500 border-purple-600 text-white shadow-lg scale-105'
                          : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
                      }`}
                    >
                      <input
                        type="radio"
                        name="adhesion"
                        value={option.id}
                        checked={formData.adhesion === option.id}
                        onChange={(e) => setFormData({ ...formData, adhesion: e.target.value })}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="text-4xl mb-2">{option.emoji}</div>
                        <div className={`font-bold text-lg mb-1 ${formData.adhesion === option.id ? 'text-white' : 'text-gray-800'}`}>
                          {option.name}
                        </div>
                        <div className={`text-2xl font-bold ${formData.adhesion === option.id ? 'text-white' : 'text-purple-600'}`}>
                          {option.price}€
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-lg">
                  Pseudo / Nom de scène{' '}
                  <span className="text-gray-400 font-normal text-base">(optionnel)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-2xl">
                    <ion-icon name="paw-outline"></ion-icon>
                  </span>
                  <input
                    type="text"
                    value={formData.pseudo}
                    onChange={(e) => setFormData({ ...formData, pseudo: e.target.value })}
                    className="w-full pl-14 pr-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 text-lg transition-all duration-300"
                    placeholder="Votre pseudo dans la communauté"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-lg">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 text-lg transition-all duration-300"
                    placeholder="Prénom"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-lg">Nom *</label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 text-lg transition-all duration-300"
                    placeholder="Nom"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-lg">
                  Date de naissance *
                </label>
                <input
                  type="date"
                  required
                  value={formData.naissance}
                  onChange={(e) => setFormData({ ...formData, naissance: e.target.value })}
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 text-lg transition-all duration-300"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Vous devez avoir 18 ans ou plus pour adhérer
                </p>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-lg">
                  Adresse email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 text-lg transition-all duration-300"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-lg">
                  Mot de passe *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 text-lg transition-all duration-300"
                  placeholder="••••••••"
                />
                <p className="text-sm text-gray-500 mt-2">Minimum 8 caractères</p>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-lg">
                  Confirmer le mot de passe *
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 text-lg transition-all duration-300"
                  placeholder="••••••••"
                />
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-100">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    required
                    checked={formData.cgu}
                    onChange={(e) => setFormData({ ...formData, cgu: e.target.checked })}
                    className="w-6 h-6 mt-1 rounded border-2 border-gray-300 text-purple-600 focus:ring-purple-500 flex-shrink-0 cursor-pointer"
                  />
                  <span className="text-gray-700 leading-relaxed">
                    J'accepte les conditions générales d'utilisation et la politique de
                    confidentialité de l'association Les Patounes *
                  </span>
                </label>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary text-white py-5 rounded-xl font-bold text-xl shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{loading ? 'Inscription en cours...' : 'Valider mon adhésion'}</span>
                  <span className="text-2xl">🐾</span>
                </button>
              </div>

              <p className="text-center text-gray-500 text-sm">* Champs obligatoires</p>
            </form>

            <div className="mt-10 pt-8 border-t-2 border-gray-100 text-center">
              <p className="text-gray-600 text-lg">
                Vous avez déjà un compte ?{' '}
                <Link to="/login" className="text-purple-600 hover:text-purple-700 font-bold hover:underline">
                  Connectez-vous
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
