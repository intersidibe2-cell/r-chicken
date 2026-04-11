import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Edit, Trash2, X, Save, Tag, Calendar, Gift } from 'lucide-react';

const initialPromos = [
  { id: 1, code: 'BIENVENUE10', type: 'percentage', value: 10, minOrder: 5000, maxUses: 100, used: 23, active: true, expiry: '2026-12-31', description: '-10% première commande' },
  { id: 2, code: 'FAMILLE20', type: 'percentage', value: 20, minOrder: 15000, maxUses: 50, used: 12, active: true, expiry: '2026-06-30', description: '-20% pour les familles (dès 15000F)' },
  { id: 3, code: 'LIVRAISON0', type: 'free_delivery', value: 0, minOrder: 10000, maxUses: 200, used: 89, active: true, expiry: '2026-08-31', description: 'Livraison gratuite dès 10000F' },
  { id: 4, code: 'NOEL2025', type: 'percentage', value: 15, minOrder: 8000, maxUses: 100, used: 100, active: false, expiry: '2025-12-31', description: 'Promo Noël - Expirée' },
];

export default function AdminPromotions() {
  const [promos, setPromos] = useState(initialPromos);
  const [showModal, setShowModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minOrder: '',
    maxUses: '',
    expiry: '',
    description: '',
    active: true,
  });

  const openModal = (promo = null) => {
    if (promo) {
      setEditingPromo(promo);
      setFormData({
        code: promo.code,
        type: promo.type,
        value: promo.value.toString(),
        minOrder: promo.minOrder.toString(),
        maxUses: promo.maxUses.toString(),
        expiry: promo.expiry,
        description: promo.description,
        active: promo.active,
      });
    } else {
      setEditingPromo(null);
      setFormData({
        code: '',
        type: 'percentage',
        value: '',
        minOrder: '',
        maxUses: '',
        expiry: '',
        description: '',
        active: true,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const promoData = {
      id: editingPromo ? editingPromo.id : Date.now(),
      code: formData.code.toUpperCase(),
      type: formData.type,
      value: parseInt(formData.value) || 0,
      minOrder: parseInt(formData.minOrder) || 0,
      maxUses: parseInt(formData.maxUses) || 0,
      used: editingPromo ? editingPromo.used : 0,
      expiry: formData.expiry,
      description: formData.description,
      active: formData.active,
    };

    if (editingPromo) {
      setPromos(prev => prev.map(p => p.id === editingPromo.id ? promoData : p));
    } else {
      setPromos(prev => [...prev, promoData]);
    }
    setShowModal(false);
    setEditingPromo(null);
  };

  const deletePromo = (id) => {
    if (window.confirm('Supprimer cette promotion ?')) {
      setPromos(prev => prev.filter(p => p.id !== id));
    }
  };

  const toggleActive = (id) => {
    setPromos(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Gestion des Promotions</h1>
            <p className="text-gray-500 mt-1">{promos.length} promotions configurées</p>
          </div>
          <button
            onClick={() => openModal()}
            className="kfc-button text-white px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouvelle promotion
          </button>
        </div>

        {/* Promo Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {promos.map(promo => (
            <div key={promo.id} className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden ${promo.active ? 'border-green-200' : 'border-gray-200'}`}>
              <div className={`p-4 ${promo.active ? 'bg-gradient-to-r from-[#E4002B] to-[#C4001F]' : 'bg-gray-200'} text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5" />
                    <span className="font-black text-xl tracking-wider">{promo.code}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${promo.active ? 'bg-green-400 text-green-900' : 'bg-gray-400 text-gray-700'}`}>
                    {promo.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 mb-4">{promo.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="font-bold text-sm">
                      {promo.type === 'percentage' ? `${promo.value}% de réduction` :
                       promo.type === 'fixed' ? `${promo.value}F de réduction` :
                       'Livraison gratuite'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Commande min.</p>
                    <p className="font-bold text-sm">{promo.minOrder.toLocaleString('fr-FR')}F</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Utilisations</p>
                    <p className="font-bold text-sm">{promo.used} / {promo.maxUses}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Expiration</p>
                    <p className="font-bold text-sm">{promo.expiry}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#E4002B] h-2 rounded-full transition-all"
                      style={{ width: `${(promo.used / promo.maxUses) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleActive(promo.id)}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                      promo.active
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {promo.active ? 'Désactiver' : 'Activer'}
                  </button>
                  <button
                    onClick={() => openModal(promo)}
                    className="px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deletePromo(promo.id)}
                    className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-black text-gray-900">
                  {editingPromo ? 'Modifier la promotion' : 'Nouvelle promotion'}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Code promo</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B] uppercase font-bold tracking-wider"
                    placeholder="EX: PROMO20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Type de réduction</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B] bg-white"
                  >
                    <option value="percentage">Pourcentage (%)</option>
                    <option value="fixed">Montant fixe (FCFA)</option>
                    <option value="free_delivery">Livraison gratuite</option>
                  </select>
                </div>

                {formData.type !== 'free_delivery' && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      {formData.type === 'percentage' ? 'Pourcentage (%)' : 'Montant (FCFA)'}
                    </label>
                    <input
                      type="number"
                      value={formData.value}
                      onChange={e => setFormData({ ...formData, value: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B]"
                      placeholder="10"
                      required
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Commande minimum (FCFA)</label>
                    <input
                      type="number"
                      value={formData.minOrder}
                      onChange={e => setFormData({ ...formData, minOrder: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B]"
                      placeholder="5000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Utilisations max</label>
                    <input
                      type="number"
                      value={formData.maxUses}
                      onChange={e => setFormData({ ...formData, maxUses: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B]"
                      placeholder="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Date d'expiration</label>
                  <input
                    type="date"
                    value={formData.expiry}
                    onChange={e => setFormData({ ...formData, expiry: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B]"
                    placeholder="-10% sur votre commande..."
                    required
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={e => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 text-[#E4002B] rounded"
                  />
                  <span className="text-sm font-medium">Promotion active</span>
                </label>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 kfc-button text-white px-4 py-3 rounded-xl font-bold inline-flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editingPromo ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
