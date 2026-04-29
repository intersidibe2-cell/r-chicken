import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { ChefHat, CheckCircle } from 'lucide-react';

export default function KitchenScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const { data } = await supabase
      .from('commandes')
      .select('*')
      .in('status', ['en attente', 'en cours'])
      .order('created_at', { ascending: true });

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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-yellow-400">ÉCRAN CUISINE</h1>
        <button onClick={loadOrders} className="bg-blue-500 px-4 py-2 rounded">
          Actualiser
        </button>
      </div>

      {loading ? (
        <p className="text-center py-8">Chargement...</p>
      ) : orders.length === 0 ? (
        <p className="text-center py-8 text-gray-400">Aucune commande en attente</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map(order => (
            <div key={order.id} className={`p-4 rounded-lg ${
              order.status === 'en attente' ? 'bg-yellow-900 border-2 border-yellow-500' : 'bg-blue-900 border-2 border-blue-500'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-xl">{order.id}</span>
                <span className="text-xs text-gray-300">
                  {new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <p className="font-bold text-lg">{order.client_name}</p>
              <p className="text-sm text-gray-300">{order.client_phone}</p>
              <p className="text-sm text-gray-300">{order.client_address}</p>
              
              <div className="mt-2 p-2 bg-gray-800 rounded">
                {Array.isArray(order.items) && order.items.map((item, i) => (
                  <p key={i} className="text-sm">{item.quantity}x {item.name}</p>
                ))}
              </div>
              
              <p className="font-bold text-xl mt-2 text-green-400">{(order.total ?? 0).toLocaleString()}F</p>
              
              <button
                onClick={() => updateStatus(order.id, order.status === 'en attente' ? 'en cours' : 'prêt')}
                className={`w-full mt-3 py-2 rounded font-bold ${
                  order.status === 'en attente' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'
                }`}
              >
                {order.status === 'en attente' ? 'COMMENCER' : 'PRÊT'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
