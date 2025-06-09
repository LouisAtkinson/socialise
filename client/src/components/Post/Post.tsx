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
import { formatDate } from '../../helpers/helpers';
import { fetchDisplayPicture } from '../../services/displayPictureService';
import { likePost, unlikePost, deletePost } from '../../services/postService';
import { addCommentToPost } from '../../services/commentService';
import './Post.css';
import { apiBaseUrl } from '../../config';

function Post({ id, content, author, recipient, date, likes, comments, update }: PostProps) {  
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
    setIsLiked(likes.some(like => like.id === user?.id));
  }, [likes, user]);

  useEffect(() => {
    const getProfilePicture = async () => {
      const token = user?.token;
      const authorPicture = await fetchDisplayPicture(author.id, 'thumbnail', token);
      setAuthorProfilePicture(authorPicture);
    };

    getProfilePicture();
  }, [author.id, recipient]);

  const handleCommentButtonClick = () => {
    setShowCommentInput(!showCommentInput);
  };

 const handleLikeClick = async () => {
    if (!user?.token) {
      logout();
      return;
    }

    try {
      if (isLiked) {
        await unlikePost(id, user.id, user.token);
        setLikesCount(likesCount - 1);
      } else {
        await likePost(id, user.id, user.token);
        setLikesCount(likesCount + 1);
      }
      setIsLiked(!isLiked);
      update();
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error liking/unliking post:', error.message);
      } else {
        console.error('Unknown error liking/unliking post');
      }
    }
  };

  const handleDeleteClick = async () => {
    if (!user?.token) {
      logout();
      return;
    }

    try {
      await deletePost(id, user.token);
      update();
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error deleting post:', error.message);
      } else {
        console.error('Unknown error deleting post');
      }
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment) return;

    if (!user?.token || !user.id) {
      logout();
      return;
    }

    try {
      await addCommentToPost(id, newComment, user.id, user.token);
      setNewComment('');
      update();
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error adding comment:', error.message);
      } else {
        console.error('Unknown error adding comment');
      }
    }
  };

  return (
    <div className="post-container">
      <div className="post">
      <div className="post-header">
        <Link to={`/user/${author.id}`}>
          <img
            src={authorProfilePicture ? authorProfilePicture : blankImage}
            alt={`${author.firstName}'s display picture`}
          />
        </Link>
        <div className="post-info">
          <div className='post-name-date'>
            <div className="post-names-container">
              <Link to={`/user/${author.id}`}>
                <p className="post-author text-transition">{`${author.firstName} ${author.lastName}`}</p>
              </Link>
              {recipient && (
                <>
                  <span className="recipient-arrow">{' > '}</span>
                  <Link to={`/user/${recipient.id}`}>
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
        {author.id === user?.id || (recipient && recipient.id === user?.id) ? (
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
                  key={firstComment.id}
                  id={firstComment.id}
                  authorId={firstComment.author.id}
                  displayPicture={authorProfilePicture}
                  fullName={`${firstComment.author.firstName} ${firstComment.author.lastName}`}
                  datetime={firstComment.date}
                  content={firstComment.content}
                  likes={firstComment.likes}
                  parentId={id}
                  update={update}
                  type="post"
                />
              </div>
            )}

            {showComments && remainingComments?.map((comment) => (
              <Comment
                key={comment.id}
                id={comment.id}
                authorId={comment.author.id}
                displayPicture={comment.author.displayPicture}
                fullName={`${comment.author.firstName} ${comment.author.lastName}`}
                datetime={comment.date}
                content={comment.content}
                likes={comment.likes}
                parentId={id}
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