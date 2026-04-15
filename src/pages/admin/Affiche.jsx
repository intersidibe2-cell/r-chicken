import { useRef } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { QRCodeSVG } from 'qrcode.react';
import { Printer } from 'lucide-react';

export default function Affiche() {
  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>R-CHICKEN Affiche</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @page { size: A3 portrait; margin: 0; }
          body { margin: 0; padding: 0; font-family: system-ui, sans-serif; }
          .poster { page-break-after: always; height: 100vh; }
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
            <h1 className="text-2xl font-black text-gray-900">🖼️ Affiches Publicitaires</h1>
            <p className="text-gray-500 mt-1">Affiches à imprimer en grand format</p>
          </div>
          <button
            onClick={handlePrint}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-bold inline-flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Imprimer les affiches
          </button>
        </div>

        <div ref={printRef} className="space-y-8">
          {/* Affiche 1 - Principale */}
          <div className="poster bg-gradient-to-b from-red-600 via-red-700 to-red-800 rounded-3xl overflow-hidden shadow-2xl" style={{ minHeight: '900px' }}>
            {/* Header */}
            <div className="bg-amber-400 py-4 text-center">
              <p className="text-red-800 font-black text-xl">🔥 LIVRAISON GRATUITE DÈS 20 000 FCFA ! 🔥</p>
            </div>

            <div className="p-8 text-white text-center">
              {/* Logo */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl">
                  <span className="text-6xl font-black text-red-600">R</span>
                </div>
                <div className="text-left">
                  <h1 className="text-5xl font-black">R-CHICKEN</h1>
                  <p className="text-amber-300 text-2xl font-bold">Le Poulet Croustillant ML</p>
                </div>
              </div>

              {/* Hero Image Placeholder */}
              <div className="bg-black/30 rounded-3xl p-8 mb-8">
                <div className="bg-amber-400 rounded-full px-6 py-3 inline-block mb-4">
                  <p className="text-red-800 font-black text-2xl">À partir de 1 500 F</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-12">
                  <div className="text-8xl mb-4">🍗</div>
                  <p className="text-2xl font-bold text-amber-300">Poulet Frais & Croustillant</p>
                </div>
              </div>

              {/* Spécialités */}
              <div className="mb-8">
                <h2 className="text-3xl font-black mb-4">✨ NOS SPÉCIALITÉS ✨</h2>
                <div className="flex flex-wrap justify-center gap-3">
                  {['🍗 KFC', '🍖 Tenders', '📦 Boxes', '🥙 Shawarma', '🍔 Burger'].map((item, i) => (
                    <span key={i} className="bg-white/20 rounded-full px-6 py-3 font-bold text-lg">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Avantages */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-red-500 rounded-2xl p-6">
                  <div className="text-5xl mb-2">🚀</div>
                  <p className="font-black text-xl">LIVRAISON RAPIDE</p>
                  <p className="text-lg">30-45 min</p>
                </div>
                <div className="bg-amber-500 rounded-2xl p-6">
                  <div className="text-5xl mb-2">✨</div>
                  <p className="font-black text-xl">POULET FRAIS</p>
                  <p className="text-lg">100% Qualité</p>
                </div>
                <div className="bg-green-500 rounded-2xl p-6">
                  <div className="text-5xl mb-2">💰</div>
                  <p className="font-black text-xl">PRIX IMBATTABLES</p>
                  <p className="text-lg">Promos !</p>
                </div>
              </div>

              {/* Contact & QR */}
              <div className="bg-white rounded-3xl p-6 text-gray-800">
                <div className="flex items-center justify-center gap-8">
                  <div className="text-left">
                    <h3 className="text-red-600 font-black text-2xl mb-2">COMMANDEZ MAINTENANT !</h3>
                    <p className="text-xl font-bold">📞 +223 83 80 61 29</p>
                    <p className="text-lg">📍 Baco-djicoroni Golf, HXGV+5X7, Bamako</p>
                    <p className="text-lg">🕐 Ouvert 24h/24 - 7j/7</p>
                    <p className="text-red-600 font-bold mt-2">📱 TikTok: @rouski_chicken</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white border-4 border-red-600 rounded-2xl p-3">
                      <QRCodeSVG 
                        value="https://r-chicken.com/menu" 
                        size={120}
                        level="H"
                        fgColor="#E4002B"
                      />
                    </div>
                    <p className="text-sm font-bold text-red-600 mt-2">Scannez pour commander !</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6">
                <p className="text-amber-300 font-black text-2xl">C'EST BON, C'EST R-CHICKEN ! 🍗</p>
              </div>
            </div>
          </div>

          {/* Affiche 2 - Programme Fidélité */}
          <div className="poster bg-gradient-to-b from-amber-400 via-orange-500 to-red-500 rounded-3xl overflow-hidden shadow-2xl" style={{ minHeight: '900px' }}>
            <div className="p-8 text-white text-center">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-5xl font-black text-orange-500">R</span>
                </div>
                <div>
                  <h1 className="text-4xl font-black">R-CHICKEN</h1>
                  <p className="text-amber-200 text-xl font-bold">Le Poulet Croustillant ML</p>
                </div>
              </div>

              <div className="text-6xl mb-4">🎁</div>
              <h2 className="text-5xl font-black mb-4">PROGRAMME FIDÉLITÉ</h2>
              <p className="text-2xl font-bold mb-8">Gagnez des points à chaque commande !</p>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-3xl p-6 text-gray-800">
                  <div className="text-5xl mb-2">🍗</div>
                  <p className="text-4xl font-black text-orange-500">+100</p>
                  <p className="text-lg font-bold">Points par commande</p>
                </div>
                <div className="bg-white rounded-3xl p-6 text-gray-800">
                  <div className="text-5xl mb-2">💎</div>
                  <p className="text-4xl font-black text-orange-500">100 pts</p>
                  <p className="text-lg font-bold">= 250 FCFA</p>
                </div>
                <div className="bg-white rounded-3xl p-6 text-gray-800">
                  <div className="text-5xl mb-2">🎁</div>
                  <p className="text-4xl font-black text-orange-500">5000 pts</p>
                  <p className="text-lg font-bold">= Commande GRATUITE!</p>
                </div>
              </div>

              <div className="bg-white/20 rounded-3xl p-6 mb-8">
                <h3 className="text-2xl font-black mb-4">🏆 NIVEAUX DE FIDÉLITÉ</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white/30 rounded-xl p-4">
                    <div className="text-4xl mb-2">🥉</div>
                    <p className="font-bold">Bronze</p>
                    <p className="text-sm">0-499 pts</p>
                  </div>
                  <div className="bg-white/30 rounded-xl p-4">
                    <div className="text-4xl mb-2">🥈</div>
                    <p className="font-bold">Silver</p>
                    <p className="text-sm">500-999 pts</p>
                  </div>
                  <div className="bg-white/30 rounded-xl p-4">
                    <div className="text-4xl mb-2">👑</div>
                    <p className="font-bold">Gold</p>
                    <p className="text-sm">1000-1999 pts</p>
                  </div>
                  <div className="bg-white/30 rounded-xl p-4">
                    <div className="text-4xl mb-2">💎</div>
                    <p className="font-bold">Diamond</p>
                    <p className="text-sm">2000+ pts</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 text-gray-800 inline-block">
                <div className="flex items-center gap-6">
                  <div className="bg-white border-4 border-orange-500 rounded-2xl p-3">
                    <QRCodeSVG 
                      value="https://r-chicken.com/menu" 
                      size={100}
                      level="H"
                      fgColor="#F59E0B"
                    />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-lg">📞 +223 83 80 61 29</p>
                    <p className="text-lg">📍 Baco-djicoroni Golf</p>
                    <p className="text-orange-600 font-bold">Commencez à gagner dès maintenant!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
