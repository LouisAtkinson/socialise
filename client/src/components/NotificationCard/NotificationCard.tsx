import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NotificationType, NotificationCardProps } from '../../types/types';
import { fetchDisplayPicture } from '../../services/displayPictureService';
import blankImage from '../../images/blank.png';
import { useAuthContext } from '../../hooks/useAuthContext';
import './NotificationCard.css';

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, markAsRead, deleteNotification }) => {
  const { user } = useAuthContext();
  const [displayPicture, setDisplayPicture] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const token = user?.token;
        const picture = await fetchDisplayPicture(notification.sender.id, 'thumbnail', token);
        setDisplayPicture(picture);
      } catch (error) {
        console.error('Error fetching display picture:', error);
      }
    };

    fetchProfilePicture();
  }, [notification.sender.id]);

  return (
    <li
      key={notification.id}
      onClick={() => markAsRead(notification.id)}
      className={notification.isRead ? 'notification' : 'notification unread'}
    >
      <div className="notification-container">
        {notification.type === 'friendRequest' && (
          <Link to={`/user/${notification.sender.id}`}>
            <div className="notification-content">
              <img
                src={displayPicture || blankImage}
                alt="Sender's display picture"
                className="notification-image"
              />
              <div className="notification-text">
                <strong>
                  {notification.sender.firstName} {notification.sender.lastName}
                </strong>
                <p>has sent you a friend request.</p>
              </div>
            </div>
          </Link>
        )}

        {notification.type === 'friendRequestAccepted' && (
          <Link to={`/user/${notification.sender.id}`}>
            <div className="notification-content">
              <img
                src={displayPicture || blankImage}
                alt="Sender's display picture"
                className="notification-image"
              />
              <div className="notification-text">
                <strong>
                  {notification.sender.firstName} {notification.sender.lastName}
                </strong>
                <p>has accepted your friend request.</p>
              </div>
            </div>
          </Link>
        )}

        {notification.type === 'postComment' && (
          <Link to={`/post/${notification.postId}`}>
            <div className="notification-content">
              <img
                src={displayPicture || blankImage}
                alt="Sender's display picture"
                className="notification-image"
              />
              <div className="notification-text">
                <strong>
                  {notification.sender.firstName} {notification.sender.lastName}
                </strong>
                <p>has commented on your post.</p>
              </div>
            </div>
          </Link>
        )}

        {notification.type === 'displayPictureComment' && (
          <Link to={`/user/${user.id}/display-picture`}>
            <div className="notification-content">
              <img
                src={displayPicture || blankImage}
                alt="Sender's display picture"
                className="notification-image"
              />
              <div className="notification-text">
                <strong>
                  {notification.sender.firstName} {notification.sender.lastName}
                </strong>
                <p>has commented on your display picture.</p>
              </div>
            </div>
          </Link>
        )}

        {notification.type === 'postLike' && (
          <Link to={`/post/${notification.postId}`}>
            <div className="notification-content">
              <img
                src={displayPicture || blankImage}
                alt="Sender's display picture"
                className="notification-image"
              />
              <div className="notification-text">
                <strong>
                  {notification.sender.firstName} {notification.sender.lastName}
                </strong>
                <p>has liked your post.</p>
              </div>
            </div>
          </Link>
        )}

        {notification.type === 'displayPictureLike' && (
          <Link to={`/user/${user.id}/display-picture`}>
            <div className="notification-content">
              <img
                src={displayPicture || blankImage}
                alt="Sender's display picture"
                className="notification-image"
              />
              <div className="notification-text">
                <strong>
                  {notification.sender.firstName} {notification.sender.lastName} 
                </strong>
                <p>has liked your display picture.</p>
              </div>
            </div>
          </Link>
        )}

        {notification.type === 'commentLike' && (
          <Link to={`/post/${notification.postId}`}>
            <div className="notification-content">
              <img
                src={displayPicture || blankImage}
                alt="Sender's display picture"
                className="notification-image"
              />
              <div className="notification-text">
                <strong>
                  {notification.sender.firstName} {notification.sender.lastName}
                </strong>
                <p>has liked your comment.</p>
              </div>
            </div>
          </Link>
        )}

        {notification.type === 'displayPictureCommentLike' && (
          <Link to={`/user/${notification.sender.id}/display-picture`}>
            <div className="notification-content">
              <img
                src={displayPicture || blankImage}
                alt="Sender's display picture"
                className="notification-image"
              />
              <div className="notification-text">
                <strong>
                  {notification.sender.firstName} {notification.sender.lastName}
                </strong>
                <p>has liked your comment.</p>
              </div>
            </div>
          </Link>
        )}

        {notification.type === 'postFromFriend' && (
          <Link to={`/post/${notification.postId}`}>
            <div className="notification-content">
              <img
                src={displayPicture || blankImage}
                alt="Sender's display picture"
                className="notification-image"
              />
              <div className="notification-text">
                <strong>
                  {notification.sender.firstName} {notification.sender.lastName}
                </strong>
                <p>has posted on your wall.</p>
              </div>
            </div>
          </Link>
        )}

        <button
          className="delete-notification-btn delete-hover"
          onClick={() => deleteNotification(notification.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default NotificationCard;