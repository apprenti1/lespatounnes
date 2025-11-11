import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import TagEditor from '../components/TagEditor';

export default function Photographer() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTags, setEditTags] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Folder photo display state - limit photos per folder
  const [folderDisplayLimits, setFolderDisplayLimits] = useState({});
  const PHOTOS_PER_FOLDER = 12;

  // Selection mode state
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState(new Set());
  const [isDeletingMultiple, setIsDeletingMultiple] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef(null);
  const initialLoadDone = useRef(false);

  // Refs for managing state without re-creating functions
  const stateRef = useRef({
    hasMore: true,
    isLoadingMore: false,
    currentPage: 1,
    isLoadingPhotos: false,
  });
  const loadPhotosRef = useRef(null);

  // Vérifier l'authentification et le rôle
  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');

    if (!token || !userData) {
      toast.error('Vous devez être connecté pour accéder à cette page');
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'PHOTOGRAPHER' && parsedUser.role !== 'ADMIN' && parsedUser.role !== 'DEV') {
        toast.error('Accès réservé aux photographes, admins et développeurs');
        navigate('/');
        return;
      }
      setUser(parsedUser);
      fetchEvents(token);
      initialLoadDone.current = true;
    } catch (error) {
      toast.error('Erreur lors de la vérification de l\'authentification');
      navigate('/login');
    }
  }, [navigate]);

  const fetchEvents = async (token) => {
    setLoadingEvents(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/events`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(Array.isArray(data) ? data : data.data || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
    } finally {
      setLoadingEvents(false);
    }
  };

  // Update stateRef when pagination state changes
  useEffect(() => {
    stateRef.current = {
      hasMore,
      isLoadingMore,
      currentPage,
      isLoadingPhotos: stateRef.current.isLoadingPhotos,
    };
  }, [hasMore, isLoadingMore, currentPage]);

  const fetchUserPhotos = useCallback(async (token, pageNum = 1) => {
    const { isLoadingPhotos } = stateRef.current;

    // Prevent duplicate requests
    if (isLoadingPhotos) {
      return;
    }

    const isFirstPage = pageNum === 1;
    stateRef.current.isLoadingPhotos = true;

    if (isFirstPage) {
      setLoadingPhotos(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/uploads/user-photos?page=${pageNum}&limit=12`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des photos');
      }

      const data = await response.json();
      const photoUuids = data.photos.map((photo) => ({
        uuid: photo.image,
        id: photo.id,
        createdAt: photo.createdAt,
        event: photo.event,
        tags: photo.tags,
        username: photo.user.username,
      }));

      if (isFirstPage) {
        setUploadedImages(photoUuids);
      } else {
        setUploadedImages((prev) => [...prev, ...photoUuids]);
      }

      setCurrentPage(pageNum);
      setTotalPages(data.totalPages);
      setHasMore(pageNum < data.totalPages);
    } catch (error) {
      toast.error('Impossible de charger les photos');
    } finally {
      stateRef.current.isLoadingPhotos = false;
      if (isFirstPage) {
        setLoadingPhotos(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  }, []);

  // Store fetchUserPhotos in ref for observer to access
  useEffect(() => {
    loadPhotosRef.current = fetchUserPhotos;
  }, [fetchUserPhotos]);

  // Load photos on mount
  useEffect(() => {
    if (!initialLoadDone.current) return;
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchUserPhotos(token, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Intersection Observer for infinite scroll with scroll fallback
  useLayoutEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          const { hasMore: canLoadMore, isLoadingMore: isLoading, currentPage: page, isLoadingPhotos } = stateRef.current;
          if (canLoadMore && !isLoading && !isLoadingPhotos) {
            const token = localStorage.getItem('accessToken');
            if (token) {
              loadPhotosRef.current?.(token, page + 1);
            }
          }
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    observer.observe(target);

    // Fallback scroll listener for better reliability
    const handleScroll = () => {
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible) {
        const { hasMore: canLoadMore, isLoadingMore: isLoading, currentPage: page, isLoadingPhotos } = stateRef.current;
        if (canLoadMore && !isLoading && !isLoadingPhotos) {
          const token = localStorage.getItem('accessToken');
          if (token) {
            loadPhotosRef.current?.(token, page + 1);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.unobserve(target);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [uploadedImages.length]);

  const toggleFolder = (folderId) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
    // Initialize display limit for this folder when opening
    if (!folderDisplayLimits[folderId]) {
      setFolderDisplayLimits((prev) => ({
        ...prev,
        [folderId]: PHOTOS_PER_FOLDER,
      }));
    }
  };

  const loadMorePhotosInFolder = (folderId) => {
    setFolderDisplayLimits((prev) => ({
      ...prev,
      [folderId]: (prev[folderId] || PHOTOS_PER_FOLDER) + PHOTOS_PER_FOLDER,
    }));
  };

  const togglePhotoSelection = (photoId) => {
    setSelectedPhotoIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });
  };

  const selectAllPhotos = () => {
    setSelectedPhotoIds(new Set(uploadedImages.map((photo) => photo.id)));
  };

  const deselectAllPhotos = () => {
    setSelectedPhotoIds(new Set());
  };

  const handleDeleteMultiplePhotos = async () => {
    if (selectedPhotoIds.size === 0) return;

    const confirmDelete = window.confirm(
      `Êtes-vous sûr de vouloir supprimer ${selectedPhotoIds.size} photo(s)? Cette action est irréversible.`
    );

    if (!confirmDelete) return;

    setIsDeletingMultiple(true);
    const token = localStorage.getItem('accessToken');
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const photoId of selectedPhotoIds) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/uploads/photos/${photoId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`✅ ${successCount} photo(s) supprimée(s) avec succès!`, { position: 'top-center' });
      }
      if (errorCount > 0) {
        toast.error(`❌ ${errorCount} photo(s) n'ont pas pu être supprimées`, { position: 'top-center' });
      }

      // Refresh photos list
      deselectAllPhotos();
      setIsSelectionMode(false);
      if (token) {
        await fetchUserPhotos(token, 1);
      }
    } finally {
      setIsDeletingMultiple(false);
    }
  };

  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo);
    setEditTags(photo.tags.join(', '));
    setIsModalOpen(true);
  };

  const closePhotoModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
    setEditTags('');
  };

  const handleDeletePhoto = async () => {
    if (!selectedPhoto) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/uploads/photos/${selectedPhoto.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la suppression');
      }

      toast.success('✅ Photo supprimée avec succès!', { position: 'top-center' });
      closePhotoModal();

      // Rafraîchir la liste
      const photoToken = localStorage.getItem('accessToken');
      if (photoToken) {
        await fetchUserPhotos(photoToken, 1);
      }
    } catch (error) {
      toast.error(`❌ ${error.message}`, { position: 'top-center' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateTags = async () => {
    if (!selectedPhoto) return;

    try {
      const token = localStorage.getItem('accessToken');
      const tags = editTags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/uploads/photos/${selectedPhoto.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tags }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la mise à jour');
      }

      toast.success('✅ Tags mis à jour avec succès!', { position: 'top-center' });
      closePhotoModal();

      // Rafraîchir la liste
      const photoToken = localStorage.getItem('accessToken');
      if (photoToken) {
        await fetchUserPhotos(photoToken, 1);
      }
    } catch (error) {
      toast.error(`❌ ${error.message}`, { position: 'top-center' });
    }
  };

  const groupPhotosByEvent = (photos) => {
    const grouped = {};

    photos.forEach((photo) => {
      const folderId = photo.event ? `event-${photo.event.id}` : 'no-event';
      const folderKey = photo.event ? photo.event.title : 'Autres photos';

      if (!grouped[folderId]) {
        grouped[folderId] = {
          id: folderId,
          title: folderKey,
          event: photo.event || null,
          photos: [],
        };
      }
      grouped[folderId].photos.push(photo);
    });

    return Object.values(grouped);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.warning('Sélectionnez au moins une image');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });

      // Ajouter eventId si sélectionné
      if (selectedEventId) {
        formData.append('eventId', selectedEventId);
      }

      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/uploads/photographer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'upload');
      }

      // Rafraîchir la liste des photos depuis la base de données
      if (token) {
        await fetchUserPhotos(token, 1);
      }

      setFiles([]);
      toast.success(`✅ ${data.count} image(s) uploadée(s) avec succès!`, {
        position: 'top-center',
      });
    } catch (error) {
      toast.error(`❌ ${error.message}`, { position: 'top-center' });
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <section className="navbar-padding pb-20 min-h-screen gradient-bg relative overflow-hidden">
      <div className="absolute inset-0 paw-pattern opacity-10"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-12 text-white fade-in">
          <div className="text-8xl mb-6 floating">📸</div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Panel Photographe
          </h1>
          <p className="text-xl md:text-2xl font-light drop-shadow-lg">
            Uploadez vos plus belles photos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Zone d'upload */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 shadow-2xl pulse-glow">
              <h2 className="text-2xl font-bold gradient-text mb-6">Uploader des photos</h2>

              {/* Sélection d'événement */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-3">
                  Événement (optionnel)
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  disabled={loadingEvents}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white disabled:opacity-50"
                >
                  <option value="">-- Aucun événement --</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title} ({new Date(event.date).toLocaleDateString('fr-FR')})
                    </option>
                  ))}
                </select>
                {loadingEvents && (
                  <p className="text-gray-500 text-sm mt-2">Chargement des événements...</p>
                )}
              </div>

              {/* Zone de drop */}
              <div className="border-3 border-dashed border-purple-300 rounded-2xl p-8 text-center bg-purple-50 mb-6 cursor-pointer hover:border-purple-500 hover:bg-purple-100 transition-all duration-300">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="fileInput"
                />
                <label htmlFor="fileInput" className="cursor-pointer block">
                  <div className="text-5xl mb-4">🖼️</div>
                  <p className="text-gray-700 font-semibold mb-2">
                    Cliquez pour sélectionner
                  </p>
                  <p className="text-gray-500 text-sm">
                    ou glissez-déposez vos images
                  </p>
                </label>
              </div>

              {/* Liste des fichiers sélectionnés */}
              {files.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-3">
                    Fichiers sélectionnés ({files.length})
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-100 p-3 rounded-lg"
                      >
                        <div className="flex-1 truncate">
                          <p className="text-sm text-gray-700 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="ml-2 text-red-500 hover:text-red-700 text-lg"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bouton d'upload */}
              <button
                onClick={handleUpload}
                disabled={files.length === 0 || uploading}
                className="w-full btn-primary text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                <span>{uploading ? 'Upload en cours...' : 'Uploader'}</span>
                <span className="text-2xl">📤</span>
              </button>

              {/* Bouton clear */}
              {files.length > 0 && (
                <button
                  onClick={() => setFiles([])}
                  disabled={uploading}
                  className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300"
                >
                  Effacer la sélection
                </button>
              )}
            </div>
          </div>

          {/* Images uploadées */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold gradient-text">
                  Images uploadées ({uploadedImages.length})
                </h2>
                {uploadedImages.length > 0 && (
                  <button
                    onClick={() => {
                      if (isSelectionMode) {
                        deselectAllPhotos();
                        setIsSelectionMode(false);
                      } else {
                        setIsSelectionMode(true);
                      }
                    }}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      isSelectionMode
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isSelectionMode ? '✕ Annuler sélection' : '☑️ Mode sélection'}
                  </button>
                )}
              </div>

              {/* Selection toolbar */}
              {isSelectionMode && selectedPhotoIds.size > 0 && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200 flex items-center justify-between">
                  <span className="font-semibold text-blue-900">
                    {selectedPhotoIds.size} photo(s) sélectionnée(s)
                  </span>
                  <button
                    onClick={handleDeleteMultiplePhotos}
                    disabled={isDeletingMultiple}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                  >
                    <span>🗑️</span>
                    {isDeletingMultiple ? 'Suppression...' : 'Supprimer'}
                  </button>
                </div>
              )}

              {uploadedImages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-500 text-lg">
                    Aucune image uploadée pour le moment
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {groupPhotosByEvent(uploadedImages).map((folder) => (
                    <div key={folder.id} className="border rounded-lg overflow-hidden">
                      {/* En-tête du dossier */}
                      <button
                        onClick={() => toggleFolder(folder.id)}
                        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">
                            {expandedFolders[folder.id] ? '📂' : '📁'}
                          </span>
                          <div className="text-left">
                            <h3 className="font-semibold text-gray-800">{folder.title}</h3>
                            <p className="text-xs text-gray-500">
                              {folder.photos.length} photo{folder.photos.length > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-lg transition-transform ${
                            expandedFolders[folder.id] ? 'rotate-180' : ''
                          }`}
                        >
                          ▼
                        </span>
                      </button>

                      {/* Contenu du dossier */}
                      {expandedFolders[folder.id] && (
                        <div className="p-4 bg-gray-50">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {folder.photos.slice(0, folderDisplayLimits[folder.id] || PHOTOS_PER_FOLDER).map((photo) => (
                              <div
                                key={photo.id}
                                className={`group cursor-pointer relative rounded-xl ${
                                  isSelectionMode
                                    ? `ring-2 ring-offset-2 ${
                                        selectedPhotoIds.has(photo.id)
                                          ? 'ring-blue-500 ring-offset-blue-500'
                                          : 'ring-gray-300'
                                      }`
                                    : ''
                                }`}
                                onClick={() => {
                                  if (isSelectionMode) {
                                    togglePhotoSelection(photo.id);
                                  } else {
                                    openPhotoModal(photo);
                                  }
                                }}
                              >
                                {/* Selection checkbox */}
                                {isSelectionMode && (
                                  <div className="absolute top-2 left-2 z-10">
                                    <input
                                      type="checkbox"
                                      checked={selectedPhotoIds.has(photo.id)}
                                      onChange={() => togglePhotoSelection(photo.id)}
                                      className="w-6 h-6 cursor-pointer rounded"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </div>
                                )}

                                <div className="relative overflow-hidden rounded-xl shadow-lg">
                                  {/* Afficher l'image responsive avec srcset */}
                                  <img
                                    srcSet={`
                                      ${import.meta.env.VITE_API_URL}/uploads/thumbnail/${photo.uuid} 150w,
                                      ${import.meta.env.VITE_API_URL}/uploads/small/${photo.uuid} 400w,
                                      ${import.meta.env.VITE_API_URL}/uploads/medium/${photo.uuid} 800w,
                                      ${import.meta.env.VITE_API_URL}/uploads/large/${photo.uuid} 1200w
                                    `}
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    src={`${import.meta.env.VITE_API_URL}/uploads/medium/${photo.uuid}`}
                                    alt={`Photo ${photo.id}`}
                                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                                    onError={(e) => {
                                      e.target.src = `${import.meta.env.VITE_API_URL}/uploads/original/${photo.uuid}`;
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                                      <p className="text-lg font-semibold">
                                        {isSelectionMode ? 'Sélectionner' : 'Gérer'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-2 space-y-2 p-1">
                                  {photo.tags && photo.tags.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {photo.tags.map((tag, idx) => (
                                        <span
                                          key={idx}
                                          className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-xs text-gray-400 italic">Aucun tag</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Load more button if there are more photos in this folder */}
                          {folder.photos.length > (folderDisplayLimits[folder.id] || PHOTOS_PER_FOLDER) && (
                            <button
                              onClick={() => loadMorePhotosInFolder(folder.id)}
                              className="mt-4 w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                              <span>⬇️</span>
                              Charger plus ({folder.photos.length - (folderDisplayLimits[folder.id] || PHOTOS_PER_FOLDER)} restantes)
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {/* Infinite scroll loader */}
                  {isLoadingMore && (
                    <div className="text-center py-8">
                      <div className="inline-block">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      </div>
                      <p className="text-gray-500 mt-2">Chargement plus de photos...</p>
                    </div>
                  )}

                  {/* Observer target pour infinite scroll */}
                  {hasMore && <div ref={observerTarget} className="h-4" />}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Infos supplémentaires */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 text-center shadow-xl">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Upload sécurisé</h3>
            <p className="text-gray-600 text-sm">
              Vos photos sont protégées et authentifiées
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 text-center shadow-xl">
            <div className="text-4xl mb-3">🖼️</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Multi-format</h3>
            <p className="text-gray-600 text-sm">
              Supportez JPEG, PNG, WebP et GIF
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur rounded-2xl p-6 text-center shadow-xl">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Sans limite</h3>
            <p className="text-gray-600 text-sm">
              Aucune limite de taille pour vous
            </p>
          </div>
        </div>
      </div>

      {/* Modale de gestion des photos */}
      {isModalOpen && selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in flex flex-col max-h-[90vh] my-auto">
            {/* En-tête de la modale */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 text-white flex justify-between items-center flex-shrink-0">
              <h2 className="text-xl font-bold">Gérer la photo</h2>
              <button
                onClick={closePhotoModal}
                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenu scrollable */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Aperçu de l'image */}
              <div className="overflow-hidden rounded-lg">
                <img
                  srcSet={`
                    ${import.meta.env.VITE_API_URL}/uploads/small/${selectedPhoto.uuid} 400w,
                    ${import.meta.env.VITE_API_URL}/uploads/medium/${selectedPhoto.uuid} 800w,
                    ${import.meta.env.VITE_API_URL}/uploads/large/${selectedPhoto.uuid} 1200w
                  `}
                  sizes="(max-width: 768px) 100vw, 600px"
                  src={`${import.meta.env.VITE_API_URL}/uploads/medium/${selectedPhoto.uuid}`}
                  alt="Aperçu"
                  className="w-full h-[50vh] object-cover"
                  onError={(e) => {
                    e.target.src = `${import.meta.env.VITE_API_URL}/uploads/original/${selectedPhoto.uuid}`;
                  }}
                />
              </div>

              {/* Édition des tags avec autocomplete */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags (pseudo utilisateur)
                </label>
                <TagEditor
                  value={editTags}
                  onChange={setEditTags}
                  placeholder="Ajouter un pseudo utilisateur..."
                />
              </div>

            </div>

            {/* Footer sticky avec boutons */}
            <div className="bg-gray-50 border-t border-gray-200 p-6 space-y-3 flex-shrink-0">
              {/* Boutons d'action */}
              <div className="flex gap-3">
                {/* Bouton Supprimer */}
                <button
                  onClick={handleDeletePhoto}
                  disabled={isDeleting}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>🗑️</span>
                  {isDeleting ? 'Suppression...' : 'Supprimer'}
                </button>

                {/* Bouton Enregistrer les tags */}
                <button
                  onClick={handleUpdateTags}
                  className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>💾</span>
                  Enregistrer
                </button>
              </div>

              {/* Bouton Fermer */}
              <button
                onClick={closePhotoModal}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
