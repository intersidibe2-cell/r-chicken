import { Gift, Tag, Users, Trophy } from 'lucide-react';

export default function Promotions() {
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
          <div className="bg-gradient-to-br from-[#E4002B] to-[#C4001F] rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Tag className="w-6 h-6" />
              </div>
              <h3 className="font-black text-xl">Code Promo Bienvenue</h3>
            </div>
            <p className="text-white/80 mb-4">
              -10% sur votre première commande avec le code BIENVENUE10
            </p>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <p className="font-black text-2xl tracking-wider">BIENVENUE10</p>
            </div>
          </div>

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
            <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-black hover:bg-yellow-400 hover:text-black transition-colors">
              PARRAINER UN AMI
            </button>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="font-black text-xl">Programme Fidélité</h3>
            </div>
            <p className="text-white/80 mb-4">
              Cumulez des points à chaque commande et échangez-les contre des plats gratuits !
            </p>
            <button className="bg-white text-orange-600 px-6 py-3 rounded-xl font-black hover:bg-yellow-400 hover:text-black transition-colors">
              VOIR MES POINTS
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
