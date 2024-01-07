import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NotificationType } from '../types/types';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import blankImage from '../images/blank.png';
import NotificationCard from './NotificationCard';
import { fetchDisplayPicture } from '../helpers/helpers';
import bellSvg from '../images/bell.svg';

const NotificationPopup: React.FC = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [notifications, setNotifications] = useState<NotificationType[]>();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
      } finally {
        setIsLoading(false);
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
            notification._id !== notificationId
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
            notification._id === notificationId
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

  const markAllAsRead = async () => {
    try {
      const token = user?.token;
  
      if (!token) {
        logout();
        return;
      }
  
      const response = await fetch(`/api/user/${user.id}/notifications/markAllAsRead`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        setNotifications((prevNotifications) =>
          prevNotifications?.map((notification: NotificationType) => ({
            ...notification,
            isRead: true,
          }))
        );
        setUnreadCount(0);
      } else {
        console.error('Error deleting all notifications:', response.statusText);
      }
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  const clearAll = async () => {
    try {
      const token = user?.token;
  
      if (!token) {
        logout();
        return;
      }
  
      const response = await fetch(`/api/user/${user.id}/notifications`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        setNotifications([]);
        setUnreadCount(0);
      } else {
        console.error('Error clearing all notifications:', response.statusText);
      }
    } catch (error) {
      console.error('Error clearing all notifications:', error);
    }
  };
  

  return (
    <div className="notifications-dropdown">
      <div className="notifications-link" onClick={() => setIsPopupOpen(!isPopupOpen)}>
        {isMobile ? (
          <span>
            <img src={bellSvg} alt='Bell icon' />
          </span>
        ) : (
          <span>Notifications</span>
        )}
        {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
      </div>
      {isPopupOpen && (
        <div className="notifications-menu">
          <h3>Notifications</h3>
          {isLoading ? (
            <p className='notifications-loading'>Loading...</p>
          ) : notifications?.length ?? 0 > 0 ? (
            <div className="notification-buttons">
              <button className="mark-all-read" onClick={markAllAsRead}>
                Mark all as read
              </button>
              <button className="clear-all" onClick={clearAll}>
                Clear all
              </button>
            </div>
          ) : (
            <p className='no-notifications'>No notifications</p>
          )}
          <ul>
            {notifications?.map((notification: NotificationType) => (
              <NotificationCard
                key={notification._id}
                notification={notification}
                markAsRead={markAsRead}
                deleteNotification={deleteNotification}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationPopup;