import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, ShoppingCart, Settings, LogOut, ChevronRight, Smartphone, Star, MapPin, Phone, Mail, Edit2, Gift, Clock, TrendingUp } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('rchicken_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [orders, setOrders] = useState([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);

  useEffect(() => {
    // Load orders
    const savedOrders = localStorage.getItem('rchicken_orders');
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders);
      setOrders(parsedOrders);
      
      // Calculate loyalty points (100 points per order)
      setLoyaltyPoints(parsedOrders.length * 100);
    }
  }, []);

  const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const pointsValue = Math.floor(loyaltyPoints * 2.5); // 100 points = 250 FCFA

  // Get tier based on points
  const getTier = () => {
    if (loyaltyPoints >= 2000) return { name: 'Diamond', color: 'bg-purple-500', textColor: 'text-purple-600' };
    if (loyaltyPoints >= 1000) return { name: 'Gold', color: 'bg-yellow-500', textColor: 'text-yellow-600' };
    if (loyaltyPoints >= 500) return { name: 'Silver', color: 'bg-gray-400', textColor: 'text-gray-600' };
    return { name: 'Bronze', color: 'bg-amber-600', textColor: 'text-amber-600' };
  };

  const tier = getTier();

  const menuItems = [
    { name: 'Mes commandes', icon: ShoppingCart, path: '/orders', badge: orders.length || null },
    { name: 'Mes favoris', icon: Package, path: '/menu' },
  ];

  return (
    <main className="pt-20 min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900">
            Mon Profil
          </h1>
          <span className={`${tier.color} text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2`}>
            <Star className="w-4 h-4" />
            {tier.name}
          </span>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Personal Info */}
          <div className="space-y-6">
            {/* Informations personnelles */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-200">
              <div className="bg-amber-50 px-6 py-4 border-b border-amber-200">
                <h2 className="font-bold text-lg flex items-center gap-2 text-gray-800">
                  <User className="w-5 h-5 text-amber-600" />
                  Informations personnelles
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <User className="w-4 h-4" />
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={user?.name || ''}
                    onChange={e => setUser({ ...user, name: e.target.value })}
                    placeholder="Votre nom complet"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <Phone className="w-4 h-4" />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={user?.phone || ''}
                    onChange={e => setUser({ ...user, phone: e.target.value })}
                    placeholder="+223 XX XX XX XX"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4" />
                    Adresse principale
                  </label>
                  <input
                    type="text"
                    value={user?.address || ''}
                    onChange={e => setUser({ ...user, address: e.target.value })}
                    placeholder="Votre adresse"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4" />
                    Adresses favorites
                  </label>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Aucune adresse favorite</span>
                    <button className="text-green-600 border border-green-600 px-3 py-1 rounded-lg text-sm font-bold hover:bg-green-50 flex items-center gap-1">
                      + Ajouter
                    </button>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <Mail className="w-4 h-4" />
                    Email (optionnel)
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    onChange={e => setUser({ ...user, email: e.target.value })}
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <button
                  onClick={() => {
                    localStorage.setItem('rchicken_user', JSON.stringify(user));
                    alert('Profil sauvegardé !');
                  }}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-5 h-5" />
                  Modifier
                </button>

                <button className="w-full border-2 border-red-200 text-red-500 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                  <LogOut className="w-5 h-5" />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Statistics */}
          <div className="space-y-6">
            {/* Mes statistiques */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-200">
              <div className="bg-amber-50 px-6 py-4 border-b border-amber-200">
                <h2 className="font-bold text-lg flex items-center gap-2 text-gray-800">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                  Mes statistiques
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Total commandes */}
                <div className="bg-amber-50 rounded-xl p-4 flex items-center justify-between">
                  <span className="font-medium text-gray-700">Total commandes</span>
                  <span className="text-2xl font-black text-amber-600">{orders.length}</span>
                </div>

                {/* Total dépensé */}
                <div className="bg-green-50 rounded-xl p-4 flex items-center justify-between">
                  <span className="font-medium text-gray-700">Total dépensé</span>
                  <span className="text-2xl font-black text-green-600">{totalSpent.toLocaleString('fr-FR')} FCFA</span>
                </div>

                {/* Points de fidélité */}
                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-purple-600" />
                      <span className="font-bold text-purple-800">Points de fidélité</span>
                    </div>
                    <span className="text-2xl font-black text-purple-600">{loyaltyPoints}</span>
                  </div>
                  <p className="text-sm text-purple-700 mb-3">
                    Valeur: <span className="font-bold">{pointsValue.toLocaleString('fr-FR')} FCFA</span>
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-purple-700">
                      <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                      100 points par commande livrée
                    </div>
                    <div className="flex items-center gap-2 text-purple-700">
                      <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">💎</span>
                      100 points = 250 FCFA de réduction
                    </div>
                    <div className="flex items-center gap-2 text-purple-700">
                      <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">🎁</span>
                      2000 points = Commande gratuite !
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dernières commandes */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-200">
              <div className="bg-amber-50 px-6 py-4 border-b border-amber-200">
                <h2 className="font-bold text-lg flex items-center gap-2 text-gray-800">
                  <Clock className="w-5 h-5 text-amber-600" />
                  Dernières commandes
                </h2>
              </div>
              
              <div className="p-6">
                {orders.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Aucune commande</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-bold text-gray-800">{order.id}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-amber-600">{order.total?.toLocaleString('fr-FR')}F</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            order.status === 'livré' ? 'bg-green-100 text-green-700' :
                            order.status === 'en attente' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {order.status || 'En attente'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {orders.length > 5 && (
                  <Link to="/orders" className="block text-center text-amber-600 font-bold mt-4 hover:underline">
                    Voir toutes les commandes →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Admin Links */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden">
          <Link
            to="/admin"
            className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#E4002B] rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-gray-900 block">Administration</span>
                <span className="text-xs text-gray-500">Gérer le restaurant</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link
            to="/mobile-preview"
            className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-gray-900 block">Version Mobile</span>
                <span className="text-xs text-gray-500">Aperçu mobile</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>
      </div>
    </main>
  );
}
