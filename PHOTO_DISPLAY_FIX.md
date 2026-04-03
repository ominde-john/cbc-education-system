# Photo Display Issue - Troubleshooting Guide

## Problem
Staff photos are not displaying in the Dashboard, List, or Details views, even when you upload or paste them.

## Root Cause
**The `photo` column doesn't exist in the `teachers` table yet.** Without this database column, the backend cannot save or retrieve photo URLs, so the data is lost.

## Solution - Step by Step

### Step 1: Run the Migration in Supabase
1. Open **Supabase Dashboard** → Your Project → **SQL Editor**
2. Create a new query and paste this SQL:

```sql
-- Add photo column to teachers table
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS photo TEXT;

-- Add index for faster queries  
CREATE INDEX IF NOT EXISTS idx_teachers_photo ON teachers(photo) WHERE photo IS NOT NULL;

-- Add comment
COMMENT ON COLUMN teachers.photo IS 'URL to staff photo stored in Supabase Storage (staff-images bucket)';
```

3. Click **Run** button
4. You should see: `Success. No rows returned`

### Step 2: Verify the Column Was Added
In the SQL Editor, run:

```sql
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'teachers' AND column_name = 'photo';
```

Expected result:
| column_name | data_type |
|-------------|-----------|
| photo       | text      |

### Step 3: Test Photo Upload
1. Go back to your application
2. Edit a staff member
3. In the **"Staff Photo"** section, paste an image OR enter a photo URL
4. Click **"Save Changes"**  
5. The photo should now display in:
   - ✅ Dashboard recent staff list
   - ✅ Staff details view
   - ✅ Staff list view (ListView)

### Step 4: Verify in Database
Run this query to confirm photos are being saved:

```sql
SELECT id, photo FROM teachers WHERE photo IS NOT NULL LIMIT 5;
```

You should see staff records with their photo URLs like:
```
id                                   | photo
-------------------------------------|--------------------------------------------------
72e18b3b-e61e-4ff5-b263-0dc614336139 | https://...yp8lzcgfjqz.supabase.co/...
```

## How Photo Upload Works

```
User uploads photo in FormView
    ↓
handleImagePaste() converts to base64 OR handlePhotoChange() accepts URL
    ↓
onFieldChange('photo', base64String/url) updates form state
    ↓
handleSave() detects base64 and uploads to Supabase Storage
    ↓
uploadStaffPhoto() returns public URL
    ↓
updateTeacher() sends URL to backend
    ↓
staffMemberToBackend() maps photo field
    ↓
Backend saves photo URL to teachers.photo column
    ↓
backendToStaffMember() retrieves photo URL
    ↓
DashboardView displays in recent staff list
```

## Debugging Logs

Once the column exists, you'll see these console logs (Press F12 → Console):

```
[DEBUG] handleSave photo field: data:image/jpeg;base64/9j/4AAQ...
[DEBUG] handleSave photo is base64: true
[DEBUG] Uploading base64 photo to Supabase...
[DEBUG] Photo uploaded, new URL: https://...staff-photos/72e18b3b...jpg
[DEBUG] formWithPhoto.photo explicitly: https://...jpg
[DEBUG] staffMemberToBackend input staff object: {photo: "https://...jpg", ...}
[DEBUG] staffMemberToBackend photo property: https://...jpg
[DEBUG] staffMemberToBackend setting photo: https://...jpg
[DEBUG] staffMemberToBackend output photo specifically: https://...jpg
```

If these logs show `undefined` or empty for photo, then:
1. Check that the form actually has a photo value
2. Verify FormView.handlePhotoChange/handleImagePaste are being triggered
3. Check browser console for errors

## Still Having Issues?

**Check 1: Is the database column there?**
```sql
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS photo TEXT;
```

**Check 2: Is Supabase Storage configured?**
- You need a public bucket named `staff-images`
- See /PHOTO_SETUP.md in Frontend folder for storage policies

**Check 3: Check browser console for errors**
- Press F12 → Console tab
- Look for errors from Supabase storage uploads
- Check the network tab to see if photos are being saved

**Check 4: Verify backend is accepting photo field**
- Check that teacher.controller.js includes photo in the update
- Verify the SQL update statement includes photo column

## Quick Verification Script

Paste this in browser console to verify the entire flow is working:

```javascript
// Check form has photo field
console.log('🔍 Checking form state...');
console.log('Photo field exists:', !!form?.photo);
console.log('Photo value:', form?.photo?.substring(0, 50));

// Check if base64 or URL
if (form?.photo?.startsWith('data:image')) {
  console.log('✅ Photo is base64 (will be uploaded)');
} else if (form?.photo?.startsWith('http')) {
  console.log('✅ Photo is URL (will be saved directly)');
} else if (form?.photo) {
  console.log('⚠️ Photo is:', form.photo);
} else {
  console.log('❌ Photo field is empty!');
}
```
