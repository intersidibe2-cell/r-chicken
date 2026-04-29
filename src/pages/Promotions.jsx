import { Link } from 'react-router-dom';
import { Gift, Tag, Users, Trophy, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Promotions() {
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('rchicken_user');
    if (saved) {
      const user = JSON.parse(saved);
      const phone = user.phone || '';
      if (phone) {
        setReferralCode('RC-' + phone.slice(-6));
        return;
      }
    }
    setReferralCode('RCHICKEN-' + Math.random().toString(36).substring(2, 8).toUpperCase());
  }, []);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="pt-20 min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-[#E4002B]/10 text-[#E4002B] px-4 py-2 rounded-full mb-3">
            <Gift className="w-5 h-5" />
            <span className="text-sm font-bold">PROMOTIONS</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-3">
            Nos <span className="text-[#E4002B]">Offres Spéciales</span>
          </h1>
          <p className="text-lg text-gray-600">Économisez en commandant chez R-CHICKEN !</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Code Promo */}
          <div className="bg-gradient-to-br from-[#E4002B] to-[#C4001F] rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Tag className="w-6 h-6" />
              </div>
              <h3 className="font-black text-xl">Code Promo Bienvenue</h3>
            </div>
            <p className="text-white/80 mb-4">
              -500F sur votre première commande avec le code BIENVENUE
            </p>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <p className="font-black text-2xl tracking-wider">BIENVENUE</p>
            </div>
          </div>

          {/* Parrainage */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-black text-xl">Parrainage</h3>
            </div>
            <p className="text-white/80 mb-4">
              Parrainez un ami et recevez 2 000F de réduction chacun !
            </p>
            <div className="bg-white/20 rounded-lg p-3 mb-3 flex items-center justify-between">
              <p className="font-black text-lg">{referralCode}</p>
              <button 
                onClick={copyReferralCode}
                className="bg-white/30 hover:bg-white/40 p-2 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <Link 
              to="/profile"
              className="block w-full bg-white text-blue-600 px-6 py-3 rounded-xl font-black hover:bg-yellow-400 hover:text-black transition-colors text-center"
            >
              PARRAINER UN AMI
            </Link>
          </div>

          {/* Programme Fidélité */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="font-black text-xl">Programme Fidélité</h3>
            </div>
            <p className="text-white/80 mb-4">
              Cumulez des points à chaque commande et échangez-les contre des plats gratuits !
            </p>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-white/20 rounded-xl p-4 text-center">
                <p className="text-3xl mb-1">🍗</p>
                <p className="font-black text-xl">+100</p>
                <p className="text-sm">Points/commande</p>
              </div>
              <div className="bg-white/20 rounded-xl p-4 text-center">
                <p className="text-3xl mb-1">💎</p>
                <p className="font-black text-xl">100 pts</p>
                <p className="text-sm">= 250 FCFA</p>
              </div>
              <div className="bg-white/20 rounded-xl p-4 text-center">
                <p className="text-3xl mb-1">🎁</p>
                <p className="font-black text-xl">2000 pts</p>
                <p className="text-sm">= Commande gratuite</p>
              </div>
            </div>
            <Link 
              to="/profile"
              className="block w-full bg-white text-orange-600 px-6 py-3 rounded-xl font-black hover:bg-yellow-400 hover:text-black transition-colors text-center"
            >
              VOIR MES POINTS
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
