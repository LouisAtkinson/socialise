import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout';
import { FriendButtonProps } from '../../types/types';
import { checkFriendshipStatus, sendFriendRequest, acceptFriendRequest, denyFriendRequest, removeFriend } from '../../services/friendService';
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
    const checkFriendshipStatusHandler = async () => {
      try {
        if (!user?.token || !user?.id || !userId) {
          logout();
          return;
        }

        const data = await checkFriendshipStatus(user.id, userId, user.token);

        setFriendshipStatus(
          data.areFriends 
            ? 'friends' 
            : data.hasPendingRequestFromLoggedInUser 
              ? 'pending' 
              : data.hasPendingRequestFromOtherUser
                ? 'received'
                : 'notFriends'
        );

        setFriendshipId(data.friendshipId || null);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    checkFriendshipStatusHandler();
  }, [userId]);

  const handleAddFriend = async () => {
    try {
      if (!user?.token || !userId) {
        logout();
        return;
      }

      await sendFriendRequest(userId, user.token);
      console.log('Friend request sent successfully');
      setFriendshipStatus('pending');
    } catch (error) {
      console.error(error);
    }
  };

  const handleAcceptFriendRequest = async () => {
    if (!friendshipId || !user?.token) {
      if (!user?.token) logout();
      return;
    }

    try {
      await acceptFriendRequest(friendshipId, user.token);
      console.log('Friend request accepted successfully');
      setFriendshipStatus('friends');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDenyFriendRequest = async () => {
    if (!friendshipId || !user?.token) {
      if (!user?.token) logout();
      return;
    }

    try {
      await denyFriendRequest(friendshipId, user.token);
      console.log('Friend request denied successfully');
      setFriendshipStatus(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveFriend = async () => {
    if (!friendshipId || !user?.token) {
      if (!user?.token) logout();
      return;
    }

    try {
      await removeFriend(friendshipId, user.token);
      console.log('Friend removed successfully');
      setFriendshipStatus('notFriends');
    } catch (error) {
      console.error(error);
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
