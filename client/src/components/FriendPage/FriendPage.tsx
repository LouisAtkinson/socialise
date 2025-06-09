import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserCard from '../UserCard/UserCard';
import { UserCardProps } from '../../types/types';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout';
import { fetchFriends } from '../../services/friendService';
import './FriendPage.css';
import { apiBaseUrl } from '../../config';

function FriendPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [friends, setFriends] = useState<UserCardProps[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFriendsHandler = async () => {
      if (!user?.token || !id) {
        if (!user?.token) logout();
        return;
      }

      try {
        const friendsData = await fetchFriends(id, user.token);
        setFriends(friendsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriendsHandler();
  }, [id]);

  const handleReturnToProfile = () => {
    navigate(`/user/${id}`);
  };

  return (
    <div className="friend-page">
      <h2>Friends</h2>
      {loading && <h3>Loading...</h3>}
      {!loading && (
        friends.length === 0 ? (
          <p>No friends added yet.</p>
        ) : (
          <div className="friend-list">
            {friends.map((friend) => (
              <UserCard key={friend.id} {...friend} />
            ))}
          </div>
        )
      )}
      <button
        className="return-btn btn-transition"
        type="button"
        onClick={handleReturnToProfile}
      >
        Return to profile
      </button>
    </div>
  );
}

export default FriendPage;