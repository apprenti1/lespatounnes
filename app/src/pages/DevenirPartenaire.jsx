import { useState } from 'react';
import { toast } from 'react-toastify';
import HeroSection from '../components/HeroSection';

export default function DevenirPartenaire() {
  const [formData, setFormData] = useState({
    enseigne: '',
    nom: '',
    prenom: '',
    email: '',
    rue: '',
    complement: '',
    codePostal: '',
    ville: '',
    region: '',
    pays: 'France',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.enseigne ||
      !formData.nom ||
      !formData.prenom ||
      !formData.email ||
      !formData.rue ||
      !formData.codePostal ||
      !formData.ville ||
      !formData.message
    ) {
      toast.error('❌ Veuillez remplir tous les champs obligatoires !', {
        position: 'top-center',
      });
      return;
    }

    setLoading(true);

    try {
      // TODO: Envoyer le formulaire au backend
      console.log('Formulaire soumis :', formData);

      toast.success(
        '✅ Votre demande a été envoyée avec succès ! Nous vous recontacterons rapidement.',
        { position: 'top-center' }
      );

      // Réinitialiser le formulaire
      setFormData({
        enseigne: '',
        nom: '',
        prenom: '',
        email: '',
        rue: '',
        complement: '',
        codePostal: '',
        ville: '',
        region: '',
        pays: 'France',
        message: '',
      });
    } catch (err) {
      toast.error(`❌ ${err.message}`, { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeroSection
        emoji="🤝"
        title="Devenir Partenaire"
        subtitle="Rejoignez notre réseau de partenaires"
        description="Vous souhaitez soutenir notre communauté et offrir des avantages à nos membres ? Remplissez ce formulaire !"
      />

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 shadow-xl">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold gradient-text mb-3">
                Formulaire de partenariat
              </h2>
              <p className="text-gray-600 text-lg">
                Présentez votre enseigne et votre projet de partenariat 💜
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom de l'enseigne */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-lg">
                  Nom de l'enseigne *
                </label>
                <input
                  type="text"
                  required
                  value={formData.enseigne}
                  onChange={(e) =>
                    setFormData({ ...formData, enseigne: e.target.value })
                  }
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 text-lg transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  placeholder="Nom de votre commerce / entreprise"
                />
              </div>

              {/* Nom et Prénom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-lg">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) =>
                      setFormData({ ...formData, nom: e.target.value })
                    }
                    className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 text-lg transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-lg">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.prenom}
                    onChange={(e) =>
                      setFormData({ ...formData, prenom: e.target.value })
                    }
                    className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 text-lg transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    placeholder="Votre prénom"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-lg">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 text-lg transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  placeholder="votre@email.com"
                />
              </div>

              {/* Adresse */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-lg">
                  Rue *
                </label>
                <input
                  type="text"
                  required
                  value={formData.rue}
                  onChange={(e) =>
                    setFormData({ ...formData, rue: e.target.value })
                  }
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 text-lg transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  placeholder="Numéro et nom de rue"
                />
              </div>

              {/* Complément d'adresse */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-lg">
                  Complément d'adresse
                </label>
                <input
                  type="text"
                  value={formData.complement}
                  onChange={(e) =>
                    setFormData({ ...formData, complement: e.target.value })
                  }
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 text-lg transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  placeholder="Bâtiment, étage, etc."
                />
              </div>

              {/* Code postal et Ville */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-lg">
                    Code postal *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.codePostal}
                    onChange={(e) =>
                      setFormData({ ...formData, codePostal: e.target.value })
                    }
                    className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 text-lg transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    placeholder="75001"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-lg">
                    Ville *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ville}
                    onChange={(e) =>
                      setFormData({ ...formData, ville: e.target.value })
                    }
                    className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 text-lg transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    placeholder="Paris"
                  />
                </div>
              </div>

              {/* Région */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-lg">
                  État / Province / Région
                </label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) =>
                    setFormData({ ...formData, region: e.target.value })
                  }
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 text-lg transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  placeholder="Île-de-France"
                />
              </div>

              {/* Pays */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-lg">
                  Pays *
                </label>
                <input
                  type="text"
                  required
                  value={formData.pays}
                  onChange={(e) =>
                    setFormData({ ...formData, pays: e.target.value })
                  }
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 text-lg transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  placeholder="France"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-lg">
                  Votre message *
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  Merci de présenter votre marque, commerce, etc. afin que nous
                  puissions étudier votre demande
                </p>
                <textarea
                  required
                  rows="6"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 text-lg transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none"
                  placeholder="Présentez votre enseigne, vos valeurs, ce que vous proposez et pourquoi vous souhaitez devenir partenaire..."
                />
              </div>

              {/* Bouton Submit */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary text-white py-5 rounded-xl font-bold text-xl shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{loading ? 'Envoi en cours...' : 'Envoyer ma demande'}</span>
                  <span className="text-2xl">🤝</span>
                </button>
              </div>

              <p className="text-center text-gray-500 text-sm">
                * Champs obligatoires
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
