export const formatDate = (rawDate: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
    };
  
    const formattedDate = new Date(rawDate).toLocaleString('en-GB', options);
    return formattedDate;
};

export const fetchDisplayPicture = async (userId: string) => {
  try {
    const response = await fetch(`/api/display-pictures/user/${userId}`);
    if (response.ok) {
      const displayPictureBlob = await response.blob();
      return displayPictureBlob instanceof Blob ? URL.createObjectURL(displayPictureBlob) : null;
    } else {
      console.error('Error fetching display picture:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error fetching display picture:', error);
    return null;
  }
};