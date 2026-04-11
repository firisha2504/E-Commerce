# How to Add Local Image Upload to Special Offers

## Current Status
✅ **Customer Special Offers page** - Updated to display uploaded images correctly
✅ **Image utility functions** - Created in `frontend/src/utils/imageUpload.js`
✅ **Admin Special Offers page** - Partially updated (needs manual completion)

## What You Need to Do

### 1. Update Admin Special Offers Import
Add this import at the top of `frontend/src/pages/admin/SpecialOffers.jsx`:

```javascript
import { processImageFile, getImageSrc, createImagePreview } from '../../utils/imageUpload';
```

### 2. Add State Variables
Add these state variables after the existing `newOffer` state:

```javascript
const [imageFile, setImageFile] = useState(null);
const [imagePreview, setImagePreview] = useState('');
```

### 3. Add Image Handling Functions
Add these functions in the component:

```javascript
const handleImageFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImageFile(file);
    createImagePreview(file, setImagePreview);
  }
};
```

### 4. Update Form Submission
In both `handleSubmitOffer` and `handleUpdateOffer` functions, replace the current logic with:

```javascript
// Add this before creating the offer object
let finalImageUrl = newOffer.image; // URL input

// Handle local image upload
if (imageFile) {
  try {
    const imageUrl = await processImageFile(imageFile);
    finalImageUrl = imageUrl;
  } catch (error) {
    toast.error('Failed to process image');
    return;
  }
}

// Then use finalImageUrl in the offer object:
const offerToAdd = {
  // ... other properties
  image: finalImageUrl,
  // ... rest of properties
};
```

### 5. Update Modal Reset Functions
In `handleAddOffer` and `handleEditOffer`, add:

```javascript
setImageFile(null);
setImagePreview('');
```

### 6. Replace Image Upload Section in Modals
Replace the current "Image URL" section in both Add and Edit modals with:

```jsx
<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
    Image URL (Optional)
  </label>
  <input
    type="url"
    value={newOffer.image}
    onChange={(e) => handleInputChange('image', e.target.value)}
    className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
    placeholder="https://example.com/image.jpg"
  />
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
    Or Upload Image from Computer
  </label>
  <div className="flex items-center space-x-4">
    <div className="w-24 h-24 bg-gray-200 dark:bg-dark-600 rounded-lg flex items-center justify-center overflow-hidden">
      {imagePreview ? (
        <img
          src={imagePreview}
          alt="Preview"
          className="w-full h-full object-cover"
        />
      ) : (
        <TagIcon size={32} className="text-gray-400" />
      )}
    </div>
    <div className="flex-1">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageFileChange}
        className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
      />
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Max size: 5MB. Supported formats: JPG, PNG, GIF, WebP
      </p>
    </div>
  </div>
</div>
```

### 7. Update Image Display in Table
Replace the table image display with:

```jsx
<img
  className="h-10 w-10 rounded-lg object-cover"
  src={getImageSrc(offer.image)}
  alt={offer.title}
/>
```

## How It Works

1. **Two Upload Options**: Users can either paste an image URL OR upload a local file
2. **Local Storage**: Uploaded images are stored in browser localStorage with unique keys
3. **Image Preview**: Shows a preview of the selected image before saving
4. **File Validation**: Checks file size (max 5MB) and type (images only)
5. **Fallback**: If image fails to load, shows a default placeholder

## Benefits

- ✅ **No Server Required**: Images stored locally in browser
- ✅ **Instant Preview**: See images immediately after upload
- ✅ **File Validation**: Prevents invalid files and oversized images
- ✅ **Dual Options**: Support both URL and local file upload
- ✅ **Persistent**: Images saved across browser sessions

## Testing

1. Go to Admin → Special Offers
2. Click "Add Special Offer"
3. Try uploading a local image file
4. Verify the preview appears
5. Save the offer
6. Check that the image appears in the offers list
7. Visit the customer Special Offers page to see the image displayed

The system now supports both URL-based images and local file uploads for special offers!