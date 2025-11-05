import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Photographer() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Vérifier l'authentification et le rôle
  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'PHOTOGRAPHER') {
        toast.error('Accès réservé aux photographes');
        navigate('/');
        return;
      }
      setUser(parsedUser);
      fetchEvents(token);
    } catch (error) {
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

      setUploadedImages((prevImages) => [...prevImages, ...data.uuids]);
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

  if (!user || user.role !== 'PHOTOGRAPHER') {
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
              <h2 className="text-2xl font-bold gradient-text mb-6">
                Images uploadées ({uploadedImages.length})
              </h2>

              {uploadedImages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-500 text-lg">
                    Aucune image uploadée pour le moment
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {uploadedImages.map((uuid, index) => (
                    <div key={index} className="group">
                      <div className="relative overflow-hidden rounded-xl shadow-lg">
                        {/* Afficher la version thumbnail */}
                        <img
                          src={`${import.meta.env.VITE_API_URL}/uploads/thumbnail/${uuid}`}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = `${import.meta.env.VITE_API_URL}/uploads/original/${uuid}`;
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                            <p className="text-sm font-semibold mb-2">UUID:</p>
                            <p className="text-xs break-all px-4">{uuid}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-center">
                        <p className="text-xs text-gray-500 truncate">{uuid}</p>
                      </div>
                    </div>
                  ))}
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
    </section>
  );
}
