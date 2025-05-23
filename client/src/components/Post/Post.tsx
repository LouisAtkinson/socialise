import React, { useState, useEffect } from 'react';
import Comment from '../Comment/Comment'; 
import LikesSection from '../LikeSection/LikeSection';
import blankImage from '../../images/blank.png';
import DeleteMenu from '../DeleteMenu/DeleteMenu';
import LikeButton from '../LikeButton/LikeButton';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout';
import { CommentData, Like, PostProps } from '../../types/types';
import { Link } from 'react-router-dom';
import { formatDate, fetchDisplayPicture } from '../../helpers/helpers';
import './Post.css';

function Post({ _id, content, author, recipient, date, likes, comments, update }: PostProps) {  
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

  useEffect(() => {
    setIsLiked(likes.some(like => like._id === user?.id));
  }, [likes, user]);

  useEffect(() => {
    const getProfilePicture = async () => {
      const authorPicture = await fetchDisplayPicture(author._id);
      setAuthorProfilePicture(authorPicture);
    };

    getProfilePicture();
  }, [author._id, recipient]);

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
  
      const endpoint = isLiked ? `https://socialise-seven.vercel.app/api/posts/${_id}/unlike` : `https://socialise-seven.vercel.app/api/posts/${_id}/like`;
      const method = isLiked ? 'DELETE' : 'POST';

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: { id: user?.id },
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

      const response = await fetch(`https://socialise-seven.vercel.app/api/posts/${_id}`, {
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
  
        const response = await fetch(`https://socialise-seven.vercel.app/api/posts/${_id}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            content: newComment, 
            user: {
              id: user?.id
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
          <div className='post-name-date'>
            <div className="post-names-container">
              <Link to={`/user/${author._id}`}>
                <p className="post-author text-transition">{`${author.firstName} ${author.lastName}`}</p>
              </Link>
              {recipient && (
                <>
                  <span className="recipient-arrow">{' > '}</span>
                  <Link to={`/user/${recipient._id}`}>
                    <p className="post-recipient text-transition">{`${recipient.firstName} ${recipient.lastName}`}</p>
                  </Link>
                </>
              )}
            </div>
            <div className="date-container">
              <p className='date'>{formatDate(date)}</p>
            </div>
          </div>
        </div>
        {author._id === user?.id || (recipient && recipient._id === user?.id) ? (
          <DeleteMenu deleteFunction={handleDeleteClick} />
        ) : null}
      </div>
        <p className="post-content break-word">{content}</p>

        <LikesSection likes={likes}/>
  
        <div className="post-actions">
          <LikeButton isLiked={isLiked} likeFunction={handleLikeClick} />
  
          <button
            className="comment-button btn-transition"
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
            className="comment-input"
          />
          <button className='submit-comment-btn btn-transition' onClick={handleCommentSubmit}>Post</button>
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
                  type="post"
                />
              </div>
            )}

            {showComments && remainingComments?.map((comment) => (
              <Comment
                key={comment._id}
                _id={comment._id}
                authorId={comment.author._id}
                displayPicture={comment.author.displayPicture}
                fullName={`${comment.author.firstName} ${comment.author.lastName}`}
                datetime={comment.date}
                content={comment.content}
                likes={comment.likes}
                parentId={_id}
                update={update}
                type="post"
              />
            ))}
          </div>
        )}

        {remainingComments?.length > 0 && (
          <button
            className="show-more-comments-button btn-transition"
            onClick={() => setShowComments(!showComments)}
          >
            {showComments
              ? 'Hide comments'
              : `Show ${remainingComments.length} more comment${
                  remainingComments.length === 1 ? '' : 's'
                }`}
          </button>
        )}
      </div>
      
    </div>
  );
}  

export default Post;