import { useRef } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Download } from 'lucide-react';

export default function Flyers() {
  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>R-CHICKEN Flyers</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @page { size: A4; margin: 10mm; }
          body { margin: 0; padding: 0; font-family: system-ui, sans-serif; }
          .flyer { page-break-after: always; }
        </style>
      </head>
      <body>${printContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">📄 Flyers Marketing</h1>
            <p className="text-gray-500 mt-1">Différents modèles de flyers à imprimer</p>
          </div>
          <button
            onClick={handlePrint}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-bold inline-flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Imprimer tous les flyers
          </button>
        </div>

        <div ref={printRef} className="space-y-8">
          {/* Flyer 1 - Livraison Gratuite */}
          <div className="flyer bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-8 text-white shadow-2xl">
            <div className="text-center">
              <div className="text-5xl mb-4">🚚</div>
              <h2 className="text-4xl font-black mb-2">LIVRAISON GRATUITE !</h2>
              <p className="text-2xl font-bold mb-6">Dès 20 000 FCFA de commande</p>
              
              <div className="bg-white rounded-3xl p-6 inline-block mb-6">
                <QRCodeSVG 
                  value="https://r-chicken.com/menu" 
                  size={180}
                  level="H"
                  fgColor="#22C55E"
                />
                <p className="text-gray-600 mt-3 font-medium">Scannez pour commander</p>
              </div>

              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-3xl font-black text-green-600">R</span>
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-black">R-CHICKEN</h3>
                  <p className="text-green-200">Le Poulet Croustillant ML</p>
                </div>
              </div>

              <div className="bg-white/20 rounded-2xl p-4">
                <p className="text-xl font-bold">📞 +223 83 80 61 29</p>
                <p className="text-lg">📍 Baco-djicoroni Golf, Bamako</p>
                <p className="text-sm mt-2">📱 TikTok: @rouski_chicken</p>
              </div>
            </div>
          </div>

          {/* Flyer 2 - Programme Fidélité */}
          <div className="flyer bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-8 text-white shadow-2xl">
            <div className="text-center">
              <div className="text-5xl mb-4">🎁</div>
              <h2 className="text-4xl font-black mb-2">PROGRAMME FIDÉLITÉ</h2>
              <p className="text-2xl font-bold mb-6">Gagnez des points à chaque commande !</p>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-2xl p-4 text-gray-800">
                  <div className="text-4xl mb-2">🍗</div>
                  <p className="text-3xl font-black text-orange-500">+100</p>
                  <p className="text-sm font-medium">Points par commande</p>
                </div>
                <div className="bg-white rounded-2xl p-4 text-gray-800">
                  <div className="text-4xl mb-2">🎯</div>
                  <p className="text-3xl font-black text-orange-500">5000</p>
                  <p className="text-sm font-medium">Points = 1 commande GRATUITE</p>
                </div>
                <div className="bg-white rounded-2xl p-4 text-gray-800">
                  <div className="text-4xl mb-2">♾️</div>
                  <p className="text-3xl font-black text-orange-500">∞</p>
                  <p className="text-sm font-medium">Pas de limite !</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6">
                <div className="bg-white p-3 rounded-xl">
                  <QRCodeSVG 
                    value="https://r-chicken.com/menu" 
                    size={120}
                    level="H"
                    fgColor="#F59E0B"
                  />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <span className="text-2xl font-black text-orange-500">R</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black">R-CHICKEN</h3>
                      <p className="text-amber-200 text-sm">Le Poulet Croustillant ML</p>
                    </div>
                  </div>
                  <p className="font-bold">📞 +223 83 80 61 29</p>
                  <p className="text-sm">📍 Baco-djicoroni Golf</p>
                </div>
              </div>
            </div>
          </div>

          {/* Flyer 3 - Spécialités */}
          <div className="flyer bg-gradient-to-br from-red-600 to-red-700 rounded-3xl p-8 text-white shadow-2xl">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
                  <span className="text-4xl font-black text-red-600">R</span>
                </div>
                <div>
                  <h2 className="text-4xl font-black">R-CHICKEN</h2>
                  <p className="text-amber-300 font-bold">ML La Saveur du Poulet Malien ML</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 mb-6">
                <h3 className="text-red-600 font-black text-2xl mb-4">✨ NOS SPÉCIALITÉS ✨</h3>
                <div className="grid grid-cols-5 gap-2">
                  {['🍗 KFC', '🍖 Tenders', '📦 Boxes', '🥙 Shawarma', '🍔 Burger'].map((item, i) => (
                    <div key={i} className="bg-red-50 rounded-xl p-3 text-red-600 font-bold text-sm">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/20 rounded-xl p-4">
                  <div className="text-3xl mb-2">🚀</div>
                  <p className="font-black">LIVRAISON RAPIDE</p>
                  <p className="text-sm">30-45 min</p>
                </div>
                <div className="bg-white/20 rounded-xl p-4">
                  <div className="text-3xl mb-2">✨</div>
                  <p className="font-black">POULET FRAIS</p>
                  <p className="text-sm">100% Qualité</p>
                </div>
                <div className="bg-white/20 rounded-xl p-4">
                  <div className="text-3xl mb-2">💰</div>
                  <p className="font-black">PRIX IMBATTABLES</p>
                  <p className="text-sm">Promos !</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 inline-block">
                <QRCodeSVG 
                  value="https://r-chicken.com/menu" 
                  size={100}
                  level="H"
                  fgColor="#E4002B"
                />
                <p className="text-gray-600 text-sm mt-2">Scannez pour commander</p>
              </div>

              <div className="mt-4">
                <p className="text-amber-300 font-bold text-lg">📞 +223 83 80 61 29</p>
                <p className="text-sm">📍 Baco-djicoroni Golf, Bamako</p>
                <p className="text-amber-300 text-sm mt-2">🔥 Livraison GRATUITE dès 20 000F !</p>
              </div>
            </div>
          </div>

          {/* Flyer 4 - Mini Cards (4 per page) */}
          <div className="flyer">
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-4 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <span className="text-2xl font-black text-red-600">R</span>
                    </div>
                    <div>
                      <h3 className="font-black">R-CHICKEN</h3>
                      <p className="text-amber-300 text-xs">Le Poulet Croustillant</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-white p-2 rounded-lg">
                      <QRCodeSVG 
                        value="https://r-chicken.com/menu" 
                        size={70}
                        level="H"
                        fgColor="#E4002B"
                      />
                    </div>
                    <div className="flex-1 text-xs space-y-1">
                      <p>📞 +223 83 80 61 29</p>
                      <p>📍 Baco-djicoroni Golf</p>
                      <p>🌐 r-chicken.com</p>
                      <p>📱 @rouski_chicken</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
