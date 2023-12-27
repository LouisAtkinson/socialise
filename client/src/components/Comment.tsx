import React from 'react';
import blankImage from '../images/blank.png';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import { CommentProps } from '../types/types';
import { formatDate } from '../helpers/helpers';
import { Link } from 'react-router-dom';

function Comment({ _id, profilePicture, fullName, datetime, content, likes, parentId, update, type }: CommentProps) {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [isLiked, setIsLiked] = React.useState<boolean>(false);
  const [likesCount, setLikesCount] = React.useState<number>(likes.length);

  React.useEffect(() => {
    setIsLiked(likes.some(like => like._id === user?.id));
  }, [likes, user]);

  const handleLikeClick = async () => {
    try {
      const token = user?.token;
  
      if (!token) {
        logout();
        return;
      }
  
      const endpoint = isLiked 
        ? `/api/posts/${parentId}/comments/${_id}/unlike` 
        : `/api/posts/${parentId}/comments/${_id}/like`;
      const method = isLiked ? 'DELETE' : 'POST';

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: { id: user.id },
        }),
      });
  
      if (!response.ok) {
        console.error('Error liking post:', response.statusText);
        return;
      }
      update();
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };
  
  const handleDeleteClick = async () => {
    try {
      const endpoint = (type === 'post')
        ? `/api/posts/${parentId}/comments/${_id}`
        : `/api/display-pictures/${parentId}/comments/${_id}` 

      const token = user?.token;

      if (!token) {
        logout();
        return;
      }

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.ok) {
        update();
      } else {
        console.error('Error deleting comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };
  
  return (
    <div className="comment">
      <Link to={`/user/${_id}`}>
        <img
          src={profilePicture ? profilePicture : blankImage}
          alt={`${fullName}'s display picture`}
        />
      </Link>
      <div className="comment-info">
        <div className='comment-name-date'>
          <Link to={`/user/${_id}`}>
            <p className='comment-author'>{fullName}</p>
          </Link>
          <p>{formatDate(datetime)}</p>
        </div>
        <p className="comment-content">{content}</p>    
        <div className="post-actions">
        <button className="like-button" onClick={handleLikeClick}>
          {isLiked ? 'Unlike' : 'Like'}
        </button>
        <p className="likes">
          {likes.length === 1 && (
            <>
              <Link to={`/user/${likes[0]._id}`} style={{ color: 'blue' }}>
                {likes[0].firstName} {likes[0].lastName}
              </Link>{' '}
              liked this
            </>
          )}
          {likes.length > 1 && (
            <>
              <Link to={`/user/${likes[0]._id}`} style={{ color: 'blue' }}>
                {likes[0].firstName} {likes[0].lastName}
              </Link>{' '}
              and{' '}
              {likes.length - 1} {likes.length - 1 === 1 ? 'other' : 'others'} liked this
            </>
          )}
        </p> 
      </div>      
      </div>
      <button className="delete-comment" onClick={handleDeleteClick}>
        Delete
      </button>
    </div>
  );
}

export default Comment;