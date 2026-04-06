const { createClient } = require('@supabase/supabase-js');
const asyncHandler = require('express-async-handler');
const path = require('path');
const sharp = require('sharp');

// Supabase storage client (service role)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// POST /api/v1/learners/upload-photo
// Upload student profile photo to 'student-photos' bucket
const uploadLearnerPhoto = asyncHandler(async (req, res) => {
  console.log('[uploadLearnerPhoto] START', { 
    hasFile: !!req.file,
    user: req.user ? { id: req.user.id, role: req.user.role, schoolId: req.user.schoolId } : null
  });

  // ✅ FIX #1: Correct auth check
  if (!req.user) {
    console.log('[uploadLearnerPhoto] Not authenticated');
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  if (req.user.role !== 'super_admin' && !req.user.schoolId) {
    console.log('[uploadLearnerPhoto] No school access');
    return res.status(403).json({ success: false, message: 'School access required' });
  }

  if (!req.file) {
    console.log('[uploadLearnerPhoto] No file provided');
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const file = req.file;
  const school_id = req.user.schoolId;
  const admission_number = req.body.filename || req.body.admission_number || path.parse(file.originalname).name;
  
  console.log('[uploadLearnerPhoto] Processing file', { 
    filename: admission_number,
    mimeType: file.mimetype,
    size: file.size,
    schoolId: school_id
  });

  // Validate file type
  if (!file.mimetype.startsWith('image/')) {
    console.log('[uploadLearnerPhoto] Invalid file type:', file.mimetype);
    return res.status(400).json({ success: false, message: 'Only image files allowed' });
  }

  // Validate file size
  if (file.size > 5 * 1024 * 1024) {
    console.log('[uploadLearnerPhoto] File too large');
    return res.status(400).json({ success: false, message: 'File size exceeds 5MB limit' });
  }

  try {
    console.log('[uploadLearnerPhoto] Resizing image...');
    
    // Resize and optimize image (max 400x400, webp)
    const timestamp = Date.now();
    const fileName = `${admission_number}-${timestamp}.webp`;
    const filePath = `students/${school_id}/${fileName}`;

    const buffer = await sharp(file.buffer)
      .resize(400, 400, { fit: 'cover' })
      .webp({ quality: 80 })
      .toBuffer();

    console.log('[uploadLearnerPhoto] Uploading to Supabase...');

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('student-photos')
      .upload(filePath, buffer, {
        contentType: 'image/webp',
        upsert: true
      });

    if (error) {
      console.error('[uploadLearnerPhoto] Storage upload error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to upload photo to storage',
        error: error.message 
      });
    }

    console.log('[uploadLearnerPhoto] Getting public URL...');

    // ✅ FIX #2: Proper error handling for getPublicUrl
    try {
      const { data } = supabase.storage
        .from('student-photos')
        .getPublicUrl(filePath);

      const publicUrl = data?.publicUrl;

      if (!publicUrl) {
        console.error('[uploadLearnerPhoto] No public URL returned');
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to get public URL' 
        });
      }

      console.log('[uploadLearnerPhoto] Success', { publicUrl });

      res.json({
        success: true,
        message: 'Photo uploaded successfully',
        photoUrl: publicUrl,
        filePath: filePath,
        filename: fileName
      });
    } catch (urlError) {
      console.error('[uploadLearnerPhoto] URL generation error:', urlError);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to generate photo URL',
        error: urlError.message 
      });
    }
  } catch (error) {
    console.error('[uploadLearnerPhoto] Processing error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Photo processing failed',
      error: error.message 
    });
  }
});

module.exports = { uploadLearnerPhoto };