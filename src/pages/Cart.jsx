import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CreditCard, Smartphone, Truck, Store, MessageCircle, User, Phone, MapPin, Clock, Check, Navigation, Gift, Star, Zap, MapPin as MapPinIcon, Calendar, ChevronDown, Package, Timer } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';
import { calculateDeliveryTime, getDeliveryFee, isRestaurantOpen } from '../utils/deliveryEstimation';

const RESTAURANT_PHONE = '22383806129';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { addToast } = useToast();
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [clientInfo, setClientInfo] = useState(() => {
    const saved = localStorage.getItem('rchicken_user');
    return saved ? JSON.parse(saved) : {
      name: '',
      phone: '',
      address: '',
      notes: '',
      latitude: null,
      longitude: null,
    };
  });
  const [gettingLocation, setGettingLocation] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [deliveryTime, setDeliveryTime] = useState('asap');
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [usePoints, setUsePoints] = useState(false);
  const [showOrderForOther, setShowOrderForOther] = useState(false);

  useEffect(() => {
    // Load loyalty points
    const savedOrders = localStorage.getItem('rchicken_orders');
    if (savedOrders) {
      const orders = JSON.parse(savedOrders);
      setLoyaltyPoints(orders.length * 100);
    }
  }, []);

  // Smart delivery estimation
  const deliveryEstimate = useMemo(() => {
    if (deliveryMethod === 'pickup') {
      return { formatted: '15-20 min', note: 'Prêt à récupérer', isPeakHour: false };
    }
    return calculateDeliveryTime(clientInfo.address, cartItems.reduce((sum, i) => sum + i.quantity, 0));
  }, [deliveryMethod, clientInfo.address, cartItems]);

  // Smart delivery fee
  const deliveryInfo = useMemo(() => {
    if (deliveryMethod === 'pickup') return { fee: 0, free: true, reason: 'Retrait' };
    return getDeliveryFee(clientInfo.address, totalPrice);
  }, [deliveryMethod, clientInfo.address, totalPrice]);

  const deliveryFee = deliveryInfo.fee;
  const pointsDiscount = usePoints ? Math.min(loyaltyPoints * 2.5, totalPrice) : 0;
  const tipAmount = clientInfo.tip || 0;
  const grandTotal = Math.max(0, totalPrice + deliveryFee - promoDiscount - pointsDiscount + tipAmount);
  
  const restaurantStatus = isRestaurantOpen();

  const applyPromoCode = () => {
    // Simple promo code logic
    if (promoCode.toUpperCase() === 'BIENVENUE') {
      setPromoDiscount(500);
      setPromoApplied(true);
      addToast('Code promo appliqué ! -500F', 'success');
    } else if (promoCode.toUpperCase() === 'VIP10') {
      setPromoDiscount(Math.floor(totalPrice * 0.1));
      setPromoApplied(true);
      addToast('Code promo VIP10 appliqué ! -10%', 'success');
    } else {
      addToast('Code promo invalide', 'error');
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      addToast('La géolocalisation n\'est pas supportée', 'error');
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

  const generateOrderId = () => {
    const date = new Date();
    return `CMD-${date.getDate()}${date.getMonth() + 1}${date.getFullYear().toString().slice(-2)}-${Date.now().toString().slice(-4)}`;
  };

  const generateWhatsAppMessage = (order) => {
    let message = `🍗 *NOUVELLE COMMANDE - R-CHICKEN*\n\n`;
    message += `📋 *N°:* ${order.id}\n`;
    message += `📅 *Date:* ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}\n\n`;
    
    // Client info
    message += `👤 *Client:* ${clientInfo.name}\n`;
    message += `📞 *Téléphone:* ${clientInfo.phone}\n`;
    
    // Recipient info if ordering for someone else
    if (showOrderForOther && clientInfo.recipientName) {
      message += `\n🎁 *Commande pour:*\n`;
      message += `👤 *Nom:* ${clientInfo.recipientName}\n`;
      message += `📞 *Tél:* ${clientInfo.recipientPhone || 'Non renseigné'}\n`;
    }
    
    message += `📍 *Adresse:* ${deliveryMethod === 'delivery' ? clientInfo.address : 'Retrait au restaurant'}\n`;
    
    if (clientInfo.latitude && clientInfo.longitude) {
      message += `📍 *GPS:* https://www.google.com/maps/dir/?api=1&destination=${clientInfo.latitude},${clientInfo.longitude}\n`;
    }
    
    // Scheduled delivery time
    if (deliveryTime === 'scheduled' && clientInfo.scheduledDate) {
      message += `\n⏰ *Livraison planifiée:*\n`;
      message += `📅 ${new Date(clientInfo.scheduledDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n`;
      if (clientInfo.scheduledTime) {
        message += `⏰ ${clientInfo.scheduledTime}\n`;
      }
    } else {
      message += `\n⚡ *Livraison:* Dès que possible\n`;
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
    message += `🚚 *Livraison:* ${deliveryMethod === 'delivery' ? 'Oui' : 'Retrait'}\n`;
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
    if (showOrderForOther) {
      if (!clientInfo.recipientName?.trim()) {
        addToast('Veuillez entrer le nom du destinataire', 'error');
        return;
      }
      if (!clientInfo.recipientPhone?.trim()) {
        addToast('Veuillez entrer le téléphone du destinataire', 'error');
        return;
      }
    }
    if (deliveryTime === 'scheduled' && !clientInfo.scheduledDate) {
      addToast('Veuillez sélectionner une date de livraison', 'error');
      return;
    }

    const order = {
      id: generateOrderId(),
      items: [...cartItems],
      client: { ...clientInfo },
      recipient: showOrderForOther ? {
        name: clientInfo.recipientName,
        phone: clientInfo.recipientPhone
      } : null,
      total: grandTotal,
      subtotal: totalPrice,
      deliveryFee,
      promoDiscount,
      pointsDiscount,
      deliveryMethod,
      paymentMethod,
      deliveryTime,
      scheduledDate: deliveryTime === 'scheduled' ? clientInfo.scheduledDate : null,
      scheduledTime: deliveryTime === 'scheduled' ? clientInfo.scheduledTime : null,
      date: new Date().toISOString(),
      status: 'en attente'
    };

    setOrderDetails(order);
    setOrderPlaced(true);

    const orders = JSON.parse(localStorage.getItem('rchicken_orders') || '[]');
    orders.unshift(order);
    localStorage.setItem('rchicken_orders', JSON.stringify(orders));

    // Save user info
    localStorage.setItem('rchicken_user', JSON.stringify(clientInfo));

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

            <Link 
              to={`/order-tracking?id=${orderDetails.id}`}
              className="block bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-4 mb-6 transition-colors"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-bold">Suivre ma commande</p>
                  <p className="text-sm text-white/80">Cliquez pour voir l'avancement</p>
                </div>
              </div>
            </Link>

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
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/menu">
            <button className="inline-flex items-center gap-2 text-gray-600 hover:text-[#E4002B] font-medium transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Continuer les achats
            </button>
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-[#E4002B]" />
          Mon Panier
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
          <div className="space-y-6">
            {/* Delivery Method - Big Buttons */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-200">
              <h2 className="font-bold text-xl mb-4 text-center text-gray-800">
                Comment récupérer votre commande ?
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`p-6 rounded-2xl border-3 transition-all ${
                    deliveryMethod === 'pickup'
                      ? 'border-green-500 bg-green-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">🏪</div>
                    <h3 className="font-black text-xl text-gray-800">À EMPORTER</h3>
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <span className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-1">
                        <Timer className="w-4 h-4" />
                        10-15 min
                      </span>
                    </div>
                    <p className="text-xs text-green-600 mt-2 font-medium">
                      ⚡ Prêt en 10-15 min - Venez récupérer !
                    </p>
                  </div>
                  {deliveryMethod === 'pickup' && (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`relative p-6 rounded-2xl border-3 transition-all ${
                    deliveryMethod === 'delivery'
                      ? 'border-red-500 bg-red-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">🛵</div>
                    <h3 className="font-black text-xl text-gray-800">LIVRAISON</h3>
                    <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
                      <span className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-1">
                        <Timer className="w-4 h-4" />
                        15-20 min
                      </span>
                      {deliveryInfo.free ? (
                        <span className="bg-green-500 text-white px-3 py-2 rounded-full font-bold text-sm">
                          GRATUITE
                        </span>
                      ) : (
                        <span className="bg-orange-500 text-white px-3 py-2 rounded-full font-bold text-sm">
                          {deliveryInfo.fee.toLocaleString('fr-FR')}F
                        </span>
                      )}
                    </div>
                  </div>
                  {deliveryMethod === 'delivery' && (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </button>
              </div>
              
              <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <div className="text-center">
                  <p className="font-bold text-green-800 flex items-center justify-center gap-2">
                    <span className="text-xl">⚡</span>
                    Pourquoi venir chercher ?
                    <span className="text-xl">⚡</span>
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm text-green-700">
                    <span className="flex items-center gap-1">
                      <span className="text-green-500">✓</span>
                      Plus rapide
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-green-500">✓</span>
                      Toujours chaud
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-green-500">✓</span>
                      Pas d'attente livreur
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 text-center text-sm text-gray-600">
                <p className="flex items-center justify-center gap-2">
                  <span className="text-green-500">✅</span>
                  {restaurantStatus.message}
                </p>
                {deliveryMethod === 'delivery' && clientInfo.address && (
                  <p className="flex items-center justify-center gap-2 mt-1 text-blue-600 font-medium">
                    <span>📍</span>
                    Zone: {deliveryEstimate.zone}
                  </p>
                )}
              </div>
            </div>

            {/* Cart Items */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg text-gray-800">Articles ({cartItems.length})</h2>
                <button className="text-sm text-gray-500 hover:text-gray-700">
                  Sélectionner tout
                </button>
              </div>
              
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-amber-100">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300" defaultChecked />
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{item.name}</h3>
                      <p className="text-[#E4002B] font-black">{item.price.toLocaleString('fr-FR')} F</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { removeFromCart(item.id); addToast(`${item.name} retiré`, 'info'); }}
                        className="ml-2 p-2 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-200">
              <h2 className="font-bold text-xl mb-4 text-gray-800">Vos informations</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nom *</label>
                  <input
                    type="text"
                    value={clientInfo.name}
                    onChange={e => setClientInfo({ ...clientInfo, name: e.target.value })}
                    placeholder="Votre nom complet"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Téléphone *</label>
                  <input
                    type="tel"
                    value={clientInfo.phone}
                    onChange={e => setClientInfo({ ...clientInfo, phone: e.target.value })}
                    placeholder="+223 XX XX XX XX"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: +223 XX XX XX XX</p>
                </div>

                <label className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOrderForOther}
                    onChange={e => setShowOrderForOther(e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                  <span className="font-bold text-purple-700">🎁 Commander pour quelqu'un d'autre</span>
                </label>

                {/* Order for other person fields */}
                {showOrderForOther && (
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 space-y-4">
                    <h4 className="font-bold text-purple-800">Informations du destinataire</h4>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Nom du destinataire *</label>
                      <input
                        type="text"
                        value={clientInfo.recipientName || ''}
                        onChange={e => setClientInfo({ ...clientInfo, recipientName: e.target.value })}
                        placeholder="Nom de la personne qui recevra"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Téléphone du destinataire *</label>
                      <input
                        type="tel"
                        value={clientInfo.recipientPhone || ''}
                        onChange={e => setClientInfo({ ...clientInfo, recipientPhone: e.target.value })}
                        placeholder="+223 XX XX XX XX"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500"
                      />
                      <p className="text-xs text-purple-600 mt-1">Le livreur contactera ce numéro</p>
                    </div>
                  </div>
                )}

                {deliveryMethod === 'delivery' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Adresse *</label>
                      <input
                        type="text"
                        value={clientInfo.address}
                        onChange={e => setClientInfo({ ...clientInfo, address: e.target.value })}
                        placeholder="Quartier, rue, numéro..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Repères locaux (optionnel)</label>
                      <input
                        type="text"
                        placeholder="Ex: Près de la mosquée, après le marché..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-amber-500"
                      />
                      <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                        <span>💡</span> Décrivez votre position pour faciliter la livraison
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">📍 Localisation GPS (optionnel)</label>
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
                        {gettingLocation ? 'Localisation...' : clientInfo.latitude && clientInfo.longitude ? 'Position partagée ✓' : 'Ma position'}
                      </button>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Quand souhaitez-vous recevoir ?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryTime('asap')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        deliveryTime === 'asap'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Zap className="w-6 h-6 mx-auto mb-1 text-green-600" />
                      <span className="font-bold text-sm">Dès que possible</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryTime('scheduled')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        deliveryTime === 'scheduled'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Calendar className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                      <span className="font-bold text-sm">Planifier</span>
                    </button>
                  </div>
                  
                  {/* Date/Time picker when scheduled */}
                  {deliveryTime === 'scheduled' && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">📅 Date de livraison</label>
                        <input
                          type="date"
                          value={clientInfo.scheduledDate || ''}
                          onChange={e => setClientInfo({ ...clientInfo, scheduledDate: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">⏰ Heure souhaitée</label>
                        <input
                          type="time"
                          value={clientInfo.scheduledTime || ''}
                          onChange={e => setClientInfo({ ...clientInfo, scheduledTime: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <p className="text-xs text-blue-600 flex items-center gap-1">
                        <span>💡</span> Le livreur confirmera la disponibilité
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-200">
              <h2 className="font-bold text-xl mb-4 text-gray-800">Mode de paiement</h2>
              
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-amber-500 text-lg font-medium bg-white"
              >
                <option value="cash">💵 Cash à la livraison</option>
                <option value="om">🟠 Orange Money</option>
                <option value="wave">🔵 Wave</option>
                <option value="sarali">🟡 Sarali</option>
              </select>
            </div>

            {/* Promo Code & Points */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-200">
              <h2 className="font-bold text-xl mb-4 text-gray-800 flex items-center gap-2">
                <Gift className="w-6 h-6 text-amber-500" />
                Réductions & Points
              </h2>
              
              {/* Promo Code */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Code Promo</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                    placeholder="ENTREZ LE CODE"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-amber-500 uppercase"
                  />
                  <button
                    onClick={applyPromoCode}
                    disabled={promoApplied}
                    className="px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50"
                  >
                    {promoApplied ? 'Appliqué' : 'Appliquer'}
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-green-600 text-sm mt-2">✅ Code promo appliqué: -{promoDiscount.toLocaleString('fr-FR')}F</p>
                )}
              </div>

              {/* Loyalty Points */}
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-purple-600" />
                    <span className="font-bold text-purple-800">Points de Fidélité</span>
                  </div>
                  <span className="text-xl font-black text-purple-600">{loyaltyPoints}</span>
                </div>
                <p className="text-sm text-purple-700 mb-3">Vous avez {loyaltyPoints} points</p>
                
                {loyaltyPoints > 0 ? (
                  <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={usePoints}
                      onChange={e => setUsePoints(e.target.checked)}
                      className="w-5 h-5 rounded"
                    />
                    <span className="text-sm font-medium text-purple-700">
                      Utiliser mes points (-{Math.min(loyaltyPoints * 2.5, totalPrice).toLocaleString('fr-FR')}F)
                    </span>
                  </label>
                ) : (
                  <p className="text-sm text-purple-600 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Commandez pour gagner vos premiers points !
                  </p>
                )}
                
                <p className="text-xs text-purple-600 mt-3">
                  💎 100 points = 250 FCFA | 🎁 2000 points = Commande gratuite
                </p>
              </div>
            </div>

            {/* Tip for delivery driver */}
            {deliveryMethod === 'delivery' && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">💝</span>
                  Pourboire pour le livreur
                </h3>
                <p className="text-sm text-green-700 mb-3">Remerciez votre livreur pour son service!</p>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 200, 500, 1000].map(amount => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setClientInfo({ ...clientInfo, tip: amount })}
                      className={`py-3 rounded-xl font-bold text-sm transition-all ${
                        (clientInfo.tip || 0) === amount
                          ? 'bg-green-500 text-white'
                          : 'bg-white border border-green-200 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      {amount === 0 ? 'Non' : `${amount}F`}
                    </button>
                  ))}
                </div>
                {(clientInfo.tip || 0) > 0 && (
                  <p className="text-sm text-green-600 mt-2 text-center font-medium">
                    Pourboire: +{clientInfo.tip.toLocaleString('fr-FR')}F
                  </p>
                )}
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-500">
              <h2 className="font-bold text-xl mb-4 text-gray-800">Résumé</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total ({cartItems.reduce((sum, i) => sum + i.quantity, 0)} articles)</span>
                  <span className="font-bold">{totalPrice.toLocaleString('fr-FR')} F</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Livraison</span>
                  <span className={`font-bold ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
                    {deliveryFee === 0 ? 'Gratuite' : `${deliveryFee.toLocaleString('fr-FR')} F`}
                  </span>
                </div>
                
                {promoApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Code promo</span>
                    <span className="font-bold">-{promoDiscount.toLocaleString('fr-FR')} F</span>
                  </div>
                )}
                
                {usePoints && pointsDiscount > 0 && (
                  <div className="flex justify-between text-purple-600">
                    <span>Points utilisés</span>
                    <span className="font-bold">-{pointsDiscount.toLocaleString('fr-FR')} F</span>
                  </div>
                )}
                
                {tipAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>💝 Pourboire livreur</span>
                    <span className="font-bold">+{tipAmount.toLocaleString('fr-FR')} F</span>
                  </div>
                )}
                
                <div className="border-t-2 pt-3 flex justify-between">
                  <span className="font-black text-xl">TOTAL</span>
                  <span className="font-black text-2xl text-[#E4002B]">
                    {grandTotal.toLocaleString('fr-FR')} F
                  </span>
                </div>
              </div>

              {/* Delivery Info Box */}
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-blue-800 flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Livraison
                  </span>
                  <span className="font-bold text-blue-600 flex items-center gap-1">
                    <Timer className="w-4 h-4" />
                    15-20 min
                  </span>
                </div>
                <p className="text-sm text-blue-700">
                  📍 Zone: {deliveryEstimate.zone}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  💰 Frais: {deliveryInfo.free ? 'Gratuite (commande ≥ 20 000F)' : `${deliveryInfo.fee.toLocaleString('fr-FR')} F`}
                </p>
              </div>

              <button
                onClick={handleOrder}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl mt-4 flex items-center justify-center gap-2 transition-colors"
              >
                <Truck className="w-5 h-5" />
                Livraison : 500-2000 F (selon zone)
              </button>
            </div>

            {/* WhatsApp Quick Order */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-500">
              <div className="text-center">
                <div className="inline-block bg-green-500 text-white px-6 py-3 rounded-xl font-black text-lg mb-4">
                  ⚡ COMMANDE RAPIDE EN 1 CLIC
                </div>
                
                <div className="flex flex-wrap justify-center gap-4 mb-4 text-sm">
                  <span className="flex items-center gap-1 text-green-700">
                    <Check className="w-4 h-4" /> Confirmation rapide
                  </span>
                  <span className="flex items-center gap-1 text-green-700">
                    <MessageCircle className="w-4 h-4" /> Suivi direct
                  </span>
                  <span className="flex items-center gap-1 text-green-700">
                    <Star className="w-4 h-4" /> Service VIP
                  </span>
                </div>

                <button
                  onClick={handleOrder}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-black py-5 rounded-xl text-xl flex items-center justify-center gap-3 shadow-xl transition-all hover:scale-105"
                >
                  <MessageCircle className="w-8 h-8" />
                  COMMANDER 🔥
                </button>
              </div>
            </div>

            {/* Trust Banner */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 text-center">
              <p className="font-bold text-amber-800 text-lg mb-2">
                ⭐ Plus de 10 000 clients satisfaits commandent sur WhatsApp !
              </p>
              <p className="text-amber-700 text-sm">
                💡 Service rapide • Confirmation immédiate • Suivi en temps réel
              </p>
            </div>

            {/* Clear Cart */}
            <button
              onClick={() => {
                if (confirm('Vider le panier ?')) clearCart();
              }}
              className="w-full text-gray-400 hover:text-red-500 text-sm transition-colors py-2"
            >
              Vider le panier
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
