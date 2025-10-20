import HeroSection from '../components/HeroSection';

export default function Shop() {
  const heroButtons = [
    {
      href: '#produits',
      text: 'Découvrir les produits',
      className:
        'bg-white text-purple-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg',
    },
  ];

  return (
    <>
      <HeroSection
        emoji="🛍️"
        title="Boutique"
        subtitle="Soutenez l'association avec nos produits exclusifs"
        description="Goodies, vêtements et accessoires aux couleurs des Patounes"
        buttons={heroButtons}
      />

      {/* Section à venir */}
      <section className="py-20 bg-gray-50 paw-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            Boutique en cours de préparation
          </h2>
          <p className="text-xl text-gray-600">
            Nos produits exclusifs seront bientôt disponibles à l'achat ! 🐾
          </p>
        </div>
      </section>
    </>
  );
}
