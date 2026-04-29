import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Receipt, Clock, ChefHat, Package, Truck, Phone, Search } from 'lucide-react';
import { supabase } from '../supabase';

const STATUS_LABELS = {
  'en attente': { label: 'En attente', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  'en cours':   { label: 'En préparation', color: 'bg-orange-100 text-orange-700', icon: ChefHat },
  'prêt':       { label: 'Prêt', color: 'bg-blue-100 text-blue-700', icon: Package },
  'livré':      { label: 'Livré', color: 'bg-green-100 text-green-700', icon: Truck },
};

export default function Orders() {
  const [phone, setPhone] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Auto-load if phone stored
  useEffect(() => {
    const saved = localStorage.getItem('rchicken_user');
    if (saved) {
      const user = JSON.parse(saved);
      if (user.phone) {
        setInputPhone(user.phone);
        fetchOrders(user.phone);
      }
    }
  }, []);

  const fetchOrders = async (phoneNumber) => {
    setLoading(true);
    setSearched(true);
    const { data, error } = await supabase
      .from('commandes')
      .select('*')
      .eq('client_phone', phoneNumber)
      .order('created_at', { ascending: false });

    if (!error && data) setOrders(data);
    else setOrders([]);
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputPhone.trim()) {
      setPhone(inputPhone.trim());
      fetchOrders(inputPhone.trim());
    }
  };

  return (
    <main className="pt-20 min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Receipt className="w-8 h-8 text-[#E4002B]" />
          <h1 className="text-2xl font-black text-gray-900">Mes Commandes</h1>
        </div>

        {/* Search by phone */}
        <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex gap-3">
          <div className="relative flex-1">
            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={inputPhone}
              onChange={e => setInputPhone(e.target.value)}
              placeholder="Votre numéro de téléphone"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B]"
            />
          </div>
          <button
            type="submit"
            className="bg-[#E4002B] text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#C4001F]"
          >
            <Search className="w-5 h-5" />
            Rechercher
          </button>
        </form>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-4 border-[#E4002B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500">Chargement...</p>
          </div>
        )}

        {/* No orders */}
        {!loading && searched && orders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <Receipt className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-bold text-gray-600 mb-2">Aucune commande trouvée</h2>
            <p className="text-gray-400 mb-6">Aucune commande associée à ce numéro</p>
            <Link to="/menu" className="bg-[#E4002B] text-white px-6 py-3 rounded-xl font-bold inline-block hover:bg-[#C4001F]">
              Commander maintenant
            </Link>
          </div>
        )}

        {/* Orders list */}
        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 font-medium">{orders.length} commande(s) trouvée(s)</p>
            {orders.map(order => {
              const statusInfo = STATUS_LABELS[order.status] || STATUS_LABELS['en attente'];
              const StatusIcon = statusInfo.icon;
              const items = Array.isArray(order.items) ? order.items : [];
              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-black text-gray-900">{order.id}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} à {new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${statusInfo.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="border-t border-b py-3 mb-3 space-y-1">
                    {items.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.quantity}x {item.name}</span>
                        <span className="font-bold text-gray-900">{((item.price || 0) * item.quantity).toLocaleString('fr-FR')}F</span>
                      </div>
                    ))}
                    {items.length > 3 && (
                      <p className="text-xs text-gray-400">+{items.length - 3} autre(s) article(s)</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="font-black text-xl text-[#E4002B]">{(order.total || 0).toLocaleString('fr-FR')}F</p>
                    </div>
                    <Link
                      to={`/order-tracking?id=${order.id}`}
                      className="bg-[#E4002B] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#C4001F] transition-colors"
                    >
                      Suivre
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state (not searched) */}
        {!loading && !searched && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <Receipt className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-bold text-gray-600 mb-2">Retrouvez vos commandes</h2>
            <p className="text-gray-400">Entrez votre numéro de téléphone pour voir vos commandes</p>
          </div>
        )}
      </div>
    </main>
  );
}
