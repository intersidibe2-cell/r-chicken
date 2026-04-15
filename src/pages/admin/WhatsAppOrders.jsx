import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { 
  MessageCircle, Plus, Trash2, Check, Clock, Phone, MapPin, 
  User, ShoppingBag, Search, Filter, Bell, X, Send
} from 'lucide-react';
import { menuData } from '../../data/menu';
import { useNotifications } from '../../context/NotificationContext';

export default function WhatsAppOrders() {
  const { addNotification } = useNotifications();
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('rchicken_whatsapp_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newOrder, setNewOrder] = useState({
    clientName: '',
    clientPhone: '',
    clientAddress: '',
    notes: '',
    items: [],
    paymentMethod: 'cash',
    deliveryMethod: 'delivery',
    total: 0
  });
  const [currentItem, setCurrentItem] = useState({
    productId: '',
    productName: '',
    quantity: 1,
    price: 0
  });

  // Get all products for dropdown
  const allProducts = menuData.categories.flatMap(cat => 
    cat.items.map(item => ({ ...item, category: cat.name }))
  );

  useEffect(() => {
    localStorage.setItem('rchicken_whatsapp_orders', JSON.stringify(orders));
  }, [orders]);

  const addItem = () => {
    if (!currentItem.productName || currentItem.quantity < 1) return;
    
    const newItem = {
      id: Date.now(),
      productId: currentItem.productId,
      name: currentItem.productName,
      quantity: currentItem.quantity,
      price: currentItem.price,
      subtotal: currentItem.price * currentItem.quantity
    };
    
    const newItems = [...newOrder.items, newItem];
    const newTotal = newItems.reduce((sum, item) => sum + item.subtotal, 0);
    
    setNewOrder({ ...newOrder, items: newItems, total: newTotal });
    setCurrentItem({ productId: '', productName: '', quantity: 1, price: 0 });
  };

  const removeItem = (itemId) => {
    const newItems = newOrder.items.filter(item => item.id !== itemId);
    const newTotal = newItems.reduce((sum, item) => sum + item.subtotal, 0);
    setNewOrder({ ...newOrder, items: newItems, total: newTotal });
  };

  const handleProductSelect = (e) => {
    const productId = e.target.value;
    const product = allProducts.find(p => p.id === productId);
    if (product) {
      setCurrentItem({
        ...currentItem,
        productId: product.id,
        productName: product.name,
        price: product.price
      });
    }
  };

  const generateOrderId = () => {
    const date = new Date();
    return `WA-${date.getDate()}${date.getMonth() + 1}${date.getFullYear().toString().slice(-2)}-${Date.now().toString().slice(-4)}`;
  };

  const saveOrder = () => {
    if (!newOrder.clientName || !newOrder.clientPhone || newOrder.items.length === 0) {
      alert('Veuillez remplir le nom, téléphone et ajouter au moins un article');
      return;
    }

    const order = {
      id: generateOrderId(),
      ...newOrder,
      date: new Date().toISOString(),
      status: 'pending',
      source: 'whatsapp'
    };

    setOrders([order, ...orders]);
    setShowModal(false);
    setNewOrder({
      clientName: '',
      clientPhone: '',
      clientAddress: '',
      notes: '',
      items: [],
      paymentMethod: 'cash',
      deliveryMethod: 'delivery',
      total: 0
    });

    // Add notification
    addNotification({
      type: 'order_update',
      title: 'Nouvelle commande WhatsApp',
      message: `${order.clientName} - ${order.total.toLocaleString('fr-FR')}F`,
      icon: '📱',
      orderId: order.id,
      playSound: true
    });
  };

  const playNotificationSound = () => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleA0yqnkAAIBEAACARAAAg0MAAINDAACARAAAf0UAAH9FAAB+RgAAfkYAAH1HAAB8SAAAfEgAAHtJAAB6SgAAekoAAHlLAAB4TAAAeEwAAHdNAAB2TgAAdU8AAHVPAAB0UAAAc1EAAHNRAAByUgAAcVMAAHFTAABwVAAAb1UAAG9VAABuVgAAblYAAG1XAABsWAAAbFgAAGtZAABqWgAAaloAAGlbAABoXAAAaFwAAGddAABmXgAAZl4AAGVfAABkYAAAZGAAAGNhAABiYgAAYmIAAGFjAABgZAAAYGQAAF9lAABeZgAAXmYAAF1nAABcaAAAXGgAAFtpAABaagAAWmoAAFlrAABYbAAAWGwAAFdtAABWbgAAVm4AAFVvAABUcAAAVHAAAFNxAABScgAAUnIAAFFzAABQdAAAUHQAAE91AABOdgAATnYAAE13AABMeAAATHgAAEt5AABKegAASnkAAEl6AABIewAASHsAAEd8AABGfQAARn0AAEV+AABEfwAAQ38AAEKAAABBgQAAQYEAAECCAAA/gwAAP4MAAD6EAAA9hQAAPYUAADyGAAA7hwAAO4cAADqIAAA5iQAAOYkAADiKAAA3iwAAN4sAADaMAAA1jQAANY0AADSOAD==');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (e) {}
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    // Add notification for status change
    const statusLabels = {
      pending: 'en attente',
      confirmed: 'confirmée',
      preparing: 'en préparation',
      ready: 'prête',
      delivered: 'livrée'
    };
    
    addNotification({
      type: 'order_update',
      title: `Commande ${orderId}`,
      message: `Statut mis à jour: ${statusLabels[newStatus] || newStatus}`,
      icon: '📋',
      orderId: orderId,
      playSound: true
    });
  };

  const deleteOrder = (orderId) => {
    if (confirm('Supprimer cette commande?')) {
      setOrders(orders.filter(order => order.id !== orderId));
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En attente' },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Confirmée' },
      preparing: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'En préparation' },
      ready: { bg: 'bg-green-100', text: 'text-green-800', label: 'Prête' },
      delivered: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Livrée' }
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-bold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    revenue: orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0)
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <MessageCircle className="w-8 h-8 text-green-500" />
              Commandes WhatsApp
            </h1>
            <p className="text-gray-500 mt-1">Gérez les commandes reçues par WhatsApp</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Ajouter une commande
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <p className="text-gray-500 text-sm">Total</p>
            <p className="text-2xl font-black text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 shadow-sm border border-yellow-200">
            <p className="text-yellow-600 text-sm">En attente</p>
            <p className="text-2xl font-black text-yellow-700">{stats.pending}</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 shadow-sm border border-orange-200">
            <p className="text-orange-600 text-sm">En préparation</p>
            <p className="text-2xl font-black text-orange-700">{stats.preparing}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 shadow-sm border border-green-200">
            <p className="text-green-600 text-sm">Prêtes</p>
            <p className="text-2xl font-black text-green-700">{stats.ready}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 shadow-sm border border-blue-200">
            <p className="text-blue-600 text-sm">Chiffre d'affaires</p>
            <p className="text-2xl font-black text-blue-700">{stats.revenue.toLocaleString('fr-FR')}F</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom ou numéro..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="preparing">En préparation</option>
            <option value="ready">Prête</option>
            <option value="delivered">Livrée</option>
          </select>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">Aucune commande WhatsApp</h3>
              <p className="text-gray-500 mb-4">Les commandes reçues par WhatsApp apparaîtront ici</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl font-bold inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter une commande manuellement
              </button>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-4 border-b bg-green-50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                        {order.id}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString('fr-FR')} à {new Date(order.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                
                <div className="p-4 grid md:grid-cols-3 gap-4">
                  {/* Client Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="w-4 h-4" />
                      <span className="font-bold">{order.clientName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{order.clientPhone}</span>
                    </div>
                    {order.clientAddress && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{order.clientAddress}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-sm">
                        💳 {order.paymentMethod === 'om' ? 'Orange Money' : 
                            order.paymentMethod === 'wave' ? 'Wave' : 
                            order.paymentMethod === 'sarali' ? 'Sarali' : 'Espèces'}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <p className="font-bold text-gray-700 mb-2">Articles:</p>
                    <div className="space-y-1">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.name}</span>
                          <span className="font-bold">{item.subtotal.toLocaleString('fr-FR')}F</span>
                        </div>
                      ))}
                    </div>
                    {order.notes && (
                      <p className="text-sm text-gray-500 mt-2 italic">📝 {order.notes}</p>
                    )}
                  </div>

                  {/* Total & Actions */}
                  <div className="text-right">
                    <p className="text-2xl font-black text-green-600 mb-4">
                      {order.total.toLocaleString('fr-FR')}F
                    </p>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold"
                          >
                            Confirmer
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg text-sm font-bold"
                          >
                            Envoyer cuisine
                          </button>
                        </>
                      )}
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg text-sm font-bold"
                        >
                          En préparation
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-bold"
                        >
                          Prête ✓
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-sm font-bold"
                        >
                          Livrée
                        </button>
                      )}
                      <button
                        onClick={() => {
                          const statusMessages = {
                            pending: 'Votre commande a été reçue et est en cours de traitement.',
                            confirmed: 'Votre commande a été confirmée et va être préparée.',
                            preparing: 'Nos cuisiniers préparent votre commande avec soin !',
                            ready: 'Votre commande est prête ! Vous pouvez venir la récupérer ou elle sera bientôt livrée.',
                            delivered: 'Votre commande a été livrée. Bon appétit ! 🍗'
                          };
                          const message = encodeURIComponent(
                            `🍗 R-CHICKEN - Mise à jour commande\n\n` +
                            `📋 Commande: ${order.id}\n` +
                            `📊 Statut: ${statusMessages[order.status]}\n\n` +
                            `Merci de votre confiance !`
                          );
                          window.open(`https://wa.me/${order.clientPhone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-bold"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-lg text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Order Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b bg-green-500 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MessageCircle className="w-6 h-6" />
                  Ajouter Commande WhatsApp
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Client Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Nom du client *
                  </label>
                  <input
                    type="text"
                    value={newOrder.clientName}
                    onChange={e => setNewOrder({ ...newOrder, clientName: e.target.value })}
                    placeholder="Ex: Issouf Sidibé"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    value={newOrder.clientPhone}
                    onChange={e => setNewOrder({ ...newOrder, clientPhone: e.target.value })}
                    placeholder="+223 XX XX XX XX"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Adresse de livraison
                </label>
                <input
                  type="text"
                  value={newOrder.clientAddress}
                  onChange={e => setNewOrder({ ...newOrder, clientAddress: e.target.value })}
                  placeholder="Quartier, rue..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500"
                />
              </div>

              {/* Add Items */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-700 mb-3">Ajouter des articles</h3>
                <div className="grid md:grid-cols-4 gap-3">
                  <div className="md:col-span-2">
                    <select
                      value={currentItem.productId}
                      onChange={handleProductSelect}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                    >
                      <option value="">Sélectionner un produit</option>
                      {menuData.categories.map(cat => (
                        <optgroup key={cat.id} label={cat.name}>
                          {cat.items.map(item => (
                            <option key={item.id} value={item.id}>
                              {item.name} - {item.price.toLocaleString('fr-FR')}F
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      min="1"
                      value={currentItem.quantity}
                      onChange={e => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) || 1 })}
                      placeholder="Qté"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <button
                    onClick={addItem}
                    disabled={!currentItem.productName}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-bold"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Items List */}
              {newOrder.items.length > 0 && (
                <div className="border rounded-xl overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 font-bold text-gray-700">
                    Articles ({newOrder.items.length})
                  </div>
                  <div className="divide-y">
                    {newOrder.items.map(item => (
                      <div key={item.id} className="px-4 py-3 flex items-center justify-between">
                        <div>
                          <span className="font-bold">{item.quantity}x {item.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-green-600">
                            {item.subtotal.toLocaleString('fr-FR')}F
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-green-50 px-4 py-3 flex justify-between items-center">
                    <span className="font-bold text-gray-700">Total</span>
                    <span className="text-2xl font-black text-green-600">
                      {newOrder.total.toLocaleString('fr-FR')}F
                    </span>
                  </div>
                </div>
              )}

              {/* Payment & Notes */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Mode de paiement</label>
                  <select
                    value={newOrder.paymentMethod}
                    onChange={e => setNewOrder({ ...newOrder, paymentMethod: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500"
                  >
                    <option value="cash">Espèces</option>
                    <option value="om">Orange Money</option>
                    <option value="wave">Wave</option>
                    <option value="sarali">Sarali</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Notes</label>
                  <input
                    type="text"
                    value={newOrder.notes}
                    onChange={e => setNewOrder({ ...newOrder, notes: e.target.value })}
                    placeholder="Ex: Sans piment..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={saveOrder}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Confirmer et envoyer à cuisine
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
