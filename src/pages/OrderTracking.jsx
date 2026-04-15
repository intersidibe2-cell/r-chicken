import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Clock, ChefHat, Truck, Package, Phone, MapPin, Copy, MessageCircle, ArrowLeft, RefreshCw, Bell } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export default function OrderTracking() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');
  const [order, setOrder] = useState(null);
  const [copied, setCopied] = useState(false);
  const [lastStatus, setLastStatus] = useState(null);
  const { checkOrderUpdates } = useNotifications();

  useEffect(() => {
    if (orderId) {
      // Search in both order sources
      const onlineOrders = JSON.parse(localStorage.getItem('rchicken_orders') || '[]');
      const whatsappOrders = JSON.parse(localStorage.getItem('rchicken_whatsapp_orders') || '[]');
      
      const foundOrder = onlineOrders.find(o => o.id === orderId) || 
                         whatsappOrders.find(o => o.id === orderId);
      
      if (foundOrder) {
        // Check if status changed
        if (lastStatus && lastStatus !== foundOrder.status) {
          checkOrderUpdates(orderId, foundOrder.status);
        }
        setLastStatus(foundOrder.status);
        setOrder(foundOrder);
      }
    }
  }, [orderId, checkOrderUpdates]);

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusInfo = (status) => {
    const isWhatsApp = order?.source === 'whatsapp';
    
    if (isWhatsApp) {
      const statuses = {
        pending: { 
          label: 'Commande reçue', 
          description: 'Votre commande a été reçue et est en attente de confirmation',
          icon: Clock, 
          color: 'yellow',
          progress: 25
        },
        confirmed: { 
          label: 'Commande confirmée', 
          description: 'Votre commande a été confirmée et va être préparée',
          icon: CheckCircle, 
          color: 'blue',
          progress: 50
        },
        preparing: { 
          label: 'En préparation', 
          description: 'Nos cuisiniers préparent votre commande avec soin',
          icon: ChefHat, 
          color: 'orange',
          progress: 75
        },
        ready: { 
          label: 'Prête !', 
          description: 'Votre commande est prête pour la livraison/retrait',
          icon: Package, 
          color: 'green',
          progress: 100
        },
        delivered: { 
          label: 'Livrée', 
          description: 'Votre commande a été livrée. Bon appétit !',
          icon: Truck, 
          color: 'green',
          progress: 100
        }
      };
      return statuses[status] || statuses.pending;
    }
    
    // Online orders
    const statuses = {
      'en attente': { 
        label: 'Commande reçue', 
        description: 'Votre commande a été reçue et est en attente de confirmation',
        icon: Clock, 
        color: 'yellow',
        progress: 25
      },
      'en cours': { 
        label: 'En préparation', 
        description: 'Nos cuisiniers préparent votre commande avec soin',
        icon: ChefHat, 
        color: 'orange',
        progress: 75
      },
      'prêt': { 
        label: 'Prête !', 
        description: 'Votre commande est prête pour la livraison/retrait',
        icon: Package, 
        color: 'green',
        progress: 100
      },
      'livré': { 
        label: 'Livrée', 
        description: 'Votre commande a été livrée. Bon appétit !',
        icon: Truck, 
        color: 'green',
        progress: 100
      }
    };
    return statuses[status] || statuses['en attente'];
  };

  const getColorClasses = (color) => {
    const colors = {
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-300', fill: 'bg-yellow-500' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-300', fill: 'bg-blue-500' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-300', fill: 'bg-orange-500' },
      green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-300', fill: 'bg-green-500' }
    };
    return colors[color] || colors.yellow;
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(`Bonjour, je suive ma commande ${orderId}`);
    window.open(`https://wa.me/22383806129?text=${message}`, '_blank');
  };

  // Refresh order status
  const refreshOrder = () => {
    const onlineOrders = JSON.parse(localStorage.getItem('rchicken_orders') || '[]');
    const whatsappOrders = JSON.parse(localStorage.getItem('rchicken_whatsapp_orders') || '[]');
    
    const foundOrder = onlineOrders.find(o => o.id === orderId) || 
                       whatsappOrders.find(o => o.id === orderId);
    
    if (foundOrder) {
      setOrder(foundOrder);
    }
  };

  if (!orderId) {
    return (
      <main className="pt-20 min-h-screen bg-gray-50 pb-20">
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-black text-gray-700 mb-4">Suivre ma commande</h2>
            <p className="text-gray-500 mb-6">Entrez votre numéro de commande pour suivre son état</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const input = e.target.querySelector('input');
              if (input.value) {
                window.location.href = `/order-tracking?id=${input.value}`;
              }
            }}>
              <input 
                type="text" 
                placeholder="Ex: CMD-151224-1234 ou WA-151224-1234"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 mb-4"
              />
              <button type="submit" className="w-full kfc-button text-white px-6 py-3 rounded-xl font-bold">
                Suivre ma commande
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="pt-20 min-h-screen bg-gray-50 pb-20">
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <Package className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-700 mb-4">Commande non trouvée</h2>
            <p className="text-gray-500 mb-6">La commande {orderId} n'existe pas ou a été supprimée</p>
            <Link to="/menu" className="kfc-button text-white px-6 py-3 rounded-xl font-bold inline-block">
              Commander maintenant
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const colorClasses = getColorClasses(statusInfo.color);
  const StatusIcon = statusInfo.icon;

  return (
    <main className="pt-20 min-h-screen bg-gray-50 pb-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/orders" className="p-2 bg-white rounded-lg shadow hover:bg-gray-50">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Suivi de commande</h1>
            <p className="text-gray-500 text-sm">Commande {orderId}</p>
          </div>
          <button onClick={refreshOrder} className="ml-auto p-2 bg-white rounded-lg shadow hover:bg-gray-50">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Status Card */}
        <div className={`${colorClasses.bg} border-2 ${colorClasses.border} rounded-2xl p-6 mb-6`}>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 ${colorClasses.fill} rounded-full flex items-center justify-center`}>
              <StatusIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className={`text-xl font-black ${colorClasses.text}`}>{statusInfo.label}</h2>
              <p className="text-gray-600">{statusInfo.description}</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="bg-white/50 rounded-full h-3 overflow-hidden">
            <div 
              className={`${colorClasses.fill} h-full transition-all duration-500`}
              style={{ width: `${statusInfo.progress}%` }}
            />
          </div>
        </div>

        {/* Order Steps */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">Étapes de votre commande</h3>
          <div className="space-y-4">
            {[
              { status: 'pending', label: 'Commande reçue', icon: Clock },
              { status: 'confirmed', label: 'Confirmée', icon: CheckCircle },
              { status: 'preparing', label: 'En préparation', icon: ChefHat },
              { status: 'ready', label: 'Prête', icon: Package }
            ].map((step, index) => {
              const isWhatsApp = order.source === 'whatsapp';
              let stepStatus = 'pending';
              
              if (isWhatsApp) {
                const orderIndex = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'].indexOf(order.status);
                const stepIndex = ['pending', 'confirmed', 'preparing', 'ready'].indexOf(step.status);
                stepStatus = stepIndex <= orderIndex ? 'completed' : 'pending';
              } else {
                const statusMap = { 'en attente': 0, 'en cours': 1, 'prêt': 2, 'livré': 3 };
                const stepMap = { 'pending': 0, 'confirmed': 0, 'preparing': 1, 'ready': 2 };
                stepStatus = stepMap[step.status] <= (statusMap[order.status] || 0) ? 'completed' : 'pending';
              }
              
              const StepIcon = step.icon;
              const isCompleted = stepStatus === 'completed';
              const isCurrent = (isWhatsApp && step.status === order.status) || 
                               (!isWhatsApp && (
                                 (step.status === 'pending' && order.status === 'en attente') ||
                                 (step.status === 'preparing' && order.status === 'en cours') ||
                                 (step.status === 'ready' && order.status === 'prêt')
                               ));
              
              return (
                <div key={step.status} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-500 text-white' : 
                    isCurrent ? 'bg-yellow-500 text-white animate-pulse' : 
                    'bg-gray-200 text-gray-400'
                  }`}>
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                  </div>
                  {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Détails de la commande</h3>
            <button 
              onClick={copyOrderId}
              className="text-sm text-red-600 flex items-center gap-1"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copié !' : 'Copier'}
            </button>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Numéro</span>
              <span className="font-bold">{order.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Date</span>
              <span className="font-bold">
                {new Date(order.date).toLocaleDateString('fr-FR')} à {new Date(order.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Source</span>
              <span className={`font-bold ${order.source === 'whatsapp' ? 'text-green-600' : 'text-blue-600'}`}>
                {order.source === 'whatsapp' ? '📱 WhatsApp' : '🌐 Site web'}
              </span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-bold text-gray-700 mb-2">Articles</h4>
            <div className="space-y-2">
              {(order.items || []).map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span className="font-bold">{(item.subtotal || item.price * item.quantity).toLocaleString('fr-FR')}F</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-3 pt-3 flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-black text-xl text-red-600">{order.total?.toLocaleString('fr-FR')}F</span>
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">Informations de livraison</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Client</p>
                <p className="font-bold">{order.clientName || order.client?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Téléphone</p>
                <p className="font-bold">{order.clientPhone || order.client?.phone}</p>
              </div>
            </div>
            {(order.clientAddress || order.client?.address) && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="font-bold">{order.clientAddress || order.client?.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* WhatsApp Contact */}
        <div className="bg-green-500 rounded-2xl p-6 text-white text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-3" />
          <h3 className="font-black text-xl mb-2">Besoin d'aide ?</h3>
          <p className="text-white/80 mb-4">Contactez-nous sur WhatsApp pour toute question</p>
          <button 
            onClick={openWhatsApp}
            className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors"
          >
            Contacter sur WhatsApp
          </button>
        </div>
      </div>
    </main>
  );
}
