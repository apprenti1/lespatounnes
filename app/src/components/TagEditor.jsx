import { useState, useEffect } from 'react';

export default function TagEditor({ value, onChange, placeholder = '' }) {
  const [allUsernames, setAllUsernames] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // Initialiser les tags depuis la prop value
  useEffect(() => {
    if (value) {
      const tagsArray = value.split(',').map((tag) => tag.trim()).filter((tag) => tag);
      setTags(tagsArray);
    }
  }, [value]);

  // Notifier le parent des changements
  useEffect(() => {
    onChange(tags.join(', '));
  }, [tags]);

  const handleInputChange = async (e) => {
    const val = e.target.value;
    setInputValue(val);

    if (val.trim()) {
      try {
        // Faire un appel API au backend avec la recherche
        const token = localStorage.getItem('accessToken');
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/uploads/tags/autocomplete?search=${encodeURIComponent(val)}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          // Filtrer pour exclure les tags déjà ajoutés
          const filtered = (data.tags || []).filter((tag) => !tags.includes(tag));
          setFilteredSuggestions(filtered);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des suggestions:', error);
      }
    } else {
      // Quand l'input est vide, on affiche pas les suggestions
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const addTag = (tag) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const handleAddFromInput = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === ',' ) {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* Tags affichés */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
            >
              <span>@{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(idx)}
                className="text-purple-500 hover:text-purple-800 font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input avec autocomplete */}
      <div className="relative">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => inputValue && setShowSuggestions(true)}
            placeholder={placeholder || 'Ajouter un tag (pseudo)...'}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleAddFromInput}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Ajouter
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
            {filteredSuggestions.slice(0, 8).map((username, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => addTag(username)}
                className="w-full text-left px-3 py-2 hover:bg-purple-50 text-sm border-b border-gray-100 last:border-b-0 flex items-center gap-2"
              >
                <span className="text-purple-600 font-semibold">@</span>
                <span>{username}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Message si aucune suggestion */}
      {inputValue && showSuggestions && filteredSuggestions.length === 0 && (
        <p className="text-xs text-gray-500 italic">
          Aucun pseudo trouvé. Appuyez sur Entrée pour créer un nouveau tag.
        </p>
      )}
    </div>
  );
}
