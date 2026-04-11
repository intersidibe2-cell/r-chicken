import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  Search, CheckCircle, XCircle, Clock, Truck, Phone,
  Eye, MessageCircle, RefreshCw, XCircle as XIcon
} from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = () => {
    const saved = localStorage.getItem('rchicken_orders');
    if (saved) {
      try {
        setOrders(JSON.parse(saved));
      } catch {
        setOrders([]);
      }
    }
  };

  const updateStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(o => 
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    setOrders(updatedOrders);
    localStorage.setItem('rchicken_orders', JSON.stringify(updatedOrders));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client?.phone?.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      'livré': 'bg-green-100 text-green-700',
      'en cours': 'bg-blue-100 text-blue-700',
      'en attente': 'bg-yellow-100 text-yellow-700',
      'annulé': 'bg-red-100 text-red-700',
    };
    const icons = {
      'livré': CheckCircle,
      'en cours': Truck,
      'en attente': Clock,
      'annulé': XCircle,
    };
    const Icon = icons[status] || Clock;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${styles[status]}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const statusCounts = {
    all: orders.length,
    'en attente': orders.filter(o => o.status === 'en attente').length,
    'en cours': orders.filter(o => o.status === 'en cours').length,
    'livré': orders.filter(o => o.status === 'livré').length,
    'annulé': orders.filter(o => o.status === 'annulé').length,
  };

  const openWhatsApp = (order) => {
    const phone = order.client.phone.replace(/\s/g, '').replace(/^\+/, '');
    let message = `🍗 *R-CHICKEN - Confirmation de commande*\n\n`;
    message += `Bonjour ${order.client.name},\n`;
    message += `Votre commande ${order.id} a été ${order.status === 'en attente' ? 'reçue et en cours de préparation !' : order.status === 'en cours' ? 'acceptée et en préparation !' : 'marquée comme livrée !'}\n\n`;
    message += `📋 Récapitulatif:\n`;
    order.items.forEach(item => {
      message += `• ${item.quantity}x ${item.name}\n`;
    });
    message += `\n💰 Total: ${order.total.toLocaleString('fr-FR')}F\n`;
    message += `\nMerci pour votre confiance ! 🙏`;
    
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const callClient = (phone) => {
    const cleanPhone = phone.replace(/\s/g, '');
    window.location.href = `tel:${cleanPhone}`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Gestion des Commandes</h1>
            <p className="text-gray-500 mt-1">{orders.length} commandes au total</p>
          </div>
          <button
            onClick={loadOrders}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'Toutes', color: 'bg-gray-800' },
            { key: 'en attente', label: 'En attente', color: 'bg-yellow-500' },
            { key: 'en cours', label: 'En cours', color: 'bg-blue-500' },
            { key: 'livré', label: 'Livrées', color: 'bg-green-500' },
            { key: 'annulé', label: 'Annulées', color: 'bg-red-500' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors inline-flex items-center gap-2 ${
                filterStatus === tab.key
                  ? `${tab.color} text-white`
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                filterStatus === tab.key ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {statusCounts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par N° commande, nom ou téléphone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B] bg-white"
          />
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">Aucune commande</h2>
            <p className="text-gray-500">Les nouvelles commandes apparaîtront ici</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div
                key={order.id}
                className={`bg-white rounded-2xl shadow-sm border-l-4 ${
                  order.status === 'en attente' ? 'border-yellow-500' :
                  order.status === 'en cours' ? 'border-blue-500' :
                  order.status === 'livré' ? 'border-green-500' : 'border-red-500'
                } p-6 hover:shadow-md transition-shadow cursor-pointer`}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                      order.status === 'en attente' ? 'bg-yellow-100' :
                      order.status === 'en cours' ? 'bg-blue-100' :
                      order.status === 'livré' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {order.status === 'en attente' && <Clock className="w-7 h-7 text-yellow-600" />}
                      {order.status === 'en cours' && <Truck className="w-7 h-7 text-blue-600" />}
                      {order.status === 'livré' && <CheckCircle className="w-7 h-7 text-green-600" />}
                      {order.status === 'annulé' && <XCircle className="w-7 h-7 text-red-600" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-900">{order.id}</h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {order.client?.name} • {order.client?.phone}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(order.date).toLocaleDateString('fr-FR')} à {new Date(order.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-black text-xl text-[#E4002B]">{order.total?.toLocaleString('fr-FR')}F</p>
                      <p className="text-xs text-gray-500">
                        {order.paymentMethod === 'om' ? 'Orange Money' : 
                         order.paymentMethod === 'sarali' ? 'Sarali' : 
                         order.paymentMethod === 'wave' ? 'Wave' : 'Espèces'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); openWhatsApp(order); }}
                        className="p-3 bg-green-100 hover:bg-green-200 text-green-600 rounded-xl transition-colors"
                        title="Envoyer WhatsApp"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); callClient(order.client?.phone); }}
                        className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl transition-colors"
                        title="Appeler le client"
                      >
                        <Phone className="w-5 h-5" />
                      </button>
                      <button className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {order.items?.slice(0, 4).map((item, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium">
                      {item.quantity}x {item.name}
                    </span>
                  ))}
                  {order.items?.length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-500">
                      +{order.items.length - 4} autres
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
                <div>
                  <h2 className="text-xl font-black text-gray-900">{selectedOrder.id}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedOrder.date).toLocaleDateString('fr-FR')} à {new Date(selectedOrder.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-700">Statut:</span>
                  {getStatusBadge(selectedOrder.status)}
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-bold text-sm text-gray-700 mb-3">👤 Client</h3>
                  <p className="font-bold text-gray-900">{selectedOrder.client?.name}</p>
                  <button
                    onClick={() => callClient(selectedOrder.client?.phone)}
                    className="text-sm text-[#E4002B] hover:underline inline-flex items-center gap-1 mt-1"
                  >
                    <Phone className="w-3 h-3" /> {selectedOrder.client?.phone}
                  </button>
                  <p className="text-sm text-gray-500 mt-2">📍 {selectedOrder.deliveryMethod === 'delivery' ? selectedOrder.client?.address : 'Retrait au restaurant'}</p>
                  {selectedOrder.client?.notes && (
                    <p className="text-sm text-amber-600 mt-2 italic">📝 {selectedOrder.client.notes}</p>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-sm text-gray-700 mb-3">📦 Articles commandés</h3>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm py-2 border-b border-gray-100">
                        <span className="text-gray-700">{item.quantity}x {item.name}</span>
                        <span className="font-bold text-gray-900">{(item.quantity * item.price).toLocaleString('fr-FR')}F</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-black text-lg mt-3 pt-3 border-t-2 border-gray-200">
                    <span>Total</span>
                    <span className="text-[#E4002B]">{selectedOrder.total?.toLocaleString('fr-FR')}F</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Paiement</p>
                    <p className="font-bold text-sm">
                       {selectedOrder.paymentMethod === 'om' ? 'Orange Money' : 
                        selectedOrder.paymentMethod === 'sarali' ? 'Sarali' : 
                        selectedOrder.paymentMethod === 'wave' ? 'Wave' : 'Espèces'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Livraison</p>
                    <p className="font-bold text-sm">{selectedOrder.deliveryMethod === 'delivery' ? 'Oui' : 'Retrait'}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => openWhatsApp(selectedOrder)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => callClient(selectedOrder.client?.phone)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Appeler
                  </button>
                </div>

                <div className="flex gap-3">
                  {selectedOrder.status === 'en attente' && (
                    <>
                      <button
                        onClick={() => updateStatus(selectedOrder.id, 'en cours')}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors inline-flex items-center justify-center gap-2"
                      >
                        <Truck className="w-4 h-4" />
                        Accepter
                      </button>
                      <button
                        onClick={() => updateStatus(selectedOrder.id, 'annulé')}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors inline-flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Refuser
                      </button>
                    </>
                  )}
                  {selectedOrder.status === 'en cours' && (
                    <button
                      onClick={() => updateStatus(selectedOrder.id, 'livré')}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Marquer comme livré
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}