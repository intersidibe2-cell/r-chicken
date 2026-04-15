import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('rchicken_notifications');
    return saved ? JSON.parse(saved) : [];
  });
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    localStorage.setItem('rchicken_notifications', JSON.stringify(notifications));
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev]);
    
    // Play sound for important notifications
    if (notification.playSound) {
      playNotificationSound();
    }
    
    return newNotification;
  }, []);

  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const deleteNotification = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  const playNotificationSound = () => {
    try {
      // Simple notification beep
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      setTimeout(() => {
        oscillator.frequency.value = 1000;
      }, 100);
      setTimeout(() => {
        oscillator.stop();
      }, 200);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  // Check for order status changes
  const checkOrderUpdates = useCallback((orderId, newStatus) => {
    const statusLabels = {
      'pending': 'en attente',
      'confirmed': 'confirmée',
      'preparing': 'en préparation',
      'ready': 'prête',
      'delivered': 'livrée',
      'en attente': 'en attente',
      'en cours': 'en préparation',
      'prêt': 'prête',
      'livré': 'livrée'
    };

    const statusEmojis = {
      'pending': '⏳',
      'confirmed': '✅',
      'preparing': '👨‍🍳',
      'ready': '📦',
      'delivered': '🎉',
      'en attente': '⏳',
      'en cours': '👨‍🍳',
      'prêt': '📦',
      'livré': '🎉'
    };

    addNotification({
      type: 'order_update',
      title: `Commande ${orderId}`,
      message: `Votre commande est maintenant: ${statusLabels[newStatus] || newStatus}`,
      icon: statusEmojis[newStatus] || '📋',
      orderId: orderId,
      status: newStatus,
      playSound: true
    });
  }, [addNotification]);

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    deleteNotification,
    checkOrderUpdates
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
