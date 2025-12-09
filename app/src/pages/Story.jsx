import HeroSection from '../components/HeroSection';
import { Link } from 'react-router-dom';

export default function Story() {
  const heroButtons = [
    {
      href: '#origines',
      text: 'Découvrir nos origines',
      className:
        'bg-white text-purple-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg',
    },
    {
      href: '/register',
      text: 'Adhérer',
      isLink: true,
      className:
        'border-2 border-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-purple-600 transition shadow-lg',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection
        emoji="📖"
        title="Notre Histoire"
        subtitle="L'aventure des Patounes depuis le début"
        description="Découvrez qui nous sommes et ce qui nous inspire 🐾"
        buttons={heroButtons}
      />

      {/* Section 1: Les origines */}
      <section id="origines" className="navbar-padding py-20 bg-gray-50 paw-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="h-full order-2 lg:order-1">
              <div className="image-card rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/loufyntau.jpg"
                  alt="PupNic Pride 2025"
                  className="w-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-500 mt-3 text-center italic">
                Crédit photo : Audrey Barein lors du PupNic Pride 2025 à Paris
              </p>
            </div>

            {/* Texte */}
            <div className="h-full order-1 lg:order-2">
              <div className="h-full flex flex-col justify-center bg-white rounded-3xl p-8 md:p-12 shadow-xl card-hover">
                <div className="text-6xl mb-6">🐺</div>
                <h2 className="text-4xl font-bold gradient-text mb-6">
                  Les origines des Patounes
                </h2>
                <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                  <p>
                    L'idée des Patounes est née en <span className="font-bold text-purple-600">octobre 2024</span>, portée par <span className="font-bold">Loufy</span>, un pup passionné de communauté, de jeux, et de partages fétiches. Rapidement, il a été rejoint par d'autres copchiens motivé·es, désireux·ses de créer un espace collectif et joyeux pour les puppies.
                  </p>
                  <p>
                    Face au manque d'événements dédiés, à une visibilité limitée et à une envie commune de se retrouver autrement que sur les applis, l'association a vu officiellement le jour en <span className="font-bold text-purple-600">juin 2025</span>.
                  </p>
                  <p>
                    Le premier événement, le <span className="font-bold text-pink-600">PupNic des Patounes</span>, a eu lieu le <span className="font-bold">28 juin 2025</span>, et a rassemblé une joyeuse meute de <span className="font-bold text-purple-600">plus de 150 puppys</span> juste avant la Marche des Fiertés, posant les bases d'un projet inclusif, festif et bienveillant.
                  </p>
                  <p>
                    Guidée par des valeurs de <span className="font-bold text-purple-600">liberté, d'entraide, d'humour et de respect</span>, l'association entend faire vivre la scène puppy à Paris et au-delà, dans un esprit de jeu et d'ouverture 🌈
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Fondateur Loufy */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Qui est à l'origine des Patounes ?</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Texte */}
            <div className='w-full'>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-6xl">🐺</div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-800">Loufy</h3>
                    <p className="text-purple-600 font-bold text-lg">Président & Fondateur</p>
                  </div>
                </div>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    <span className="font-bold">« Bonjour à tous, je m'appelle Loufy et je suis le fier fondateur des Patounes. »</span>
                  </p>
                  <p>
                    Ceux qui me connaissent vous diront que je suis une personne naturellement sociable, toujours prête à créer des liens et à proposer de nouvelles idées. Mon aventure dans le puppy play a commencé il y a quelques années grâce à mon ami <span className="font-bold">Umi</span>, qui m'a fait découvrir tout le charme de cet univers fascinant.
                  </p>
                  <p>
                    J'ai fondé Les Patounes parce que je désirais voir la scène puppy play parisienne grandir et s'animer avec une variété d'événements captivants. À mes yeux, cette communauté mérite d'avoir plus d'opportunités pour se réunir et partager des moments inoubliables.
                  </p>
                  <p>
                    Mon objectif est de continuer à organiser des activités qui rassemblent, tout en véhiculant des valeurs essentielles telles que <span className="font-bold text-purple-600">l'inclusivité et la bienveillance</span>.
                  </p>
                  <p className="italic text-purple-600 font-semibold">
                    « Pour moi, Les Patounes, c'est avant tout une grande famille où chacun est accueilli chaleureusement. »
                  </p>
                </div>
              </div>
            </div>

            {/* Image */}
            <div>
              <div className="image-card rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/loufystory.jpg"
                  alt="Loufy - Fondateur des Patounes"
                  className="w-full h-[700px] object-cover"
                />
              </div>
              <p className="text-sm text-gray-500 mt-3 text-center italic">
                Crédit Photo : Inconnu
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Notre mission */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50 paw-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div>
              <div className="image-card rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/storyengagement.jpg"
                  alt="Événements Les Patounes"
                  className="w-full h-full object-cover"
                />
              </div>
                <p className="text-sm text-gray-500 mt-3 text-center italic">
                  Crédit photo : PixUtopix
                </p>
            </div>

            {/* Texte */}
            <div>
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl card-hover">
                <div className="text-6xl mb-6">🐾</div>
                <h2 className="text-4xl font-bold gradient-text mb-6">
                  Notre engagement envers la communauté
                </h2>
                <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                  <p>
                    Chez Les Patounes, notre mission est de <span className="font-bold text-purple-600">promouvoir et valoriser la culture fétiche LGBT+</span>, et plus particulièrement la communauté Puppy 🐶.
                  </p>
                  <p>
                    Nous souhaitons offrir un espace où chacun peut vivre pleinement son identité, s'exprimer librement et trouver sa place au sein d'une communauté bienveillante et inclusive 🌈.
                  </p>
                  <p>
                    Nos actions visent à <span className="font-bold text-pink-600">rassembler, visibiliser et dynamiser</span> la scène fétiche et Puppy parisienne à travers des initiatives conviviales et solidaires.
                  </p>
                  <p>
                    Nous mettons un accent particulier sur la collaboration avec des acteurs et artistes issus de la communauté. Toutes nos affiches sont réalisées par <span className="font-bold">LaGoulue</span>, un pup parisien au style graphique affirmé, et nos photos sont signées par <span className="font-bold">Scooby</span>, photographe professionnel et membre actif de la scène fétiche.
                  </p>
                  <p className="text-xl font-semibold text-purple-600">
                    Rejoindre Les Patounes, c'est faire partie d'une véritable safe place, fondée sur le respect, la solidarité et la "pawsitivité" 🐾
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Nos activités */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Nos activités</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600">Des événements variés tout au long de l'année 🎉</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-10 md:p-16 shadow-2xl">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                
                {/* 
                <p>
                  Chaque semaine, nous organisons nos <span className="font-bold text-purple-600">apéros hebdomadaires tous les jeudis à 18h30 au FreeDj</span>, dans le Marais à Paris, avec La Qonnasse KyssyBangBang. Ces rencontres sont l'occasion idéale de se retrouver, d'échanger et de renforcer les liens au sein de notre communauté 🐶💬
                </p>
                
                <p className="font-semibold text-gray-800 text-xl">
                  En plus de ces rendez-vous réguliers, nous proposons :
                </p>
                 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="text-4xl mb-3">🎉</div>
                    <p className="font-bold text-gray-800 mb-2">Soirées & événements sociaux</p>
                    <p className="text-gray-600">Des moments festifs pour célébrer ensemble</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="text-4xl mb-3">🌞</div>
                    <p className="font-bold text-gray-800 mb-2">Pique-niques & sorties</p>
                    <p className="text-gray-600">Des rencontres conviviales en extérieur</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="text-4xl mb-3">🎭</div>
                    <p className="font-bold text-gray-800 mb-2">Événements thématiques</p>
                    <p className="text-gray-600">Des expériences immersives sur plusieurs jours</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="text-4xl mb-3">📸</div>
                    <p className="font-bold text-gray-800 mb-2">Calendrier Puppy 2026</p>
                    <p className="text-gray-600">Un projet collectif qui met en avant nos membres</p>
                  </div>
                </div>

                <p className="pt-4">
                  Ces moments de partage jouent un rôle essentiel dans le développement de notre réseau et permettent de créer des liens forts et bienveillants entre les participants.
                </p>
                
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mt-6">
                  <p className="text-center text-gray-700">
                    📅 <span className="font-bold">Retrouvez toutes nos activités</span> sur la page <Link to="/events" className="text-purple-600 font-bold hover:underline">Événements</Link> ou suivez-nous sur Instagram <a href="https://instagram.com/lespatounesfr" className="text-purple-600 font-bold hover:underline">@lespatounesfr</a> pour ne rien manquer !
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 paw-pattern">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-10 md:p-16 text-white text-center shadow-2xl card-hover">
            <div className="text-7xl mb-6 floating">🐾</div>
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Prêt à rejoindre la meute ?</h3>
            <p className="text-xl md:text-2xl mb-8 font-light max-w-2xl mx-auto">
              Devenez membre des Patounes et faites partie d'une communauté inclusive, bienveillante et pawsitive !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="./adhesion" 
                className="inline-flex items-center gap-3 bg-white text-purple-600 px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-gray-100 transition transform hover:scale-105"
              >
                <span className="text-2xl">✨</span>
                <span>Adhérer maintenant</span>
              </a>
              <a 
                href="./events" 
                className="inline-flex items-center gap-3 border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-purple-600 transition shadow-xl"
              >
                <span className="text-2xl">📅</span>
                <span>Voir nos événements</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}