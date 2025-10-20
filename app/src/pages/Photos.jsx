import HeroSection from '../components/HeroSection';

export default function Photos() {
  const heroButtons = [
    {
      href: '#galerie',
      text: 'Voir la galerie',
      className:
        'bg-white text-purple-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg',
    },
  ];

  return (
    <>
      <HeroSection
        emoji="📸"
        title="Galerie Photos"
        subtitle="Revivez nos meilleurs moments en images"
        description="Photos de nos événements, rencontres et moments pawsitifs"
        buttons={heroButtons}
      />

      {/* Section à venir */}
      <section className="py-20 bg-gray-50 paw-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            Galerie en cours de construction
          </h2>
          <p className="text-xl text-gray-600">
            Nos plus belles photos seront bientôt disponibles ici ! 🐾
          </p>
        </div>
      </section>
    </>
  );
}
