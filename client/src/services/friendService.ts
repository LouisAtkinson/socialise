import { apiBaseUrl } from "../config";

export async function fetchFriends(userId: string, token: string) {
  const response = await fetch(`${apiBaseUrl}/friends/all/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error fetching friends');
  }

  const data = await response.json();
  return data;
}

export async function checkFriendshipStatus(loggedInUserId: string, targetUserId: string, token: string) {
  const response = await fetch(`${apiBaseUrl}/friends/status/${loggedInUserId}/${targetUserId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error checking friendship status: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function sendFriendRequest(targetUserId: string, token: string) {
  const response = await fetch(`${apiBaseUrl}/friends/request/${targetUserId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error sending friend request: ${response.statusText}`);
  }
  
  return response;
}

export async function acceptFriendRequest(friendshipId: number, token: string) {
  const response = await fetch(`${apiBaseUrl}/friends/accept/${friendshipId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error accepting friend request: ${response.statusText}`);
  }

  return response;
}

export async function denyFriendRequest(friendshipId: number, token: string) {
  const response = await fetch(`${apiBaseUrl}/friends/reject/${friendshipId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error denying friend request: ${response.statusText}`);
  }

  return response;
}

export async function removeFriend(friendshipId: number, token: string) {
  const response = await fetch(`${apiBaseUrl}/friends/delete/${friendshipId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error removing friend: ${response.statusText}`);
  }

  return response;
}