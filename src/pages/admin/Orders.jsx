import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { supabase } from '../../supabase';
import { Search, CheckCircle, Clock, Truck, Phone } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('commandes')
      .select('*')
      .order('created_at', { ascending: false });

    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    await supabase
      .from('commandes')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    loadOrders();
  };

  const displayed = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <AdminLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-black">Commandes</h1>
          <button onClick={loadOrders} className="bg-blue-500 text-white px-4 py-2 rounded">
            Actualiser
          </button>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto">
          {['all', 'en attente', 'en cours', 'prêt', 'livré'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded ${filter === s ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            >
              {s === 'all' ? 'Toutes' : s}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center py-8">Chargement...</p>
        ) : displayed.length === 0 ? (
          <p className="text-center py-8 text-gray-500">Aucune commande</p>
        ) : (
          <div className="space-y-3">
            {displayed.map(order => (
              <div key={order.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.client_name}</p>
                    <p className="text-sm text-gray-600">{order.client_phone}</p>
                    <p className="text-sm text-gray-600">{order.client_address}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    order.status === 'livré' ? 'bg-green-100 text-green-700' :
                    order.status === 'prêt' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'en cours' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <p className="font-bold mt-2">{(order.total ?? 0).toLocaleString()}F</p>
                
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => updateStatus(order.id, 'en cours')}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  >
                    En cours
                  </button>
                  <button
                    onClick={() => updateStatus(order.id, 'prêt')}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Prêt
                  </button>
                  <button
                    onClick={() => updateStatus(order.id, 'livré')}
                    className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Livré
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
