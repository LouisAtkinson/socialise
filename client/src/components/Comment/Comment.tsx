import React from 'react';
import blankImage from '../../images/blank.png';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout';
import { CommentProps } from '../../types/types';
import { formatDate, fetchDisplayPicture } from '../../helpers/helpers'; 
import { Link } from 'react-router-dom';
import LikesSection from '../LikeSection/LikeSection';
import './Comment.css';

function Comment({ _id, authorId, displayPicture, fullName, datetime, content, likes, parentId, update, type }: CommentProps) {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [isLiked, setIsLiked] = React.useState<boolean>(false);
  const [likesCount, setLikesCount] = React.useState<number>(likes.length);
  const [authorProfilePicture, setAuthorProfilePicture] = React.useState<string | null>(null);

  React.useEffect(() => {
    const getProfilePicture = async () => {
      const picture = await fetchDisplayPicture(authorId);
      setAuthorProfilePicture(picture);
    };

    getProfilePicture();
  }, [authorId]);

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

      const commentType = (type === 'post') ? 'posts' : 'display-pictures';
  
      const endpoint = isLiked 
        ? `https://socialise-seven.vercel.app/api/${commentType}/${parentId}/comments/${_id}/unlike` 
        : `https://socialise-seven.vercel.app/api/${commentType}/${parentId}/comments/${_id}/like`;
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
        ? `https://socialise-seven.vercel.app/api/posts/${parentId}/comments/${_id}`
        : `https://socialise-seven.vercel.app/api/display-pictures/${parentId}/comments/${_id}` 

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
      <Link to={`/user/${authorId}`}>
        <img
          src={authorProfilePicture ? authorProfilePicture : blankImage}
          alt={`${fullName}'s display picture`}
        />
      </Link>
      <div className="comment-info">
        <div className='comment-name-date'>
          <Link to={`/user/${authorId}`}>
            <p className='comment-author'>{fullName}</p>
          </Link>
          <p className='date'>{formatDate(datetime)}</p>
        </div>
        <p className="comment-content break-word">{content}</p>   
        
        <LikesSection likes={likes} />

        <div className="post-actions">
          <button className="like-button btn-transition" onClick={handleLikeClick}>
            {isLiked ? 'Unlike' : 'Like'}
          </button>
        </div>      
      </div>
      {(authorId === user.id) &&
        <button className="delete-comment btn-transition" onClick={handleDeleteClick}>
          Delete
        </button>
      }
    </div>
  );
}

export default Comment;