import heic2any from 'heic2any';

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

export async function convertHeicToJpeg(file: File): Promise<Blob> {
  if (file.type !== 'image/heic' && !file.name.toLowerCase().endsWith('.heic')) {
    return file; // Not HEIC, return original
  }
  try {
    const result = await heic2any({
      blob: file,
      toType: 'image/jpeg',
    });
    
    if (Array.isArray(result)) {
      // heic2any returned an array of blobs, take the first one
      return result[0];
    }

    // Single blob returned
    return result;
  } catch (error) {
    console.error('HEIC conversion failed:', error);
    return file;
  }
}