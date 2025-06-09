import { apiBaseUrl } from "../config";

export async function addCommentToPost(postId: number, content: string, userId: number, token: string) {
  const response = await fetch(`${apiBaseUrl}/comments/post/${postId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      content,
      user: { id: userId },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Error adding comment');
  }

  return await response.json();
}

export const addCommentToDisplayPicture = async (
  displayPictureId: number,
  content: string,
  userId: string,
  token: string
) => {
  const endpoint = `${apiBaseUrl}/comments/display-picture/${displayPictureId}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      content,
      user: { id: userId },
    }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
};

export async function toggleLikeComment(
  id: number,
  isLiked: boolean,
  token: string
): Promise<void> {
  const endpoint = isLiked
    ? `${apiBaseUrl}/comments/${id}/unlike`
    : `${apiBaseUrl}/comments/${id}/like`;
  const method = isLiked ? 'DELETE' : 'POST';

  const response = await fetch(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ user: { id } }),
  });

  if (!response.ok) {
    throw new Error(`Error toggling like: ${response.statusText}`);
  }
};

export const deleteComment = async (commentId: number, token: string): Promise<boolean> => {
  const endpoint = `${apiBaseUrl}/comments/${commentId}`;

  const response = await fetch(endpoint, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error('Error deleting comment:', response.statusText);
    return false;
  }

  return true;
};