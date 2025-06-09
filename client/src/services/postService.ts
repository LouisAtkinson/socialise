import { apiBaseUrl } from "../config";

export async function fetchPosts(token: string) {
  const response = await fetch(`${apiBaseUrl}/posts/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401) {
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error fetching posts');
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}

export const fetchPostsByUserId = async (userId: string, token: string) => {
  const response = await fetch(`${apiBaseUrl}/posts/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  return response.json();
};

export async function fetchPostById(id: number, token: string) {
  const response = await fetch(`${apiBaseUrl}/posts/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error fetching post');
  }

  return await response.json();
}

export async function createPost(token: string, content: string, userId: string) {
  const response = await fetch(`${apiBaseUrl}/posts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, userId }),
  });

  if (response.status === 401) {
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error adding post');
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}

export async function createPostOnFriendWall(token: string, friendId: string, content: string, userId: string) {
  const response = await fetch(`${apiBaseUrl}/posts/friend/${friendId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, userId }),
  });

  if (response.status === 401) {
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error adding post to friend wall');
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}

export async function likePost(postId: number, userId: number, token: string) {
  const response = await fetch(`${apiBaseUrl}/posts/${postId}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ user: { id: userId } }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error liking post');
  }

  return await response.json();
}

export async function unlikePost(postId: number, userId: number, token: string) {
  const response = await fetch(`${apiBaseUrl}/posts/${postId}/unlike`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ user: { id: userId } }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error unliking post');
  }

  return await response.json();
}

export async function deletePost(postId: number, token: string) {
  const response = await fetch(`${apiBaseUrl}/posts/${postId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Error deleting post');
  }

  return true;
}