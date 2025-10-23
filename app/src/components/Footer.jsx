import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="gradient-bg text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.png"
                alt="Les Patounes"
                className="h-[5rem] rounded-2xl"
              />
              <span className="text-3xl font-bold">Les Patounes</span>
            </div>
            <p className="text-white/90 text-lg leading-relaxed">
              Communauté Puppy LGBT+ à Paris. Safe place, respect, solidarité et pawsitivité 🌈
            </p>
          </div>

          <div>
            <h4 className="text-2xl font-bold mb-6">Contact</h4>
            <div className="space-y-4">
              <a
                href="mailto:lespatounes75@gmail.com"
                className="flex items-center gap-3 text-white/90 hover:text-white transition text-lg"
              >
                <span className="text-2xl">📧</span> lespatounes75@gmail.com
              </a>
              <Link
                to="/contact"
                className="flex items-center gap-3 text-white/90 hover:text-white transition text-lg"
              >
                <span className="text-2xl">💬</span> Formulaire de contact
              </Link>
              <a
                href="https://instagram.com/lespatounesfr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/90 hover:text-white transition text-lg"
              >
                <span className="text-2xl">📱</span> @lespatounesfr
              </a>
              <Link
                to="/mentions-legales"
                className="flex items-center gap-3 text-white/90 hover:text-white transition text-lg"
              >
                <span className="text-2xl">📄</span> Mentions légales
              </Link>
              <Link
                to="/rgpd"
                className="flex items-center gap-3 text-white/90 hover:text-white transition text-lg"
              >
                <span className="text-2xl">🔒</span> RGPD
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center">
          <p className="text-white/80 text-lg">© 2025 Les Patounes - Tous droits réservés 🌈🐾</p>
          <p className="text-white/60 mt-2">
            Ensemble, continuons à faire rayonner notre communauté
          </p>
        </div>
      </div>
    </footer>
  );
}
