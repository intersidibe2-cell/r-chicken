import { useState, useEffect } from 'react';
import { Smartphone, RefreshCw, ZoomIn, ZoomOut, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const MobilePreview = () => {
  const [scale, setScale] = useState(0.5);
  const [currentUrl, setCurrentUrl] = useState('/');
  const [refreshKey, setRefreshKey] = useState(0);

  const pages = [
    { path: '/', name: 'Accueil', icon: '🏠' },
    { path: '/menu', name: 'Menu', icon: '🍽️' },
    { path: '/cart', name: 'Panier', icon: '🛒' },
    { path: '/promotions', name: 'Promos', icon: '🏷️' },
    { path: '/contact', name: 'Contact', icon: '📞' },
  ];

  const useMobileView = () => {
    const style = document.createElement('style');
    style.id = 'mobile-preview-style';
    style.innerHTML = `
      @media (max-width: 768px) {
        header, footer, .mobile-hide { display: block !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/profile" className="text-white hover:text-[#E4002B] transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
                <Smartphone className="w-8 h-8 text-[#E4002B]" />
                Aperçu Mobile
              </h1>
              <p className="text-gray-400">Prévisualisez le site comme sur un téléphone</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setScale(Math.max(0.3, scale - 0.1))}
              className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="text-white font-bold px-3">{Math.round(scale * 100)}%</span>
            <button 
              onClick={() => setScale(Math.min(1, scale + 0.1))}
              className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={() => setRefreshKey(k => k + 1)}
              className="ml-2 bg-[#E4002B] hover:bg-[#C4001F] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Rafraîchir</span>
            </button>
          </div>
        </div>

        {/* Phone Frame */}
        <div className="flex justify-center">
          <div 
            className="relative bg-black rounded-[40px] overflow-hidden shadow-2xl border-8 border-gray-800"
            style={{ 
              width: 380 * scale, 
              height: 780 * scale,
            }}
            key={refreshKey}
          >
            {/* Notch */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 bg-black z-30 rounded-b-2xl"
              style={{ 
                width: 180 * scale, 
                height: 30 * scale,
              }}
            />
            
            {/* Status Bar */}
            <div 
              className="absolute top-0 left-0 right-0 flex justify-between items-center px-4 z-20"
              style={{ paddingTop: 8 * scale }}
            >
              <span className="text-white text-xs" style={{ fontSize: 10 * scale }}>9:41</span>
              <div className="flex gap-1">
                <div className="w-4 h-2 bg-white/80 rounded-sm"></div>
                <div className="w-4 h-2 bg-white/80 rounded-sm"></div>
                <div className="w-4 h-2 bg-white/80 rounded-sm"></div>
                <div className="w-4 h-2 bg-white/80 rounded-sm"></div>
              </div>
            </div>

            {/* Content Preview */}
            <div className="w-full h-full bg-gray-100 overflow-auto">
              {/* Simulated Mobile Header */}
              <div className="bg-[#1A1A1A] text-white p-3 flex items-center justify-between">
                <div className="font-black text-lg">R-CHICKEN</div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-[#E4002B] rounded-full"></div>
                </div>
              </div>

              {/* Simulated Content */}
              <div className="p-4 space-y-3">
                {/* Hero */}
                <div className="bg-gradient-to-r from-[#E4002B] to-[#C4001F] rounded-xl p-4 text-white">
                  <h2 className="font-black text-lg">C'EST BON C'EST R-CHICKEN</h2>
                  <p className="text-sm">Le Meilleur Poulet Frit de Bamako 🇲🇱</p>
                </div>

                {/* Categories */}
                <div className="grid grid-cols-3 gap-2">
                  {['Box KFC', 'KFC', 'Tenders', 'Nuggets', 'Burger', 'Wraps'].map((cat, i) => (
                    <div key={i} className="bg-white rounded-lg p-2 text-center shadow">
                      <div className="text-2xl mb-1">🍗</div>
                      <div className="text-xs font-bold text-gray-700">{cat}</div>
                    </div>
                  ))}
                </div>

                {/* Products */}
                <div className="space-y-2">
                  {['Mini Box - 3 500F', 'Tenders x4 - 4 000F', 'Burger Classic - 2 500F'].map((item, i) => (
                    <div key={i} className="bg-white rounded-lg p-3 flex items-center gap-3 shadow">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="font-bold text-sm text-gray-800">{item.split(' - ')[0]}</div>
                        <div className="text-[#E4002B] font-black text-sm">{item.split(' - ')[1]}</div>
                      </div>
                      <button className="bg-[#E4002B] text-white px-3 py-1 rounded-lg text-xs font-bold">+</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A] border-t-4 border-[#E4002B] p-2 flex justify-around">
                {pages.slice(0, 5).map((page, i) => (
                  <div key={i} className="flex flex-col items-center text-gray-400">
                    <span className="text-lg">{page.icon}</span>
                    <span className="text-[8px] font-bold">{page.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-800 rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-4">Comment tester la version mobile ?</h3>
          <div className="grid md:grid-cols-2 gap-4 text-gray-300 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-[#E4002B] font-black text-xl">1</span>
              <div>
                <p className="font-bold text-white">Sur votre téléphone</p>
                <p>Allez sur http://192.168.1.111:3000 depuis votre téléphone</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#E4002B] font-black text-xl">2</span>
              <div>
                <p className="font-bold text-white">Outils développeur (F12)</p>
                <p>Ouvrez F12 → icône téléphone → Choisissez un appareil</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#E4002B] font-black text-xl">3</span>
              <div>
                <p className="font-bold text-white">Réduire la fenêtre</p>
                <p>Redimensionnez votre navigateur en largeur &lt; 768px</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#E4002B] font-black text-xl">4</span>
              <div>
                <p className="font-bold text-white">Vérifier le pare-feu</p>
                <p>Désactivez temporairement le pare-feu si problème</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePreview;