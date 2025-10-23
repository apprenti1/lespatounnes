import HeroSection from '../components/HeroSection';

export default function RGPD() {
  return (
    <>
      <HeroSection
        emoji="🔒"
        title="Politique de confidentialité RGPD"
        subtitle="Protection des données personnelles"
        description="Association Les Patounes - Dernière mise à jour : 20/10/2025"
      />

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 shadow-xl">

            <div className="space-y-10">

              {/* Section 1 */}
              <div>
                <h2 className="text-3xl font-bold gradient-text mb-4 flex items-center gap-3">
                  <span className="text-4xl">1️⃣</span> Éditeur et responsable du traitement
                </h2>
                <div className="pl-12 space-y-2 text-gray-700 text-lg">
                  <p><strong>Association :</strong> Les Patounes</p>
                  <p><strong>Siège social :</strong> 4 rue du Bac, 93360 Neuilly-Plaisance</p>
                  <p>
                    <strong>Contact DPO / RGPD :</strong>{' '}
                    <a href="mailto:lespatounes75@gmail.com" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
                      lespatounes75@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="text-3xl font-bold gradient-text mb-4 flex items-center gap-3">
                  <span className="text-4xl">2️⃣</span> Données personnelles collectées
                </h2>
                <div className="pl-12 space-y-2 text-gray-700 text-lg">
                  <p>Nous collectons uniquement les données nécessaires à nos activités :</p>
                  <ul className="list-disc list-inside space-y-1 mt-3">
                    <li><strong>Identité :</strong> nom, prénom</li>
                    <li><strong>Coordonnées :</strong> e‑mail, numéro de téléphone (facultatif)</li>
                    <li><strong>Contenu visuel :</strong> photos / vidéos lors d'événements, avec consentement</li>
                    <li><strong>Données liées aux adhésions, dons, inscriptions événements et achats sur la boutique :</strong> via HelloAsso, puis centralisées dans le back office interne</li>
                    <li><strong>Données d'accès à l'espace membre :</strong> identifiants, n° d'adhérent</li>
                  </ul>
                </div>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className="text-3xl font-bold gradient-text mb-4 flex items-center gap-3">
                  <span className="text-4xl">3️⃣</span> Catégories de personnes concernées
                </h2>
                <div className="pl-12 space-y-2 text-gray-700 text-lg">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Membres et bénévoles</li>
                    <li>Participants à des événements (adultes)</li>
                    <li>Donateurs, partenaires, prospects</li>
                  </ul>
                  <p className="mt-3 text-sm italic text-gray-600">
                    (Pour les mineurs, une autorisation parentale est obligatoire avant toute collecte de photos/vidéos)
                  </p>
                </div>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className="text-3xl font-bold gradient-text mb-4 flex items-center gap-3">
                  <span className="text-4xl">4️⃣</span> Finalités du traitement
                </h2>
                <div className="pl-12 space-y-2 text-gray-700 text-lg">
                  <p>Les données sont utilisées pour :</p>
                  <ul className="list-disc list-inside space-y-1 mt-3">
                    <li><strong>Gestion administrative :</strong> adhésions, dons, inscriptions à des événements, achats sur la boutique, gestion de l'espace membre via le back office</li>
                    <li><strong>Communication :</strong> newsletters, mails d'information, publications sur le site et Instagram</li>
                    <li><strong>Organisation d'événements :</strong> prise de photos/vidéos, communication visuelle</li>
                    <li><strong>Obligations légales :</strong> comptabilité, sécurité, obligations RGPD</li>
                  </ul>
                </div>
              </div>

              {/* Section 5 */}
              <div>
                <h2 className="text-3xl font-bold gradient-text mb-4 flex items-center gap-3">
                  <span className="text-4xl">5️⃣</span> Bases légales
                </h2>
                <div className="pl-12 space-y-2 text-gray-700 text-lg">
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Consentement explicite :</strong> inscriptions, formulaires, photos/vidéos, newsletter</li>
                    <li><strong>Exécution d'un contrat :</strong> gestion de l'adhésion ou des achats</li>
                    <li><strong>Intérêt légitime :</strong> gestion de la communauté associative et communication interne</li>
                  </ul>
                </div>
              </div>

              {/* Section 6 */}
              <div>
                <h2 className="text-3xl font-bold gradient-text mb-4 flex items-center gap-3">
                  <span className="text-4xl">6️⃣</span> Moyens de collecte et traitement
                </h2>
                <div className="pl-12 space-y-2 text-gray-700 text-lg">
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Plateforme HelloAsso :</strong> dons, adhésions, inscriptions événements, achats sur la boutique</li>
                    <li><strong>Collecte directe via le site internet et back office interne :</strong> gestion complète des adhérents et centralisation des données</li>
                    <li><strong>Réseaux sociaux :</strong> Instagram pour diffusion visuelle avec consentement</li>
                    <li><strong>Sécurité :</strong> accès restreint aux responsables, mots de passe forts, sauvegardes régulières</li>
                  </ul>
                </div>
              </div>

              {/* Section 7 */}
              <div>
                <h2 className="text-3xl font-bold gradient-text mb-4 flex items-center gap-3">
                  <span className="text-4xl">7️⃣</span> Durée de conservation
                </h2>
                <div className="pl-12 space-y-2 text-gray-700 text-lg">
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Adhésions / inscriptions / dons / achats :</strong> 3 ans après dernier contact</li>
                    <li><strong>Newsletter / mails de contact :</strong> jusqu'à désinscription ou 3 ans</li>
                    <li><strong>Photos / vidéos :</strong> 20 ans maximum, sauf demande de retrait anticipé</li>
                    <li><strong>Données d'accès à l'espace membre :</strong> 3 ans après fin de l'adhésion</li>
                  </ul>
                </div>
              </div>

              {/* Section 8 */}
              <div>
                <h2 className="text-3xl font-bold gradient-text mb-4 flex items-center gap-3">
                  <span className="text-4xl">8️⃣</span> Droits des personnes
                </h2>
                <div className="pl-12 space-y-2 text-gray-700 text-lg">
                  <p>Conformément au RGPD, toute personne peut :</p>
                  <ul className="list-disc list-inside space-y-1 mt-3">
                    <li>Accéder à ses données</li>
                    <li>Demander la rectification ou mise à jour</li>
                    <li>Demander l'effacement</li>
                    <li>S'opposer ou demander la limitation du traitement</li>
                    <li>Demander la portabilité des données</li>
                  </ul>
                  <p className="mt-4">
                    <strong>Pour exercer ces droits :</strong>{' '}
                    <a href="mailto:lespatounes75@gmail.com" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
                      lespatounes75@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              {/* Section 9 */}
              <div>
                <h2 className="text-3xl font-bold gradient-text mb-4 flex items-center gap-3">
                  <span className="text-4xl">9️⃣</span> Sécurité des données
                </h2>
                <div className="pl-12 space-y-2 text-gray-700 text-lg">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Accès limité aux responsables autorisés</li>
                    <li>Mots de passe forts et sécurisation HTTPS pour l'espace membre</li>
                    <li>Sauvegardes régulières sur serveurs sécurisés</li>
                    <li>Mise à jour régulière du site et du back office</li>
                  </ul>
                </div>
              </div>

              {/* Section 10 */}
              <div>
                <h2 className="text-3xl font-bold gradient-text mb-4 flex items-center gap-3">
                  <span className="text-4xl">🔟</span> Transferts et partage des données
                </h2>
                <div className="pl-12 space-y-2 text-gray-700 text-lg">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Aucun transfert hors UE</li>
                    <li>Partage limité à des tiers uniquement avec consentement explicite, par exemple :
                      <ul className="list-circle list-inside ml-6 mt-2 space-y-1">
                        <li><strong>HelloAsso :</strong> plateforme de paiement et gestion des dons / adhésions / inscriptions / boutique</li>
                        <li><strong>Partenaires :</strong> pour communication ou organisation d'événements</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 11 */}
              <div>
                <h2 className="text-3xl font-bold gradient-text mb-4 flex items-center gap-3">
                  <span className="text-4xl">1️⃣1️⃣</span> Droit de réclamation
                </h2>
                <div className="pl-12 space-y-2 text-gray-700 text-lg">
                  <p>
                    Vous pouvez déposer une réclamation auprès de la CNIL :{' '}
                    <a
                      href="https://www.cnil.fr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700 font-semibold hover:underline"
                    >
                      www.cnil.fr
                    </a>
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    </>
  );
}
