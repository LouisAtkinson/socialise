import { apiBaseUrl } from "../config";

export async function fetchNotifications(token: string, userId: string) {
  const response = await fetch(`${apiBaseUrl}/notifications/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error fetching notifications');
  }

  const data = await response.json();
  return data;
}

export async function deleteNotification(token: string, notificationId: number) {
  const response = await fetch(`${apiBaseUrl}/notifications/${notificationId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error deleting notification');
  }

  return true;
}

export async function markNotificationAsRead(token: string, notificationId: number) {
  const response = await fetch(`${apiBaseUrl}/notifications/mark-as-read/${notificationId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error marking notification as read');
  }

  return true;
}

export async function markAllNotificationsAsRead(token: string, userId: number) {
  const response = await fetch(`${apiBaseUrl}/notifications/mark-all-as-read/${userId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error marking all notifications as read');
  }

  return true;
}

export async function clearAllNotifications(token: string, userId: number) {
  const response = await fetch(`${apiBaseUrl}/notifications/all/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error clearing all notifications');
  }

  return true;
}