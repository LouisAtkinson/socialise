import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import blankImage from '../images/blank.png';
import Comment from './Comment';
import LikesSection from './LikeSection';
import { CommentData, Like } from '../types/types';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import { fetchDisplayPicture } from '../helpers/helpers';

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

  const location = useLocation();
  const userId = location.pathname.split('/')[2];

  const fetchDisplayPictureData = async () => {
    try {
      const displayPicture = await fetchDisplayPicture(userId);
      setDisplayPicture(displayPicture);
    } catch (error) {
      console.error('Error fetching display picture:', error);
    }
    try {
      const response = await fetch(`/api/display-pictures/user/${userId}/details`);
      if (response.ok) {
        const displayPictureData = await response.json();
        setComments(displayPictureData.comments);
        setLikes(displayPictureData.likes.length);
        setUploadDate(displayPictureData.uploadDate);
        setDisplayPictureId(displayPictureData.displayPictureId);
        setIsLoading(false);
      } else {
        console.error('Error fetching display picture details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching display picture details:', error);
    }
  };

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  const handleCommentSubmit = async () => {
    if (comment) {
      try {
        const token = user?.token;
  
        if (!token) {
          logout();
          return;
        }
  
        const response = await fetch(`/api/display-pictures/${userId}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            content: comment, 
            user: {
              id: user.id
            } }),
        });
  
        if (!response.ok) {
          console.error('Error adding comment:', response.statusText);
          return;
        }
  
        const newCommentData = await response.json();
        setComment('');
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  useEffect(() => {
    fetchDisplayPictureData();
  }, [userId]);

  return (
    <div>
      {(isLoading) 
        ? <h3>Loading...</h3> 
        : <div className="display-picture">
          <img
            src={displayPicture ? displayPicture : blankImage}
            alt="Display Picture"
          />

          <LikesSection likes={likes}/>

          {isLiked ? (
            <button onClick={handleLikeClick}>Unlike</button>
          ) : (
            <button onClick={handleLikeClick}>Like</button>
          )}
          <textarea
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button onClick={handleCommentSubmit}>Comment</button>
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
              type={"displayPicture"}
            />
          ))}
        </div>
      }
    </div>
  );
}

export default DisplayPicture;