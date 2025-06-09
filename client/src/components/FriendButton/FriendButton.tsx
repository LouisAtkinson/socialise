import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout';
import { FriendButtonProps } from '../../types/types';
import './FriendButton.css';
import { apiBaseUrl } from '../../config';

const FriendButton: React.FC<FriendButtonProps> = ({ userId, friendshipStatus, setFriendshipStatus }) => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [friendshipId, setFriendshipId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const checkFriendshipStatus = async () => {
      try {
        const token = user?.token;

        if (!token) {
          logout();
          return;
        }

        const response = await fetch(`${apiBaseUrl}/friends/status/${user?.id}/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFriendshipStatus(
            data.areFriends 
              ? 'friends' 
            : data.hasPendingRequestFromLoggedInUser 
              ? 'pending' 
            : data.hasPendingRequestFromOtherUser
              ? 'received'
            : 'notFriends');
          setFriendshipId(data.friendshipId || null);
          setLoading(false);        
          } else {
          console.error('Error checking friendship status:', response.statusText);
        }
      } catch (error) {
        console.error('Error checking friendship status:', error);
      }
    };

    checkFriendshipStatus();
  }, [userId]);

  const handleAddFriend = async () => {
    try {
      const token = user?.token;

      if (!token) {
        logout();
        return;
      }

      const response = await fetch(`${apiBaseUrl}/friends/request/${userId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log('Friend request sent successfully');
        setFriendshipStatus('pending');
      } else {
        console.error('Error sending friend request:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const handleAcceptFriendRequest = async () => {
    if (!friendshipId) return;
    
    try {
      const token = user?.token;

      if (!token) {
        logout();
        return;
      }

      const response = await fetch(`${apiBaseUrl}/friends/accept/${friendshipId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log('Friend request accepted successfully');
        setFriendshipStatus('friends');
      } else {
        console.error('Error accepting friend request:', response.statusText);
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleDenyFriendRequest = async () => {
    if (!friendshipId) return;

    try {
      const token = user?.token;

      if (!token) {
        logout();
        return;
      }

      const response = await fetch(`${apiBaseUrl}/friends/reject/${friendshipId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log('Friend request denied successfully');
        setFriendshipStatus(null);
      } else {
        console.error('Error denying friend request:', response.statusText);
      }
    } catch (error) {
      console.error('Error denying friend request:', error);
    }
  };

  const handleRemoveFriend = async () => {
    if (!friendshipId) return;

    try {
      const token = user?.token;

      if (!token) {
        logout();
        return;
      }

      const response = await fetch(`${apiBaseUrl}/friends/delete/${friendshipId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log('Friend removed successfully');
        setFriendshipStatus('notFriends');
      } else {
        console.error('Error removing friend:', response.statusText);
      }
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  if (loading) return (
    <></>
  );

  return (
    <div>
      {(user.id !== userId) && !loading && (
        <div className="friendship-actions">
          {friendshipStatus === 'friends' && (
            <button className='friend-button' onClick={toggleDropdown}>Friends ▼</button>
          )}
          {friendshipStatus === 'pending' && <p className='pending-friends'>Friend request pending</p>}
          {friendshipStatus === 'received' && (
            <div className='accept-reject-btns'>
              <button className='accept-button' onClick={handleAcceptFriendRequest}>Accept friend request</button>
              <button className='reject-button' onClick={handleDenyFriendRequest}>Reject friend request</button>
            </div>
          )}
          {friendshipStatus === 'sent' && <p className='pending-friends'>Friend request sent</p>}
          {friendshipStatus === 'notFriends' && <button onClick={handleAddFriend} className='friend-button'>Add friend</button>}
          {friendshipStatus === 'friends' && isDropdownOpen && (
            <div className="friend-dropdown">
              <button onClick={handleRemoveFriend}>Remove friend</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FriendButton;
