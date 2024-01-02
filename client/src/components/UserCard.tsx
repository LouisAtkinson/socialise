import React from 'react';
import { Link } from 'react-router-dom';
import blankImage from '../images/blank.png';
import { useAuthContext } from '../hooks/useAuthContext';
import FriendButton from './FriendButton';
import { UserCardProps } from '../types/types';
import { fetchDisplayPicture } from '../helpers/helpers';

const UserCard: React.FC<UserCardProps> = ({
  _id,
  displayPicture,
  firstName,
  lastName,
  hometown,
  visibility,
}) => {
  const { user } = useAuthContext();
  const isCurrentUser = user?.id === _id;
  const [userDisplayPicture, setUserDisplayPicture] = React.useState<string | null>(null);

  React.useEffect(() => {
    const getProfilePicture = async () => {
      if (userDisplayPicture) {
        const picture = await fetchDisplayPicture(_id);
        setUserDisplayPicture(picture);
      }
    };

    getProfilePicture();
  }, [_id, userDisplayPicture]);

  return (
    <div className={`user-card ${isCurrentUser ? 'current-user' : ''}`}>
      <Link to={`/user/${_id}`}>
        <div className="user-card-display-picture">
          <img src={userDisplayPicture ? userDisplayPicture : blankImage} alt="User Display" />
        </div>
      </Link>
      <div className="user-card-details">
        <Link to={`/user/${_id}`}>
          <h3>{`${firstName} ${lastName}`}</h3>
        </Link>
        {visibility?.hometown && hometown && <p>Hometown: {hometown}</p>}
      </div>
      <div className="user-card-friendship-actions">
        <FriendButton userId={_id} />
      </div>
    </div>
  );
};

export default UserCard;
