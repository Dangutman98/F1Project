import React from 'react';
import { useNotifications } from '../hooks/useNotifications';

const NotificationTest: React.FC = () => {
  const { notificationToken, showNotification } = useNotifications();

  const handleTestNotification = () => {
    showNotification('Test Notification', {
      body: 'This is a test notification from your F1 app!',
      icon: '/favicon.ico',
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Notification Test</h2>
      <div className="mb-4">
        <p className="text-sm text-gray-600">Notification Token:</p>
        <p className="text-xs break-all">{notificationToken || 'No token available'}</p>
      </div>
      <button
        onClick={handleTestNotification}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
      >
        Send Test Notification
      </button>
    </div>
  );
};

export default NotificationTest; 