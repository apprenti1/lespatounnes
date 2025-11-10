import { useState, useRef, useEffect } from 'react';

export default function LazyImage({ srcSet, sizes, src, alt, className, onError }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!imgRef.current) return;

    // Créer l'Intersection Observer pour charger les images
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Quand l'image est visible dans le viewport, charger l'image
          if (entry.isIntersecting) {
            // Charger l'image avec srcSet
            setImageSrc(src);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        // Commence à charger 200px avant que l'image soit visible
        rootMargin: '200px',
      }
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src]);

  return (
    <img
      ref={imgRef}
      srcSet={isLoaded ? srcSet : ''}
      sizes={isLoaded ? sizes : ''}
      src={imageSrc}
      alt={alt}
      className={className}
      onLoad={() => setIsLoaded(true)}
      onError={(e) => {
        // Si l'image échoue à charger avec srcSet, essayer avec l'original
        if (onError) {
          onError(e);
        }
      }}
    />
  );
}
