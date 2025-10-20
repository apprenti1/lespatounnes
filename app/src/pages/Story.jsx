import HeroSection from '../components/HeroSection';

export default function Story() {
  const heroButtons = [
    {
      href: '#histoire',
      text: 'Découvrir notre histoire',
      className:
        'bg-white text-purple-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg',
    },
  ];

  return (
    <>
      <HeroSection
        emoji="📖"
        title="Notre Histoire"
        subtitle="L'aventure des Patounes depuis le début"
        description="Comment tout a commencé et où nous allons"
        buttons={heroButtons}
      />

      {/* Section à venir */}
      <section className="py-20 bg-gray-50 paw-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            Histoire en cours de rédaction
          </h2>
          <p className="text-xl text-gray-600">
            Revenez bientôt pour découvrir notre parcours ! 🐾
          </p>
        </div>
      </section>
    </>
  );
}
