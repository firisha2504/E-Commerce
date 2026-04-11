// Image upload utility functions for special offers

export const processImageFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('Image size must be less than 5MB'));
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file'));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      // Store image in localStorage with unique key
      const imageKey = `special_offer_image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      try {
        localStorage.setItem(imageKey, reader.result);
        resolve(imageKey); // Return the key as the image URL
      } catch (error) {
        reject(new Error('Failed to save image. Image might be too large.'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };
    reader.readAsDataURL(file);
  });
};

export const getImageSrc = (imageSrc) => {
  // If it's a localStorage key, retrieve the actual image data
  if (imageSrc && imageSrc.startsWith('special_offer_image_')) {
    const storedImage = localStorage.getItem(imageSrc);
    return storedImage || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800';
  }
  // If it's a URL or empty, return as is or default
  return imageSrc || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800';
};

export const createImagePreview = (file, callback) => {
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  }
};