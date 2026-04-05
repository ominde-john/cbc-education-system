const { createClient } = require('@supabase/supabase-js');
const asyncHandler     = require('express-async-handler');
const csv              = require('csv-parse/sync');   // npm i csv-parse

// Supabase service-role client (bypasses RLS for admin operations)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Valid grade levels from schema CHECK constraint
const GRADE_LEVELS = [
  'PP1', 'PP2',
  'Grade 1', 'Grade 2', 'Grade 3',
  'Grade 4', 'Grade 5', 'Grade 6',
  'Grade 7', 'Grade 8', 'Grade 9',
];

// ---------------------------------------------------------------------------
// Helper: get supabase client scoped to the request JWT (respects RLS)
// ---------------------------------------------------------------------------
const getClient = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
};

// ---------------------------------------------------------------------------
// Helper: paginate
// ---------------------------------------------------------------------------
const paginate = (query, page = 1, limit = 20) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  return query.range(from, to);
};

// =============================================================================
// 1. POST /api/v1/learners
//    Register a new learner
// =============================================================================
const registerLearner = asyncHandler(async (req, res) => {
  const { schoolId, role } = req.user;
  const {
    first_name,
    last_name,
    admission_number,
    date_of_birth,
    gender,
    email,
    phone,
    address,
    emergency_contact,
    medical_info,
    photo_url
  } = req.body;

  // Validate required fields
  if (!first_name || !last_name || !admission_number || !date_of_birth || !gender) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: first_name, last_name, admission_number, date_of_birth, gender'
    });
  }

  // Validate gender
  if (!['Male', 'Female'].includes(gender)) {
    return res.status(400).json({
      success: false,
      message: 'Gender must be either Male or Female'
    });
  }

  // Check if admission number already exists for this school
  const { data: existing } = await supabase
    .from('learners')
    .select('id')
    .eq('admission_number', admission_number)
    .eq('school_id', schoolId)
    .single();

  if (existing) {
    return res.status(409).json({
      success: false,
      message: 'Admission number already exists for this school'
    });
  }

  // Create learner
  const { data: learner, error } = await supabase
    .from('learners')
    .insert({
      school_id: schoolId,
      first_name,
      last_name,
      admission_number,
      date_of_birth,
      gender,
      email,
      phone,
      address,
      emergency_contact,
      medical_info,
      photo_url,
      created_by: req.user.id
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to register learner',
      error: error.message
    });
  }

  res.status(201).json({
    success: true,
    message: 'Learner registered successfully',
    data: learner
  });
});

// =============================================================================
// 2. GET /api/v1/learners
//    List learners for the school with pagination and filtering
// =============================================================================
const listLearners = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;

  // Log for debugging
  console.log('[listLearners] schoolId:', schoolId);
  console.log('[listLearners] user:', req.user);
  console.log('[listLearners] query:', req.query);

  if (!schoolId) {
    return res.status(400).json({
      success: false,
      message: 'School ID required. Please ensure you are logged in with a valid school admin account.'
    });
  }

  const {
    page = 1,
    limit = 20,
    search,
    gender,
    grade_level, // Note: applied via subquery since on classes, not learners
    is_active: statusFilter, // Match frontend param name
    sort_by = 'first_name',
    sort_order = 'asc'
  } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  // Simplified query: LEFT JOIN to avoid inner join failures on missing enrollments/parents
