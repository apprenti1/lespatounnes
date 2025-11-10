import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import HeroSection from '../components/HeroSection';
import LazyImage from '../components/LazyImage';

export default function Photos() {
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTaggedByMe, setShowTaggedByMe] = useState(false);
  const [showNoEvent, setShowNoEvent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef(null);
  const initialLoadDone = useRef(false);

  // Refs to store current state and prevent duplicate requests
  const stateRef = useRef({
    hasMore,
    isLoadingMore,
    currentPage,
    selectedEventId,
    showNoEvent,
    searchQuery,
    showTaggedByMe,
    user,
    isLoadingPhotos: false, // Flag to prevent duplicate requests
  });
  const loadPhotosInFlightRef = useRef(false);
  const loadPhotosRef = useRef(null); // Store loadPhotos function for observer

  // Récupérer l'utilisateur connecté (une fois au montage)
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      }
    }
    initialLoadDone.current = true;
  }, []);

  // Mettre à jour la ref avec les valeurs actuelles ET les filtres
  useEffect(() => {
    stateRef.current = {
      hasMore,
      isLoadingMore,
      currentPage,
      selectedEventId,
      showNoEvent,
      searchQuery,
      showTaggedByMe,
      user,
      isLoadingPhotos: stateRef.current.isLoadingPhotos, // Preserve the flag
    };
  }, [hasMore, isLoadingMore, currentPage, selectedEventId, showNoEvent, searchQuery, showTaggedByMe, user]);

  // Charger les photos avec les filtres actuels
  const loadPhotos = useCallback(async (pageNum = 1) => {
    console.log('[loadPhotos] Called with pageNum:', pageNum);
    // Récupérer les filtres depuis la ref pour avoir les valeurs à jour
    const { selectedEventId: eventId, showNoEvent: noEvent, searchQuery: query, showTaggedByMe: taggedByMe, user: currentUser, isLoadingPhotos } = stateRef.current;

    // Prevent duplicate requests - only allow one request at a time
    if (isLoadingPhotos) {
      console.warn('[loadPhotos] Already loading, skipping duplicate request for page:', pageNum);
      return;
    }

    // Mark as loading
    stateRef.current.isLoadingPhotos = true;
    loadPhotosInFlightRef.current = true;

    if (pageNum === 1) {
      setLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const token = localStorage.getItem('accessToken');
      const params = new URLSearchParams();
      params.append('page', pageNum.toString());
      params.append('limit', '12');

      if (eventId) {
        params.append('eventId', eventId);
      }

      if (noEvent) {
        params.append('noEvent', 'true');
      }

      if (query?.trim()) {
        params.append('search', query);
      }

      if (taggedByMe && currentUser?.username) {
        params.append('taggedByUsername', currentUser.username);
      }

      console.log('[loadPhotos] Fetching page:', pageNum, 'URL:', `${import.meta.env.VITE_API_URL}/uploads/user-photos?${params.toString()}`);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/uploads/user-photos?${params.toString()}`,
        {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des photos');
      }

      const data = await response.json();
      const newPhotos = data.photos || [];

      if (pageNum === 1) {
        setFilteredPhotos(newPhotos);
        setCurrentPage(1);
        setTotalPages(data.totalPages);
        setHasMore(1 < data.totalPages);
        // Extraire les événements uniques seulement à la première page
        if (!eventId && !noEvent) {
          const uniqueEvents = {};
          newPhotos.forEach((photo) => {
            if (photo.event && !uniqueEvents[photo.event.id]) {
              uniqueEvents[photo.event.id] = photo.event;
            }
          });
          setEvents(Object.values(uniqueEvents).sort((a, b) => new Date(b.date) - new Date(a.date)));
        }
      } else {
        setFilteredPhotos((prev) => [...prev, ...newPhotos]);
        setCurrentPage(pageNum);
        setHasMore(pageNum < data.totalPages);
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Impossible de charger les photos');
    } finally {
      if (pageNum === 1) {
        setLoading(false);
      } else {
        setIsLoadingMore(false);
      }
      // Clear the in-flight flag
      stateRef.current.isLoadingPhotos = false;
      loadPhotosInFlightRef.current = false;
    }
  }, []);

  // Store loadPhotos in ref so observer can access it
  useEffect(() => {
    loadPhotosRef.current = loadPhotos;
  }, [loadPhotos]);

  // Charger les photos au montage
  useEffect(() => {
    if (!initialLoadDone.current) return;
    console.log('[Mount] Loading initial photos');
    loadPhotos(1);
  }, []); // Empty deps - loadPhotos is stable from useCallback with empty deps

  // Charger les photos quand les filtres changent
  // Reset to page 1 when filters change
  useEffect(() => {
    if (!initialLoadDone.current) return;
    console.log('[Filters Changed] Resetting to page 1 with new filters:', {
      selectedEventId,
      showNoEvent,
      searchQuery,
      showTaggedByMe,
    });
    setCurrentPage(1);
    setHasMore(true);
    loadPhotos(1);
  }, [selectedEventId, showNoEvent, searchQuery, showTaggedByMe]); // Filter deps only, not loadPhotos

  // Intersection Observer pour infinite scroll
  useEffect(() => {
    const target = observerTarget.current;
    console.log('[IntersectionObserver] Setup - target:', target);
    if (target) {
      const rect = target.getBoundingClientRect();
      console.log('[IntersectionObserver] Target rect:', {
        top: rect.top,
        bottom: rect.bottom,
        height: rect.height,
        offsetHeight: target.offsetHeight,
        offsetTop: target.offsetTop,
        parentElement: target.parentElement?.className,
      });
    }
    if (!target) {
      console.warn('[IntersectionObserver] No target found!');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        console.log('[IntersectionObserver] Callback triggered!');
        entries.forEach((entry, idx) => {
          console.log(`[IntersectionObserver] Entry ${idx}:`, {
            isIntersecting: entry.isIntersecting,
            boundingClientRect: {
              top: entry.boundingClientRect.top,
              bottom: entry.boundingClientRect.bottom,
              height: entry.boundingClientRect.height,
            },
            intersectionRatio: entry.intersectionRatio,
            rootBounds: entry.rootBounds,
          });
        });

        if (entries[0]?.isIntersecting) {
          const { hasMore: canLoadMore, isLoadingMore: isLoading, currentPage: page, isLoadingPhotos } = stateRef.current;
          console.log('[IntersectionObserver] ✅ Intersection detected - page:', page, 'canLoadMore:', canLoadMore, 'isLoading:', isLoading, 'isLoadingPhotos:', isLoadingPhotos);

          if (canLoadMore && !isLoading && !isLoadingPhotos) {
            console.log('[IntersectionObserver] 🚀 Loading page:', page + 1);
            loadPhotosRef.current?.(page + 1);
          } else {
            console.log('[IntersectionObserver] ⏭️ Skipped - canLoadMore:', canLoadMore, 'isLoading:', isLoading, 'isLoadingPhotos:', isLoadingPhotos);
          }
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: '100px' }
    );

    observer.observe(target);
    console.log('[IntersectionObserver] ✅ Observer attached to target');

    // Fallback: Manual scroll detection since IntersectionObserver might not work
    const handleScroll = () => {
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible) {
        console.log('[Scroll Fallback] 📍 Target is visible in viewport - checking if should load...');
        const { hasMore: canLoadMore, isLoadingMore: isLoading, currentPage: page, isLoadingPhotos } = stateRef.current;
        console.log('[Scroll Fallback] canLoadMore:', canLoadMore, 'isLoading:', isLoading, 'isLoadingPhotos:', isLoadingPhotos);

        if (canLoadMore && !isLoading && !isLoadingPhotos) {
          console.log('[Scroll Fallback] 🚀 Loading page:', page + 1);
          loadPhotosRef.current?.(page + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      console.log('[IntersectionObserver] Cleanup - unobserving target');
      observer.unobserve(target);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty deps - loadPhotosRef, stateRef are mutable refs, not deps

  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const closePhotoModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  const downloadPhoto = (photo) => {
    const photoUrl = `${import.meta.env.VITE_API_URL}/uploads/original/${photo.image}`;
    const link = document.createElement('a');
    link.href = photoUrl;
    link.download = `photo_${photo.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const heroButtons = [
    {
      href: '#galerie',
      text: 'Voir la galerie',
      className:
        'bg-white text-purple-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg',
    },
  ];

  return (
    <>
      <HeroSection
        emoji="📸"
        title="Galerie Photos"
        subtitle="Revivez nos meilleurs moments en images"
        description="Photos de nos événements, rencontres et moments pawsitifs"
        buttons={heroButtons}
      />

      {/* Section galerie */}
      <section id="galerie" className="py-20 bg-gray-50 paw-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête et filtres */}
          <div className="mb-12">
            {/* Ligne de recherche et filtres rapides */}
            <div className="mb-6 flex flex-col lg:flex-row gap-3 lg:items-end">
              {/* Barre de recherche */}
              <input
                type="text"
                placeholder="Rechercher par pseudo ou tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-all duration-300"
              />

              {/* Bouton "Je suis taggé" pour utilisateurs connectés */}
              {user && (
                <button
                  onClick={() => setShowTaggedByMe(!showTaggedByMe)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 whitespace-nowrap ${
                    showTaggedByMe
                      ? 'bg-pink-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-pink-500'
                  }`}
                >
                  👤 Je suis taggé
                </button>
              )}
            </div>

            {/* Filtre par événement et "Sans événement" */}
            {events.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-3">PAR ÉVÉNEMENT</p>
                <div className="flex flex-wrap gap-3">
                  {/* Bouton "Toutes les photos" */}
                  <button
                    onClick={() => {
                      setSelectedEventId('');
                      setShowNoEvent(false);
                    }}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                      selectedEventId === '' && !showNoEvent
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-600'
                    }`}
                  >
                    Toutes les photos
                  </button>

                  {/* Bouton "Sans événement" */}
                  <button
                    onClick={() => {
                      setShowNoEvent(!showNoEvent);
                      setSelectedEventId('');
                    }}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                      showNoEvent
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-500'
                    }`}
                  >
                    Sans événement
                  </button>

                  {events.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => {
                        setSelectedEventId(event.id);
                        setShowNoEvent(false);
                      }}
                      className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                        selectedEventId === event.id && !showNoEvent
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-600'
                      }`}
                    >
                      {event.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Galerie */}
          {loading ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">⏳</div>
              <p className="text-gray-600 text-lg">Chargement des photos...</p>
            </div>
          ) : filteredPhotos.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-600 text-lg">Aucune photo correspondant à votre recherche</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group cursor-pointer"
                    onClick={() => openPhotoModal(photo)}
                  >
                    <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 h-64">
                      {/* Image avec lazy loading */}
                      <LazyImage
                        srcSet={`
                          ${import.meta.env.VITE_API_URL}/uploads/thumbnail/${photo.image} 150w,
                          ${import.meta.env.VITE_API_URL}/uploads/small/${photo.image} 400w,
                          ${import.meta.env.VITE_API_URL}/uploads/medium/${photo.image} 800w,
                          ${import.meta.env.VITE_API_URL}/uploads/large/${photo.image} 1200w
                        `}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        src={`${import.meta.env.VITE_API_URL}/uploads/medium/${photo.image}`}
                        alt="Photo galerie"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = `${import.meta.env.VITE_API_URL}/uploads/original/${photo.image}`;
                        }}
                      />

                      {/* Overlay au survol */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                          <p className="text-lg font-semibold">Voir en grand</p>
                        </div>
                      </div>
                    </div>

                    {/* Infos photo */}
                    <div className="mt-3 space-y-2">
                      {/* Événement */}
                      {photo.event && (
                        <p className="text-xs text-purple-600 font-semibold">
                          📅 {photo.event.title}
                        </p>
                      )}

                      {/* Tags */}
                      {photo.tags && photo.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {photo.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {photo.tags.length > 3 && (
                            <span className="inline-block text-gray-500 text-xs italic">
                              +{photo.tags.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">Aucun tag</p>
                      )}

                      {/* Photographe */}
                      {photo.user?.username && (
                        <p className="text-xs text-gray-600">
                          📷 {photo.user.username}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Infinite scroll loader */}
              {isLoadingMore && filteredPhotos.length > 0 && (
                <div className="col-span-full text-center py-8">
                  <div className="inline-block">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                  <p className="text-gray-500 mt-2">Chargement plus de photos...</p>
                </div>
              )}

              {/* Observer target pour infinite scroll - toujours présent si on a des photos */}
              {filteredPhotos.length > 0 && (
                <div
                  ref={observerTarget}
                  className={hasMore ? "h-32 bg-blue-100 my-8 flex items-center justify-center" : "h-0 hidden"}
                  data-test="observer-target"
                  style={{ visibility: hasMore ? 'visible' : 'hidden' }}
                >
                  {hasMore && <p className="text-sm text-blue-600 font-semibold">📍 Scroll detection zone</p>}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Modale de visualisation agrandie */}
      {isModalOpen && selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* En-tête */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 text-white flex justify-between items-center sticky top-0">
              <h2 className="text-xl font-bold">Photo en grand</h2>
              <button
                onClick={closePhotoModal}
                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenu */}
            <div className="p-6 space-y-6">
              {/* Image */}
              <div className="space-y-4">
                <div className="overflow-hidden rounded-lg">
                  <LazyImage
                    srcSet={`
                      ${import.meta.env.VITE_API_URL}/uploads/small/${selectedPhoto.image} 400w,
                      ${import.meta.env.VITE_API_URL}/uploads/medium/${selectedPhoto.image} 800w,
                      ${import.meta.env.VITE_API_URL}/uploads/large/${selectedPhoto.image} 1200w
                    `}
                    sizes="(max-width: 768px) 100vw, 800px"
                    src={`${import.meta.env.VITE_API_URL}/uploads/large/${selectedPhoto.image}`}
                    alt="Photo agrandie"
                    className="w-full h-auto"
                    onError={(e) => {
                      e.target.src = `${import.meta.env.VITE_API_URL}/uploads/original/${selectedPhoto.image}`;
                    }}
                  />
                </div>

                {/* Bouton de téléchargement */}
                <button
                  onClick={() => downloadPhoto(selectedPhoto)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Télécharger l'originale
                </button>
              </div>

              {/* Informations */}
              <div className="space-y-4 border-t pt-6">
                {/* Événement */}
                {selectedPhoto.event && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">📅 Événement</h3>
                    <p className="text-gray-700">{selectedPhoto.event.title}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedPhoto.event.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                )}

                {/* Photographe */}
                {selectedPhoto.user?.username && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">📷 Photographe</h3>
                    <p className="text-gray-700">{selectedPhoto.user.username}</p>
                  </div>
                )}

                {/* Tags */}
                {selectedPhoto.tags && selectedPhoto.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">🏷️ Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPhoto.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Date */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">📌 Uploadée le</h3>
                  <p className="text-gray-700">
                    {new Date(selectedPhoto.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {/* Bouton fermer */}
              <button
                onClick={closePhotoModal}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
