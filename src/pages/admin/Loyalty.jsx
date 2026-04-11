import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Star, Gift, Users, TrendingUp, Plus, Edit, Settings } from 'lucide-react';

export default function Loyalty() {
  const [pointsConfig, setPointsConfig] = useState({
    pointsPerFCFA: 0.1,
    minOrderForPoints: 1000,
    pointsExpiry: 90,
  });

  const [rewards, setRewards] = useState([
    { id: 1, name: 'Boisson gratuite', points: 100, description: 'Soda 33cl offert' },
    { id: 2, name: 'Frites gratuites', points: 200, description: 'Pot de frites offert' },
    { id: 3, name: 'Tenders x4', points: 500, description: '4 Tenders offerts' },
    { id: 4, name: 'Réduction 10%', points: 750, description: '10% sur votre commande' },
    { id: 5, name: 'Mini Box', points: 1500, description: 'Mini Box complète offerte' },
  ]);

  const [topClients] = useState([
    { id: 1, name: 'Moussa Diallo', points: 2450, orders: 28, level: 'Gold' },
    { id: 2, name: 'Fatoumata Traoré', points: 1890, orders: 22, level: 'Gold' },
    { id: 3, name: 'Ibrahim Keita', points: 1250, orders: 15, level: 'Silver' },
    { id: 4, name: 'Aminata Coulibaly', points: 890, orders: 11, level: 'Silver' },
    { id: 5, name: 'Oumar Touré', points: 450, orders: 6, level: 'Bronze' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newReward, setNewReward] = useState({ name: '', points: 0, description: '' });

  const addReward = () => {
    if (newReward.name && newReward.points > 0) {
      setRewards([...rewards, { id: Date.now(), ...newReward }]);
      setNewReward({ name: '', points: 0, description: '' });
      setShowModal(false);
    }
  };

  const getLevelColor = (level) => {
    switch(level) {
      case 'Gold': return 'bg-yellow-100 text-yellow-800';
      case 'Silver': return 'bg-gray-100 text-gray-800';
      case 'Bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">⭐ Points Fidélité</h1>
            <p className="text-gray-500 mt-1">Gérez le programme de fidélité</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="kfc-button text-white px-4 py-2 rounded-xl font-bold inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter une récompense
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl p-4 text-white">
            <Star className="w-8 h-8 mb-2" />
            <p className="text-2xl font-black">12,450</p>
            <p className="text-sm opacity-80">Points distribués</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
            <Gift className="w-8 h-8 mb-2" />
            <p className="text-2xl font-black">156</p>
            <p className="text-sm opacity-80">Récompenses utilisées</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <Users className="w-8 h-8 mb-2" />
            <p className="text-2xl font-black">89</p>
            <p className="text-sm opacity-80">Membres actifs</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <TrendingUp className="w-8 h-8 mb-2" />
            <p className="text-2xl font-black">+24%</p>
            <p className="text-sm opacity-80">Ce mois</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Rewards */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="font-bold text-lg text-gray-900 mb-4">🎁 Récompenses disponibles</h2>
            <div className="space-y-3">
              {rewards.map(reward => (
                <div key={reward.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-bold text-gray-900">{reward.name}</p>
                    <p className="text-xs text-gray-500">{reward.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                      {reward.points} pts
                    </span>
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <Edit className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Clients */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="font-bold text-lg text-gray-900 mb-4">🏆 Top Clients</h2>
            <div className="space-y-3">
              {topClients.map((client, index) => (
                <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900' :
                      index === 1 ? 'bg-gray-300 text-gray-700' :
                      index === 2 ? 'bg-orange-400 text-orange-900' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-bold text-gray-900">{client.name}</p>
                      <p className="text-xs text-gray-500">{client.orders} commandes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#E4002B]">{client.points} pts</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getLevelColor(client.level)}`}>
                      {client.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Config */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuration
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Points par FCFA</label>
              <input
                type="number"
                step="0.01"
                value={pointsConfig.pointsPerFCFA}
                onChange={e => setPointsConfig({...pointsConfig, pointsPerFCFA: parseFloat(e.target.value)})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200"
              />
              <p className="text-xs text-gray-500 mt-1">Ex: 0.1 = 1 point pour 10F</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Commande min. (FCFA)</label>
              <input
                type="number"
                value={pointsConfig.minOrderForPoints}
                onChange={e => setPointsConfig({...pointsConfig, minOrderForPoints: parseInt(e.target.value)})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200"
              />
              <p className="text-xs text-gray-500 mt-1">Montant minimum pour gagner des points</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Expiration (jours)</label>
              <input
                type="number"
                value={pointsConfig.pointsExpiry}
                onChange={e => setPointsConfig({...pointsConfig, pointsExpiry: parseInt(e.target.value)})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200"
              />
              <p className="text-xs text-gray-500 mt-1">Durée de validité des points</p>
            </div>
          </div>
          <button className="mt-6 kfc-button text-white px-6 py-2 rounded-xl font-bold">
            Enregistrer les paramètres
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Ajouter une récompense</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  value={newReward.name}
                  onChange={e => setNewReward({...newReward, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200"
                  placeholder="Ex: Boisson gratuite"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Points requis</label>
                <input
                  type="number"
                  value={newReward.points}
                  onChange={e => setNewReward({...newReward, points: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200"
                  placeholder="100"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newReward.description}
                  onChange={e => setNewReward({...newReward, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200"
                  placeholder="Description de la récompense"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl font-bold"
              >
                Annuler
              </button>
              <button
                onClick={addReward}
                className="flex-1 kfc-button text-white px-4 py-2 rounded-xl font-bold"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}