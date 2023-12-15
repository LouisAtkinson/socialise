import React, { useEffect, useState } from 'react';

const mockNotifications = [
  {
    _id: '1',
    sender: {
      firstName: 'John',
      lastName: 'Doe',
    },
    type: 'friendRequest',
    content: 'sent you a friend request.',
    timestamp: new Date(),
    isRead: false,
  },
  {
    _id: '2',
    sender: {
      firstName: 'Alice',
      lastName: 'Smith',
    },
    type: 'comment',
    content: 'commented on your post.',
    timestamp: new Date(),
    isRead: true,
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="notifications-dropdown">
      <div className="notifications-link" onClick={toggleDropdown}>
        <span>Notifications</span>
        {notifications.length > 0 && <span className="notification-count">{notifications.length}</span>}
      </div>
      {isOpen && (
        <div className="notifications-menu">
          <h3>Notifications</h3>
          {notifications.length === 0 ? (
            <p>No new notifications</p>
          ) : (
            <ul>
              {notifications.map((notification) => (
                <li key={notification._id}>
                  {!notification.isRead ? <strong>{notification.sender.firstName} {notification.sender.lastName}</strong> : `${notification.sender.firstName} ${notification.sender.lastName}`} {notification.content}
                  <span className="notification-timestamp">
                    {new Date(notification.timestamp).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}