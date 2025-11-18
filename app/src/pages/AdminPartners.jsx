import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import HeroSection from '../components/HeroSection';

export default function AdminPartners() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
    imagePreview: null,
    websiteUrl: '',
    promoCode: '',
    promotionalText: '',
    order: 0,
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
      fetchPartners(token);
    } catch (error) {
      toast.error('Erreur lors de la vérification de l\'authentification');
      navigate('/login');
    }
  }, [navigate]);

  const fetchPartners = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/partners`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPartners(data.success ? data.partners : []);
      } else {
        toast.error('Erreur lors du chargement des partenaires');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des partenaires');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setSelectedPartner(null);
    setFormData({
      name: '',
      description: '',
      image: null,
      imagePreview: null,
      websiteUrl: '',
      promoCode: '',
      promotionalText: '',
      order: 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (partnerToEdit) => {
    setIsEditMode(true);
    setSelectedPartner(partnerToEdit);
    setFormData({
      name: partnerToEdit.name,
      description: partnerToEdit.description || '',
      image: null,
      imagePreview: partnerToEdit.image ? `${import.meta.env.VITE_API_URL}/uploads/medium/${partnerToEdit.image}` : null,
      websiteUrl: partnerToEdit.websiteUrl || '',
      promoCode: partnerToEdit.promoCode || '',
      promotionalText: partnerToEdit.promotionalText || '',
      order: partnerToEdit.order || 0,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPartner(null);
    setFormData({
      name: '',
      description: '',
      image: null,
      imagePreview: null,
      websiteUrl: '',
      promoCode: '',
      promotionalText: '',
      order: 0,
    });
  };

  const handleCreatePartner = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      toast.error('Veuillez remplir le nom et la description');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      let imagePath = null;

      // Upload l'image si une image a été sélectionnée
      if (formData.image && formData.image instanceof File) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', formData.image);

        const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL}/uploads/partner`, {
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

      // Créer le partenaire
      const partnerData = {
        name: formData.name,
        description: formData.description,
        websiteUrl: formData.websiteUrl,
        promoCode: formData.promoCode,
        promotionalText: formData.promotionalText,
        image: imagePath,
        order: parseInt(formData.order) || 0,
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/partners`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(partnerData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Partenaire créé avec succès');
        closeModal();
        fetchPartners(token);
      } else {
        toast.error(data.message || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la création du partenaire');
    }
  };

  const handleUpdatePartner = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('accessToken');
      let imagePath = selectedPartner?.image || null;

      // Upload l'image si une nouvelle image a été sélectionnée
      if (formData.image && formData.image instanceof File) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', formData.image);

        const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL}/uploads/partner`, {
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

      // Mettre à jour le partenaire
      const partnerData = {
        name: formData.name,
        description: formData.description,
        websiteUrl: formData.websiteUrl,
        promoCode: formData.promoCode,
        promotionalText: formData.promotionalText,
        image: imagePath,
        order: parseInt(formData.order) || 0,
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/partners/${selectedPartner.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(partnerData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Partenaire mis à jour avec succès');
        closeModal();
        fetchPartners(token);
      } else {
        toast.error(data.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour du partenaire');
    }
  };

  const handleDeletePartner = async (partnerId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/partners/${partnerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Partenaire supprimé avec succès');
        fetchPartners(token);
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression du partenaire');
    }
  };

  const filteredPartners = partners.filter(
    (p) =>
      (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!user) {
    return null;
  }

  const heroButtons = [
    {
      href: '#partners',
      text: 'Gestion des partenaires',
      className:
        'bg-white text-purple-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg',
    },
  ];

  return (
    <>
      <HeroSection
        emoji="🤝"
        title="Gestion des partenaires"
        subtitle="Administrez les partenaires"
        description="Créez, modifiez et supprimez les partenaires"
        buttons={heroButtons}
      />

      <section id="partners" className="py-20 bg-gray-50 paw-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold gradient-text">Gestion des partenaires</h2>
            <button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-bold transition-all"
            >
              ➕ Ajouter un partenaire
            </button>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Rechercher par nom ou description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all mb-6"
          />

          {/* Partners Grid */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            {loading ? (
              <div className="text-center py-12">Chargement des partenaires...</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPartners.map((p) => (
                    <div key={p.id} className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
                      {p.image && (
                        <img src={`${import.meta.env.VITE_API_URL}/uploads/medium/${p.image}`} alt={p.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                      )}
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{p.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-3">{p.description}</p>
                      {p.promoCode && (
                        <p className="text-sm font-semibold text-purple-600 mb-3">Code: <span className="text-pink-600">{p.promoCode}</span></p>
                      )}
                      {p.websiteUrl && (
                        <a href={p.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline mb-4 block">
                          Visiter le site
                        </a>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-all"
                        >
                          ✏️ Éditer
                        </button>
                        <button
                          onClick={() => handleDeletePartner(p.id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-all"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredPartners.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    Aucun partenaire trouvé
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {isEditMode ? 'Éditer le partenaire' : 'Créer un partenaire'}
              </h3>
              <button
                onClick={closeModal}
                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={isEditMode ? handleUpdatePartner : handleCreatePartner}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Nom *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                  placeholder="Nom du partenaire"
                  required
                  disabled={isEditMode}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                  placeholder="Description détaillée"
                  rows="4"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Image</label>
                {formData.imagePreview && (
                  <div className="mb-4">
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                  </div>
                )}
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({
                        ...formData,
                        image: file,
                        imagePreview: URL.createObjectURL(file),
                      });
                    }
                  }}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                  accept="image/*"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Site Web</label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Code Promo</label>
                <input
                  type="text"
                  value={formData.promoCode}
                  onChange={(e) => setFormData({ ...formData, promoCode: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                  placeholder="Ex: PATOUNES10"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Texte Promotionnel (visible aux non-adhérents)</label>
                <textarea
                  value={formData.promotionalText}
                  onChange={(e) => setFormData({ ...formData, promotionalText: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                  placeholder="Texte HTML pour les visiteurs non adhérents"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Ordre d'affichage</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-bold transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-bold transition-all"
                >
                  {isEditMode ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
