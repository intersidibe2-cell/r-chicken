import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Clock, CheckCircle, ChefHat, AlertCircle } from 'lucide-react';

export default function KitchenScreen() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = () => {
      const savedOrders = JSON.parse(localStorage.getItem('rchicken_orders') || '[]');
      const activeOrders = savedOrders.filter(o => 
        o.status === 'en attente' || o.status === 'en cours'
      );
      setOrders(activeOrders);
    };

    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'en attente':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', icon: AlertCircle };
      case 'en cours':
        return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', icon: ChefHat };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', icon: Clock };
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const savedOrders = JSON.parse(localStorage.getItem('rchicken_orders') || '[]');
    const updatedOrders = savedOrders.map(o => 
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    localStorage.setItem('rchicken_orders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders.filter(o => o.status === 'en attente' || o.status === 'en cours'));
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-900 p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <ChefHat className="w-10 h-10 text-[#FFB81C]" />
            Écran Cuisine
          </h1>
          <p className="text-gray-400 mt-1">Commandes en attente de préparation</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-gray-800 rounded-2xl p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Aucune commande en attente</h2>
            <p className="text-gray-400">Toutes les commandes sont préparées !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {orders.map(order => {
              const style = getStatusStyle(order.status);
              const StatusIcon = style.icon;
              
              return (
                <div 
                  key={order.id} 
                  className={`bg-gray-800 rounded-xl p-4 border-2 ${style.border}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${style.bg} ${style.text}`}>
                        <StatusIcon className="w-3 h-3" />
                        {order.status === 'en attente' ? 'NOUVEAU' : 'EN PRÉPARATION'}
                      </span>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {order.id}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-white font-bold">{order.client?.name || 'Client'}</p>
                    <p className="text-gray-400 text-sm">{order.client?.address || 'Retrait'}</p>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-3 mb-4">
                    <h3 className="text-[#FFB81C] font-bold text-sm mb-2">Articles</h3>
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-white text-sm py-1">
                        <span>{item.quantity}x {item.name}</span>
                        {item.selectedSize && (
                          <span className="text-gray-400">({item.selectedSize})</span>
                        )}
                      </div>
                    ))}
                    {order.client?.notes && (
                      <div className="mt-2 pt-2 border-t border-gray-600">
                        <p className="text-yellow-400 text-xs">📝 {order.client.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {order.status === 'en attente' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'en cours')}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
                      >
                        Commencer
                      </button>
                    )}
                    {order.status === 'en cours' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'prêt')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors"
                      >
                        Prêt !
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}