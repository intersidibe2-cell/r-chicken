import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { QRCodeSVG } from 'qrcode.react';
import { Play, Pause, Monitor } from 'lucide-react';
import { menuData } from '../../data/menu';

export default function AfficheTV() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const slides = [
    // Slide 1 - Welcome
    {
      type: 'welcome',
      content: (
        <div className="h-full bg-gradient-to-br from-red-600 via-red-700 to-red-800 flex flex-col items-center justify-center text-white p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
              <span className="text-8xl font-black text-red-600">R</span>
            </div>
            <div>
              <h1 className="text-6xl font-black">R-CHICKEN</h1>
              <p className="text-amber-300 text-3xl font-bold">Le Poulet Croustillant ML</p>
            </div>
          </div>
          <div className="text-6xl mb-4">🍗</div>
          <p className="text-4xl font-bold text-amber-300">Bienvenue!</p>
          <p className="text-2xl mt-4">Commandez au comptoir ou scannez le QR code</p>
          <div className="mt-8 bg-white p-4 rounded-2xl">
            <QRCodeSVG value="https://r-chicken.com/menu" size={150} fgColor="#E4002B" />
          </div>
        </div>
      )
    },
    // Slide 2 - Boxes
    {
      type: 'boxes',
      content: (
        <div className="h-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex flex-col text-white p-8">
          <h2 className="text-5xl font-black text-center mb-6">📦 NOS BOXES</h2>
          <div className="grid grid-cols-3 gap-6 flex-1">
            {menuData.categories.find(c => c.id === 'boxes')?.items.slice(0, 6).map((item, i) => (
              <div key={i} className="bg-white/20 rounded-2xl p-6 flex flex-col items-center justify-center">
                <div className="text-6xl mb-3">🍗</div>
                <h3 className="text-2xl font-black text-center">{item.name}</h3>
                <p className="text-lg opacity-80 text-center">{item.description}</p>
                <p className="text-4xl font-black text-amber-200 mt-3">{item.price.toLocaleString('fr-FR')}F</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-2xl font-bold">🔥 Livraison GRATUITE dès 20 000F !</p>
          </div>
        </div>
      )
    },
    // Slide 3 - KFC
    {
      type: 'kfc',
      content: (
        <div className="h-full bg-gradient-to-br from-red-600 via-red-700 to-red-900 flex flex-col text-white p-8">
          <h2 className="text-5xl font-black text-center mb-6">🍗 NOS KFC</h2>
          <div className="grid grid-cols-2 gap-8 flex-1">
            <div className="bg-black/30 rounded-3xl p-8 flex flex-col items-center justify-center">
              <div className="text-8xl mb-4">🍗</div>
              <h3 className="text-3xl font-black">Poulet Entier Doré XXL</h3>
              <p className="text-xl opacity-80 mt-2">Un poulet entier magnifiquement frit</p>
              <p className="text-5xl font-black text-amber-300 mt-4">8 000F</p>
            </div>
            <div className="bg-black/30 rounded-3xl p-8 flex flex-col items-center justify-center">
              <div className="text-8xl mb-4">🍖</div>
              <h3 className="text-3xl font-black">KFC MIX</h3>
              <p className="text-xl opacity-80 mt-2">Gros morceaux - Ailes, cuisses, tenders</p>
              <p className="text-5xl font-black text-amber-300 mt-4">À partir de 2 500F</p>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-2xl font-bold">📞 +223 83 80 61 29</p>
          </div>
        </div>
      )
    },
    // Slide 4 - Promos
    {
      type: 'promos',
      content: (
        <div className="h-full bg-gradient-to-br from-green-500 via-green-600 to-green-700 flex flex-col items-center justify-center text-white p-8">
          <div className="text-8xl mb-6">🔥</div>
          <h2 className="text-6xl font-black text-center mb-8">PROMOS DU JOUR</h2>
          <div className="grid grid-cols-2 gap-8 w-full max-w-4xl">
            <div className="bg-white/20 rounded-3xl p-8 text-center">
              <p className="text-4xl mb-4">🚚</p>
              <h3 className="text-3xl font-black">LIVRAISON GRATUITE</h3>
              <p className="text-2xl">Dès 20 000F de commande</p>
            </div>
            <div className="bg-white/20 rounded-3xl p-8 text-center">
              <p className="text-4xl mb-4">🎁</p>
              <h3 className="text-3xl font-black">+100 POINTS</h3>
              <p className="text-2xl">Par commande livrée</p>
            </div>
          </div>
          <div className="mt-8 bg-white rounded-2xl p-4">
            <QRCodeSVG value="https://r-chicken.com/menu" size={120} fgColor="#22C55E" />
          </div>
          <p className="mt-4 text-xl">Scannez pour commander!</p>
        </div>
      )
    },
    // Slide 5 - Menu complet
    {
      type: 'menu',
      content: (
        <div className="h-full bg-gradient-to-b from-red-600 to-red-800 flex flex-col text-white p-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
              <span className="text-4xl font-black text-red-600">R</span>
            </div>
            <h2 className="text-4xl font-black">NOTRE MENU</h2>
          </div>
          <div className="grid grid-cols-4 gap-4 flex-1">
            {menuData.categories.map((category, i) => (
              <div key={i} className="bg-white/10 rounded-2xl p-4">
                <h3 className="text-xl font-black text-amber-300 mb-3 flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  {category.name}
                </h3>
                <div className="space-y-2">
                  {category.items.slice(0, 4).map((item, j) => (
                    <div key={j} className="flex justify-between text-sm">
                      <span className="truncate">{item.name}</span>
                      <span className="text-amber-300 font-bold">{item.price.toLocaleString('fr-FR')}F</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-amber-300 font-bold text-2xl">C'EST BON, C'EST R-CHICKEN ! 🍗</p>
          </div>
        </div>
      )
    },
    // Slide 6 - Contact
    {
      type: 'contact',
      content: (
        <div className="h-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex flex-col items-center justify-center text-white p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
              <span className="text-6xl font-black text-orange-500">R</span>
            </div>
            <div>
              <h1 className="text-5xl font-black">R-CHICKEN</h1>
              <p className="text-amber-200 text-2xl font-bold">Le Poulet Croustillant ML</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8 w-full max-w-4xl mb-8">
            <div className="bg-white/20 rounded-3xl p-6 text-center">
              <p className="text-5xl mb-3">📞</p>
              <p className="text-3xl font-black">+223 83 80 61 29</p>
            </div>
            <div className="bg-white/20 rounded-3xl p-6 text-center">
              <p className="text-5xl mb-3">📍</p>
              <p className="text-2xl font-bold">Baco-djicoroni Golf</p>
              <p className="text-lg">Bamako, Mali</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 w-full max-w-4xl mb-8">
            <div className="bg-white/20 rounded-3xl p-6 text-center">
              <p className="text-5xl mb-3">🕐</p>
              <p className="text-3xl font-black">24h/24</p>
              <p className="text-xl">7j/7</p>
            </div>
            <div className="bg-white/20 rounded-3xl p-6 text-center">
              <p className="text-5xl mb-3">📱</p>
              <p className="text-2xl font-bold">@rouski_chicken</p>
              <p className="text-lg">TikTok</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4">
            <QRCodeSVG value="https://r-chicken.com/menu" size={120} fgColor="#F59E0B" />
          </div>
          <p className="mt-4 text-xl font-bold">Scannez pour commander!</p>
        </div>
      )
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">📺 Affiche TV</h1>
            <p className="text-gray-500 mt-1">Diaporama pour écrans TV du restaurant</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white px-4 py-2 rounded-xl font-bold inline-flex items-center gap-2`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl font-bold"
            >
              Slide suivant
            </button>
          </div>
        </div>

        {/* Slide Preview */}
        <div className="bg-black rounded-2xl p-4">
          <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
            {slides[currentSlide].content}
          </div>
        </div>

        {/* Slide Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {slides.map((slide, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-bold transition-all ${
                currentSlide === i 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Slide {i + 1}
            </button>
          ))}
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-blue-800 font-bold">💡 Comment utiliser l'affiche TV:</p>
          <ul className="text-blue-700 text-sm mt-2 space-y-1">
            <li>• Cliquez sur "Play" pour lancer le diaporama automatique (5 secondes par slide)</li>
            <li>• Utilisez les boutons pour naviguer manuellement</li>
            <li>• Ouvrez cette page en plein écran sur un écran TV (F11)</li>
            <li>• Les slides changent automatiquement toutes les 5 secondes</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
