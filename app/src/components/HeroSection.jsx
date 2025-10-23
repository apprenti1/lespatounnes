import React from 'react';
import { Link } from 'react-router-dom';

export default function HeroSection({
  emoji,
  title,
  subtitle,
  description,
  buttons,
  stats,
  photoCredit,
  backgroundImage = "https://media.joomeo.com/large/68f186f9e8f11.jpg"
}) {
  return (
    <section id="accueil" className="navbar-padding relative overflow-hidden">
      {/* Hero Image Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `url(${backgroundImage}) no-repeat fixed`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute inset-0 gradient-bg opacity-80"></div>
      </div>

      {/* Content */}
      <div
        className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-6 text-white ${emoji && emoji !== 'img' ? 'navbar-padding' : ''}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: stats ? 'calc(100vh - 5rem)' : 'auto',
        }}
      >
        <div className="text-center fade-in">
          {emoji && (
            <div className="text-8xl md:text-9xl mb-6 floating flex justify-center">
              {emoji === 'img' ? (
                <img
                  src="/logo.png"
                  alt="Les Patounes"
                  style={{ width: '10rem', borderRadius: '2rem' }}
                />
              ) : (
                <span>{emoji}</span>
              )}
            </div>
          )}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">{title}</h1>
          <p className="text-xl md:text-2xl mb-4 max-w-3xl mx-auto font-light drop-shadow-lg">
            {subtitle}
          </p>
          {description && (
            <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto font-light opacity-90 drop-shadow-lg">
              {description}
            </p>
          )}
          {photoCredit && <p className="text-sm opacity-75 mb-8">{photoCredit}</p>}

          {buttons && buttons.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
              {buttons.map((button, index) => (
                button.isLink ? (
                  <Link
                    key={index}
                    to={button.href}
                    className={button.className}
                  >
                    {button.text}
                  </Link>
                ) : (
                  <a
                    key={index}
                    href={button.href}
                    className={button.className}
                  >
                    {button.text}
                  </a>
                )
              ))}
            </div>
          )}
        </div>

        {/* Stats Section */}
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="stats-box rounded-2xl p-8 text-center card-hover pulse-glow"
                style={{ opacity: 1, transform: 'translateY(0px)', transition: '0.6s' }}
              >
                <div className="text-6xl mb-3">{stat.emoji}</div>
                <div className="text-5xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-gray-600 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Wave Separator */}
      <div className="relative z-10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path
            fill="#F9FAFB"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,112C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Junction Line */}
      <div
        style={{
          height: '6px',
          backgroundColor: '#F9FAFB',
          width: '100%',
          position: 'absolute',
          bottom: '-3px',
        }}
      ></div>
    </section>
  );
}
