import React, { useState } from 'react';
import Comment from './Comment'; 
import LikesSection from './LikeSection';
import blankImage from '../images/blank.png';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import { CommentData, Like, PostProps } from '../types/types';
import { Link } from 'react-router-dom';
import { formatDate, fetchDisplayPicture } from '../helpers/helpers';

function Post({ _id, content, author, date, likes, comments, update }: PostProps) {  
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [showCommentInput, setShowCommentInput] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');
  const [authorProfilePicture, setAuthorProfilePicture] = useState<string | null>(null);
  const firstComment = comments?.length ? comments[0] : null;
  const remainingComments = comments?.slice(1);

  const [likesCount, setLikesCount] = useState<number>(likes.length);

  React.useEffect(() => {
    setIsLiked(likes.some(like => like._id === user?.id));
  }, [likes, user]);  

  React.useEffect(() => {
    const getProfilePicture = async () => {
      const picture = await fetchDisplayPicture(author._id);
      setAuthorProfilePicture(picture);
    };

    getProfilePicture();
  }, [author._id]);

  const handleCommentButtonClick = () => {
    setShowCommentInput(!showCommentInput);
  };

  const handleLikeClick = async () => {
    try {
      const token = user?.token;
  
      if (!token) {
        logout();
        return;
      }
  
      const endpoint = isLiked ? `/api/posts/${_id}/unlike` : `/api/posts/${_id}/like`;
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
      const token = user?.token;

      if (!token) {
        logout();
        return;
      }

      const response = await fetch(`/api/posts/${_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.ok) {
        update();
      } else {
        console.error('Error deleting post:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (newComment) {
      try {
        const token = user?.token;
  
        if (!token) {
          logout();
          return;
        }
  
        const response = await fetch(`/api/posts/${_id}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            content: newComment, 
            user: {
              id: user.id
            } }),
        });
  
        if (!response.ok) {
          console.error('Error adding comment:', response.statusText);
          return;
        } else {
          update();
        }
  
        const newCommentData = await response.json();
        setNewComment('');
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  return (
    <div className="post-container">
      <div className="post">
        <div className="post-header">
          <Link to={`/user/${author._id}`}>
            <img
              src={authorProfilePicture ? authorProfilePicture : blankImage}
              alt={`${author.firstName}'s display picture`}
            />
          </Link>
          <div className="post-info">
            <Link to={`/user/${author._id}`}>
              <p className="post-author">{`${author.firstName} ${author.lastName}`}</p>
            </Link>
            <p className='date'>{formatDate(date)}</p>
          </div>
          {(author._id === user.id) && <button className="delete-post" onClick={handleDeleteClick}>
            Delete
          </button>}
        </div>
        <p className="post-content">{content}</p>

        <LikesSection likes={likes}/>
  
        <div className="post-actions">
          <button className="like-button" onClick={handleLikeClick}>
            {isLiked ? 'Unlike' : 'Like'}
          </button>
  
          <button
            className="comment-button"
            onClick={handleCommentButtonClick}
          >
            Comment
          </button>
        </div>
      </div>

      {showCommentInput && (
        <div className="comments-container">
          <textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button className='submit-comment-btn' onClick={handleCommentSubmit}>Submit</button>
        </div>
      )}

      <div className={comments?.length > 0 ? 'comment-section' : ''}>
        {(firstComment || showComments) && (
          <div className="comments-container">
            {firstComment && (
              <div className="first-comment">
                <Comment
                  key={firstComment._id}
                  _id={firstComment._id}
                  authorId={firstComment.author._id}
                  displayPicture={authorProfilePicture}
                  fullName={`${firstComment.author.firstName} ${firstComment.author.lastName}`}
                  datetime={firstComment.date}
                  content={firstComment.content}
                  likes={firstComment.likes}
                  parentId={_id}
                  update={update}
                  type="Post"
                />
              </div>
            )}

            {showComments && remainingComments?.map((comment) => (
              <Comment
                key={comment._id}
                _id={comment._id}
                authorId={comment.author._id}
                displayPicture={authorProfilePicture}
                fullName={`${comment.author.firstName} ${comment.author.lastName}`}
                datetime={comment.date}
                content={comment.content}
                likes={comment.likes}
                parentId={_id}
                update={update}
                type="Post"
              />
            ))}
          </div>
        )}

        {remainingComments?.length > 0 && (
          <button
            className="show-more-comments-button"
            onClick={() => setShowComments(!showComments)}
          >
            {showComments
              ? 'Hide Comments'
              : `Show ${remainingComments.length} More Comments`}
          </button>
        )}
      </div>
      
    </div>
  );
}  

export default Post;