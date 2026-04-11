import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Package, Plus, AlertTriangle, TrendingDown, TrendingUp, Search, Edit } from 'lucide-react';

export default function Inventory() {
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Poulet (kg)', stock: 45, unit: 'kg', minStock: 20, status: 'ok' },
    { id: 2, name: 'Huile de friture (L)', stock: 15, unit: 'L', minStock: 10, status: 'ok' },
    { id: 3, name: 'Pain burger', stock: 8, unit: 'pièces', minStock: 50, status: 'low' },
    { id: 4, name: 'Fromage tranché', stock: 5, unit: 'paquets', minStock: 10, status: 'low' },
    { id: 5, name: 'Laitue', stock: 25, unit: 'pièces', minStock: 15, status: 'ok' },
    { id: 6, name: 'Tomates', stock: 30, unit: 'kg', minStock: 10, status: 'ok' },
    { id: 7, name: 'Sauce ketchup', stock: 8, unit: 'bouteilles', minStock: 5, status: 'ok' },
    { id: 8, name: 'Sauce mayonnaise', stock: 3, unit: 'bouteilles', minStock: 5, status: 'low' },
    { id: 9, name: 'Frites surgelées', stock: 20, unit: 'kg', minStock: 15, status: 'ok' },
    { id: 10, name: 'Coca-Cola (33cl)', stock: 48, unit: 'canettes', minStock: 30, status: 'ok' },
  ]);

  const [movements, setMovements] = useState([
    { id: 1, item: 'Poulet (kg)', type: 'in', quantity: 20, date: '2024-01-15 08:00', note: 'Livraison fournisseur' },
    { id: 2, item: 'Pain burger', type: 'out', quantity: 30, date: '2024-01-15 12:30', note: 'Utilisation cuisine' },
    { id: 3, item: 'Frites surgelées', type: 'out', quantity: 5, date: '2024-01-15 14:00', note: 'Commande #156' },
  ]);

  const lowStockItems = inventory.filter(item => item.stock < item.minStock);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">📦 Inventaire & Stocks</h1>
            <p className="text-gray-500 mt-1">Gérez vos stocks de matières premières</p>
          </div>
          <button className="kfc-button text-white px-4 py-2 rounded-xl font-bold inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nouvelle entrée
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <p className="text-2xl font-black text-gray-900">{inventory.length}</p>
            <p className="text-sm text-gray-500">Produits</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <p className="text-2xl font-black text-green-600">{inventory.filter(i => i.status === 'ok').length}</p>
            <p className="text-sm text-gray-500">En stock</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <p className="text-2xl font-black text-orange-600">{lowStockItems.length}</p>
            <p className="text-sm text-gray-500">Stock bas</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <p className="text-2xl font-black text-red-600">{inventory.filter(i => i.stock === 0).length}</p>
            <p className="text-sm text-gray-500">Rupture</p>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h2 className="font-bold text-orange-800">Stock bas - Réapprovisionnement nécessaire</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {lowStockItems.map(item => (
                <span key={item.id} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  {item.name} ({item.stock} {item.unit})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Inventory Table */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              className="flex-1 outline-none text-sm"
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Produit</th>
                  <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Stock</th>
                  <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Minimum</th>
                  <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Statut</th>
                  <th className="text-left px-4 py-3 text-sm font-bold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {inventory.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold">{item.stock}</span> {item.unit}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {item.minStock} {item.unit}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                        item.stock === 0 ? 'bg-red-100 text-red-700' :
                        item.stock < item.minStock ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {item.stock === 0 ? 'Rupture' : item.stock < item.minStock ? 'Stock bas' : 'OK'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Movements */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-4">📊 Mouvements récents</h2>
          <div className="space-y-3">
            {movements.map(mov => (
              <div key={mov.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  {mov.type === 'in' ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{mov.item}</p>
                    <p className="text-xs text-gray-500">{mov.note}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${mov.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                    {mov.type === 'in' ? '+' : '-'}{mov.quantity}
                  </p>
                  <p className="text-xs text-gray-500">{mov.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}