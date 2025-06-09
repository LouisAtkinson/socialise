import { apiBaseUrl } from "../config";
import { UserCardProps } from "../types/types";

export async function loginUser(formData: { email: string; password: string; }) {
  const response = await fetch(`${apiBaseUrl}/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || 'Login failed');
  }

  return json;
}

export const registerUser = async (formData: Record<string, any>): Promise<any> => {
  try {
    const response = await fetch(`${apiBaseUrl}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error || 'Registration failed.');
    }

    return json;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error during registration:', error.message);
      throw error;
    } else {
      console.error('Unknown error during registration');
      throw new Error('Unknown error during registration.');
    }
  }
};

export const fetchUserData = async (userId: string, token: string) => {
  const response = await fetch(`${apiBaseUrl}/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user information');
  }

  return response.json();
};

export async function updateUserInfo(userId: string, token: string, data: any) {
  const response = await fetch(`${apiBaseUrl}/user/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update user info');
  return response.json();
}

export const fetchUsersByQuery = async (
  searchQuery: string,
  token: string
): Promise<UserCardProps[]> => {
  try {
    const response = await fetch(`${apiBaseUrl}/user/search/${searchQuery}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error searching users: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};