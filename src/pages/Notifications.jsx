import { Link } from 'react-router-dom';
import { Bell, Package, Gift, AlertCircle, Check, Trash2, ArrowLeft, CheckCheck } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export default function Notifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order_update':
        return <Package className="w-6 h-6 text-blue-500" />;
      case 'promo':
        return <Gift className="w-6 h-6 text-pink-500" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <main className="pt-20 min-h-screen bg-gray-50 pb-20">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/" className="p-2 bg-white rounded-lg shadow hover:bg-gray-50">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <Bell className="w-6 h-6 text-red-500" />
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500">{unreadCount} non lues</p>
            )}
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
              >
                <CheckCheck className="w-4 h-4" />
                Tout lire
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Supprimer toutes les notifications?')) {
                    clearAll();
                  }
                }}
                className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Effacer
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">Aucune notification</h2>
            <p className="text-gray-500">Les notifications sur vos commandes apparaîtront ici</p>
            <Link to="/menu" className="inline-block mt-6 kfc-button text-white px-6 py-3 rounded-xl font-bold">
              Commander maintenant
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${
                  !notification.read ? 'border-l-4 border-l-red-500' : 'border-gray-200'
                }`}
              >
                <div className="p-4">
                  <div className="flex gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      !notification.read ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className={`font-bold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.icon} {notification.title}
                          </h3>
                          <p className="text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">{formatTime(notification.timestamp)}</p>
                        </div>
                        {!notification.read && (
                          <span className="flex-shrink-0 w-3 h-3 bg-red-500 rounded-full"></span>
                        )}
                      </div>
                      
                      <div className="flex gap-3 mt-3">
                        {notification.orderId && (
                          <Link
                            to={`/order-tracking?id=${notification.orderId}`}
                            onClick={() => markAsRead(notification.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold"
                          >
                            Voir la commande
                          </Link>
                        )}
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                          >
                            <Check className="w-4 h-4" />
                            Marquer comme lu
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
