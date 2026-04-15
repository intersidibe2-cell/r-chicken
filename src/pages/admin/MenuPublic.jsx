import { useRef } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { QRCodeSVG } from 'qrcode.react';
import { Printer } from 'lucide-react';
import { menuData } from '../../data/menu';

export default function MenuPublic() {
  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>R-CHICKEN Menu</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @page { size: A3 portrait; margin: 0; }
          body { margin: 0; padding: 0; font-family: system-ui, sans-serif; }
          .menu-page { page-break-after: always; }
          .product-card { break-inside: avoid; }
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
            <h1 className="text-2xl font-black text-gray-900">📋 Menu Public</h1>
            <p className="text-gray-500 mt-1">Menu à imprimer pour affichage</p>
          </div>
          <button
            onClick={handlePrint}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-bold inline-flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Imprimer le menu
          </button>
        </div>

        <div ref={printRef}>
          <div className="menu-page bg-gradient-to-b from-red-600 to-red-700 rounded-3xl overflow-hidden shadow-2xl" style={{ minHeight: '1200px' }}>
            {/* Header */}
            <div className="bg-amber-400 py-4 text-center">
              <p className="text-red-800 font-black text-xl">🔥 LIVRAISON GRATUITE DÈS 20 000 FCFA ! 🔥</p>
            </div>

            <div className="p-6 text-white">
              {/* Logo */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-4xl font-black text-red-600">R</span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-black">R-CHICKEN</h1>
                    <p className="text-amber-300 font-bold">Le Poulet Croustillant ML</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">📞 +223 83 80 61 29</p>
                  <p className="text-sm">📍 Baco-djicoroni Golf, Bamako</p>
                  <p className="text-sm">🌐 r-chicken.com</p>
                </div>
              </div>

              {/* Menu Grid */}
              <div className="grid grid-cols-3 gap-4">
                {menuData.categories.map(category => (
                  <div key={category.id} className="bg-white/10 rounded-2xl p-4">
                    <h2 className="text-xl font-black text-amber-300 mb-3 flex items-center gap-2">
                      <span>{category.icon}</span>
                      {category.name}
                    </h2>
                    <div className="space-y-2">
                      {category.items.map(item => (
                        <div key={item.id} className="product-card bg-white/10 rounded-xl p-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-bold text-sm">{item.name}</h3>
                              <p className="text-xs text-white/70 line-clamp-1">{item.description}</p>
                            </div>
                            <span className="text-amber-300 font-black text-sm ml-2">
                              {item.price.toLocaleString('fr-FR')}F
                            </span>
                          </div>
                          {item.sizes && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {item.sizes.map((size, i) => (
                                <span key={i} className="text-xs bg-white/20 px-2 py-0.5 rounded">
                                  {size.name}: {size.price.toLocaleString('fr-FR')}F
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-6 bg-white rounded-2xl p-4 text-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-red-600">💳 Paiement accepté:</p>
                    <p className="text-sm">Cash • Orange Money • Wave • Sarali</p>
                    <p className="text-sm mt-1">🕐 Ouvert 24h/24 - 7j/7</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white border-4 border-red-600 rounded-xl p-2 inline-block">
                      <QRCodeSVG 
                        value="https://r-chicken.com/menu" 
                        size={80}
                        level="H"
                        fgColor="#E4002B"
                      />
                    </div>
                    <p className="text-xs font-bold text-red-600 mt-1">Commandez en ligne!</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">🎁 Programme Fidélité</p>
                    <p className="text-sm">+100 pts par commande</p>
                    <p className="text-sm">5000 pts = Commande gratuite!</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-amber-300 font-black text-xl">C'EST BON, C'EST R-CHICKEN ! 🍗</p>
                <p className="text-sm">📱 TikTok: @rouski_chicken</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
