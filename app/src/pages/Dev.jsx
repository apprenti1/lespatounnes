import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Dev() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Vérifier l'authentification et le rôle DEV
    const token = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'DEV') {
      toast.error('Accès refusé. Vous devez être développeur.');
      navigate('/');
      return;
    }

    setLoading(false);
  }, [navigate]);

  const handleRegenerateImages = async () => {
    setRegenerating(true);
    setResult(null);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/uploads/regenerate-responsive`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la régénération des images');
      }

      const data = await response.json();
      setResult(data.result);
      toast.success(
        `Images régénérées avec succès! (${data.result.processed} traitées, ${data.result.errors} erreurs)`
      );
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la régénération des images');
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 px-8 py-12">
            <h1 className="text-4xl font-bold text-white mb-2">🔧 Panel Développeur</h1>
            <p className="text-purple-100">Outils de maintenance et configuration</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Image Regeneration Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Régénération des Images</h2>
              <p className="text-gray-600 mb-6">
                Supprime toutes les versions responsive (thumbnail, small, medium, large) et les régénère à partir des images originales.
              </p>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800">
                  ⚠️ Cette opération peut prendre du temps selon le nombre d'images. Ne fermez pas cette page pendant le traitement.
                </p>
              </div>

              <button
                onClick={handleRegenerateImages}
                disabled={regenerating}
                className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  regenerating
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600 shadow-lg hover:shadow-xl'
                }`}
              >
                {regenerating ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Régénération en cours...
                  </>
                ) : (
                  <>
                    <span>🖼️</span>
                    Régénérer toutes les images
                  </>
                )}
              </button>
            </div>

            {/* Results */}
            {result && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mt-8">
                <h3 className="text-xl font-bold text-green-800 mb-4">✅ Résultat</h3>
                <div className="space-y-2">
                  <p className="text-green-700">
                    <strong>Images traitées:</strong> {result.processed}
                  </p>
                  <p className={result.errors > 0 ? 'text-orange-700' : 'text-green-700'}>
                    <strong>Erreurs:</strong> {result.errors}
                  </p>
                </div>
              </div>
            )}

            {/* Info Section */}
            <div className="mt-12 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <h3 className="text-lg font-bold text-blue-900 mb-3">ℹ️ Informations</h3>
              <ul className="text-blue-800 space-y-2 text-sm">
                <li>• Les images originales ne sont jamais modifiées</li>
                <li>• Les versions responsive sont recréées à partir des originaux</li>
                <li>• Les résolutions créées: 150x150 (thumbnail), 400x300 (small), 800x600 (medium), 1200x900 (large)</li>
                <li>• Cette opération est sécurisée et peut être exécutée sans risque</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
