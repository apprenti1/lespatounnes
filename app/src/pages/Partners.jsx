import HeroSection from '../components/HeroSection';
import { Link } from 'react-router-dom';

export default function Partners() {
  const heroButtons = [
    {
      href: '/devenir-partenaire',
      text: 'Devenir partenaire 🤝',
      className:
        'bg-white text-purple-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg',
      isLink: true,
    },
    {
      href: '/suggerer-partenaire',
      text: 'Suggérer une enseigne 🐾',
      className:
        'bg-white text-purple-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg',
      isLink: true,
    },
  ];

  const partners = [
    {
      name: 'K9Fetish - Produits Personnalisés',
      description: 'Produits sur mesure haut de gamme :<br/>' +
                   'tasses, t-shirts, médailles, porte-clés.<br/>' +
                   'Affichez votre personnalité avec K9Fetish.<br/>' +
                   '<br/>' +
                   'Devenez adhérent et bénéficiez de<br/>' +
                   '<strong>10% de réduction</strong> sur votre panier.<br/>',
      imageUrl: '/k9.jpg',
      websiteUrl: 'https://www.k9fetish.fr',

    },
    {
      name: 'LC.RIYA - Créatrice sur mesure',
      description: 'Notre partenaire LC.RIYA est une créatrice d’accessoires fétiche sur mesure,<br/>' +
                   'spécialisée dans le Puppy Play. Colliers, harnais personnalisés… tout est fait avec amour et qualité !<br/>' +
                   '<br/>' +
                   'Devenez adhérent et bénéficiez de<br/>' +
                   '<strong>10% de réduction</strong> sur votre panier<br/>' +
                   'sur la collection spéciale "Puppy Secret".<br/>' +
                   '(Entrez le code "Puppylove" pour accéder à la collection.)<br/>',
      imageUrl: '/riya.jpg',
      websiteUrl: 'https://lescreaderiya.fr/collections/puppysecret-🐶',
    },
    {
      name: 'Boxxman - SexShop & Cruising Parisien',
      description: 'Au cœur de Châtelet, vient découvrir la grande collection de notre partenaire !<br/>' +
                   'Sextoys, vêtements, accessoires puppyplay, vous y trouverez forcément votre bonheur.<br/>' +
                   '<br/>' +
                   'Adresse : 2 Rue de la Cossonnerie, 75001 Paris<br/>' +
                   'Horaires : Tous les jours de 10h30 à 23h00<br/>' +
                   'Métro : Châtelet / Hôtel de Ville<br/>' +
                   '<br/>' +
                   'Devenez adhérent et bénéficiez de <strong>10% de réduction</strong><br/>' +
                   'en magasin et peut-être même d\'un accès au sous-sol pour les plus téméraires !<br/>' +
                   '<small><em>(sur présentation de votre carte de membre en caisse)</em></small><br/>',
      imageUrl: 'Boxxman.jpg',
      websiteUrl: 'https://www.boxxman.fr',
    },
    {
      name: 'PuppyPlay Scooby - Photographe',
      description: '<em>\"En tant que photographe, je suis constamment émerveillé<br/>' +
                   'par les codes uniques du Fetish & Bdsm,<br/>' +
                   'et mon objectif principal est d\'honorer cet art<br/>' +
                   'en respectant et en mettant en valeur ces codes dans mon travail. <br/>' +
                   'Je suis toujours touché par la confiance que mes clients m\'accordent <br/>' +
                   'et je suis reconnaissant pour chaque opportunité <br/>' +
                   'de capturer leur individualité à travers mon objectif. \"</em><br/>' +
                   'Puppy Scooby<br/>' +
                   '<br/>' +
                   'Devenez adhérent et bénéficiez de <strong>10% de réduction</strong> sur votre shooting.<br/>' +
                   '<small><em>(sur présentation de votre carte de membre au photographe)</em></small><br/>',
      imageUrl: 'scooby.jpg',
      websiteUrl: 'https://www.gregstudiophoto.fr/fetish',
    },
    {
      name: 'WOLF STUDIO - TAILS & PAWS',
      description: 'Bienvenue chez Wolf Studio, où l\'art de la personnalisation<br/>' +
                   'prend vie et où l\'extraordinaire devient réalité.<br/>' +
                   '<br/>' +
                   'Nous sommes des passionnés de fourrure et proposons des modèles de Tails et de Paws à personnaliser, avec des accessoires pour prendre soin de vos créations<br/>' +
                   'et briller lors des conventions.<br/>' +
                   '<br/>' +
                   'Que vous cherchiez à ajouter un peu de fantaisie à votre personnage ou à compléter votre cosplay, Wolf Studio est là pour vous aider à exprimer votre créativité.<br/>' +
                   '<br/>' +
                   'Alors, êtes-vous prêt à mettre votre fourrure de loup<br/>' +
                   'et vous transformer en votre animal favori !<br/>' +
                   '<br/>' +
                   'Devenez adhérent et bénéficiez de <strong>10% de réduction</strong><br/>' +
                   'sur votre panier.',
      imageUrl: 'wolf.jpg',
      websiteUrl: 'https://wolf-studio.fr',
    },
    {
      name: 'BMC STORE - Sexshop Parisien',
      description: 'Depuis 1988, BMC Store accueille une clientèle queer, gay<br/>' +
                   'et curieuse dans un esprit fun, sexy et décomplexé.<br/>' +
                   'Situé en plein cœur du Marais, ce sex-shop convivial<br/>' +
                   'propose un large choix de sextoys, accessoires SM, jockstraps, lubrifiants, poppers, DVDs… et même des cabines vidéos !<br/>' +
                   '<br/>' +
                   'Adresse : 21 rue des Lombards, 75004 Paris<br/>' +
                   'Horaires : Tous les jours de 10h à 1h du matin<br/>' +
                   'Métro : Châtelet / Hôtel de Ville<br/>' +
                   '<br/>' +
                   'Devenez adhérent et bénéficiez de <strong>10% de réduction</strong><br/>' +
                   'en magasin<br/>' +
                   '<small>(sur présentation de votre carte de membre en caisse)</small>.',
      imageUrl: 'bmc.jpg',
      websiteUrl: 'https://www.bmc-store.com',
    },
    {
      name: 'Le Bouqet des Archives - Bistro Parisien',
      description: 'Situé en plein cœur du Marais à Paris,<br>' +
                   'Le Bouquet des Archives est un restaurant à l\'ambiance conviviale, où il fait bon se retrouver autour d\'une cuisine généreuse et authentique. Que ce soit pour un déjeuner entre amis ou un dîner après nos événements, c\'est une adresse idéale pour prolonger les bons moments.<br>' +
                   '<br>' +
                   'Adresse : 31 Rue des Archives, 75003 Paris<br>' +
                   'Horaire : Du Lundi au Dimanche<br>' +
                   '<br>' +
                   'Devenez adhérent et bénéficiez d\'une <strong>boisson offerte</strong><br/>' +
                   '<small><em>(bière 25cl, verre de vin ou soft)</small></em><br>' +
                   'pour toute commande d\'un plat.<br>' +
                   '<small><em>(sur présentation de votre carte de membre en caisse)</em></small>.<br>',
      imageUrl: 'bouquet.jpg',
      websiteUrl: 'https://share.google/4ZJUIUn1bCq1B17BG',
    },
    {
      name: 'Furrjoi - Accessoires en Silicone',
      description: 'Furrjoi est un leader reconnu dans la fabrication d\'équipements fétichistes destinés à la communauté gay et aux passionné·e·s de puppy play.<br/>' +
                   '<br/>' +
                   'Depuis plus de 10 ans, leur usine allie savoir-faire, innovation et passion pour créer des produits de haute qualité : cagoules, combinaisons en silicone, accessoires de pattes de chien… autant d’articles plébiscités par leurs clients à travers le monde.<br/>' +
                   '<br/>' +
                   'Devenez adhérent et bénéficiez de<br/>' +
                   '<strong>10% de réduction</strong> sur votre panier.',
      imageUrl: 'furrjoi.jpg',
      websiteUrl: 'https://furrjoi.com/home',
    },
    {
      name: 'PlayFetish - Rencontres Kinkys',
      description: 'PlayFetish, le site gratuit dédié Fetish & Kink !<br/>' +
                   'Chat, petites annonces,<br/>' +
                   'découvres les membres fétichistes proches de toi.<br/>' +
                   'Aucune censure, sans pub, ni collecte de données<br/>' +
                   'et 100% Made in France !<br/>' +
                   '<br/>' +
                   'Devenez adhérant et bénéficiez d\'un <strong>accès premium</strong> !<br/>',
      imageUrl: 'Playfetish.png',
      websiteUrl: 'https://PlayFetish.com/@lespatounesfr',
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

      {/* Events Preview Section */}
      <section id="evenements" className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


          {/* Join Section */}
          <div className="py-20 bg-gray-50 paw-pattern rounded-3xl">

            {
              partners.map((partner, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col md:flex-row items-center gap-8 p-8 ${ index%2 == 1 ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Texte à gauche */}
                  <div className="flex-1">
                    <h3 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
                      {partner.name}
                    </h3>
                    <p 
                      className="text-lg text-gray-700 leading-relaxed mb-6"
                      dangerouslySetInnerHTML={{ __html: partner.description }}
                    />
                    <Link
                      to={partner.websiteUrl}
                      target="_blank"
                      className="inline-flex items-center gap-3 btn-primary text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl"
                    >
                      <span className="text-2xl">🐾</span> Visiter le site
                    </Link>
                  </div>
                  {/* Image à droite */}
                  <div className="flex-1 w-full md:w-auto">
                    <img
                      src={partner.imageUrl}
                      alt={`Partenaire ${partner.name}`}
                      className="w-full h-auto rounded-2xl shadow-2xl object-cover"
                    />
                  </div>
                </div>
              ))
            }

          </div>

        </div>
      </section>

{/* 
      {Section à venir}
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
 */}

    </>
  );
}
