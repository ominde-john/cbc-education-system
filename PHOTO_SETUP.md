# Staff Photo Upload - Setup & Verification Guide

## ✅ Completed Implementation

Your photo upload system is now fully integrated with:
- **Frontend**: Base64 image paste/URL input with automatic Supabase Storage upload
- **Backend**: Photo field support in both `inviteTeacher()` and `updateTeacher()` 
- **Display**: Avatar component with proper error handling and fallback to initials
- **Error Handling**: Graceful fallback if image fails to load

---

## 🔧 Required Supabase Setup (One-Time)

### 1. Create Storage Bucket

Go to **Supabase Dashboard** → **Storage** → **Create new bucket**:

```
Bucket Name: staff-images
Public: ✓ (Must be PUBLIC for image access)
File size limit: 10 MB
Allowed MIME types: image/jpeg, image/png, image/gif, image/webp
```

### 2. Set Bucket Policies

In Supabase Dashboard → Storage → `staff-images` → Policies:

```sql
-- Allow anyone to read (view) photos
CREATE POLICY "Public Read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'staff-images');

-- Allow authenticated users to upload
CREATE POLICY "User Upload" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'staff-images' 
    AND auth.role() = 'authenticated'
  );

-- Allow users to delete their own photos
CREATE POLICY "User Delete" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'staff-images'
    AND auth.role() = 'authenticated'
  );
```

### 3. Update Database Schema

Add `photo` column to teachers table if not already present:

```sql
ALTER TABLE teachers
ADD COLUMN photo TEXT; -- Stores public URL from Supabase Storage

-- Optional: Index for better query performance
CREATE INDEX idx_teachers_photo ON teachers(photo);
```

---

## 🧪 Testing the Implementation

### Test 1: Upload Photo During Registration

1. Create new staff member (Register view)
2. Paste an image into the photo URL field (clipboard paste)
3. Verify the photo preview appears
4. Click "Register"
5. Check browser console - should see upload logs:
   ```
   [DEBUG] Creating new teacher with payload: { photo: "[base64...]" }
   Photo uploaded: https://your-project.supabase.co/storage/v1/object/public/staff-photos/[staffId]-[timestamp].jpg
   ```

### Test 2: Update Existing Staff Photo

1. Select staff member from list
2. Click "Edit Profile"
3. Paste new image into photo field
4. Click "Save Changes"
5. Verify updated photo appears in details view

### Test 3: View Staff List with Photos

1. Navigate to Staff List
2. Photos should appear as images instead of initials
3. If image fails to load, falls back to initials gracefully

### Test 4: Verify Database Storage

```sql
-- Check if photos are saved correctly
SELECT id, first_name, last_name, photo FROM teachers LIMIT 5;

-- Output should show URLs like:
-- https://xxx.supabase.co/storage/v1/object/public/staff-photos/[id]-[timestamp].jpg
```

---

## 🐛 Troubleshooting

### Issue: Photos Not Displaying

**Symptom**: Photo uploads succeed but don't show in the app

**Solutions**:
1. Check browser console for image load errors
2. Verify Supabase storage bucket is **PUBLIC**
3. Verify database has `photo` column
4. Check photo URL format: Should be `https://xxx.supabase.co/storage/v1/object/public/staff-photos/[filename]`

### Issue: Upload Fails

**Symptom**: Error during image upload

**Solutions**:
1. Check browser console for Supabase error
2. Verify `staff-images` bucket exists and is public
3. Check image file size (max 10MB)
4. Verify localStorage has valid `cbe_access_token`

### Issue: Base64 Still Being Saved

**Symptom**: `data:image/jpeg;base64,/9j/4AAQ...` stored in database

**Solutions**:
1. Clear old data: `UPDATE teachers SET photo = NULL;`
2. Verify frontend is uploading to Supabase before sending to backend
3. Check console logs show: `uploadStaffPhoto()` called successfully

### Issue: CORS Errors

**Symptom**: Browser console shows CORS error loading photos

**Solutions**:
1. Verify Supabase storage bucket is public (not private)
2. Check backend CORS config includes `http://localhost:5173`
3. Supabase storage doesn't require backend whitelist for public buckets

---

## 📊 Photo Data Flow

```
User Paste Image or Enter URL
    ↓
FormView detectsBase64 string
    ↓
uploadStaffPhoto() called
    ↓
Fetch Base64 → Convert to Blob
    ↓
Upload to Supabase Storage
    ↓
Get Public URL from response
    ↓
Send URL to backend (not base64!)
    ↓
Backend stores URL in teachers.photo
    ↓
DetailsView displays image from URL
    ↓
Avatar component shows image or initials fallback
```

---

## 🔐 Security Considerations

✅ **Implemented**:
- Base64 images converted to files before upload (reduces storage bloat)
- Public URLs stored in database (not sensitive data)
- Image files validated by Supabase storage policies
- Error handling prevents app crashes from failed uploads

⚠️ **Optional Enhancements**:
- Add image compression before upload
- Validate image dimensions (e.g., 1:1 aspect ratio)
- Add watermark or metadata to uploaded photos
- Implement auto-cleanup of old photos

---

## 📝 Database Field

The `photo` column now stores public HTTPS URLs:

```typescript
// Example data
photo: "https://ywcrsgaxftooovqipkdr.supabase.co/storage/v1/object/public/staff-images/73d67436-0c3a-4ba0-8ace-1b4c9ab84a34-1712667824000.jpg"

// Should NOT be:
photo: "data:image/jpeg;base64,/9j/4AAQSkZJRgABA..." ❌
photo: null // Shows initials fallback ✅
```

---

## 📚 Related Files

- **Frontend Form**: `Frontend/src/pages/teacher/StaffManagement/components/FormView.tsx`
- **Photo Utility**: `Frontend/src/pages/teacher/StaffManagement/photoUtils.ts`
- **Avatar Component**: `Frontend/src/pages/teacher/StaffManagement/components/index.tsx`
- **Staff List**: `Frontend/src/pages/teacher/StaffManagement/components/ListView.tsx`
- **Backend**: `Backend/src/controllers/teacher.controller.js`

---

## ✨ Features

✅ Paste images directly from clipboard  
✅ Enter photo URL  
✅ Auto-convert base64 to proper URL  
✅ Graceful error handling with fallback avatars  
✅ Photo shows in list view and details view  
✅ Support for both new registrations and updates  
✅ Console debugging logs for troubleshooting  
