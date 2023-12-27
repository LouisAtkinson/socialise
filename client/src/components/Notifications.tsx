import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { NotificationType } from '../types/types';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';

const Notifications = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [notifications, setNotifications] = useState<NotificationType[]>();
  const [unreadCount, setUnreadCount] = useState(2);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = user?.token;

        if (!token) {
          logout();
          return;
        }

        const response = await fetch(`/api/user/${user.id}/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
          
          const unread = data.filter((notification: NotificationType) => !notification.isRead);
          setUnreadCount(unread.length);
        } else {
          console.error('Error fetching notifications:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const deleteNotification = async (notificationId: string) => {
    try {
      const token = user?.token;

      if (!token) {
        logout();
        return;
      }

      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setNotifications((prevNotifications) =>
          prevNotifications?.filter((notification: NotificationType) =>
            notification.id !== notificationId
          )
        );
        setUnreadCount((count) => Math.max(0, count - 1));
      } else {
        console.error('Error deleting notification:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const token = user?.token;

      if (!token) {
        logout();
        return;
      }

      const response = await fetch(`/api/notifications/${notificationId}/markAsRead`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setNotifications((prevNotifications) =>
          prevNotifications?.map((notification: NotificationType) =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );
        setUnreadCount((count) => Math.max(0, count - 1));
      } else {
        console.error('Error marking notification as read:', response.statusText);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="notifications-dropdown">
      <div className="notifications-link">
        <span>Notifications</span>
        {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
        {/* <span className="notification-count">2</span> */}
      </div>
      <div className="notifications-menu">
        <h3>Notifications</h3>
        {notifications?.length === 0 ? (
          <p>No new notifications</p>
        ) : (
          <ul>
            {notifications?.map((notification: NotificationType) => (
              <li key={notification.id}>
                {!notification.isRead ? (
                  <strong>{notification.sender.firstName} {notification.sender.lastName}</strong>
                ) : (
                  `${notification.sender.firstName} ${notification.sender.lastName}`
                )}{' '}
                {notification.content}
                {!notification.isRead && (
                  <button onClick={() => markAsRead(notification.id)}>&times;</button>
                )}
                <button onClick={() => deleteNotification(notification.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;