import React, { useState } from 'react';
import { useNotifications, Notification } from '../hooks/useNotifications';

const NotificationsIcon: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      markAllAsRead();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleBellClick}
        className="p-1.5 hover:bg-red-700 rounded-full transition-colors"
        aria-label="Notifications"
      >
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      </button>

      {showDropdown && (
        <div className="fixed right-2 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 max-h-[80vh] overflow-y-auto">
          <div className="p-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-semibold">Notifications</h3>
              <button 
                onClick={() => setShowDropdown(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-center py-3 text-sm">No notifications</p>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification: Notification) => (
                  <div
                    key={notification.id}
                    className={`p-2 rounded ${
                      notification.read ? 'bg-gray-50' : 'bg-red-50'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <p className="text-sm text-gray-600">{notification.body}</p>
                    <span className="text-xs text-gray-400">
                      {new Date(notification.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsIcon; 