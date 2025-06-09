import { apiBaseUrl } from "../config";

export const formatDate = (rawDate: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
  
    const formattedDate = new Date(rawDate).toLocaleString('en-GB', options);
    return formattedDate;
};

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