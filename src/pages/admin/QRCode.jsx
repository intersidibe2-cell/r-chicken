import { useState, useRef } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, Monitor, Smartphone, Printer, FileText, Image, Share2, ExternalLink } from 'lucide-react';

export default function AdminQRCode() {
  const [qrSize, setQrSize] = useState(256);
  const [qrColor, setQrColor] = useState('#E4002B');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const printRef = useRef();

  const siteUrl = window.location.origin;
  const menuUrl = siteUrl + '/menu';
  const cartUrl = siteUrl + '/cart';
  const promoUrl = siteUrl + '/promotions';
  const contactUrl = siteUrl + '/contact';

  const qrCodes = [
    { id: 'site', name: 'Site Web', url: siteUrl, icon: '🌐', description: 'Page d\'accueil du site' },
    { id: 'menu', name: 'Menu', url: menuUrl, icon: '📋', description: 'Voir le menu complet' },
    { id: 'cart', name: 'Commander', url: cartUrl, icon: '🛒', description: 'Commander directement' },
    { id: 'promo', name: 'Promotions', url: promoUrl, icon: '🎁', description: 'Voir les offres' },
    { id: 'contact', name: 'Contact', url: contactUrl, icon: '📞', description: 'Nous contacter' },
  ];

  const downloadQR = (id, filename) => {
    const svg = document.querySelector(`#${id} svg`);
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, img.width, img.height);
      ctx.drawImage(img, 0, 0);
      
      const a = document.createElement('a');
      a.download = `${filename}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const downloadAllQR = () => {
    qrCodes.forEach((qr, index) => {
      setTimeout(() => {
        downloadQR(`qr-${qr.id}`, `r-chicken-${qr.id}`);
      }, index * 500);
    });
  };

  const printAllQR = () => {
    const printWindow = window.open('', '_blank');
    const qrElements = qrCodes.map(qr => {
      const svg = document.querySelector(`#qr-${qr.id} svg`);
      return svg ? new XMLSerializer().serializeToString(svg) : '';
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>R-CHICKEN - QR Codes</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; }
          .qr-card { 
            border: 2px solid #E4002B; 
            border-radius: 16px; 
            padding: 20px; 
            text-align: center;
            page-break-inside: avoid;
          }
          .qr-card h2 { color: #E4002B; margin-bottom: 10px; }
          .qr-card p { color: #666; font-size: 12px; margin-bottom: 15px; }
          .qr-card svg { margin: 0 auto; display: block; }
          .url { font-size: 10px; color: #999; margin-top: 10px; word-break: break-all; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <h1 style="text-align: center; color: #E4002B; margin-bottom: 30px;">🍗 R-CHICKEN - QR Codes</h1>
        <div class="grid">
          ${qrCodes.map((qr, i) => `
            <div class="qr-card">
              <h2>${qr.icon} ${qr.name}</h2>
              <p>${qr.description}</p>
              ${qrElements[i]}
              <p class="url">${qr.url}</p>
            </div>
          `).join('')}
        </div>
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
            <h1 className="text-2xl font-black text-gray-900">📱 QR Codes</h1>
            <p className="text-gray-500 mt-1">Générez et imprimez tous vos QR codes</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={downloadAllQR}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl font-bold text-sm inline-flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Tout télécharger
            </button>
            <button
              onClick={printAllQR}
              className="kfc-button text-white px-4 py-2 rounded-xl font-bold text-sm inline-flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Imprimer tout
            </button>
          </div>
        </div>

        {/* QR Codes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map(qr => (
            <div key={qr.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="text-center mb-4">
                <span className="text-3xl">{qr.icon}</span>
                <h2 className="font-bold text-lg text-gray-900 mt-2">{qr.name}</h2>
                <p className="text-sm text-gray-500">{qr.description}</p>
              </div>
              
              <div className="flex justify-center mb-4">
                <div id={`qr-${qr.id}`} className="bg-white p-3 rounded-xl shadow-inner border">
                  <QRCodeSVG
                    value={qr.url}
                    size={180}
                    bgColor={bgColor}
                    fgColor={qrColor}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              </div>

              <div className="text-center mb-4">
                <p className="text-xs text-gray-400 truncate">{qr.url}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => downloadQR(`qr-${qr.id}`, `r-chicken-${qr.id}`)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm font-medium inline-flex items-center justify-center gap-1 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  PNG
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(qr.url)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm font-medium inline-flex items-center justify-center gap-1 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Lien
                </button>
                <button
                  onClick={() => window.open(qr.url, '_blank')}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm font-medium inline-flex items-center justify-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ouvrir
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Poster Preview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-4">🖼️ Aperçu Affiche Publicitaire</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Red Poster */}
            <div className="bg-gradient-to-br from-[#E4002B] to-[#C4001F] rounded-2xl p-8 text-center text-white">
              <h3 className="font-black text-3xl mb-2">🍗 R-CHICKEN</h3>
              <p className="text-white/80 mb-4 text-lg">Commandez en ligne !</p>
              <div className="inline-block bg-white p-4 rounded-2xl shadow-xl">
                <QRCodeSVG
                  value={siteUrl}
                  size={150}
                  bgColor="#FFFFFF"
                  fgColor="#E4002B"
                  level="H"
                />
              </div>
              <p className="text-sm text-white/60 mt-4">Scannez pour commander</p>
              <p className="text-xs text-white/40 mt-1">Livraison à Bamako 🚗</p>
            </div>

            {/* Black Poster */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 text-center text-white">
              <h3 className="font-black text-3xl mb-2">🍗 R-CHICKEN</h3>
              <p className="text-[#FFB81C] mb-4 text-lg font-bold">Le Meilleur Poulet Frit !</p>
              <div className="inline-block bg-white p-4 rounded-2xl shadow-xl">
                <QRCodeSVG
                  value={menuUrl}
                  size={150}
                  bgColor="#FFFFFF"
                  fgColor="#1A1A1A"
                  level="H"
                />
              </div>
              <p className="text-sm text-gray-400 mt-4">Scannez pour voir le menu</p>
              <p className="text-xs text-gray-500 mt-1">📱 Compatible tous téléphones</p>
            </div>
          </div>
        </div>

        {/* Customization */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-4">🎨 Personnalisation</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Taille: {qrSize}px</label>
              <input
                type="range"
                min="128"
                max="512"
                value={qrSize}
                onChange={e => setQrSize(parseInt(e.target.value))}
                className="w-full accent-[#E4002B]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Couleur QR</label>
              <div className="flex gap-2 flex-wrap">
                {['#E4002B', '#1A1A1A', '#FFB81C', '#3B82F6', '#10B981', '#8B5CF6'].map(color => (
                  <button
                    key={color}
                    onClick={() => setQrColor(color)}
                    className={`w-8 h-8 rounded-lg border-2 transition-transform ${
                      qrColor === color ? 'border-gray-900 scale-110' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Fond</label>
              <div className="flex gap-2">
                {[
                  { color: '#FFFFFF', label: 'Blanc' },
                  { color: '#F4F1E8', label: 'Crème' },
                  { color: '#1A1A1A', label: 'Noir' },
                ].map(opt => (
                  <button
                    key={opt.color}
                    onClick={() => setBgColor(opt.color)}
                    className={`w-10 h-10 rounded-lg border-2 transition-transform ${
                      bgColor === opt.color ? 'border-gray-900 scale-110' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: opt.color }}
                    title={opt.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Usage Tips */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-4">💡 Conseils d'utilisation</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <Monitor className="w-8 h-8 text-[#E4002B] mb-2" />
              <p className="font-bold text-sm">Écrans TV</p>
              <p className="text-xs text-gray-500">Affichez dans le restaurant</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <Printer className="w-8 h-8 text-[#E4002B] mb-2" />
              <p className="font-bold text-sm">Affiches</p>
              <p className="text-xs text-gray-500">Imprimez pour les tables</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <Smartphone className="w-8 h-8 text-[#E4002B] mb-2" />
              <p className="font-bold text-sm">Réseaux sociaux</p>
              <p className="text-xs text-gray-500">Partagez sur TikTok, Facebook</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <Share2 className="w-8 h-8 text-[#E4002B] mb-2" />
              <p className="font-bold text-sm">Panneaux</p>
              <p className="text-xs text-gray-500">Publicité extérieure</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}