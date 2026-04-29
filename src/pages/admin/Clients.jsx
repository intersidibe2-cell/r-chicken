import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Users, Search, Eye, ShoppingBag, Star, Phone, MapPin } from 'lucide-react';

export default function Clients() {
  const [clients] = useState([
    { id: 1, name: 'Moussa Diallo', phone: '83 12 34 56', address: 'Baco-djicoroni', orders: 28, totalSpent: 245000, lastOrder: '2024-01-15', points: 2450 },
    { id: 2, name: 'Fatoumata Traoré', phone: '79 23 45 67', address: 'Hamdallaye ACI', orders: 22, totalSpent: 189000, lastOrder: '2024-01-14', points: 1890 },
    { id: 3, name: 'Ibrahim Keita', phone: '65 34 56 78', address: 'Badalabougou', orders: 15, totalSpent: 125000, lastOrder: '2024-01-13', points: 1250 },
    { id: 4, name: 'Aminata Coulibaly', phone: '90 45 67 89', address: 'Hippodrome', orders: 11, totalSpent: 89000, lastOrder: '2024-01-12', points: 890 },
    { id: 5, name: 'Oumar Touré', phone: '76 56 78 90', address: 'Sotuba', orders: 6, totalSpent: 45000, lastOrder: '2024-01-10', points: 450 },
    { id: 6, name: 'Aïssata Maïga', phone: '82 67 89 01', address: 'Kalaban Coura', orders: 4, totalSpent: 32000, lastOrder: '2024-01-08', points: 320 },
    { id: 7, name: 'Sékou Camara', phone: '70 78 90 12', address: 'Djikoroni', orders: 3, totalSpent: 18000, lastOrder: '2024-01-05', points: 180 },
    { id: 8, name: 'Kadiatou Sangaré', phone: '95 89 01 23', address: 'Bamako-Coura', orders: 2, totalSpent: 12000, lastOrder: '2024-01-03', points: 120 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const totalClients = clients.length;
  const totalRevenue = clients.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue = totalRevenue / clients.reduce((sum, c) => sum + c.orders, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">👥 Clients</h1>
          <p className="text-gray-500 mt-1">Gérez votre base de clients</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <Users className="w-8 h-8 text-blue-500 mb-2" />
            <p className="text-2xl font-black text-gray-900">{totalClients}</p>
            <p className="text-sm text-gray-500">Total clients</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <p className="text-2xl font-black text-green-600">{(totalRevenue / 1000).toFixed(0)}kF</p>
            <p className="text-sm text-gray-500">Chiffre clients</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <p className="text-2xl font-black text-purple-600">{Math.round(avgOrderValue || 0).toLocaleString()}F</p>
            <p className="text-sm text-gray-500">Panier moyen</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <p className="text-2xl font-black text-orange-600">3</p>
            <p className="text-sm text-gray-500">Nouveaux cette semaine</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm border p-4">
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou téléphone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-transparent flex-1 outline-none text-sm"
            />
          </div>
        </div>

        {/* Clients List */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Client</th>
                  <th className="text-left px-4 py-3 text-sm font-bold text-gray-600 hidden md:table-cell">Adresse</th>
                  <th className="text-center px-4 py-3 text-sm font-bold text-gray-600">Commandes</th>
                  <th className="text-center px-4 py-3 text-sm font-bold text-gray-600 hidden md:table-cell">Points</th>
                  <th className="text-right px-4 py-3 text-sm font-bold text-gray-600">Total</th>
                  <th className="text-center px-4 py-3 text-sm font-bold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredClients.map(client => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#E4002B] rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{client.name}</p>
                          <p className="text-xs text-gray-500">{client.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm hidden md:table-cell">
                      {client.address}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm font-bold">
                        {client.orders}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-sm font-bold">
                        {client.points}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-[#E4002B]">
                      {(client.totalSpent || 0).toLocaleString()}F
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => setSelectedClient(client)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Client Detail Modal */}
        {selectedClient && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-[#E4002B] rounded-full flex items-center justify-center text-white font-black text-2xl mx-auto mb-3">
                  {selectedClient.name.charAt(0)}
                </div>
                <h2 className="text-xl font-bold">{selectedClient.name}</h2>
                <p className="text-gray-500">Client depuis 2024</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>{selectedClient.phone}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>{selectedClient.address}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <ShoppingBag className="w-5 h-5 text-gray-400" />
                  <span>{selectedClient.orders} commandes</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>{selectedClient.points} points fidélité</span>
                </div>
              </div>

              <div className="bg-[#E4002B] text-white rounded-xl p-4 text-center mb-4">
                <p className="text-sm opacity-80">Total dépensé</p>
                <p className="text-3xl font-black">{(selectedClient.totalSpent || 0).toLocaleString()}F</p>
              </div>

              <button
                onClick={() => setSelectedClient(null)}
                className="w-full bg-gray-100 hover:bg-gray-200 py-3 rounded-xl font-bold transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}