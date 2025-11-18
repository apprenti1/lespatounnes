import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import HeroSection from '../components/HeroSection';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'USER',
    isMember: false,
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
      fetchUsers(token);
    } catch (error) {
      toast.error('Erreur lors de la vérification de l\'authentification');
      navigate('/login');
    }
  }, [navigate]);

  const fetchUsers = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.success ? data.users : []);
      } else {
        toast.error('Erreur lors du chargement des utilisateurs');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setSelectedUser(null);
    setFormData({
      username: '',
      email: '',
      role: 'USER',
      isMember: false,
      password: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (userToEdit) => {
    setIsEditMode(true);
    setSelectedUser(userToEdit);
    setFormData({
      username: userToEdit.username,
      email: userToEdit.email,
      role: userToEdit.role,
      isMember: userToEdit.isMember || false,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setFormData({
      username: '',
      email: '',
      role: 'USER',
      isMember: false,
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Utilisateur créé avec succès');
        closeModal();
        fetchUsers(token);
      } else {
        toast.error(data.message || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la création de l\'utilisateur');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Utilisateur mis à jour avec succès');
        closeModal();
        fetchUsers(token);
      } else {
        toast.error(data.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour de l\'utilisateur');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Utilisateur supprimé avec succès');
        fetchUsers(token);
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      (u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!user) {
    return null;
  }

  const heroButtons = [
    {
      href: '#users',
      text: 'Gestion des utilisateurs',
      className:
        'bg-white text-purple-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg',
    },
  ];

  return (
    <>
      <HeroSection
        emoji="👥"
        title="Gestion des utilisateurs"
        subtitle="Administrez les utilisateurs de l'association"
        description="Créez, modifiez et supprimez les comptes utilisateurs"
        buttons={heroButtons}
      />

      <section id="users" className="py-20 bg-gray-50 paw-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold gradient-text">Gestion des utilisateurs</h2>
            <button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-bold transition-all"
            >
              ➕ Ajouter un utilisateur
            </button>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Rechercher par pseudo ou email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all mb-6"
          />

          {/* Users Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {loading ? (
              <div className="text-center py-12">Chargement des utilisateurs...</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left">Pseudo</th>
                        <th className="px-6 py-4 text-left">Email</th>
                        <th className="px-6 py-4 text-left">Rôle</th>
                        <th className="px-6 py-4 text-center">Adhérent</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-semibold">{u.username}</td>
                          <td className="px-6 py-4">{u.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              u.role === 'ADMIN'
                                ? 'bg-red-100 text-red-700'
                                : u.role === 'PHOTOGRAPHER'
                                ? 'bg-blue-100 text-blue-700'
                                : u.role === 'DEV'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              u.isMember
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {u.isMember ? '✅ Oui' : '❌ Non'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center space-x-2">
                            <button
                              onClick={() => openEditModal(u)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-all inline-block"
                            >
                              ✏️ Éditer
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-all inline-block"
                            >
                              🗑️ Supprimer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    Aucun utilisateur trouvé
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
                {isEditMode ? 'Éditer l\'utilisateur' : 'Créer un utilisateur'}
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
              onSubmit={isEditMode ? handleUpdateUser : handleCreateUser}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Pseudo *</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              {!isEditMode && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Mot de passe *</label>
                  <input
                    type="password"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                    required={!isEditMode}
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Rôle</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                >
                  <option value="USER">Utilisateur</option>
                  <option value="PHOTOGRAPHER">Photographe</option>
                  <option value="ADMIN">Admin</option>
                  <option value="DEV">Dev</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isMember}
                    onChange={(e) => setFormData({ ...formData, isMember: e.target.checked })}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <span className="text-gray-700 font-semibold">Adhérent</span>
                </label>
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
