import HeroSection from '../components/HeroSection';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Home() {
  const heroStats = [
    { emoji: '👥', value: '~80', label: 'Personnes par événement' },
    { emoji: '💜', value: '64', label: 'Adhérents' },
    { emoji: '🎉', value: '2025', label: 'Ouverture en Juin' },
  ];

  const heroButtons = [
    {
      href: '#mission',
      text: 'Découvrir notre mission',
      className:
        'bg-white text-purple-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg',
    },
    {
      href: '/events',
      text: 'Nos événements',
      isLink: true,
      className:
        'border-2 border-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-purple-600 transition shadow-lg',
    },
  ];

  return (
    <>
      <HeroSection
        emoji="img"
        title="Les Patounes"
        subtitle="Communauté Puppy LGBT+ à Paris"
        description='Un espace inclusif, bienveillant et "pawsitif" 🌈'
        photoCredit="Photo : Scooby, PupNic Pride 2025"
        buttons={heroButtons}
        stats={heroStats}
      />

      {/* Mission Section */}
      <section id="mission" className="py-20 bg-gray-50 paw-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold gradient-text mb-4">Notre Mission</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600">
              Promouvoir et valoriser la culture fétiche LGBT+ 🐶
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-10 md:p-16 shadow-2xl card-hover">
            <div className="max-w-4xl mx-auto">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                Chez Les Patounes, notre mission est de{' '}
                <span className="font-bold text-purple-600">
                  promouvoir et valoriser la culture fétiche LGBT+
                </span>
                , et plus particulièrement la{' '}
                <span className="font-bold text-purple-600">communauté Puppy 🐶</span>
              </p>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                Nous souhaitons offrir un espace où chacun peut{' '}
                <span className="font-bold text-pink-600">vivre pleinement son identité</span>,
                s'exprimer librement et trouver sa place au sein d'une communauté bienveillante et
                inclusive 🌈
              </p>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
                Nos actions visent à{' '}
                <span className="font-bold text-purple-600">
                  rassembler, visibiliser et dynamiser
                </span>{' '}
                la scène fétiche et Puppy parisienne à travers des initiatives conviviales et
                solidaires.
              </p>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-center font-semibold">
                  Rejoindre Les Patounes, c'est faire partie d'une véritable{' '}
                  <span className="gradient-text text-2xl">safe place</span>, fondée sur le respect,
                  la solidarité et la "pawsitivité" 🐾
                </p>
              </div>
              <div className="flex justify-center">
                <Link
                  to="/story"
                  className="mt-5 inline-flex items-center gap-3 btn-primary text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl"
                >
                  <span className="text-2xl">📖</span> Notre histoire
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Preview Section */}
      <section id="evenements" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold gradient-text mb-4">Nos Événements</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600">Découvrez toutes nos initiatives 🌈</p>
          </div>

          {/* Main Event */}
          <div className="relative bg-white rounded-3xl overflow-hidden mb-10 shadow-2xl card-hover">
            <div className="image-card h-96 relative">
              <img
                src="/qonasse-banner.jpg"
                alt="Affiche Les Patounes"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/60 to-black/20"></div>
              <div className="absolute bottom-0 left-0 right-0 p-10 text-white flex justify-center items-center flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-5xl">🍻</span>
                  <h3 className="text-3xl md:text-4xl font-bold">Apéros Hebdomadaires</h3>
                </div>
                <p className="text-xl md:text-2xl mb-4 font-light">
                  Tous les jeudis à 18h30 au FreeDj, dans le Marais à Paris
                </p>
                <p className="text-lg opacity-90 mb-4">Avec La Qonnasse KyssyBangBang</p>
                <div className="inline-block bg-white text-purple-600 px-6 py-3 rounded-full font-bold text-lg">
                  Tous les jeudis 📅
                </div>
              </div>
            </div>
          </div>

          {/* Join Section */}
          <div className="py-20 bg-gray-50 paw-pattern rounded-3xl">
            <div className="flex flex-col md:flex-row items-center gap-8 p-8">
              {/* Texte à gauche */}
              <div className="flex-1">
                <h3 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
                  Les Patounes fêtent Halloween !
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Un bonbon ou on mord !<br/>
                  <br/>
                  À l'occasion d'Halloween,<br/>
                  retrouvez nous au Freedj le vendredi 31 octobre à 18h30.<br/>
                  Tournée des bars du Marais et distribution de bonbons pour l'occasion.<br/>
                  <br/>
                  Aucune obligation mais...<br/>
                  Venez déguisé ! Des verres offerts pour les plus beaux costumes.
                  <br/>
                  <br/>
                  Soirée pleine de surprises et de convivialité, profitez de l'ambiance festive du quartier.
                  N'hésite pas à inviter tes amis :3 . 
                  <br/>
                  <br/>
                  L'ffiche de l'événement, réalisée par l'artiste LaGoulue, est disponible à l'achat pour un souvenir de cette merveilleuse soirée 😀.
                </p>
                <Link
                  to="https://www.helloasso.com/associations/association-les-patounes/boutiques/affiches?_gl=1%2a7jbbz1%2a_gcl_au%2aMTAxNjU2MzkyNy4xNzU3NDM1MjI4LjI0ODE3MTM4Mi4xNzYwMzY5MDUzLjE3NjAzNjkyNzI."
                  target="_blank"
                  className="inline-flex items-center gap-3 btn-primary text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl"
                >
                  <span className="text-2xl">🐾</span> Acheter l'affiche
                </Link>
              </div>

              {/* Image à droite */}
              <div className="flex-1 w-full md:w-auto">
                <img
                  src="/halloween.jpg"
                  alt="Adhésion Les Patounes"
                  className="w-full h-auto rounded-2xl shadow-2xl object-cover"
                />
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-10 md:p-16">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Ne manquez aucun événement !
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              📅 Retrouvez toutes nos activités sur notre agenda ou suivez-nous sur Instagram
            </p>
            <a
              href="https://instagram.com/lespatounesfr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 btn-primary text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl"
            >
              <span className="text-2xl">📱</span> @lespatounesfr
            </a>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="equipe" className="py-20 bg-gray-50 paw-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold gradient-text mb-4">L'Équipe</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600">Trois membres passionnés et engagés 💙</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
            {/* Team Member 1 - Loufy */}
            <div className="bg-white rounded-3xl p-8 text-center card-hover shadow-xl">
              <div className="relative w-40 h-40 mx-auto mb-6">
                {/* Image de profil (dessous) */}
                <img
                  src="/loufypp.jpg"
                  alt="Loufy - Président"
                  className="absolute inset-0 w-full h-full object-cover rounded-full shadow-2xl"
                />
                {/* Overlay gradient + emoji (dessus, apparaît au hover) */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/90 to-pink-500/90 rounded-full flex items-center justify-center text-7xl shadow-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                  🐺
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Loufy</h3>
              <p className="text-purple-600 font-bold text-lg mb-4">Président & Fondateur</p>
              <p className="text-gray-600 leading-relaxed">
                Véritable moteur du projet, il insuffle l'énergie et la vision qui guident Les
                Patounes depuis leur création. Il œuvre à renforcer les liens au sein de la
                communauté et à faire grandir la scène Puppy parisienne.
              </p>
            </div>

            {/* Team Member 2 - Tau */}
            <div className="bg-white rounded-3xl p-8 text-center card-hover shadow-xl">
              <div className="relative w-40 h-40 mx-auto mb-6">
                {/* Image de profil (dessous) */}
                <img
                  src="/taupp.jpg"
                  alt="Tau - Trésorier"
                  className="absolute inset-0 w-full h-full object-cover rounded-full shadow-2xl"
                />
                {/* Overlay gradient + emoji (dessus, apparaît au hover) */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/90 to-purple-500/90 rounded-full flex items-center justify-center text-7xl shadow-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                  🐕
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Tau</h3>
              <p className="text-blue-600 font-bold text-lg mb-4">Trésorier</p>
              <p className="text-gray-600 leading-relaxed">
                Veille avec rigueur et bienveillance à la gestion de l'association. Toujours à
                l'écoute, il contribue à garantir la stabilité et la continuité de nos actions
                🐶💙
              </p>
            </div>

            {/* Team Member 3 - Draikon */}
            <div className="bg-white rounded-3xl p-8 text-center card-hover shadow-xl">
              <div className="relative w-40 h-40 mx-auto mb-6">
                {/* Image de profil (dessous) */}
                <img
                  src="draiconpp.jpg"
                  alt="Draikon - Secrétaire"
                  className="absolute inset-0 w-full h-full object-cover rounded-full shadow-2xl"
                />
                {/* Overlay gradient + emoji (dessus, apparaît au hover) */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/90 to-orange-500/90 rounded-full flex items-center justify-center text-7xl shadow-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                  🦴
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Draikon</h3>
              <p className="text-pink-600 font-bold text-lg mb-4">Secrétaire</p>
              <p className="text-gray-600 leading-relaxed">
                Assure la coordination et le bon déroulement de nos projets. Son engagement et sa
                créativité sont essentiels à la dynamique et à la convivialité qui caractérisent Les
                Patounes.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-10 md:p-16 text-white text-center shadow-2xl">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Une équipe soudée 💜</h3>
            <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto">
              Ensemble, ils forment une équipe animée par des valeurs de partage, d'inclusion et de
              "pawsitivité", au service d'une communauté qui ne cesse de grandir 🌈🐾
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-10 md:p-16 text-center shadow-xl">
            <div className="text-6xl mb-6">📬</div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Restez Informés
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Recevez directement dans votre boîte mail les dernières nouvelles de Les Patounes et
              découvrez nos projets à venir
            </p>
            <form
              className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success('Merci pour votre inscription ! 🐾 Vous recevrez bientôt nos actualités.', {
                  position: 'top-center',
                });
                e.target.reset();
              }}
            >
              <input
                type="email"
                placeholder="Votre email"
                required
                className="flex-1 px-6 py-4 rounded-full border-2 border-purple-200 focus:border-purple-500 outline-none text-gray-700"
              />
              <button
                type="submit"
                className="btn-primary text-white px-10 py-4 rounded-full font-bold text-lg whitespace-nowrap"
              >
                S'inscrire 🐾
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
