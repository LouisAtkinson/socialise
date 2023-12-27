import React from 'react';
import { Link } from 'react-router-dom';
import blankImage from '../images/blank.png';
import { useAuthContext } from '../hooks/useAuthContext';
import FriendButton from './FriendButton';
import { UserCardProps } from '../types/types';
import { fetchDisplayPicture } from '../helpers/helpers';

const UserCard: React.FC<UserCardProps> = ({
  id,
  profilePicture,
  firstName,
  lastName,
  hometown,
  visibility,
}) => {
  const { user } = useAuthContext();
  const isCurrentUser = user?.id === id;
  const [displayPicture, setDisplayPicture] = React.useState<string | null>(null);

  React.useEffect(() => {
    const getProfilePicture = async () => {
      if (profilePicture) {
        const picture = await fetchDisplayPicture(id);
        setDisplayPicture(picture);
      }
    };

    getProfilePicture();
  }, [id, profilePicture]);

  return (
    <div className={`user-card ${isCurrentUser ? 'current-user' : ''}`}>
      <Link to={`/user/${id}`}>
        <div className="user-card-display-picture">
          <img src={displayPicture ? displayPicture : blankImage} alt="User Display" />
        </div>
      </Link>
      <div className="user-card-details">
        <Link to={`/user/${id}`}>
          <h3>{`${firstName} ${lastName}`}</h3>
        </Link>
        {visibility.hometown && hometown && <p>Hometown: {hometown}</p>}
      </div>
      <div className="user-card-friendship-actions">
        <FriendButton userId={id} />
      </div>
    </div>
  );
};

export default UserCard;
