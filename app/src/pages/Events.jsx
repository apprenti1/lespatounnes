import HeroSection from '../components/HeroSection';
import { Link } from 'react-router-dom';

export default function Events() {
  const events = [
    {
      emoji: '🎉',
      title: 'Événements Mensuels',
      badge: 'Mensuel',
      badgeColor: 'bg-blue-100 text-blue-600',
      gradient: 'from-blue-500 to-purple-500',
      description:
        'Un événement spécial chaque mois pour renforcer les liens de notre communauté et découvrir de nouvelles activités ensemble.',
      frequency: '1 fois par mois',
      icon: 'calendar-outline',
    },
    {
      emoji: '🌞',
      title: 'Pique-niques & Sorties',
      badge: 'Saisonnier',
      badgeColor: 'bg-pink-100 text-pink-600',
      gradient: 'from-pink-500 to-orange-500',
      description:
        'Des moments conviviaux en plein air pour se retrouver dans une ambiance détendue et profiter du beau temps tous ensemble.',
      frequency: 'Printemps & Été',
      icon: 'sunny-outline',
    },
    {
      emoji: '🎭',
      title: 'Événements Thématiques',
      badge: 'Spécial',
      badgeColor: 'bg-green-100 text-green-600',
      gradient: 'from-green-500 to-teal-500',
      description:
        'Des événements sur plusieurs jours avec des thématiques créatives et immersives pour vivre des expériences inoubliables.',
      frequency: 'Événements exceptionnels',
      icon: 'sparkles-outline',
    },
    {
      emoji: '📸',
      title: 'Calendrier Puppy 2026',
      badge: 'Projet 2026',
      badgeColor: 'bg-yellow-100 text-yellow-600',
      gradient: 'from-yellow-500 to-red-500',
      description:
        'Un projet collectif qui mettra en avant nos membres et nos valeurs à travers un calendrier photographique unique et créatif.',
      frequency: 'À venir en 2026',
      icon: 'camera-outline',
    },
    {
      emoji: '✨',
      title: 'Soirées Spéciales',
      badge: 'Régulier',
      badgeColor: 'bg-indigo-100 text-indigo-600',
      gradient: 'from-indigo-500 to-purple-500',
      description:
        'Des soirées thématiques festives et inclusives pour célébrer ensemble notre communauté dans une ambiance unique et bienveillante.',
      frequency: 'Plusieurs fois par an',
      icon: 'moon-outline',
    },
    {
      emoji: '🤝',
      title: 'Rencontres & Networking',
      badge: 'Continu',
      badgeColor: 'bg-purple-100 text-purple-600',
      gradient: 'from-purple-600 to-pink-600',
      description:
        "Créer des liens forts et authentiques entre les participants à travers des moments d'échange et de partage privilégiés.",
      frequency: "Tout au long de l'année",
      icon: 'people-outline',
    },
  ];

  const heroButtons = [
    {
      href: '#evenements',
      text: 'Voir tous les événements',
      className:
        'bg-white text-purple-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg',
    },
    {
      href: 'https://instagram.com/lespatounesfr',
      text: 'Suivre sur Instagram',
      className:
        'border-2 border-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-purple-600 transition shadow-lg',
    },
  ];

  return (
    <>
      <HeroSection
        emoji="🎉"
        title="Nos Événements"
        subtitle="Découvrez toutes nos initiatives et rejoignez la meute 🐾"
        buttons={heroButtons}
      />

      {/* Section à venir */}
      <section className="py-20 bg-gray-50 paw-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            Nos Événements en cours de préparation
          </h2>
          <p className="text-xl text-gray-600">
            Nos évents seront bientôt disponibles ! 🐾
          </p>
        </div>
      </section>
      
      {/* {Featured Event} */}
      <section className="py-20 bg-gray-50 paw-pattern -mt-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-purple-100 text-purple-600 px-6 py-3 rounded-full font-bold text-lg mb-4">
              ⭐ ÉVÉNEMENT PHARE
            </span>
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Notre Rendez-vous Hebdomadaire
            </h2>
          </div>

          <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl card-hover">
            <div className="image-card h-96 md:h-[500px] relative">
              <img
                src="/qonasse-banner.jpg"
                alt="Affiche Les Patounes"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-5xl md:text-6xl">🍻</span>
                  <h3 className="text-3xl md:text-5xl font-bold">Apéros Hebdomadaires</h3>
                </div>
                <p className="text-xl md:text-2xl mb-3 font-light">
                  Tous les jeudis à 18h30 au FreeDj, dans le Marais à Paris
                </p>
                <p className="text-lg md:text-xl opacity-90 mb-6">
                  Avec La Qonnasse KyssyBangBang
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="event-badge bg-white text-purple-600">
                    <ion-icon name="calendar-outline"></ion-icon>
                    Tous les jeudis
                  </span>
                  <span className="event-badge bg-white text-purple-600">
                    <ion-icon name="time-outline"></ion-icon>
                    18h30
                  </span>
                  <span className="event-badge bg-white text-purple-600">
                    <ion-icon name="location-outline"></ion-icon>
                    FreeDj - Le Marais
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* {Events Grid} */}
      <section id="evenements" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Tous Nos Événements
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600">
              Une programmation riche et variée tout au long de l'année 🌈
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover border-2 border-gray-100"
              >
                <div
                  className={`h-48 bg-gradient-to-br ${event.gradient} flex items-center justify-center relative overflow-hidden`}
                >
                  <div className="absolute inset-0 paw-pattern opacity-20"></div>
                  <span className="text-7xl relative z-10">{event.emoji}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-2xl font-bold text-gray-800">{event.title}</h3>
                    <span className={`event-badge ${event.badgeColor} flex-shrink-0`}>
                      {event.badge}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 leading-relaxed">{event.description}</p>
                  <div className="flex items-center gap-2 text-purple-600 font-semibold">
                    <ion-icon name={event.icon} class="text-xl"></ion-icon>
                    <span>{event.frequency}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* {Calendar CTA} */}
      <section className="py-20 bg-gray-50 paw-pattern">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-10 md:p-16 text-white text-center shadow-2xl card-hover">
            <div className="text-7xl mb-6 floating">📅</div>
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Ne manquez aucun événement !</h3>
            <p className="text-xl md:text-2xl mb-8 font-light max-w-2xl mx-auto">
              Suivez-nous sur Instagram pour être informé en temps réel de tous nos événements et
              actualités
            </p>
            <a
              href="https://instagram.com/lespatounesfr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-purple-600 px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-gray-100 transition transform hover:scale-105"
            >
              <span className="text-2xl">📱</span>
              <span>@lespatounesfr</span>
            </a>
          </div>
        </div>
      </section>

      {/* {Participation Info} */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Comment Participer ?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600">C'est simple et ouvert à tous 🌈</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-4xl text-white shadow-xl">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Suivez-nous</h3>
              <p className="text-gray-600 leading-relaxed">
                Abonnez-vous à notre Instagram et activez les notifications pour ne rien manquer de
                nos annonces
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-4xl text-white shadow-xl">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Venez comme vous êtes</h3>
              <p className="text-gray-600 leading-relaxed">
                Pas besoin de matériel ou d'expérience. Venez avec respect, ouverture d'esprit et
                bienveillance
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-4xl text-white shadow-xl">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Profitez !</h3>
              <p className="text-gray-600 leading-relaxed">
                Rencontrez de nouvelles personnes, créez des liens et faites partie de notre
                communauté pawsitive
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
              <p className="text-lg text-gray-700 mb-4">
                <span className="font-bold text-purple-600">Pour les membres :</span> accès
                prioritaire et avantages exclusifs sur certains événements
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-3 btn-primary text-white px-8 py-3 rounded-full font-bold shadow-xl"
              >
                <span>Devenir membre</span>
                <span className="text-xl">🐾</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
