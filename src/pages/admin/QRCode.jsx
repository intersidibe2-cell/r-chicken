import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, Monitor, Smartphone, Printer } from 'lucide-react';

export default function AdminQRCode() {
  const [qrSize, setQrSize] = useState(256);
  const [qrColor, setQrColor] = useState('#E4002B');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [showPreview, setShowPreview] = useState(true);

  const menuUrl = window.location.origin + '/menu';
  const homeUrl = window.location.origin;

  const downloadQR = (url, filename) => {
    const canvas = document.createElement('canvas');
    const svg = document.querySelector(`#${filename} svg`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvasEl = document.createElement('canvas');
    const ctx = canvasEl.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvasEl.width = img.width;
      canvasEl.height = img.height;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, img.width, img.height);
      ctx.drawImage(img, 0, 0);
      const a = document.createElement('a');
      a.download = `${filename}.png`;
      a.href = canvasEl.toDataURL('image/png');
      a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">QR Code du Menu</h1>
          <p className="text-gray-500 mt-1">Générez des QR codes pour l'affichage en restaurant</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* QR Code Generator */}
          <div className="space-y-6">
            {/* Menu QR Code */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-lg text-gray-900 mb-4">QR Code - Menu</h2>
              <div className="flex justify-center mb-6">
                <div id="menu-qr" className="bg-white p-4 rounded-2xl shadow-lg">
                  <QRCodeSVG
                    value={menuUrl}
                    size={qrSize}
                    bgColor={bgColor}
                    fgColor={qrColor}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">{menuUrl}</p>
                <button
                  onClick={() => downloadQR(menuUrl, 'menu-qr')}
                  className="kfc-button text-white px-6 py-2.5 rounded-xl font-bold inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Télécharger le QR Code
                </button>
              </div>
            </div>

            {/* Customization */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-lg text-gray-900 mb-4">Personnalisation</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Taille: {qrSize}px</label>
                  <input
                    type="range"
                    min="128"
                    max="512"
                    value={qrSize}
                    onChange={e => setQrSize(parseInt(e.target.value))}
                    className="w-full accent-[#E4002B]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Couleur QR</label>
                    <div className="flex gap-2">
                      {['#E4002B', '#1A1A1A', '#FFB81C', '#3B82F6', '#10B981'].map(color => (
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
                    <label className="block text-sm font-bold text-gray-700 mb-1">Fond</label>
                    <div className="flex gap-2">
                      {[
                        { color: '#FFFFFF', label: 'Blanc' },
                        { color: '#F4F1E8', label: 'Crème' },
                        { color: '#1A1A1A', label: 'Noir' },
                      ].map(opt => (
                        <button
                          key={opt.color}
                          onClick={() => setBgColor(opt.color)}
                          className={`w-8 h-8 rounded-lg border-2 transition-transform ${
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
            </div>
          </div>

          {/* Preview & Usage */}
          <div className="space-y-6">
            {/* Preview Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-lg text-gray-900 mb-4">Aperçu - Affiche Restaurant</h2>
              <div className="bg-gradient-to-br from-[#E4002B] to-[#C4001F] rounded-2xl p-8 text-center text-white">
                <h3 className="font-black text-2xl mb-2">🍗 R-CHICKEN</h3>
                <p className="text-white/80 mb-6">Scannez pour voir notre menu</p>
                <div className="inline-block bg-white p-4 rounded-2xl">
                  <QRCodeSVG
                    value={menuUrl}
                    size={180}
                    bgColor="#FFFFFF"
                    fgColor={qrColor}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <p className="text-sm text-white/60 mt-4">Menu disponible sur r-chicken.com</p>
              </div>
            </div>

            {/* Usage Tips */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-lg text-gray-900 mb-4">💡 Conseils d'utilisation</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Monitor className="w-5 h-5 text-[#E4002B] mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Écrans TV</p>
                    <p className="text-xs text-gray-500">Affichez le QR code sur un écran dans le restaurant</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Printer className="w-5 h-5 text-[#E4002B] mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Affiches imprimées</p>
                    <p className="text-xs text-gray-500">Imprimez et placez sur les tables et à l'entrée</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-[#E4002B] mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Réseaux sociaux</p>
                    <p className="text-xs text-gray-500">Partagez le QR code sur TikTok, Facebook, WhatsApp</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Copy Link */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-lg text-gray-900 mb-4">Lien direct du menu</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={menuUrl}
                  readOnly
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(menuUrl)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
