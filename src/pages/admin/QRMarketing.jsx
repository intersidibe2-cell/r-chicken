import { useRef } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, Smartphone, ShoppingCart, Gift, Star } from 'lucide-react';

export default function QRMarketing() {
  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>R-CHICKEN QR Marketing</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @page { size: A4; margin: 0; }
          body { margin: 0; padding: 20px; font-family: system-ui, sans-serif; }
          .print-container { max-width: 800px; margin: 0 auto; }
        </style>
      </head>
      <body>
        <div class="print-container">${printContent}</div>
      </body>
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
            <h1 className="text-2xl font-black text-gray-900">📱 QR Marketing</h1>
            <p className="text-gray-500 mt-1">QR codes pour vos supports marketing</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-bold inline-flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Imprimer
            </button>
          </div>
        </div>

        <div ref={printRef} className="print-container">
          {/* QR Code Card - Order */}
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-3xl p-8 text-white mb-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
                  <span className="text-4xl font-black text-red-600">R</span>
                </div>
                <div>
                  <h2 className="text-3xl font-black">R-CHICKEN</h2>
                  <p className="text-amber-300 font-bold">Le Poulet Croustillant ML</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 text-center mb-6">
              <h3 className="text-red-600 font-black text-2xl mb-4">📱 SCANNEZ & COMMANDEZ !</h3>
              <p className="text-gray-600 mb-4">Votre poulet préféré en 2 clics</p>
              <div className="inline-block p-4 bg-white border-4 border-red-600 rounded-2xl">
                <QRCodeSVG 
                  value="https://r-chicken.com/menu" 
                  size={200}
                  level="H"
                  includeMargin={false}
                  fgColor="#E4002B"
                />
              </div>
              <p className="text-gray-500 mt-4 text-sm">Ou visitez directement :</p>
              <p className="text-red-600 font-bold text-lg">https://r-chicken.com</p>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div className="bg-white/20 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">🚚</div>
                <p className="text-xs font-bold">Livraison Express</p>
                <p className="text-xs opacity-80">30-45 min</p>
              </div>
              <div className="bg-white/20 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">🍗</div>
                <p className="text-xs font-bold">100% Frais</p>
                <p className="text-xs opacity-80">Qualité Premium</p>
              </div>
              <div className="bg-white/20 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">💳</div>
                <p className="text-xs font-bold">Paiement Facile</p>
                <p className="text-xs opacity-80">Cash, OM, Wave</p>
              </div>
              <div className="bg-white/20 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">🎁</div>
                <p className="text-xs font-bold">Promos</p>
                <p className="text-xs opacity-80">Régulières</p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-amber-300 font-bold">📍 Baco-djicoroni Golf, Bamako</p>
              <p className="text-white font-black text-xl mt-2">📞 +223 83 80 61 29</p>
              <p className="text-sm opacity-80 mt-1">Ouvert 24h/24 - 7j/7</p>
              <p className="text-amber-300 text-sm mt-2">🔥 Livraison GRATUITE dès 20 000F !</p>
            </div>
          </div>

          {/* Small QR Cards - 4 per page */}
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-4 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-black text-red-600">R</span>
                  </div>
                  <div>
                    <h3 className="font-black text-lg">R-CHICKEN</h3>
                    <p className="text-amber-300 text-xs">Le Poulet Croustillant</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-white p-2 rounded-lg">
                    <QRCodeSVG 
                      value="https://r-chicken.com/menu" 
                      size={80}
                      level="H"
                      fgColor="#E4002B"
                    />
                  </div>
                  <div className="flex-1 text-xs space-y-1">
                    <p className="flex items-center gap-1">📞 +223 83 80 61 29</p>
                    <p className="flex items-center gap-1">📍 Baco-djicoroni Golf</p>
                    <p className="flex items-center gap-1">🌐 r-chicken.com</p>
                    <p className="flex items-center gap-1">📱 @rouski_chicken</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
