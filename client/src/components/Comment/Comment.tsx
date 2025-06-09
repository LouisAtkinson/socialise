import React from "react";
import blankImage from "../../images/blank.png";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLogout } from "../../hooks/useLogout";
import { CommentProps } from "../../types/types";
import { formatDate } from "../../helpers/helpers";
import { fetchDisplayPicture } from "../../services/displayPictureService";
import {
  toggleLikeComment,
  deleteComment,
} from "../../services/commentService";
import { Link } from "react-router-dom";
import LikesSection from "../LikeSection/LikeSection";
import DeleteMenu from "../DeleteMenu/DeleteMenu";
import LikeButton from "../LikeButton/LikeButton";
import { apiBaseUrl } from "../../config";
import "./Comment.css";

function Comment({
  id,
  authorId,
  displayPicture,
  fullName,
  datetime,
  content,
  likes,
  parentId,
  update,
  type,
}: CommentProps) {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [isLiked, setIsLiked] = React.useState<boolean>(false);
  const [likesCount, setLikesCount] = React.useState<number>(likes.length);
  const [authorProfilePicture, setAuthorProfilePicture] = React.useState<
    string | null
  >(null);

  React.useEffect(() => {
    const getProfilePicture = async () => {
      const token = user?.token;
      const picture = await fetchDisplayPicture(authorId, "thumbnail", token);
      setAuthorProfilePicture(picture);
    };

    getProfilePicture();
  }, [authorId]);

  React.useEffect(() => {
    setIsLiked(likes.some((like) => like.id === user?.id));
  }, [likes, user]);

  const handleLikeClick = async () => {
    try {
      const token = user?.token;

      if (!token) {
        logout();
        return;
      }

      await toggleLikeComment(id, isLiked, token);

      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
      update();
    } catch (error) {
      console.error("Error liking/unliking comment:", error);
    }
  };

  const handleDeleteClick = async () => {
    try {
      const token = user?.token;

      if (!token) {
        logout();
        return;
      }

      const isDeleted = await deleteComment(id, token);

      if (isDeleted) {
        update();
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
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
        <div className="comment-name-date">
          <Link to={`/user/${authorId}`}>
            <p className="comment-author text-transition">{fullName}</p>
          </Link>
          <p className="date">{formatDate(datetime)}</p>
        </div>
        <p className="comment-content break-word">{content}</p>

        <LikesSection likes={likes} />

        <div className="post-actions">
          <LikeButton isLiked={isLiked} likeFunction={handleLikeClick} />
        </div>
      </div>
      {authorId === user?.id ? (
        <DeleteMenu deleteFunction={handleDeleteClick} />
      ) : null}
    </div>
  );
}

export default Comment;
