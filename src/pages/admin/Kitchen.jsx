import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Clock, CheckCircle, ChefHat, AlertCircle, MessageCircle, RefreshCw } from 'lucide-react';

export default function KitchenScreen() {
  const [orders, setOrders] = useState([]);
  const [whatsappOrders, setWhatsappOrders] = useState([]);

  useEffect(() => {
    const loadOrders = () => {
      // Load regular orders
      const savedOrders = JSON.parse(localStorage.getItem('rchicken_orders') || '[]');
      const activeOrders = savedOrders.filter(o => 
        o.status === 'en attente' || o.status === 'en cours'
      ).map(o => ({ ...o, source: 'online' }));
      setOrders(activeOrders);

      // Load WhatsApp orders
      const savedWhatsappOrders = JSON.parse(localStorage.getItem('rchicken_whatsapp_orders') || '[]');
      const activeWhatsappOrders = savedWhatsappOrders.filter(o => 
        o.status === 'pending' || o.status === 'confirmed' || o.status === 'preparing'
      ).map(o => ({ ...o, source: 'whatsapp' }));
      setWhatsappOrders(activeWhatsappOrders);
    };

    loadOrders();
    const interval = setInterval(loadOrders, 3000); // Refresh every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusStyle = (status, source) => {
    if (source === 'whatsapp') {
      switch(status) {
        case 'pending':
          return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-400', icon: MessageCircle, label: 'WHATSAPP' };
        case 'confirmed':
          return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-400', icon: ChefHat, label: 'CONFIRMÉE' };
        case 'preparing':
          return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-400', icon: ChefHat, label: 'EN PRÉPARATION' };
        default:
          return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-400', icon: Clock, label: status.toUpperCase() };
      }
    }
    
    // Online orders
    switch(status) {
      case 'en attente':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', icon: AlertCircle, label: 'NOUVEAU' };
      case 'en cours':
        return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', icon: ChefHat, label: 'EN PRÉPARATION' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', icon: Clock, label: status.toUpperCase() };
    }
  };

  const updateOrderStatus = (orderId, newStatus, source) => {
    if (source === 'whatsapp') {
      const savedOrders = JSON.parse(localStorage.getItem('rchicken_whatsapp_orders') || '[]');
      const updatedOrders = savedOrders.map(o => 
        o.id === orderId ? { ...o, status: newStatus } : o
      );
      localStorage.setItem('rchicken_whatsapp_orders', JSON.stringify(updatedOrders));
      setWhatsappOrders(updatedOrders.filter(o => 
        o.status === 'pending' || o.status === 'confirmed' || o.status === 'preparing'
      ));
    } else {
      const savedOrders = JSON.parse(localStorage.getItem('rchicken_orders') || '[]');
      const updatedOrders = savedOrders.map(o => 
        o.id === orderId ? { ...o, status: newStatus } : o
      );
      localStorage.setItem('rchicken_orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders.filter(o => o.status === 'en attente' || o.status === 'en cours'));
    }
  };

  const getNextStatus = (currentStatus, source) => {
    if (source === 'whatsapp') {
      const flow = { 'pending': 'confirmed', 'confirmed': 'preparing', 'preparing': 'ready' };
      return flow[currentStatus];
    }
    const flow = { 'en attente': 'en cours', 'en cours': 'prêt' };
    return flow[currentStatus];
  };

  const getNextStatusLabel = (currentStatus, source) => {
    if (source === 'whatsapp') {
      const labels = { 'pending': 'Confirmer', 'confirmed': 'Commencer', 'preparing': 'Prêt !' };
      return labels[currentStatus];
    }
    const labels = { 'en attente': 'Commencer', 'en cours': 'Prêt !' };
    return labels[currentStatus];
  };

  const allOrders = [...whatsappOrders, ...orders].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-900 p-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <ChefHat className="w-10 h-10 text-[#FFB81C]" />
              Écran Cuisine
            </h1>
            <p className="text-gray-400 mt-1">
              Commandes en attente de préparation
              <span className="ml-3 text-green-400">
                📱 {whatsappOrders.length} WhatsApp
              </span>
              <span className="ml-3 text-blue-400">
                🌐 {orders.length} En ligne
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Actualisation auto
          </div>
        </div>

        {allOrders.length === 0 ? (
          <div className="bg-gray-800 rounded-2xl p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Aucune commande en attente</h2>
            <p className="text-gray-400">Toutes les commandes sont préparées !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allOrders.map(order => {
              const style = getStatusStyle(order.status, order.source);
              const StatusIcon = style.icon;
              const isWhatsApp = order.source === 'whatsapp';
              
              return (
                <div 
                  key={`${order.source}-${order.id}`} 
                  className={`bg-gray-800 rounded-xl p-4 border-2 ${style.border} ${isWhatsApp ? 'ring-2 ring-green-500/30' : ''}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col gap-1">
                      {isWhatsApp && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-green-500 text-white">
                          <MessageCircle className="w-3 h-3" />
                          WHATSAPP
                        </span>
                      )}
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${style.bg} ${style.text}`}>
                        <StatusIcon className="w-3 h-3" />
                        {style.label}
                      </span>
                    </div>
                    <span className="text-gray-400 text-sm font-mono">
                      {order.id}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-white font-bold text-lg">
                      {isWhatsApp ? order.clientName : (order.client?.name || 'Client')}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {isWhatsApp ? (order.clientAddress || 'Retrait') : (order.client?.address || 'Retrait')}
                    </p>
                    {isWhatsApp && order.clientPhone && (
                      <p className="text-green-400 text-sm mt-1">
                        📞 {order.clientPhone}
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-700 rounded-lg p-3 mb-4">
                    <h3 className="text-[#FFB81C] font-bold text-sm mb-2">Articles</h3>
                    {isWhatsApp ? (
                      order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-white py-1">
                          <span className="font-medium">{item.quantity}x {item.name}</span>
                        </div>
                      ))
                    ) : (
                      order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-white py-1">
                          <span className="font-medium">{item.quantity}x {item.name}</span>
                          {item.selectedSize && (
                            <span className="text-gray-400 text-sm">({item.selectedSize})</span>
                          )}
                        </div>
                      ))
                    )}
                    {(isWhatsApp ? order.notes : order.client?.notes) && (
                      <div className="mt-2 pt-2 border-t border-gray-600">
                        <p className="text-yellow-400 text-xs">
                          📝 {isWhatsApp ? order.notes : order.client?.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => updateOrderStatus(order.id, getNextStatus(order.status, order.source), order.source)}
                      className={`flex-1 font-bold py-3 rounded-lg transition-colors ${
                        order.status === 'preparing' || order.status === 'en cours'
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {getNextStatusLabel(order.status, order.source)}
                    </button>
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
