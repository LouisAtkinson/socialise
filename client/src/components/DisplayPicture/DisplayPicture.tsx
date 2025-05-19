import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import blankImage from '../../images/blank.png';
import Comment from '../Comment/Comment';
import LikesSection from '../LikeSection/LikeSection';
import { CommentData, Like, DisplayPictureOwner } from '../../types/types';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout';
import { fetchDisplayPicture } from '../../helpers/helpers';
import LikeButton from '../LikeButton/LikeButton';
import './DisplayPicture.css';

function DisplayPicture() {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [displayPicture, setDisplayPicture] = useState<string | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [uploadDate, setUploadDate] = useState<Date | null>(null);
  const [displayPictureId, setDisplayPictureId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [owner, setOwner] = useState<DisplayPictureOwner | null>(null);
  const [commentInputVisible, setCommentInputVisible] = useState<Boolean>(false);
  const location = useLocation();
  const userId = location.pathname.split('/')[2];
  const navigate = useNavigate();

  React.useEffect(() => {
    setIsLiked(likes.some(like => like._id === user?.id));
  }, [likes, user]);  

  const fetchDisplayPictureData = async () => {
    try {
      const displayPicture = await fetchDisplayPicture(userId);
      setDisplayPicture(displayPicture);
    } catch (error) {
      console.error('Error fetching display picture:', error);
    }
    try {
      const response = await fetch(`https://socialise-seven.vercel.app/api/display-pictures/user/${userId}/details`);
      if (response.ok) {
        const displayPictureData = await response.json();
        setComments(displayPictureData.comments);
        setLikes(displayPictureData.likes);
        setUploadDate(displayPictureData.uploadDate);
        setDisplayPictureId(displayPictureData.displayPictureId);
        setIsLoading(false);
        setOwner(displayPictureData.user);
      } else {
        console.error('Error fetching display picture details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching display picture details:', error);
    }
  };

  const handleLikeClick = async () => {
    try {
      const token = user?.token;

      if (!token) {
        logout();
        return;
      }

      const endpoint = isLiked
        ? `https://socialise-seven.vercel.app/api/display-pictures/${userId}/unlike`
        : `https://socialise-seven.vercel.app/api/display-pictures/${userId}/like`;

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
        console.error('Error liking display picture:', response.statusText);
        return;
      }

      fetchDisplayPictureData();
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error liking display picture:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (comment) {
      try {
        const token = user?.token;

        if (!token) {
          logout();
          return;
        }

        const response = await fetch(`https://socialise-seven.vercel.app/api/display-pictures/${userId}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: comment,
            user: {
              id: user.id,
            },
          }),
        });

        if (!response.ok) {
          console.error('Error adding comment:', response.statusText);
          return;
        }

        fetchDisplayPictureData();
        setComment('');
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  useEffect(() => {
    fetchDisplayPictureData();
  }, [userId]);


  const handleReturnToProfile = () => {
    navigate(`/user/${owner?.id}`);
  };

  return (
    <div className='display-picture'>
      {isLoading ? (
        <h3>Loading...</h3>
      ) : (
        <div className="display-picture">
          <div className='top'>
            <img
              src={displayPicture ? displayPicture : blankImage}
              alt="Display Picture"
            />
            {owner && <h3>{owner.fullName}</h3>}
          </div>
          

          <LikesSection likes={likes} />

          <div className="post-actions">
            <LikeButton isLiked={isLiked} likeFunction={handleLikeClick} />

            <button
              className="comment-button btn-transition"
              onClick={() => setCommentInputVisible(!commentInputVisible)}
            >
              Comment
            </button>
          </div>

          {commentInputVisible && (
            <div className="comments-container">
              <textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className='comment-input'
              />
              <button
                className="submit-comment-btn btn-transition"
                onClick={handleCommentSubmit}
              >
                Post
              </button>
            </div>
          )}

          {comments.length > 0 && (
            <div className='comment-section comments-container'>
              {comments.map((comment) => (
                <Comment
                  key={comment._id}
                  _id={comment._id}
                  authorId={comment.author._id}
                  displayPicture={comment.author.displayPicture}
                  fullName={`${comment.author.firstName} ${comment.author.lastName}`}
                  datetime={comment.date}
                  content={comment.content}
                  parentId={displayPictureId}
                  update={fetchDisplayPictureData}
                  likes={comment.likes}
                  type="displayPicture"
                />
              ))}
            </div>
          )}
        </div>
      )}
      {owner && (
          <button
            className="return-btn btn-transition"
            type="button"
            onClick={handleReturnToProfile}
          >
            Return to profile
          </button>
      )}   
    </div>
  );
}

export default DisplayPicture;