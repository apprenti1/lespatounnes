import { useState } from 'react';
import HeroSection from '../components/HeroSection';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      '🐾 Merci pour votre message !\n\nNous avons bien reçu votre demande et nous vous répondrons dans les plus brefs délais.\n\nÀ très bientôt !\nL\'équipe des Patounes 💜'
    );
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      <HeroSection
        title="Contactez nous"
        subtitle="Une question ? Une suggestion ? N'hésitez pas à nous écrire 🐾"
      />

      <section className="py-20 pt-0 bg-gray-50 paw-pattern -mt-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
            <a
              href="mailto:contact@lespatounes.fr"
              className="contact-card bg-white rounded-3xl p-10 text-center card-hover shadow-xl group"
            >
              <div className="text-7xl mb-6 group-hover:scale-110 transition-transform duration-300">
                📧
              </div>
              <h3 className="text-3xl font-bold gradient-text mb-4">Email</h3>
              <p className="text-gray-600 mb-4 text-lg">Écrivez-nous directement</p>
              <p className="text-purple-600 font-bold text-xl">contact@lespatounes.fr</p>
            </a>

            <a
              href="https://instagram.com/lespatounesfr"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card bg-white rounded-3xl p-10 text-center card-hover shadow-xl group"
            >
              <div className="text-7xl mb-6 group-hover:scale-110 transition-transform duration-300">
                📱
              </div>
              <h3 className="text-3xl font-bold gradient-text mb-4">Instagram</h3>
              <p className="text-gray-600 mb-4 text-lg">Suivez nos actualités</p>
              <p className="text-purple-600 font-bold text-xl">@lespatounesfr</p>
            </a>
          </div>

          <div className="max-w-3xl mx-auto mb-32">
            <div className="bg-white rounded-3xl p-10 md:p-12 shadow-2xl">
              <div className="text-center mb-10">
                <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                  Formulaire de Contact
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-500 mx-auto mb-4"></div>
                <p className="text-lg text-gray-600">
                  Remplissez le formulaire ci-dessous et nous vous répondrons rapidement 💜
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-lg">
                    Nom / Pseudo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 text-gray-700 text-lg transition-all duration-300"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-lg">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 text-gray-700 text-lg transition-all duration-300"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-lg">
                    Sujet *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 text-gray-700 text-lg transition-all duration-300"
                    placeholder="Objet de votre message"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-lg">
                    Message *
                  </label>
                  <textarea
                    required
                    rows="6"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 text-gray-700 text-lg transition-all duration-300 resize-none"
                    placeholder="Écrivez votre message ici..."
                  ></textarea>
                </div>

                <div className="text-center pt-4">
                  <button
                    type="submit"
                    className="btn-primary text-white px-12 py-4 rounded-full font-bold text-xl inline-flex items-center gap-3 shadow-xl"
                  >
                    <span>Envoyer</span>
                    <span className="text-2xl">🐾</span>
                  </button>
                </div>

                <p className="text-center text-gray-500 text-sm mt-4">* Champs obligatoires</p>
              </form>
            </div>
          </div>

          <div className="max-w-3xl mx-auto mt-12">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 text-center">
              <div className="text-5xl mb-4">⏱️</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Temps de réponse</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Nous faisons notre maximum pour répondre à tous vos messages dans les{' '}
                <span className="font-bold text-purple-600">48 heures</span>. Pour les demandes
                urgentes, n'hésitez pas à nous contacter sur Instagram 📱
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Questions Fréquentes
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600">Vous avez peut-être déjà la réponse 🤔</p>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-3">
                <span className="text-2xl">❓</span>
                Comment adhérer à l'association ?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Rendez-vous sur notre page d'accueil et cliquez sur le bouton "Adhérer" pour accéder
                au formulaire d'inscription. Vous pouvez aussi nous contacter directement pour plus
                d'informations.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-3">
                <span className="text-2xl">📅</span>
                Où trouver le calendrier des événements ?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Tous nos événements sont annoncés sur notre compte Instagram @lespatounesfr et dans
                la section "Événements" de notre site web. Suivez-nous pour ne rien manquer !
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-3">
                <span className="text-2xl">🐕</span>
                Faut-il être Puppy pour rejoindre Les Patounes ?
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Absolument pas ! Nos événements sont ouverts à{' '}
                <span className="font-bold text-purple-600">
                  tous les fétiches et à tout le monde
                </span>
                , sans aucune condition. Que vous soyez Puppy, Handler, Kitten, Pony, Leather,
                Rubber, ou simplement curieux et bienveillant, vous êtes les bienvenus !
              </p>
              <p className="text-gray-700 leading-relaxed">
                Pas besoin de matériel, d'expérience ou de connaissances particulières. Venez comme
                vous êtes, avec respect et ouverture d'esprit. Notre communauté est{' '}
                <span className="font-bold text-pink-600">inclusive, diverse et accueillante</span>{' '}
                🌈✨
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
