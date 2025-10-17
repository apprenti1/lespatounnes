function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-12 text-center">
        <div className="text-8xl mb-6">
          🐾
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-4">
          Les Patounes
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Projet React + Vite + Tailwind + Ion-Icons
        </p>

        <div className="flex gap-4 justify-center items-center mb-8">
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl flex items-center gap-2">
            <ion-icon name="heart" class="text-xl"></ion-icon>
            Bouton avec icône
          </button>

          <button className="h-[50px] w-[50px] text-purple-600 border-2 border-purple-600 rounded-lg hover:bg-purple-50 hover:border-purple-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-xl">
            <ion-icon name="person-circle-outline" class="text-3xl"></ion-icon>
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6">
          <p className="text-gray-700 font-semibold mb-2">Configuration terminée :</p>
          <ul className="text-left text-gray-600 space-y-2">
            <li className="flex items-center gap-2">
              <ion-icon name="checkmark-circle" class="text-green-500 text-xl"></ion-icon>
              React + Vite
            </li>
            <li className="flex items-center gap-2">
              <ion-icon name="checkmark-circle" class="text-green-500 text-xl"></ion-icon>
              Tailwind CSS
            </li>
            <li className="flex items-center gap-2">
              <ion-icon name="checkmark-circle" class="text-green-500 text-xl"></ion-icon>
              Ion-Icons
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
