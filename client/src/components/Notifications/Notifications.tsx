import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NotificationType } from '../../types/types';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout';
import blankImage from '../../images/blank.png';
import NotificationCard from '../NotificationCard/NotificationCard';
import { fetchDisplayPicture } from '../../services/displayPictureService';
import { fetchNotifications, deleteNotification, markNotificationAsRead, markAllNotificationsAsRead, clearAllNotifications } from '../../services/notificationService';
import bellSvg from '../../images/bell.svg';
import './Notifications.css';
import { apiBaseUrl } from '../../config';

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
    const loadNotifications = async () => {
      if (!user?.token) {
        logout();
        return;
      }

      setIsLoading(true);

      try {
        const notificationsData = await fetchNotifications(user.token, user.id);
        setNotifications(notificationsData);

        const unread = notificationsData.filter((notification: NotificationType) => !notification.isRead);
        setUnreadCount(unread.length);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching notifications:', error.message);
        } else {
          console.error('Unknown error fetching notifications');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const handleDeleteNotification = async (notificationId: number) => {
    if (!user?.token) {
      logout();
      return;
    }

    try {
      await deleteNotification(user.token, notificationId);
      setNotifications(prev =>
        prev?.filter(notification => notification.id !== notificationId)
      );
      setUnreadCount(count => Math.max(0, count - 1));
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error deleting notification:', error.message);
      } else {
        console.error('Unknown error deleting notification');
      }
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    if (!user?.token) {
      logout();
      return;
    }

    try {
      await markNotificationAsRead(user.token, notificationId);
      setNotifications(prevNotifications =>
        prevNotifications?.map(notification =>
          notification.id === notificationId ? { ...notification, isRead: true } : notification
        )
      );
      setUnreadCount(count => Math.max(0, count - 1));
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error marking notification as read:', error.message);
      } else {
        console.error('Unknown error marking notification as read');
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.token) {
      logout();
      return;
    }

    try {
      await markAllNotificationsAsRead(user.token, user.id);
      setNotifications(prevNotifications =>
        prevNotifications?.map(notification => ({
          ...notification,
          isRead: true,
        }))
      );
      setUnreadCount(0);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error marking all notifications as read:', error.message);
      } else {
        console.error('Unknown error marking all notifications as read');
      }
    }
  };
  
  const handleClearAll = async () => {
    if (!user?.token) {
      logout();
      return;
    }

    try {
      await clearAllNotifications(user.token, user.id);
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error clearing all notifications:', error.message);
      } else {
        console.error('Unknown error clearing all notifications');
      }
    }
  };
  

  return (
    <div className="notifications-dropdown">
      <div className="notifications-link" onClick={() => setIsPopupOpen(!isPopupOpen)}>
        {/* {isMobile ? ( */}
        {/* for now, only show the bell icon no matter the screen width */}
        {true ? (
          <span>
            <svg className="bell" fill="currentColor" height="26px" width="26px" viewBox="0 0 611.999 611.999">
            <path d="M570.107,500.254c-65.037-29.371-67.511-155.441-67.559-158.622v-84.578c0-81.402-49.742-151.399-120.427-181.203
              C381.969,34,347.883,0,306.001,0c-41.883,0-75.968,34.002-76.121,75.849c-70.682,29.804-120.425,99.801-120.425,181.203v84.578
              c-0.046,3.181-2.522,129.251-67.561,158.622c-7.409,3.347-11.481,11.412-9.768,19.36c1.711,7.949,8.74,13.626,16.871,13.626
              h164.88c3.38,18.594,12.172,35.892,25.619,49.903c17.86,18.608,41.479,28.856,66.502,28.856
              c25.025,0,48.644-10.248,66.502-28.856c13.449-14.012,22.241-31.311,25.619-49.903h164.88c8.131,0,15.159-5.676,16.872-13.626
              C581.586,511.664,577.516,503.6,570.107,500.254z M484.434,439.859c6.837,20.728,16.518,41.544,30.246,58.866H97.32
              c13.726-17.32,23.407-38.135,30.244-58.866H484.434z M306.001,34.515c18.945,0,34.963,12.73,39.975,30.082
              c-12.912-2.678-26.282-4.09-39.975-4.09s-27.063,1.411-39.975,4.09C271.039,47.246,287.057,34.515,306.001,34.515z
              M143.97,341.736v-84.685c0-89.343,72.686-162.029,162.031-162.029s162.031,72.686,162.031,162.029v84.826
              c0.023,2.596,0.427,29.879,7.303,63.465H136.663C143.543,371.724,143.949,344.393,143.97,341.736z M306.001,577.485
              c-26.341,0-49.33-18.992-56.709-44.246h113.416C355.329,558.493,332.344,577.485,306.001,577.485z"/>
            <path d="M306.001,119.235c-74.25,0-134.657,60.405-134.657,134.654c0,9.531,7.727,17.258,17.258,17.258
              c9.531,0,17.258-7.727,17.258-17.258c0-55.217,44.923-100.139,100.142-100.139c9.531,0,17.258-7.727,17.258-17.258
              C323.259,126.96,315.532,119.235,306.001,119.235z"/>            </svg>
          </span>
        ) : (
          <span className="text-transition">Notifications</span>
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
              <button className="mark-all-read text-transition" onClick={handleMarkAllAsRead}>
                Mark all as read
              </button>
              <button className="clear-all text-transition" onClick={handleClearAll}>
                Clear all
              </button>
            </div>
          ) : (
            <p className='no-notifications'>No notifications</p>
          )}
          <ul>
            {notifications?.map((notification: NotificationType) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                markAsRead={handleMarkAsRead}
                deleteNotification={handleDeleteNotification}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationPopup;