import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CreditCard, Smartphone, Truck, Store, MessageCircle, User, Phone, MapPin, Clock, Check, Navigation, Gift, Star, Zap, MapPin as MapPinIcon, Calendar, ChevronDown, Package, Timer } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';
import { calculateDeliveryTime, getDeliveryFee, isRestaurantOpen } from '../utils/deliveryEstimation';
import { supabase } from '../supabase';

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

// Auto-calculate pickup discount (-500F only for pickup)
  const pickupDiscount = deliveryMethod === 'pickup' ? 500 : 0;
  
  // No discount for scheduled (removed)

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

  const deliveryFee = deliveryInfo.fee || 0;
  const pointsDiscount = usePoints ? Math.min(loyaltyPoints, totalPrice) : 0;
  const tipAmount = clientInfo.tip || 0;
  const grandTotal = Math.max(0, totalPrice + deliveryFee - promoDiscount - pointsDiscount - pickupDiscount + tipAmount);
  
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
        addToast('Impossible de récupérer votre position', 'error');
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
      message += `• ${item.quantity}x ${item.name} - ${((item.price || 0) * item.quantity).toLocaleString('fr-FR')}F\n`;
    });
    
    message += `\n💳 *Paiement:* ${
      paymentMethod === 'om' ? 'Orange Money' : 
      paymentMethod === 'sarali' ? 'Sarali' : 
      paymentMethod === 'wave' ? 'Wave' : 
      'Espèces'
    }\n`;
    message += `🚚 *Livraison:* ${deliveryMethod === 'delivery' ? 'Oui (à discuter)' : 'Retrait'}\n`;
    message += `💰 *Frais livraison:* À confirmer avec le livreur\n`;
    message += `📦 *Total:* ${(grandTotal || 0).toLocaleString('fr-FR')}F\n`;
    
    if (clientInfo.notes) {
      message += `\n📝 *Note:* ${clientInfo.notes}`;
    }
    
    return encodeURIComponent(message);
  };

  const handleOrder = async () => {
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

    const orderId = generateOrderId();
    const order = {
      id: orderId,
      client_name: clientInfo.name,
      client_phone: clientInfo.phone,
      client_address: deliveryMethod === 'delivery' ? clientInfo.address : 'À emporter',
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total: grandTotal,
      delivery_fee: 0, // À discuter avec le livreur
      delivery_method: deliveryMethod,
      payment_method: paymentMethod,
      status: 'en attente',
      notes: clientInfo.notes || '',
      delivery_note: 'Frais de livraison à confirmer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Sauvegarder dans Supabase
    const { error } = await supabase.from('commandes').insert([order]);

    if (error) {
      addToast('Erreur lors de la commande. Veuillez appeler le restaurant.', 'error');
      console.error('Supabase error:', error);
      return;
    }

    setOrderDetails({ ...order, items: [...cartItems] });
    setOrderPlaced(true);

    // Sauvegarder aussi en local pour historique local
    localStorage.setItem('rchicken_user', JSON.stringify(clientInfo));
    localStorage.setItem('last_order_id', orderId);

    clearCart();
    addToast('Commande enregistrée ! Nous vous appellerons pour confirmer.', 'success');
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
          <div className="bg-card rounded-2xl shadow-xl p-8 border-4 border-green-500">
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
                Le restaurant vous appellera au <span className="font-black">{orderDetails.client_phone}</span> pour confirmer votre commande.
              </p>
            </div>

            <Link 
              to={`/order-tracking?id=${orderDetails.id}`}
              className="block bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-4 mb-6 transition-colors"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-card/20 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-bold">Suivre ma commande</p>
                  <p className="text-sm text-white/80">Cliquez pour voir l'avancement</p>
                </div>
              </div>
            </Link>

            <div className="text-left bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-bold text-primary mb-3">📋 Récapitulatif</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                   <span className="text-gray-600">Client</span>
                   <span className="font-bold">{orderDetails.client_name}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-gray-600">Téléphone</span>
                   <span className="font-bold">{orderDetails.client_phone}</span>
                 </div>
                 {orderDetails.client_address && orderDetails.client_address !== 'À emporter' && (
                   <div className="flex justify-between">
                     <span className="text-gray-600">Adresse</span>
                     <span className="font-bold text-right max-w-[150px]">{orderDetails.client_address}</span>
                   </div>
                 )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Articles</span>
                  <span className="font-bold">{orderDetails.items.reduce((sum, i) => sum + i.quantity, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total</span>
                  <span className="font-black text-lg text-[#E4002B]">{(grandTotal || 0).toLocaleString('fr-FR')}F</span>
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
          <div className="bg-card rounded-2xl shadow-xl p-12 text-center">
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
            <div className="card p-6">
              <h2 className="font-bold text-xl mb-4 text-center text-primary">
                Comment récupérer votre commande ?
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    deliveryMethod === 'pickup'
                      ? 'border-green-500 bg-green-50 shadow-lg'
                      : 'border-input hover:border-primary'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">🏪</div>
                    <h3 className="font-black text-xl text-primary">À EMPORTER</h3>
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <span className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-1">
                        <Timer className="w-4 h-4" />
                        10-15 min
                      </span>
                    </div>
                    <p className="text-xs text-green-600 mt-2 font-medium">
                      ⚡ Prêt en 10-15 min - Venez récupérer !
                    </p>
                    {pickupDiscount > 0 && (
                      <span className="inline-block mt-2 bg-green-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                        🎉 -500F
                      </span>
                    )}
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
                    <h3 className="font-black text-xl text-primary">LIVRAISON</h3>
                    <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
                      <span className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-1">
                        <Timer className="w-4 h-4" />
                        {deliveryEstimate.formatted}
                      </span>
                      <span className="bg-amber-500 text-white px-3 py-2 rounded-full font-bold text-sm">
                        À discuter
                      </span>
                    </div>
                  </div>
                  {deliveryMethod === 'delivery' && (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </button>
              </div>
               
              <div className="mt-3 text-center text-sm text-gray-600">
                <p className="flex items-center justify-center gap-2 mt-1 font-bold text-green-700">
                  <span>🕐</span>
                  Ouvert 24h/24, 7j/7 - Commandez à toute heure !
                </p>
                {deliveryMethod === 'delivery' && clientInfo.address && (
                  <p className="flex items-center justify-center gap-2 mt-1 text-blue-600 font-medium">
                    <span>📍</span>
                    Zone: {deliveryEstimate.zone}
                  </p>
                )}
                {deliveryMethod === 'delivery' && (
                  <p className="text-amber-600 text-sm mt-2 text-center font-medium">
                    💡 Frais de livraison selon votre zone (500-2000 F)
                    <br />
                    <span className="text-gray-500">Le livreur confirmera le montant exact à la commande</span>
                  </p>
                )}
              </div>
            </div>

            {/* Delivery Time Selection */}
            <div className="bg-card rounded-2xl shadow-lg p-6 border border-amber-200">
              <h2 className="font-bold text-xl mb-4 text-center text-primary">
                ⏰ Quand souhaitez-vous recevoir ?
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setDeliveryTime('asap')}
                  className={`p-6 rounded-2xl border-3 transition-all ${
                    deliveryTime === 'asap'
                      ? 'border-green-500 bg-green-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">⚡</div>
                    <h3 className="font-black text-xl text-primary">Dés que possible</h3>
                    <p className="text-xs text-green-600 mt-2 font-medium">
                      🚀 Commande immédiate
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setDeliveryTime('scheduled')}
                  className={`relative p-6 rounded-2xl border-3 transition-all ${
                    deliveryTime === 'scheduled'
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">📅</div>
                    <h3 className="font-black text-xl text-primary">Planifier</h3>
                    <p className="text-xs text-purple-600 mt-2 font-medium">
                      🎯 Commandez à l'avance
                    </p>
                    
                  </div>
                </button>
              </div>

              {deliveryTime === 'scheduled' && (
                <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <p className="font-bold text-purple-700 mb-3">📅 Choisissez la date et l'heure :</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                      <input
                        type="date"
                        value={clientInfo.scheduledDate || ''}
                        onChange={e => setClientInfo({ ...clientInfo, scheduledDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Heure</label>
                      <input
                        type="time"
                        value={clientInfo.scheduledTime || ''}
                        onChange={e => setClientInfo({ ...clientInfo, scheduledTime: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Items */}
            <div className="bg-card rounded-2xl shadow-lg p-6 border border-amber-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg text-primary">Articles ({cartItems.length})</h2>
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
                       <p className="text-[#E4002B] font-black">{(item.price || 0).toLocaleString('fr-FR')} F</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-card border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-card border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100"
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
            <div className="bg-card rounded-2xl shadow-lg p-6 border border-amber-200">
              <h2 className="font-bold text-xl mb-4 text-primary">Vos informations</h2>
              
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

                <button
                  onClick={() => setShowOrderForOther(!showOrderForOther)}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                    showOrderForOther
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 bg-purple-50'
                  }`}
                >
                  <Gift className="w-5 h-5 text-purple-600" />
                  <span className="font-bold text-purple-700">
                    🎁 Commander pour quelqu'un d'autre
                  </span>
                </button>
                
                {showOrderForOther && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200 space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-purple-700 mb-2">Nom du destinataire *</label>
                      <input
                        type="text"
                        value={clientInfo.recipientName || ''}
                        onChange={e => setClientInfo({ ...clientInfo, recipientName: e.target.value })}
                        placeholder="Nom de la personne qui reçoit"
                        className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-purple-700 mb-2">Téléphone du destinataire</label>
                      <input
                        type="tel"
                        value={clientInfo.recipientPhone || ''}
                        onChange={e => setClientInfo({ ...clientInfo, recipientPhone: e.target.value })}
                        placeholder="+223 XX XX XX XX"
                        className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                )}


                {deliveryMethod === 'delivery' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Adresse de livraison *</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={clientInfo.address}
                          onChange={e => setClientInfo({ ...clientInfo, address: e.target.value })}
                          placeholder="Quartier, rue, numéro..."
                          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-amber-500"
                        />
                        <button
                          type="button"
                          onClick={getCurrentLocation}
                          disabled={gettingLocation}
                          className={`px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                            clientInfo.latitude && clientInfo.longitude
                              ? 'bg-green-500 text-white'
                              : 'bg-amber-500 text-white hover:bg-amber-600'
                          }`}
                          title="Partager ma position GPS"
                        >
                          {gettingLocation ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <MapPin className="w-5 h-5" />
                              <span className="hidden sm:inline"> GPS</span>
                            </>
                          )}
                        </button>
                      </div>
                      {clientInfo.latitude && clientInfo.longitude && (
                        <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                          <Check className="w-4 h-4" /> Position GPS activée
                        </p>
                      )}
                      {!clientInfo.latitude && !clientInfo.longitude && (
                        <p className="text-amber-600 text-xs mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> Cliquez sur GPS pour partager votre position
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card rounded-2xl shadow-lg p-6 border border-amber-200">
              <h2 className="font-bold text-xl mb-4 text-primary">Mode de paiement</h2>
              
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-amber-500 text-lg font-medium bg-card"
              >
                <option value="cash">💵 Cash à la livraison</option>
                <option value="om">🟠 Orange Money</option>
                <option value="wave">🔵 Wave</option>
                <option value="sarali">🟡 Sarali</option>
              </select>
            </div>

            

            

            {/* Order Summary */}
            <div className="bg-card rounded-2xl shadow-lg p-6 border-2 border-red-500">
              <h2 className="font-bold text-xl mb-4 text-primary">Résumé</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total ({cartItems.reduce((sum, i) => sum + i.quantity, 0)} articles)</span>
                   <span className="font-bold">{(totalPrice || 0).toLocaleString('fr-FR')} F</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-bold text-amber-600">
                    À discuter
                  </span>
                </div>
                
                {pickupDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Réduction À emporter</span>
                    <span className="font-bold">-{pickupDiscount.toLocaleString('fr-FR')} F</span>
                  </div>
                )}
                
                
                
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
                     <span className="font-bold">+{(tipAmount || 0).toLocaleString('fr-FR')} F</span>
                  </div>
                )}
                
                <div className="border-t-2 pt-3 flex justify-between">
                  <span className="font-black text-xl">TOTAL</span>
                  <span className="font-black text-2xl text-[#E4002B]">
                    {(grandTotal || 0).toLocaleString('fr-FR')} F
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
                  💰 Frais: {deliveryInfo.free ? 'Gratuite (commande ≥ 20 000F)' : `${(deliveryInfo.fee || 0).toLocaleString('fr-FR')} F`}
                </p>
              </div>

              <button
                onClick={handleOrder}
                className="w-full bg-[#E4002B] hover:bg-[#C4001F] text-white font-black py-4 rounded-xl mt-4 flex items-center justify-center gap-2 transition-colors"
              >
                <Truck className="w-5 h-5" />
               Commander en ligne
              </button>
            </div>

            {/* Commander maintenant par WhatsApp ou Appel */}
            <div className="bg-card rounded-2xl shadow-lg p-6 border-2 border-green-500">
              <p className="text-center font-black text-primary text-lg mb-2">
                Commandez maintenant !
              </p>
              <p className="text-center text-gray-500 text-sm mb-5">
                Appelez-nous ou envoyez votre panier par WhatsApp. Nous vous rappelons pour confirmer.
              </p>
              <div className="space-y-3">
                <a
                  href={`https://wa.me/${RESTAURANT_PHONE}?text=${encodeURIComponent(`Bonjour R-CHICKEN !\n\nJe voudrais commander :\n${cartItems.map(i => `• ${i.quantity}x ${i.name} — ${((i.price || 0) * i.quantity).toLocaleString('fr-FR')}F`).join('\n')}\n\nTotal : ${(grandTotal || 0).toLocaleString('fr-FR')}F\n\nMode : ${deliveryMethod === 'delivery' ? 'Livraison' : 'À emporter'}\nPaiement : ${paymentMethod === 'om' ? 'Orange Money' : paymentMethod === 'wave' ? 'Wave' : paymentMethod === 'sarali' ? 'Sarali' : 'Espèces'}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-xl text-lg flex items-center justify-center gap-3 transition-colors"
                >
                  <MessageCircle className="w-6 h-6" />
                  Commander par WhatsApp
                </a>
                <a
                  href="tel:+22383806129"
                  className="w-full bg-[#E4002B] hover:bg-[#C4001F] text-white font-black py-4 rounded-xl text-lg flex items-center justify-center gap-3 transition-colors"
                >
                  <Phone className="w-6 h-6" />
                  Appeler : +223 83 80 61 29
                </a>
              </div>
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
