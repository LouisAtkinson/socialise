import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Link } from 'react-router-dom';
import blankImage from '../../images/blank.png';
import { fetchDisplayPicture } from '../../services/displayPictureService';
import { UserFriendProps } from '../../types/types';
import './UserFriend.css';

const UserFriend: React.FC<UserFriendProps> = ({ friend }) => {
  const { user } = useAuthContext();
  const [displayPicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    const fetchFriendData = async () => {
      try {
        const token = user?.token;
        const displayPicture = await fetchDisplayPicture(friend.id, 'thumbnail', token);
        setProfilePicture(displayPicture);
      } catch (error) {
        console.error('Error fetching friend data:', error);
      }
    };

    fetchFriendData();
  }, [friend.id]);

  return (
    <Link to={`/user/${friend.id}`} className='user-friend-link'>
      <div key={friend.id} className="user-friend">
        <img
          src={displayPicture ? displayPicture : blankImage}
          alt={`${friend.firstName}'s profile`}
        />
        <p className='friend-name'>{`${friend.firstName} ${friend.lastName}`}</p>
      </div>
    </Link>
  );
};

export default UserFriend;