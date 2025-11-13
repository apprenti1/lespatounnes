import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import HeroSection from '../components/HeroSection';

export default function AdminEvents() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    lieu: '',
    date: '',
    recurrence: '',
    onlyUsers: false,
    image: null,
    imagePreview: null,
  });

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
      if (parsedUser.role !== 'ADMIN' && parsedUser.role !== 'DEV') {
        toast.error('Accès réservé aux administrateurs et développeurs');
        navigate('/');
        return;
      }
      setUser(parsedUser);
      fetchEvents(token);
    } catch (error) {
      toast.error('Erreur lors de la vérification de l\'authentification');
      navigate('/login');
    }
  }, [navigate]);

  const fetchEvents = async (token) => {
    setLoading(true);
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
      toast.error('Impossible de charger les événements');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        description: event.description,
        lieu: event.lieu,
        date: event.date.split('T')[0],
        recurrence: event.recurrence || '',
        onlyUsers: event.onlyUsers || false,
        image: null,
        imagePreview: event.image ? `${import.meta.env.VITE_API_URL}/uploads/medium/${event.image}` : null,
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        description: '',
        lieu: '',
        date: '',
        recurrence: '',
        onlyUsers: false,
        image: null,
        imagePreview: null,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      lieu: '',
      date: '',
      recurrence: '',
      onlyUsers: false,
      image: null,
      imagePreview: null,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');

    if (!formData.title || !formData.date) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }

    try {
      let imagePath = editingEvent?.image || null;

      // Upload l'image si une nouvelle image a été sélectionnée
      if (formData.image && formData.image instanceof File) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', formData.image);

        const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL}/uploads/event`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Erreur lors de l\'upload de l\'image');
        }

        const uploadData = await uploadResponse.json();
        imagePath = uploadData.uuid || uploadData.filename;
      }

      // Créer/modifier l'événement
      const eventData = {
        title: formData.title,
        description: formData.description,
        lieu: formData.lieu,
        date: formData.date,
        recurrence: formData.recurrence,
        onlyUsers: formData.onlyUsers,
        image: imagePath,
      };

      const url = editingEvent
        ? `${import.meta.env.VITE_API_URL}/events/${editingEvent.id}`
        : `${import.meta.env.VITE_API_URL}/events`;

      const method = editingEvent ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la sauvegarde');
      }

      toast.success(editingEvent ? '✅ Événement modifié!' : '✅ Événement créé!');
      handleCloseModal();
      fetchEvents(token);
    } catch (error) {
      toast.error(`❌ ${error.message}`);
    }
  };

  const handleDelete = async (eventId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement?')) return;

    const token = localStorage.getItem('accessToken');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      toast.success('✅ Événement supprimé!');
      fetchEvents(token);
    } catch (error) {
      toast.error(`❌ ${error.message}`);
    }
  };

  if (!user) {
    return null;
  }

  const heroButtons = [
    {
      href: '#gestion',
      text: 'Gestion des événements',
      className:
        'bg-white text-purple-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg',
    },
  ];

  return (
    <>
      <HeroSection
        emoji="📅"
        title="Gestion des événements"
        subtitle="Créer, modifier et supprimer les événements"
        description="Espace de gestion complet des événements de l'association"
        buttons={heroButtons}
      />

      {/* Section gestion */}
      <section id="gestion" className="py-20 bg-gray-50 paw-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête */}
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text">
              Événements ({events.length})
            </h2>
            <button
              onClick={() => handleOpenModal()}
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold px-8 py-4 rounded-full transition-all duration-300 shadow-lg flex items-center gap-2"
            >
              <span className="text-2xl">➕</span>
              Créer un événement
            </button>
          </div>

          {/* Liste des événements */}
          {loading ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">⏳</div>
              <p className="text-gray-600 text-lg">Chargement des événements...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-600 text-lg">Aucun événement pour le moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-2xl p-6 shadow-xl">
                  {/* En-tête de la carte */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800 flex-1">{event.title}</h3>
                    <span className="text-sm font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                      {new Date(event.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  {/* Infos */}
                  <div className="space-y-3 mb-6">
                    <p className="text-gray-700">
                      <span className="font-semibold">📍 Lieu:</span> {event.lieu}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">📅 Date:</span>{' '}
                      {new Date(event.date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    {event.recurrence && (
                      <p className="text-gray-700">
                        <span className="font-semibold">🔄 Récurrence:</span> {event.recurrence}
                      </p>
                    )}
                    <p className="text-gray-700">
                      <span className="font-semibold">👥 Accès:</span>{' '}
                      {event.onlyUsers ? 'Membres seulement' : 'Public'}
                    </p>
                    <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleOpenModal(event)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <span>✏️</span>
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <span>🗑️</span>
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal de création/édition */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* En-tête */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 text-white flex justify-between items-center sticky top-0">
              <h2 className="text-xl font-bold">
                {editingEvent ? 'Modifier l\'événement' : 'Créer un événement'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Titre */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-all"
                  placeholder="Titre de l'événement"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-all"
                  placeholder="Description de l'événement"
                  rows="4"
                />
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image de l'événement
                </label>
                {formData.imagePreview && (
                  <div className="mb-4 relative">
                    <img
                      src={formData.imagePreview}
                      alt="Aperçu"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-all"
                />
              </div>

              {/* Lieu */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lieu
                </label>
                <input
                  type="text"
                  value={formData.lieu}
                  onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-all"
                  placeholder="Lieu de l'événement"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-all"
                  required
                />
              </div>

              {/* Récurrence */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Récurrence
                </label>
                <input
                  type="text"
                  value={formData.recurrence}
                  onChange={(e) => setFormData({ ...formData, recurrence: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-all"
                  placeholder="Ex: Hebdomadaire, Mensuel..."
                />
              </div>

              {/* Accès */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.onlyUsers}
                    onChange={(e) => setFormData({ ...formData, onlyUsers: e.target.checked })}
                    className="w-5 h-5 rounded border-2 border-gray-200 text-purple-600 focus:outline-none"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Réservé aux membres
                  </span>
                </label>
              </div>

              {/* Boutons */}
              <div className="flex gap-3 pt-6 border-t">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-3 rounded-lg transition-all"
                >
                  {editingEvent ? 'Modifier' : 'Créer'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition-all"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
