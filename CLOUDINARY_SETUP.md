# Cloudinary Setup for Book Cover Images

## 1. Create a Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Get your credentials from the dashboard

## 2. Environment Variables

Create a `.env` file in the project root with:

```env
REACT_APP_CLOUDINARY_CLOUD_NAME=your-cloud-name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
REACT_APP_CLOUDINARY_API_KEY=your-api-key
```

## 3. Upload Preset Setup

1. Go to Cloudinary Dashboard → Settings → Upload
2. Create a new upload preset:
   - **Preset Name**: `book-covers` (or any name you prefer)
   - **Signing Mode**: `Unsigned`
   - **Folder**: `book-covers/`
   - **Transformation**: Auto-format and quality optimization

## 4. Features

- ✅ **Sliding Modal**: 30% width, full height, slides from right
- ✅ **Image Upload**: Direct upload to Cloudinary
- ✅ **Image Preview**: Shows uploaded image immediately
- ✅ **Loading States**: Toast notifications for upload progress
- ✅ **Error Handling**: Graceful error handling for failed uploads

## 5. Usage

1. Click "Add New Book" in Admin Dashboard
2. Modal slides in from the right
3. Upload book cover image
4. Fill in book details
5. Submit to create book

The modal takes 30% of screen width and full height, sliding in from the right side.
