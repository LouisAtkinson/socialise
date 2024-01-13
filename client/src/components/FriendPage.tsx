import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserCard from './UserCard';
import { UserCardProps } from '../types/types';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';

function FriendPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [friends, setFriends] = useState<UserCardProps[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = user?.token;

        if (!token) {
          logout();
          return;
        }
        
        const response = await fetch(`/api/friends/all/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
          throw new Error('Error fetching friends');
        }
        setLoading(false);
        const data = await response.json();
        setFriends(data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
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
              <UserCard key={friend._id} {...friend} />
            ))}
          </div>
        )
      )}
      <button
        className="return-btn"
        type="button"
        onClick={handleReturnToProfile}
      >
        Return to profile
      </button>
    </div>
  );
}

export default FriendPage;