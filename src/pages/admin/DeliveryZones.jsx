import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { MapPin, Plus, Truck, Edit, Trash2 } from 'lucide-react';

export default function DeliveryZones() {
  const [zones, setZones] = useState([
    { id: 1, name: 'Baco-djicoroni', price: 1000, time: '15-20 min', active: true },
    { id: 2, name: 'Hamdallaye ACI 2000', price: 1500, time: '20-25 min', active: true },
    { id: 3, name: 'Badalabougou', price: 1500, time: '20-25 min', active: true },
    { id: 4, name: 'Hippodrome', price: 2000, time: '25-30 min', active: true },
    { id: 5, name: 'Sotuba', price: 2000, time: '25-30 min', active: true },
    { id: 6, name: 'Kalaban Coura', price: 2500, time: '30-35 min', active: true },
    { id: 7, name: 'Sénou (Aéroport)', price: 3000, time: '35-45 min', active: false },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newZone, setNewZone] = useState({ name: '', price: 1000, time: '20-30 min' });

  const addZone = () => {
    if (newZone.name) {
      setZones([...zones, { id: Date.now(), ...newZone, active: true }]);
      setNewZone({ name: '', price: 1000, time: '20-30 min' });
      setShowModal(false);
    }
  };

  const toggleZone = (id) => {
    setZones(zones.map(z => z.id === id ? { ...z, active: !z.active } : z));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">🚚 Zones de Livraison</h1>
            <p className="text-gray-500 mt-1">Définissez vos zones et tarifs de livraison</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="kfc-button text-white px-4 py-2 rounded-xl font-bold inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter une zone
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <p className="text-2xl font-black text-gray-900">{zones.length}</p>
            <p className="text-sm text-gray-500">Total zones</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <p className="text-2xl font-black text-green-600">{zones.filter(z => z.active).length}</p>
            <p className="text-sm text-gray-500">Actives</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <p className="text-2xl font-black text-blue-600">{zones.filter(z => z.active).length > 0 ? Math.min(...zones.filter(z => z.active).map(z => z.price ?? 0)).toLocaleString() : 0}F</p>
            <p className="text-sm text-gray-500">Livraison min</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <p className="text-2xl font-black text-purple-600">{zones.filter(z => z.active).length > 0 ? Math.max(...zones.filter(z => z.active).map(z => z.price ?? 0)).toLocaleString() : 0}F</p>
            <p className="text-sm text-gray-500">Livraison max</p>
          </div>
        </div>

        {/* Free Delivery Banner */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-xl mb-1">🎉 Livraison Gratuite</h2>
              <p className="text-white/80">Pour toute commande supérieure à 20 000F</p>
            </div>
            <Truck className="w-12 h-12 opacity-50" />
          </div>
        </div>

        {/* Zones Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {zones.map(zone => (
            <div 
              key={zone.id} 
              className={`bg-white rounded-2xl shadow-sm border-2 p-5 transition-all ${
                zone.active ? 'border-green-200' : 'border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#E4002B]" />
                  <h3 className="font-bold text-gray-900">{zone.name}</h3>
                </div>
                <button
                  onClick={() => toggleZone(zone.id)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    zone.active ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    zone.active ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-black text-[#E4002B]">{(zone.price ?? 0).toLocaleString()}F</p>
                  <p className="text-xs text-gray-500">Frais de livraison</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-700">{zone.time}</p>
                  <p className="text-xs text-gray-500">Temps estimé</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm font-medium inline-flex items-center justify-center gap-1 transition-colors">
                  <Edit className="w-4 h-4" />
                  Modifier
                </button>
                <button className="bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg text-sm font-medium text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Map Placeholder */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-4">🗺️ Carte des zones</h2>
          <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Carte interactive des zones de livraison</p>
              <p className="text-sm">Bamako, Mali</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Ajouter une zone</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nom de la zone</label>
                <input
                  type="text"
                  value={newZone.name}
                  onChange={e => setNewZone({...newZone, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200"
                  placeholder="Ex: Djikoroni"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Prix de livraison (FCFA)</label>
                <input
                  type="number"
                  value={newZone.price}
                  onChange={e => setNewZone({...newZone, price: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Temps estimé</label>
                <select
                  value={newZone.time}
                  onChange={e => setNewZone({...newZone, time: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200"
                >
                  <option value="15-20 min">15-20 min</option>
                  <option value="20-30 min">20-30 min</option>
                  <option value="30-45 min">30-45 min</option>
                  <option value="45-60 min">45-60 min</option>
                </select>
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
                onClick={addZone}
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
