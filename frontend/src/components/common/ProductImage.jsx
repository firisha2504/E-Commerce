import React, { useState } from 'react';

const ProductImage = ({ src, alt, className, productName }) => {
  const [imageError, setImageError] = useState(false);
  
  // Generate a food-related placeholder based on product name
  const getPlaceholderImage = (name) => {
    const foodKeywords = {
      'doro': 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop',
      'kitfo': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
      'injera': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      'tibs': 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop',
      'coffee': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
      'juice': 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop',
      'tej': 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop',
      'vegetarian': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      'orange': 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop',
      'mango': 'https://images.unsplash.com/photo-1605027990121-3b2c6c7cb4c2?w=400&h=300&fit=crop',
    };
    
    const lowerName = (name || '').toLowerCase();
    for (const [keyword, image] of Object.entries(foodKeywords)) {
      if (lowerName.includes(keyword)) {
        return image;
      }
    }
    
    // Default food placeholder
    return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop';
  };

  // Check if the src is a local path that doesn't exist - use placeholder immediately
  const isLocalPath = src && (src.startsWith('/images/') || src.startsWith('./images/') || src.startsWith('images/'));
  
  // Use placeholder images for local paths or when there's an error
  const imageSrc = (isLocalPath || imageError) ? getPlaceholderImage(productName || alt) : src;

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
    />
  );
};

export default ProductImage;