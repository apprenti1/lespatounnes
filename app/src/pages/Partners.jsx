import HeroSection from '../components/HeroSection';

export default function Partners() {
  const heroButtons = [
    {
      href: '#contact',
      text: 'Devenir partenaire',
      className:
        'bg-white text-purple-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg',
    },
  ];

  return (
    <>
      <HeroSection
        emoji="🤝"
        title="Nos Partenaires"
        subtitle="Des partenariats solides pour soutenir notre communauté"
        description="Découvrez nos partenaires qui nous accompagnent dans nos projets"
        buttons={heroButtons}
      />

      {/* Section à venir */}
      <section className="py-20 bg-gray-50 paw-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            Contenu en cours de développement
          </h2>
          <p className="text-xl text-gray-600">
            Cette page sera bientôt disponible avec la liste de nos partenaires ! 🐾
          </p>
        </div>
      </section>
    </>
  );
}
