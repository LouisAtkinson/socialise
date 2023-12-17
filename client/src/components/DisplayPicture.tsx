import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import blankImage from '../images/blank.png';
import Comment from './Comment';
import { CommentData } from '../types/types';

function DisplayPicture() {
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [userProfile, setUserProfile] = useState({
    profilePicture: '',
    firstName: '',
  });
  const [comments, setComments] = useState<CommentData[]>([]);
  const [likes, setLikes] = useState<number>(0);

  const location = useLocation();
  const displayPictureId = location.pathname.split('/')[2];

  const fetchDisplayPicture = () => {
    fetch(`/api/display-pictures/${displayPictureId}`)
      .then((response) => response.json())
      .then((data) => {
        setUserProfile(data.displayPicture.user);
        setComments(data.comments);
        setLikes(data.likes.length);
      })
    .catch((error) => console.error('Error fetching display picture details:', error));
  }
  useEffect(() => {
    fetchDisplayPicture();
  }, [displayPictureId]);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  const handleCommentSubmit = () => {
  };

  const handleCommentDelete = (commentId: string) => {
  };

  return (
    <div className="display-picture">
      <img
        src={userProfile.profilePicture ? userProfile.profilePicture : blankImage}
        alt={`${userProfile.firstName}'s display picture`}
      />
      {isLiked ? (
        <button onClick={handleLikeClick}>Unlike</button>
      ) : (
        <button onClick={handleLikeClick}>Like</button>
      )}
      <p>{likes} {likes === 1 ? 'like' : 'likes'}</p>
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
          profilePicture={comment.author.profilePicture}
          fullName={`${comment.author.firstName} ${comment.author.lastName}`}
          datetime={comment.date}
          content={comment.content}
          postId={displayPictureId}
          update={fetchDisplayPicture}
        />
      ))}
    </div>
  );
}

export default DisplayPicture;
