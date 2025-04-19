import { useState, useEffect } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app } from '../firebase';

export interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: Date;
  read: boolean;
}

export const useNotifications = () => {
  const [notificationToken, setNotificationToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        // For testing purposes, let's add a sample notification
        const sampleNotification: Notification = {
          id: '1',
          title: 'Welcome!',
          body: 'Welcome to F1 Notifications',
          timestamp: new Date(),
          read: false
        };
        setNotifications([sampleNotification]);
        setUnreadCount(1);

        // Actual Firebase messaging setup will go here once we have the proper configuration
        // const messaging = getMessaging(app);
        // const token = await getToken(messaging, {
        //   vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
        // });
        // setNotificationToken(token);
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };

    initializeNotifications();
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const removeNotification = (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  return {
    notificationToken,
    notifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
    removeNotification
  };
}; 