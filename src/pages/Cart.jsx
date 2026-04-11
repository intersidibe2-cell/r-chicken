import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CreditCard, Smartphone, Truck, Store, MessageCircle, User, Phone, MapPin, Clock, Check, Copy, Navigation } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';

const RESTAURANT_PHONE = '22383806129';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { addToast } = useToast();
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('om');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [clientInfo, setClientInfo] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
    latitude: null,
    longitude: null,
  });
  const [showForm, setShowForm] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const deliveryFee = totalPrice >= 20000 ? 0 : 1500;
  const grandTotal = totalPrice + deliveryFee;

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      addToast('La géolocalisation n\'est pas supportée par votre navigateur', 'error');
      return;
    }
    
    setGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setClientInfo({
          ...clientInfo,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        addToast('Position partagée avec succès !', 'success');
        setGettingLocation(false);
      },
      (error) => {
        addToast('Impossible de获取 votre position', 'error');
        setGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const openMaps = () => {
    if (clientInfo.latitude && clientInfo.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${clientInfo.latitude},${clientInfo.longitude}`;
      window.open(url, '_blank');
    }
  };

  const generateOrderId = () => {
    const date = new Date();
    return `CMD-${date.getDate()}${date.getMonth() + 1}${date.getFullYear().toString().slice(-2)}-${Date.now().toString().slice(-4)}`;
  };

  const generateWhatsAppMessage = (order) => {
    let message = `🍗 *NOUVELLE COMMANDE - R-CHICKEN*\n\n`;
    message += `📋 *N°:* ${order.id}\n`;
    message += `📅 *Date:* ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}\n\n`;
    
    message += `👤 *Client:* ${clientInfo.name}\n`;
    message += `📞 *Téléphone:* ${clientInfo.phone}\n`;
    message += `📍 *Adresse:* ${deliveryMethod === 'delivery' ? clientInfo.address : 'Retrait au restaurant'}\n`;
    
    if (clientInfo.latitude && clientInfo.longitude) {
      message += `📍 *GPS:* https://www.google.com/maps/dir/?api=1&destination=${clientInfo.latitude},${clientInfo.longitude}\n`;
    }
    message += `\n🛒 *Articles:*\n`;
    order.items.forEach(item => {
      message += `• ${item.quantity}x ${item.name} - ${(item.price * item.quantity).toLocaleString('fr-FR')}F\n`;
    });
    
    message += `\n💳 *Paiement:* ${
      paymentMethod === 'om' ? 'Orange Money' : 
      paymentMethod === 'sarali' ? 'Sarali' : 
      paymentMethod === 'wave' ? 'Wave' : 
      'Espèces'
    }\n`;
    message += `🚚 *Livraison:* ${deliveryMethod === 'delivery' ? 'Oui (+1500F)' : 'Retrait'}\n`;
    message += `📦 *Total:* ${grandTotal.toLocaleString('fr-FR')}F\n`;
    
    if (clientInfo.notes) {
      message += `\n📝 *Note:* ${clientInfo.notes}`;
    }
    
    return encodeURIComponent(message);
  };

  const handleOrder = () => {
    if (!clientInfo.name.trim()) {
      addToast('Veuillez entrer votre nom', 'error');
      return;
    }
    if (!clientInfo.phone.trim()) {
      addToast('Veuillez entrer votre numéro de téléphone', 'error');
      return;
    }
    if (deliveryMethod === 'delivery' && !clientInfo.address.trim()) {
      addToast('Veuillez entrer votre adresse de livraison', 'error');
      return;
    }

    const order = {
      id: generateOrderId(),
      items: [...cartItems],
      client: { ...clientInfo },
      total: grandTotal,
      deliveryFee,
      deliveryMethod,
      paymentMethod,
      date: new Date().toISOString(),
      status: 'en attente'
    };

    setOrderDetails(order);
    setOrderPlaced(true);

    const orders = JSON.parse(localStorage.getItem('rchicken_orders') || '[]');
    orders.unshift(order);
    localStorage.setItem('rchicken_orders', JSON.stringify(orders));

    clearCart();
  };

  const openWhatsApp = () => {
    if (orderDetails) {
      const url = `https://wa.me/${RESTAURANT_PHONE}?text=${generateWhatsAppMessage(orderDetails)}`;
      window.open(url, '_blank');
    }
  };

  const copyOrderId = () => {
    if (orderDetails) {
      navigator.clipboard.writeText(orderDetails.id);
      addToast('Numéro de commande copié !', 'success');
    }
  };

  if (orderPlaced && orderDetails) {
    return (
      <main className="pt-20 min-h-screen bg-gray-50 pb-20 md:pb-0">
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-green-500">
            <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-black text-green-700 mb-2">Commande Confirmée ! 🎉</h1>
            <p className="text-lg text-gray-600 mb-4">
              Votre commande a été envoyée avec succès.
            </p>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-500">Numéro de commande</p>
              <p className="text-2xl font-black text-[#E4002B]">{orderDetails.id}</p>
              <button
                onClick={copyOrderId}
                className="text-sm text-blue-500 hover:text-blue-700 underline mt-1"
              >
                Copier
              </button>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 mb-6">
              <h3 className="font-black text-lg mb-3">📱 Envoyer la commande par WhatsApp</h3>
              <p className="text-sm text-white/80 mb-4">
                Envoyez la commande directement au restaurant via WhatsApp pour une confirmation rapide !
              </p>
              <button
                onClick={openWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-6 h-6" />
                Envoyer sur WhatsApp
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="font-bold text-amber-800 mb-1">📞 Confirmation par appel</p>
              <p className="text-sm text-amber-700">
                Le restaurant vous appellera au <span className="font-black">{orderDetails.client.phone}</span> pour confirmer votre commande.
              </p>
            </div>

            <div className="text-left bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-bold text-gray-800 mb-3">📋 Récapitulatif</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Client</span>
                  <span className="font-bold">{orderDetails.client.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Téléphone</span>
                  <span className="font-bold">{orderDetails.client.phone}</span>
                </div>
                {orderDetails.client.address && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Adresse</span>
                    <span className="font-bold text-right max-w-[150px]">{orderDetails.client.address}</span>
                  </div>
                )}
                {orderDetails.client.latitude && orderDetails.client.longitude && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Position</span>
                    <span className="font-bold text-green-600">📍 Partagée</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Articles</span>
                  <span className="font-bold">{orderDetails.items.reduce((sum, i) => sum + i.quantity, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total</span>
                  <span className="font-black text-lg text-[#E4002B]">{grandTotal.toLocaleString('fr-FR')}F</span>
                </div>
              </div>
            </div>

            <Link to="/">
              <button className="w-full kfc-button text-white px-8 py-4 rounded-xl font-black text-lg inline-flex items-center justify-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                Retour à l'accueil
              </button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/menu">
            <button className="inline-flex items-center gap-2 text-gray-600 hover:text-[#E4002B] font-medium transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Continuer les achats
            </button>
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-8">
          Votre <span className="text-[#E4002B]">Panier</span>
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-300" />
            <h2 className="text-2xl font-black text-gray-700 mb-3">Votre panier est vide</h2>
            <p className="text-gray-500 mb-6">Ajoutez des articles depuis notre menu</p>
            <Link to="/menu">
              <button className="kfc-button text-white px-8 py-4 rounded-xl font-black text-lg inline-flex items-center gap-2">
                Voir le Menu
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow p-4 flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                    <p className="text-[#E4002B] font-black text-lg mt-2">
                      {(item.price * item.quantity).toLocaleString('fr-FR')}F
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        aria-label="Diminuer la quantité"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        aria-label="Augmenter la quantité"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { removeFromCart(item.id); addToast(`${item.name} retiré du panier`, 'info'); }}
                        className="ml-auto p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Form */}
            <div className="space-y-6">
              {/* Client Info */}
              {showForm && (
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#E4002B]" />
                    Vos informations
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Nom complet *</label>
                      <input
                        type="text"
                        value={clientInfo.name}
                        onChange={e => setClientInfo({ ...clientInfo, name: e.target.value })}
                        placeholder="Ex: Moussa Diallo"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Téléphone *</label>
                      <input
                        type="tel"
                        value={clientInfo.phone}
                        onChange={e => setClientInfo({ ...clientInfo, phone: e.target.value })}
                        placeholder="Ex: 83 80 61 29"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B]"
                        required
                      />
                    </div>
                    {deliveryMethod === 'delivery' && (
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Adresse de livraison *</label>
                        <div className="space-y-3">
                          <textarea
                            value={clientInfo.address}
                            onChange={e => setClientInfo({ ...clientInfo, address: e.target.value })}
                            placeholder="Quartier, rue, numéro..."
                            rows={2}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B] resize-none"
                            required
                          />
                          <button
                            type="button"
                            onClick={getCurrentLocation}
                            disabled={gettingLocation}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-colors ${
                              clientInfo.latitude && clientInfo.longitude
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100'
                            }`}
                          >
                            <Navigation className="w-5 h-5" />
                            {gettingLocation ? 'Localisation...' : clientInfo.latitude && clientInfo.longitude ? 'Position partagée ✓' : 'Partager ma position'}
                          </button>
                          {clientInfo.latitude && clientInfo.longitude && (
                            <p className="text-xs text-green-600 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              Latitude: {clientInfo.latitude.toFixed(4)}, Longitude: {clientInfo.longitude.toFixed(4)}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Note (optionnel)</label>
                      <input
                        type="text"
                        value={clientInfo.notes}
                        onChange={e => setClientInfo({ ...clientInfo, notes: e.target.value })}
                        placeholder="Ex: Sans piment, sauce aparte..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E4002B]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Delivery Method */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#E4002B]" />
                  Mode de livraison
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setDeliveryMethod('delivery')}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                      deliveryMethod === 'delivery'
                        ? 'border-[#E4002B] bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Truck className="w-6 h-6 text-[#E4002B]" />
                    <div className="text-left flex-1">
                      <p className="font-bold">Livraison</p>
                      <p className="text-xs text-gray-500">30-45 min • {deliveryFee > 0 ? `${deliveryFee.toLocaleString('fr-FR')}F` : 'Gratuite'}</p>
                    </div>
                    {deliveryMethod === 'delivery' && <Check className="w-5 h-5 text-[#E4002B]" />}
                  </button>
                  <button
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                      deliveryMethod === 'pickup'
                        ? 'border-[#E4002B] bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Store className="w-6 h-6 text-[#E4002B]" />
                    <div className="text-left flex-1">
                      <p className="font-bold">Retrait au restaurant</p>
                      <p className="text-xs text-gray-500">Baco-djicoroni Golf</p>
                    </div>
                    {deliveryMethod === 'pickup' && <Check className="w-5 h-5 text-[#E4002B]" />}
                  </button>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-[#E4002B]" />
                  Mode de paiement
                </h3>
                <div className="space-y-3">
                  {/* Orange Money */}
                  <button
                    onClick={() => setPaymentMethod('om')}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                      paymentMethod === 'om' ? 'border-[#FF6600] bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-10 h-10 bg-[#FF6600] rounded-lg flex items-center justify-center">
                      <span className="text-white font-black text-sm">OM</span>
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-bold">Orange Money</p>
                      <p className="text-xs text-gray-500">Paiement rapide</p>
                    </div>
                    {paymentMethod === 'om' && <Check className="w-5 h-5 text-[#FF6600]" />}
                  </button>
                  
                  {/* Sarali */}
                  <button
                    onClick={() => setPaymentMethod('sarali')}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                      paymentMethod === 'sarali' ? 'border-[#FFD700] bg-yellow-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-10 h-10 bg-[#FFD700] rounded-lg flex items-center justify-center">
                      <span className="text-black font-black text-xs">SAR</span>
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-bold">Sarali</p>
                      <p className="text-xs text-gray-500">Paiement sécurisé Orange Mali</p>
                    </div>
                    {paymentMethod === 'sarali' && <Check className="w-5 h-5 text-[#FFD700]" />}
                  </button>
                  
                  {/* Wave */}
                  <button
                    onClick={() => setPaymentMethod('wave')}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                      paymentMethod === 'wave' ? 'border-[#0055D4] bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-10 h-10 bg-[#0055D4] rounded-lg flex items-center justify-center">
                      <span className="text-white font-black text-sm">W</span>
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-bold">Wave</p>
                      <p className="text-xs text-gray-500">Paiement sans frais</p>
                    </div>
                    {paymentMethod === 'wave' && <Check className="w-5 h-5 text-[#0055D4]" />}
                  </button>
                  
                  {/* Espèces */}
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                      paymentMethod === 'cash' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-bold">Espèces</p>
                      <p className="text-xs text-gray-500">Paiement à la {deliveryMethod === 'pickup' ? 'remise' : 'livraison'}</p>
                    </div>
                    {paymentMethod === 'cash' && <Check className="w-5 h-5 text-green-500" />}
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-bold text-lg mb-4">💰 Résumé</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sous-total ({cartItems.reduce((sum, i) => sum + i.quantity, 0)} articles)</span>
                    <span className="font-bold">{totalPrice.toLocaleString('fr-FR')}F</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Livraison</span>
                    <span className={`font-bold ${deliveryFee === 0 ? 'text-green-500' : ''}`}>
                      {deliveryFee === 0 ? 'Gratuite' : `${deliveryFee.toLocaleString('fr-FR')}F`}
                    </span>
                  </div>
                  {deliveryFee > 0 && (
                    <p className="text-xs text-gray-400">Livraison gratuite dès 20 000F</p>
                  )}
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-black text-lg">Total</span>
                    <span className="font-black text-2xl text-[#E4002B]">
                      {grandTotal.toLocaleString('fr-FR')}F
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleOrder}
                  className="w-full kfc-button text-white font-black py-4 rounded-xl mt-6 text-lg shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-6 h-6" />
                  CONFIRMER ET ENVOYER PAR WHATSAPP
                </button>

                <button
                  onClick={() => {
                    if (confirm('Vider le panier ?')) clearCart();
                  }}
                  className="w-full text-gray-400 hover:text-red-500 text-sm mt-3 transition-colors"
                >
                  Vider le panier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}