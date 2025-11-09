import HeroSection from '../components/HeroSection';
import { Link } from 'react-router-dom';

export default function Calendar() {


  return (
    <>
      <HeroSection
        emoji="📅"
        title="Le Calendrier des Pups 2026"
        subtitle="Ce n’est pas qu’un simple calendrier !"
        photoCredit="Photo : Scooby, PupNic Pride 2025"
      />



      {/* Mission Section - Calendar Description */}
      <section id="mission" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold gradient-text mb-4">Le calendrier</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-500 mx-auto mb-6"></div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden card-hover">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Image à gauche - en grand et centrée verticalement */}
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <img
                  src="/calendrier2026.jpg"
                  alt="Calendrier des Pups 2026"
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* Texte formaté à droite */}
              <div className="p-10 md:p-16 flex flex-col justify-center">
                <div className="space-y-6 text-gray-700">
                  <p className="text-base leading-relaxed">
                    Né au sein de l'association <span className="font-bold text-purple-600">Les Patounes</span>, le <span className="font-bold text-purple-600">Calendrier des Pups 2026</span> est bien plus qu'un simple objet décoratif : c'est une œuvre collective, un voyage visuel et émotionnel au cœur de la découverte de soi.
                  </p>

                  <p className="text-base leading-relaxed">
                    📸 <span className="font-semibold">Conçu et photographié par PuppyPlay Scooby</span>, ce projet réunit <span className="font-bold">29 modèles</span> autour de <span className="font-bold">12 thématiques</span> fortes, chacune illustrant un mois de l'année. Ensemble, elles racontent une histoire : celle de la naissance, de l'exploration et de l'affirmation de son identité à travers le prisme du PuppyPlay.
                  </p>

                  <div className="bg-purple-50 rounded-2xl p-6 border-l-4 border-purple-600">
                    <p className="font-semibold text-purple-900 mb-4">Le calendrier suit une progression chronologique :</p>
                    <ul className="space-y-3 text-sm">
                      <li className="flex gap-3">
                        <span className="text-xl">🐶</span>
                        <span>Les premiers mois évoquent la <span className="font-semibold">curiosité et la timidité</span>, cette phase où l'on découvre son "pup intérieur" avec pudeur et émerveillement</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-xl">🌈</span>
                        <span>Au fil des pages, les visuels gagnent en <span className="font-semibold">intensité, confiance et liberté</span>, jusqu'à une fin d'année pleinement assumée, sensuelle et fière</span>
                      </li>
                    </ul>
                  </div>

                  <p className="text-base leading-relaxed italic text-gray-600">
                    Cette direction artistique audacieuse et sensible illustre la diversité des parcours, des corps et des sensibilités. Chaque modèle apporte sa propre lumière, son histoire, et sa manière d'incarner le PuppyPlay — entre jeu, fétichisme, tendresse et expression de soi.
                  </p>

                  <div className="bg-pink-50 rounded-2xl p-6">
                    <p className="font-semibold text-pink-900 mb-3">🖼️ Un objet de qualité</p>
                    <p className="text-sm leading-relaxed text-gray-700">
                      Pensé dans l'esprit des grands classiques comme les calendriers Dieux du Stade ou Pompiers, ce calendrier est un <span className="font-bold">format mural A3</span>, imprimé sur <span className="font-bold">papier photo haut de gamme</span> avec <span className="font-bold">reliure métallique</span>. Son design élégant, mêlant esthétique fetish et mise en valeur des modèles, en fait à la fois une pièce de collection et un symbole fort de visibilité pour la communauté.
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-2xl p-6 border-l-4 border-blue-600">
                    <p className="font-semibold text-blue-900 mb-4">💬 Pourquoi ce calendrier ?</p>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>✨ Parce qu'au-delà de l'image, il parle de découverte, de confiance et d'acceptation.</li>
                      <li>✨ Parce que le PuppyPlay, c'est aussi une manière de se reconnecter à soi-même, d'exprimer son identité et ses émotions, sans jugement.</li>
                      <li>✨ Et parce que chaque pup, qu'il débute ou qu'il soit pleinement affirmé, mérite d'être vu et célébré.</li>
                    </ul>
                  </div>

                  <p className="text-base leading-relaxed font-semibold text-purple-700">
                    Le Calendrier des Pups 2026 est donc une déclaration d'amour à notre communauté, une ode à la liberté d'être soi, et un bel objet à (s')offrir pour soutenir l'association <span className="text-pink-600">Les Patounes</span> ❤️
                  </p>

                  <div className="pt-4 border-t-2 border-gray-200">
                    <p className="font-semibold text-lg text-gray-800 mb-2">📅 Disponible dès maintenant en précommande !</p>
                    <p className="text-base text-gray-600">Faites partie de l'aventure, et laissez entrer un peu de la meute dans votre quotidien !</p>
                  </div>
                </div>

                <div className="flex justify-center md:justify-start mt-8">
                  <Link
                    to="https://www.helloasso.com/associations/association-les-patounes/boutiques/affiches?_gl=1%2a7jbbz1%2a_gcl_au%2aMTAxNjU2MzkyNy4xNzU3NDM1MjI4LjI0ODE3MTM4Mi4xNzYwMzY5MDUzLjE3NjAzNjkyNzI."
                    target="_blank"
                    className="inline-flex items-center gap-3 btn-primary text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
                  >
                    <span className="text-2xl">🐾</span> Précommander
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
