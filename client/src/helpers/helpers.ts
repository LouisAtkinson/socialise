import heic2any from 'heic2any';
import imageCompression from 'browser-image-compression';

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

export async function compressImageFile(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.8,       
    maxWidthOrHeight: 800,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Image compression error:', error);
    return file;
  }
}