let query = supabase
    .from('learners')
    .select(`
      id,
      admission_number,
      first_name,
      last_name,
      middle_name,
      date_of_birth,
      gender,
      special_needs,
      is_active,
      created_at,
      school_id
    `, { 
      count: 'exact',
      head: false 
    })
    .eq('school_id', schoolId)
    .order(sort_by, { ascending: sort_order !== 'desc' })
    .range(offset, offset + limitNum - 1);

  // Filters (applied before pagination)
  if (statusFilter !== undefined) {
    const isActive = statusFilter === 'true';
    query = query.eq('is_active', isActive);
  }

  if (gender && ['male', 'female'].includes(gender.toLowerCase())) {
    query = query.eq('gender', gender.charAt(0).toUpperCase() + gender.slice(1));
  }

  if (search) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,admission_number.ilike.%${search}%`);
  }

  // Grade filter: filter learners currently enrolled in matching grade
  if (grade_level) {
    query = query.filter('learner_enrollments', 'is', null); // Exclude unenrolled? Or include all
    // More precise: post-filter or separate query if needed
  }

  try {
    const { data: learners, error, count } = await query;

    if (error) {
      console.error('[listLearners] Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch learners',
        error: error.message,
        details: error.details
      });
    }

    // Post-process: flatten grade_level/stream_name from first active enrollment
    const processedLearners = (learners || []).map(learner => ({
      ...learner,
      grade_level: learner.learner_enrollments?.[0]?.classes?.grade_level || null,
      stream_name: learner.learner_enrollments?.[0]?.classes?.stream || null,
      learner_parents: learner.learner_parents || []
    }));

    console.log(`[listLearners] Found ${processedLearners.length} learners`);

    res.json({
      success: true,
      data: {
        learners: processedLearners,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: count || 0,
          pages: Math.ceil((count || 0) / limitNum)
        }
      }
    });
  } catch (err) {
    console.error('[listLearners] Unexpected error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
});

// =============================================================================
// 3. GET /api/v1/learners/:id
//    Get learner details with enrollment history
// =============================================================================
const getLearner = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id } = req.params;

  // Get learner details
  const { data: learner, error: learnerError } = await supabase
    .from('learners')
    .select(`
      *,
      learner_enrollments(
        id,
        class_id,
        status,
        enrolled_at,
        completed_at,
        classes(id, name, grade_level, stream, academic_year_id)
      )
    `)
    .eq('id', id)
    .eq('school_id', schoolId)
    .single();

  if (learnerError || !learner) {
    return res.status(404).json({
      success: false,
      message: 'Learner not found'
    });
  }

  res.json({
    success: true,
    data: learner
  });
});

// =============================================================================
// 4. PUT /api/v1/learners/:id
//    Update learner details
// =============================================================================
const updateLearner = asyncHandler(async (req, res) => {
  const { schoolId, role } = req.user;
  const { id } = req.params;
  const updates = req.body;

  // Remove fields that shouldn't be updated directly
  delete updates.id;
  delete updates.school_id;
  delete updates.created_at;
  delete updates.created_by;

  // Validate gender if provided
  if (updates.gender && !['Male', 'Female'].includes(updates.gender)) {
    return res.status(400).json({
      success: false,
      message: 'Gender must be either Male or Female'
    });
  }

  // Check if admission number conflict (if updating admission_number)
  if (updates.admission_number) {
    const { data: existing } = await supabase
      .from('learners')
      .select('id')
      .eq('admission_number', updates.admission_number)
      .eq('school_id', schoolId)
      .neq('id', id)
      .single();

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Admission number already exists for this school'
      });
    }
  }

  const { data: learner, error } = await supabase
    .from('learners')
    .update(updates)
    .eq('id', id)
    .eq('school_id', schoolId)
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update learner',
      error: error.message
    });
  }

  if (!learner) {
    return res.status(404).json({
      success: false,
      message: 'Learner not found'
    });
  }

  res.json({
    success: true,
    message: 'Learner updated successfully',
    data: learner
  });
});

// =============================================================================
// 5. DELETE /api/v1/learners/:id
//    Soft delete learner (set is_active = false)
// =============================================================================
const deleteLearner = asyncHandler(async (req, res) => {
  const { schoolId, role } = req.user;
  const { id } = req.params;

  // Check if learner has active enrollments
  const { data: activeEnrollments } = await supabase
    .from('learner_enrollments')
    .select('id')
    .eq('learner_id', id)
    .eq('status', 'enrolled');

  if (activeEnrollments && activeEnrollments.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete learner with active enrollments. Please unenroll first.'
    });
  }

  const { data: learner, error } = await supabase
    .from('learners')
    .update({ is_active: false })
    .eq('id', id)
    .eq('school_id', schoolId)
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete learner',
      error: error.message
    });
  }

  if (!learner) {
    return res.status(404).json({
      success: false,
      message: 'Learner not found'
    });
  }

  res.json({
    success: true,
    message: 'Learner deleted successfully'
  });
});

// =============================================================================
// 6. POST /api/v1/learners/:id/enroll
//    Enroll learner in a class
// =============================================================================
const enrollLearner = asyncHandler(async (req, res) => {
  const { schoolId, role } = req.user;
  const { id } = req.params;
  const { class_id, enrollment_date } = req.body;

  if (!class_id) {
    return res.status(400).json({
      success: false,
      message: 'class_id is required'
    });
  }

  // Verify learner belongs to school
  const { data: learner } = await supabase
    .from('learners')
    .select('id, first_name, last_name')
    .eq('id', id)
    .eq('school_id', schoolId)
    .single();

  if (!learner) {
    return res.status(404).json({
      success: false,
      message: 'Learner not found'
    });
  }

  // Verify class belongs to school
  const { data: classData } = await supabase
    .from('classes')
    .select('id, name, capacity')
    .eq('id', class_id)
    .eq('school_id', schoolId)
    .single();

  if (!classData) {
    return res.status(404).json({
      success: false,
      message: 'Class not found'
    });
  }

  // Check current enrollment count
  const { count: enrolledCount } = await supabase
    .from('learner_enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('class_id', class_id)
    .eq('status', 'enrolled');

  if (enrolledCount >= classData.capacity) {
    return res.status(400).json({
      success: false,
      message: 'Class is at full capacity'
    });
  }

  // Check if learner is already enrolled in this class
  const { data: existingEnrollment } = await supabase
    .from('learner_enrollments')
    .select('id, status')
    .eq('learner_id', id)
    .eq('class_id', class_id)
    .single();

  if (existingEnrollment) {
    if (existingEnrollment.status === 'enrolled') {
      return res.status(409).json({
        success: false,
        message: 'Learner is already enrolled in this class'
      });
    } else {
      // Re-enroll
      const { data: enrollment, error } = await supabase
        .from('learner_enrollments')
        .update({
          status: 'enrolled',
          enrolled_at: enrollment_date || new Date().toISOString()
        })
        .eq('id', existingEnrollment.id)
        .select()
        .single();

      if (error) {
        return res.status(500).json({
          success: false,
          message: 'Failed to re-enroll learner',
          error: error.message
        });
      }

      return res.json({
        success: true,
        message: 'Learner re-enrolled successfully',
        data: enrollment
      });
    }
  }

  // Create new enrollment
  const { data: enrollment, error } = await supabase
    .from('learner_enrollments')
    .insert({
      learner_id: id,
      class_id,
      status: 'enrolled',
      enrolled_at: enrollment_date || new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to enroll learner',
      error: error.message
    });
  }

  res.status(201).json({
    success: true,
    message: 'Learner enrolled successfully',
    data: enrollment
  });
});

// =============================================================================
// 7. GET /api/v1/learners/:id/enrollments
//    Get learner enrollment history
// =============================================================================
const getEnrollmentHistory = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id } = req.params;

  // Verify learner belongs to school
  const { data: learner } = await supabase
    .from('learners')
    .select('id')
    .eq('id', id)
    .eq('school_id', schoolId)
    .single();

  if (!learner) {
    return res.status(404).json({
      success: false,
      message: 'Learner not found'
    });
  }

  const { data: enrollments, error } = await supabase
    .from('learner_enrollments')
    .select(`
      id,
      status,
      enrolled_at,
      completed_at,
      classes(id, name, grade_level, stream, academic_year_id)
    `)
    .eq('learner_id', id)
    .order('enrolled_at', { ascending: false });

  if (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch enrollment history',
      error: error.message
    });
  }

  res.json({
    success: true,
    data: enrollments || []
  });
});

// =============================================================================
// 8. POST /api/v1/learners/:id/promote
//    Promote learner to next grade
// =============================================================================
const promoteLearner = asyncHandler(async (req, res) => {
  const { schoolId, role } = req.user;
  const { id } = req.params;
  const { new_class_id, promotion_date } = req.body;

  if (!new_class_id) {
    return res.status(400).json({
      success: false,
      message: 'new_class_id is required'
    });
  }

  // Get current enrollment
  const { data: currentEnrollment } = await supabase
    .from('learner_enrollments')
    .select(`
      id,
      class_id,
      classes!inner(grade_level, school_id)
    `)
    .eq('learner_id', id)
    .eq('status', 'enrolled')
    .single();

  if (!currentEnrollment) {
    return res.status(400).json({
      success: false,
      message: 'Learner is not currently enrolled in any class'
    });
  }

  if (currentEnrollment.classes.school_id !== schoolId) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  // Complete current enrollment
  await supabase
    .from('learner_enrollments')
    .update({
      status: 'completed',
      completed_at: promotion_date || new Date().toISOString()
    })
    .eq('id', currentEnrollment.id);

  // Enroll in new class
  const { data: newEnrollment, error } = await supabase
    .from('learner_enrollments')
    .insert({
      learner_id: id,
      class_id: new_class_id,
      status: 'enrolled',
      enrolled_at: promotion_date || new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to promote learner',
      error: error.message
    });
  }

  res.json({
    success: true,
    message: 'Learner promoted successfully',
    data: newEnrollment
  });
});

// =============================================================================
// 9. POST /api/v1/learners/:id/transfer
//    Transfer learner to another class
// =============================================================================
const transferLearner = asyncHandler(async (req, res) => {
  const { schoolId, role } = req.user;
  const { id } = req.params;
  const { new_class_id, transfer_date } = req.body;

  if (!new_class_id) {
    return res.status(400).json({
      success: false,
      message: 'new_class_id is required'
    });
  }

  // Get current enrollment
  const { data: currentEnrollment } = await supabase
    .from('learner_enrollments')
    .select('id, class_id')
    .eq('learner_id', id)
    .eq('status', 'enrolled')
    .single();

  if (!currentEnrollment) {
    return res.status(400).json({
      success: false,
      message: 'Learner is not currently enrolled in any class'
    });
  }

  // Complete current enrollment
  await supabase
    .from('learner_enrollments')
    .update({
      status: 'transferred',
      completed_at: transfer_date || new Date().toISOString()
    })
    .eq('id', currentEnrollment.id);

  // Enroll in new class
  const { data: newEnrollment, error } = await supabase
    .from('learner_enrollments')
    .insert({
      learner_id: id,
      class_id: new_class_id,
      status: 'enrolled',
      enrolled_at: transfer_date || new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to transfer learner',
      error: error.message
    });
  }

  res.json({
    success: true,
    message: 'Learner transferred successfully',
    data: newEnrollment
  });
});

// =============================================================================
// 10. GET /api/v1/learners/:id/report-card
//     Get learner report card
// =============================================================================
const getReportCard = asyncHandler(async (req, res) => {
  const { schoolId } = req.user;
  const { id } = req.params;
  const { academic_year_id } = req.query;

  // Verify learner belongs to school
  const { data: learner } = await supabase
    .from('learners')
    .select('id, first_name, last_name, admission_number')
    .eq('id', id)
    .eq('school_id', schoolId)
    .single();

  if (!learner) {
    return res.status(404).json({
      success: false,
      message: 'Learner not found'
    });
  }

  // Get current enrollment
  let query = supabase
    .from('learner_enrollments')
    .select(`
      id,
      class_id,
      classes!inner(id, name, grade_level, stream, academic_year_id)
    `)
    .eq('learner_id', id)
    .eq('status', 'enrolled');

  if (academic_year_id) {
    query = query.eq('classes.academic_year_id', academic_year_id);
  }

  const { data: enrollment } = await query.single();

  if (!enrollment) {
    return res.status(404).json({
      success: false,
      message: 'No active enrollment found for this learner'
    });
  }

  // Get assessments for this learner in this class
  const { data: assessments } = await supabase
    .from('assessments')
    .select(`
      id,
      subject_id,
      assessment_type,
      score,
      max_score,
      assessment_date,
      subjects!inner(name, code)
    `)
    .eq('learner_id', id)
    .eq('class_id', enrollment.class_id)
    .order('assessment_date', { ascending: false });

  res.json({
    success: true,
    data: {
      learner,
      class: enrollment.classes,
      assessments: assessments || []
    }
  });
});

// =============================================================================
// 11. POST /api/v1/learners/bulk-import
//     Bulk import learners from CSV
// =============================================================================
const bulkImportLearners = asyncHandler(async (req, res) => {
  const { schoolId, role, id: userId } = req.user;

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No CSV file provided'
    });
  }

  try {
    // Parse CSV
    const csvData = req.file.buffer.toString('utf-8');
    const records = csv.parse(csvData, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    const results = {
      successful: [],
      failed: []
    };

    // Process each record
    for (const record of records) {
      try {
        const learnerData = {
          school_id: schoolId,
          first_name: record.first_name,
          last_name: record.last_name,
          admission_number: record.admission_number,
          date_of_birth: record.date_of_birth,
          gender: record.gender,
          email: record.email,
          phone: record.phone,
          address: record.address,
          emergency_contact: record.emergency_contact,
          medical_info: record.medical_info,
          created_by: userId
        };

        // Validate required fields
        if (!learnerData.first_name || !learnerData.last_name || !learnerData.admission_number) {
          throw new Error('Missing required fields: first_name, last_name, admission_number');
        }

        // Validate gender
        if (learnerData.gender && !['Male', 'Female'].includes(learnerData.gender)) {
          throw new Error('Invalid gender. Must be Male or Female');
        }

        // Insert learner
        const { data: learner, error } = await supabase
          .from('learners')
          .insert(learnerData)
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        results.successful.push({
          admission_number: learner.admission_number,
          name: `${learner.first_name} ${learner.last_name}`,
          id: learner.id
        });

      } catch (error) {
        results.failed.push({
          row: record,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: `Import completed. ${results.successful.length} successful, ${results.failed.length} failed`,
      data: results
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to process CSV file',
      error: error.message
    });
  }
});

module.exports = {
  registerLearner,
  listLearners,
  getLearner,
  updateLearner,
  deleteLearner,
  enrollLearner,
  getEnrollmentHistory,
  promoteLearner,
  transferLearner,
  getReportCard,
  bulkImportLearners,
};
