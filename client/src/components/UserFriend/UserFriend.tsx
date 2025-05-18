import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import blankImage from '../../images/blank.png';
import { fetchDisplayPicture } from '../../helpers/helpers';
import { UserFriendProps } from '../../types/types';
import './UserFriend.css';

const UserFriend: React.FC<UserFriendProps> = ({ friend }) => {
  const [displayPicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    const fetchFriendData = async () => {
      try {
        const displayPicture = await fetchDisplayPicture(friend._id);
        setProfilePicture(displayPicture);
      } catch (error) {
        console.error('Error fetching friend data:', error);
      }
    };

    fetchFriendData();
  }, [friend._id]);

  return (
    <Link to={`/user/${friend._id}`} className='user-friend-link'>
      <div key={friend._id} className="user-friend">
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