import { useState } from 'react';
import { toast } from 'react-toastify';
import HeroSection from '../components/HeroSection';

export default function SuggererPartenaire() {
  const [formData, setFormData] = useState({
    enseigne: '',
    pseudo: '',
    email: '',
    nomContact: '',
    coordonneesContact: '',
    message: '',
    accepteCollecte: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.enseigne ||
      !formData.pseudo ||
      !formData.email ||
      !formData.message ||
      !formData.accepteCollecte
    ) {
      toast.error('❌ Veuillez remplir tous les champs obligatoires et accepter la collecte de données !', {
        position: 'top-center',
      });
      return;
    }

    setLoading(true);

    try {
      // TODO: Envoyer le formulaire au backend
      console.log('Formulaire soumis :', formData);

      toast.success(
        '✅ Votre suggestion a été envoyée avec succès ! Merci pour votre contribution 💜',
        { position: 'top-center' }
      );

      // Réinitialiser le formulaire
      setFormData({
        enseigne: '',
        pseudo: '',
        email: '',
        nomContact: '',
        coordonneesContact: '',
        message: '',
        accepteCollecte: false,
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
        emoji="🐾"
        title="Suggérer un Partenaire"
        subtitle="Vous connaissez une enseigne qui pourrait rejoindre notre réseau ?"
        description="Aidez-nous à élargir notre communauté en nous recommandant un partenaire potentiel !"
      />

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 shadow-xl">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold gradient-text mb-3">
                Formulaire de suggestion
              </h2>
              <p className="text-gray-600 text-lg">
                Recommandez une enseigne qui pourrait devenir partenaire 💜
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
                  placeholder="Nom du commerce / entreprise suggéré"
                />
              </div>

              {/* Pseudo */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-lg">
                  Pseudo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.pseudo}
                  onChange={(e) =>
                    setFormData({ ...formData, pseudo: e.target.value })
                  }
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 text-lg transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  placeholder="Votre pseudo / surnom"
                />
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

              {/* Nom de la personne à contacter */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-lg">
                  Nom de la personne à contacter
                </label>
                <p className="text-sm text-gray-500 mb-2">Si vous avez cette information</p>
                <input
                  type="text"
                  value={formData.nomContact}
                  onChange={(e) =>
                    setFormData({ ...formData, nomContact: e.target.value })
                  }
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 text-lg transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  placeholder="Nom du responsable / gérant"
                />
              </div>

              {/* Coordonnées de la personne à contacter */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-lg">
                  Coordonnées de la personne à contacter
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  Téléphone, email, Instagram, etc. (si vous avez cette information)
                </p>
                <textarea
                  rows="3"
                  value={formData.coordonneesContact}
                  onChange={(e) =>
                    setFormData({ ...formData, coordonneesContact: e.target.value })
                  }
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 text-lg transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none"
                  placeholder="Téléphone : 06 12 34 56 78&#10;Email : contact@exemple.com&#10;Instagram : @exemple"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-lg">
                  Votre message *
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  Merci de nous indiquer le plus d'informations possible concernant le partenaire
                  suggéré afin que nous puissions les contacter
                </p>
                <textarea
                  required
                  rows="6"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-700 text-lg transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none"
                  placeholder="Décrivez l'enseigne, ce qu'elle propose, pourquoi elle serait un bon partenaire, son adresse, site web, etc."
                />
              </div>

              {/* Acceptation collecte de données */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-100">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    required
                    checked={formData.accepteCollecte}
                    onChange={(e) =>
                      setFormData({ ...formData, accepteCollecte: e.target.checked })
                    }
                    className="w-6 h-6 mt-1 rounded border-2 border-gray-300 text-purple-600 focus:ring-purple-500 flex-shrink-0 cursor-pointer"
                  />
                  <span className="text-gray-700 leading-relaxed">
                    En soumettant ce formulaire, j'accepte que les données saisies soient
                    collectées dans le but de traiter ma demande. *
                  </span>
                </label>
              </div>

              {/* Bouton Submit */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary text-white py-5 rounded-xl font-bold text-xl shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{loading ? 'Envoi en cours...' : 'Envoyer ma suggestion'}</span>
                  <span className="text-2xl">🐾</span>
                </button>
              </div>

              <p className="text-center text-gray-500 text-sm">* Champs obligatoires</p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
