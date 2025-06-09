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