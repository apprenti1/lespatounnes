import HeroSection from '../components/HeroSection';

export default function MentionsLegales() {
  return (
    <>
      <HeroSection
        emoji="📄"
        title="Mentions Légales"
        subtitle="Informations légales de l'association Les Patounes"
      />

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 shadow-xl">

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold gradient-text mb-4">Nom de l'association</h2>
                <p className="text-gray-700 text-lg">Les Patounes</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold gradient-text mb-4">Forme juridique</h2>
                <p className="text-gray-700 text-lg">Association loi 1901</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold gradient-text mb-4">Siège social</h2>
                <p className="text-gray-700 text-lg">4 Rue du Bec, 93360 Neuilly-Plaisance, France</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold gradient-text mb-4">Responsable de publication</h2>
                <p className="text-gray-700 text-lg">Johan Pépin - Loufy</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold gradient-text mb-4">Contact</h2>
                <p className="text-gray-700 text-lg">
                  <a href="mailto:lespatounes75@gmail.com" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
                    lespatounes75@gmail.com
                  </a>
                  <br />
                  <a href="tel:+33649727714" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
                    06 49 72 77 14
                  </a>
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold gradient-text mb-4">Hébergeur du site</h2>
                <p className="text-gray-700 text-lg">
                  OVHcloud SAS<br />
                  2 rue Kellermann, 59100 Roubaix, France
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold gradient-text mb-4">Numéro RNA / SIREN</h2>
                <p className="text-gray-700 text-lg">W932013664 - 987 999 869 00017</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold gradient-text mb-4">Propriété intellectuelle</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  L'ensemble du contenu présent sur ce site (textes, images, logos, vidéos) est la propriété
                  exclusive de l'association Les Patounes ou de ses partenaires. Toute reproduction, totale ou
                  partielle, sans autorisation écrite préalable, est strictement interdite.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold gradient-text mb-4">Protection des données personnelles</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Les informations collectées via ce site (contact, adhésion, newsletter) sont utilisées
                  uniquement par l'association pour gérer les adhésions, envoyer des informations ou traiter
                  les demandes. Pour plus d'informations, consultez notre{' '}
                  <a href="/rgpd" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
                    Politique de confidentialité (RGPD)
                  </a>.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
