import { apiBaseUrl } from "../config";
import { compressImageFile } from "../helpers/helpers";

export const fetchDisplayPicture = async (userId: string, type: string, token?: string) => {
  try {
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${apiBaseUrl}/display-pictures/user/${userId}/${type}`, {
      headers,
    });

    if (response.status === 404) {
      // user hasn't uploaded a display picture
      return null;
    }

    if (response.ok) {
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.startsWith('image')) {
        const displayPictureBlob = await response.blob();
        return displayPictureBlob instanceof Blob ? URL.createObjectURL(displayPictureBlob) : null;
      } else {
        return null;
      }
    } else {
      console.error('Error fetching display picture:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error fetching display picture:', error);
    return null;
  }
};

export const fetchDisplayPictureDetails = async (userId: string, token: string) => {
  const endpoint = `${apiBaseUrl}/display-pictures/user/${userId}/details`;

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error('Error fetching display picture details:', response.statusText);
    throw new Error(response.statusText);
  }

  return response.json();
};


export const toggleLikeDisplayPicture = async (
  displayPictureId: number,
  isLiked: boolean,
  userId: string,
  token: string
) => {
  const endpoint = isLiked
    ? `${apiBaseUrl}/display-pictures/${displayPictureId}/unlike`
    : `${apiBaseUrl}/display-pictures/${displayPictureId}/like`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      user: { id: userId },
    }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
};

export async function uploadDisplayPicture(file: File, token: string) {
  const compressedFile = await compressImageFile(file);

  const formData = new FormData();
  formData.append('file', compressedFile);
  
  const response = await fetch(`${apiBaseUrl}/display-pictures/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to upload display picture');
  return response.json();
}