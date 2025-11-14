import { useEffect, useState } from 'react';
import '../styles/scrollToTop.css';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
      setIsVisible(scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      id="scrolltoTop"
      className={`scroll-to-top ${isVisible ? 'visible' : 'hidden'}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <div className="arrow">
        <span></span>
        <span></span>
      </div>
    </button>
  );
}
