import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import { FriendButtonProps } from '../types/types';

const FriendButton: React.FC<FriendButtonProps> = ({ userId }) => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [friendshipStatus, setFriendshipStatus] = useState<string | null>(null);

  useEffect(() => {
    const checkFriendshipStatus = async () => {
      try {
        const token = user?.token;

        if (!token) {
          logout();
          return;
        }

        const response = await fetch(`/api/friends/status/${user?.id}/${userId}`, {
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
            : null);        } else {
          console.error('Error checking friendship status:', response.statusText);
        }
      } catch (error) {
        console.error('Error checking friendship status:', error);
      }
    };

    checkFriendshipStatus();
  }, [userId, user, logout]);

  const handleAddFriend = async () => {
    try {
      const token = user?.token;

      if (!token) {
        logout();
        return;
      }

      const response = await fetch(`/api/friends/add/${user?.id}/${userId}`, {
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
    try {
      const token = user?.token;

      if (!token) {
        logout();
        return;
      }

      const response = await fetch(`/api/friends/accept/${user?.id}/${userId}`, {
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
    try {
      const token = user?.token;

      if (!token) {
        logout();
        return;
      }

      const response = await fetch(`/api/friends/deny/${user?.id}/${userId}`, {
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
    try {
      const token = user?.token;

      if (!token) {
        logout();
        return;
      }

      const response = await fetch(`/api/friends/remove/${user?.id}/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log('Friend removed successfully');
        setFriendshipStatus(null);
      } else {
        console.error('Error removing friend:', response.statusText);
      }
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  return (
    <div>
      {(user.id !== userId) &&
        (<div className="friendship-actions">
        {friendshipStatus === 'friends' && <p>Friends</p>}
        {friendshipStatus === 'pending' && <p>Friend request pending</p>}
        {friendshipStatus === 'received' && (
          <div>
            <button onClick={handleAcceptFriendRequest}>Accept friend request</button>
            <button onClick={handleDenyFriendRequest}>Deny friend request</button>
          </div>
        )}
        {friendshipStatus === 'sent' && <p>Friend request sent</p>}
        {!friendshipStatus && <button onClick={handleAddFriend}>Add friend</button>}
        {friendshipStatus === 'friends' && <button onClick={handleRemoveFriend}>Remove friend</button>}
      </div>)}
    </div>
  );
};

export default FriendButton;
