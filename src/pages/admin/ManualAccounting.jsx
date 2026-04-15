import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Plus, TrendingUp, TrendingDown, DollarSign, Calendar, Edit, Trash2, Download, X } from 'lucide-react';

export default function ManualAccounting() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('income');
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    amount: '',
    paymentMethod: 'cash',
    notes: ''
  });

  const incomeCategories = [
    { id: 'sales_cash', name: 'Ventes Espèces', icon: '💵' },
    { id: 'sales_om', name: 'Ventes Orange Money', icon: '📱' },
    { id: 'sales_wave', name: 'Ventes Wave', icon: '📱' },
    { id: 'delivery_fees', name: 'Frais de livraison', icon: '🚗' },
    { id: 'other_income', name: 'Autres recettes', icon: '💰' },
  ];

  const expenseCategories = [
    { id: 'chicken', name: 'Poulet / Volaille', icon: '🍗' },
    { id: 'fries', name: 'Frites / Accompagnements', icon: '🍟' },
    { id: 'drinks', name: 'Boissons', icon: '🥤' },
    { id: 'sauces', name: 'Sauces / Condiments', icon: '🥫' },
    { id: 'packaging', name: 'Emballages', icon: '📦' },
    { id: 'salary', name: 'Salaires', icon: '👷' },
    { id: 'rent', name: 'Loyer', icon: '🏠' },
    { id: 'electricity', name: 'Électricité / Eau', icon: '💡' },
    { id: 'transport', name: 'Transport / Livraison', icon: '🚗' },
    { id: 'other_expense', name: 'Autres dépenses', icon: '📝' },
  ];

  useEffect(() => {
    loadEntries();
  }, [selectedDate]);

  const loadEntries = () => {
    const saved = JSON.parse(localStorage.getItem('rchicken_accounting') || '[]');
    setEntries(saved.filter(e => e.date === selectedDate));
  };

  const saveEntry = () => {
    if (!formData.category || !formData.amount) return;

    const newEntry = {
      id: Date.now(),
      type: modalType,
      category: formData.category,
      description: formData.description || getCategoryName(formData.category),
      amount: parseFloat(formData.amount),
      paymentMethod: formData.paymentMethod,
      notes: formData.notes,
      date: selectedDate,
      createdAt: new Date().toISOString()
    };

    const allEntries = JSON.parse(localStorage.getItem('rchicken_accounting') || '[]');
    allEntries.push(newEntry);
    localStorage.setItem('rchicken_accounting', JSON.stringify(allEntries));

    setFormData({ category: '', description: '', amount: '', paymentMethod: 'cash', notes: '' });
    setShowModal(false);
    loadEntries();
  };

  const deleteEntry = (id) => {
    const allEntries = JSON.parse(localStorage.getItem('rchicken_accounting') || '[]');
    const filtered = allEntries.filter(e => e.id !== id);
    localStorage.setItem('rchicken_accounting', JSON.stringify(filtered));
    loadEntries();
  };

  const getCategoryName = (categoryId) => {
    const allCategories = [...incomeCategories, ...expenseCategories];
    return allCategories.find(c => c.id === categoryId)?.name || categoryId;
  };

  const getCategoryIcon = (categoryId) => {
    const allCategories = [...incomeCategories, ...expenseCategories];
    return allCategories.find(c => c.id === categoryId)?.icon || '📝';
  };

  const incomeTotal = entries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
  const expenseTotal = entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
  const balance = incomeTotal - expenseTotal;

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('fr-FR') + 'F';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">📊 Comptabilité Manuelle</h1>
            <p className="text-gray-500 mt-1">Saisissez vos recettes et dépenses</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 font-medium"
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 opacity-80" />
              <span className="text-sm opacity-80">Recettes</span>
            </div>
            <p className="text-3xl font-black">{formatCurrency(incomeTotal)}</p>
          </div>
          
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="w-8 h-8 opacity-80" />
              <span className="text-sm opacity-80">Dépenses</span>
            </div>
            <p className="text-3xl font-black">{formatCurrency(expenseTotal)}</p>
          </div>
          
          <div className={`rounded-2xl p-6 text-white ${balance >= 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-orange-500 to-orange-600'}`}>
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 opacity-80" />
              <span className="text-sm opacity-80">Solde</span>
            </div>
            <p className="text-3xl font-black">{formatCurrency(balance)}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => openModal('income')}
            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Ajouter Recette
          </button>
          <button
            onClick={() => openModal('expense')}
            className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Ajouter Dépense
          </button>
        </div>

        {/* Entries List */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-bold text-lg">📝 Entrées du {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h2>
          </div>
          
          {entries.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>Aucune entrée pour cette date</p>
            </div>
          ) : (
            <div className="divide-y">
              {entries.map(entry => (
                <div key={entry.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      entry.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {getCategoryIcon(entry.category)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{entry.description}</p>
                      <p className="text-sm text-gray-500">
                        {getCategoryName(entry.category)} • {entry.paymentMethod === 'cash' ? 'Espèces' : entry.paymentMethod === 'om' ? 'Orange Money' : 'Wave'}
                      </p>
                      {entry.notes && <p className="text-xs text-gray-400 mt-1">{entry.notes}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-black text-lg ${entry.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {entry.type === 'income' ? '+' : '-'}{formatCurrency(entry.amount)}
                    </span>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Monthly Summary */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="font-bold text-lg mb-4">📈 Résumé du mois</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-black text-green-600">
                {formatCurrency(entries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0))}
              </p>
              <p className="text-sm text-gray-500">Ce jour</p>
            </div>
            <div>
              <p className="text-2xl font-black text-red-600">
                {formatCurrency(entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0))}
              </p>
              <p className="text-sm text-gray-500">Dépenses</p>
            </div>
            <div>
              <p className={`text-2xl font-black ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                {formatCurrency(balance)}
              </p>
              <p className="text-sm text-gray-500">Bénéfice</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Entry Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {modalType === 'income' ? '💰 Nouvelle Recette' : '💸 Nouvelle Dépense'}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Catégorie *</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                >
                  <option value="">Sélectionner...</option>
                  {(modalType === 'income' ? incomeCategories : expenseCategories).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Montant (FCFA) *</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-2xl font-bold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Description optionnelle"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Mode de paiement</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'cash', name: 'Espèces' },
                    { id: 'om', name: 'Orange Money' },
                    { id: 'wave', name: 'Wave' },
                  ].map(method => (
                    <button
                      key={method.id}
                      onClick={() => setFormData({...formData, paymentMethod: method.id})}
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                        formData.paymentMethod === method.id
                          ? 'border-[#E4002B] bg-red-50'
                          : 'border-gray-200'
                      }`}
                    >
                      {method.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  placeholder="Notes supplémentaires..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 resize-none"
                />
              </div>
            </div>

            <button
              onClick={saveEntry}
              disabled={!formData.category || !formData.amount}
              className={`w-full py-4 rounded-xl font-bold text-lg mt-6 text-white disabled:opacity-50 ${
                modalType === 'income' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              Enregistrer
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}