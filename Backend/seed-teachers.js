const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://ywcrsgaxftooovqipkdr.supabase.co';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceKey) {
  console.error('❌ Set SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seedTeachers() {
  console.log('🌱 Seeding demo teachers...');

  // Step 1: Get or create demo school
  let { data: school, error: schoolErr } = await supabase
    .from('schools')
    .select('id, name')
    .eq('name', 'Demo CBC School')
    .single();

  if (schoolErr && schoolErr.code !== 'PGRST116') { // not found
    console.log('Creating demo school...');
    const { data: newSchool, error } = await supabase
      .from('schools')
      .insert({ name: 'Demo CBC School', county: 'Nairobi', location: 'Westlands', branch: 'Main Campus' })
      .select()
      .single();
    if (error) {
      console.error('School create error:', error);
      process.exit(1);
    }
    school = newSchool;
  }

  const school_id = school.id;
  console.log('Using school:', school_id);

  // Sample data
  const samples = [
    {
      first_name: "James",
      last_name: "Maina",
      email: "bravogejeremy@gmail.com",
      phone_number: "+254745817359",
      tsc_number: "TSC123478",
      id_number: "22334455",
      designation: "Mathematics Department Head",
      branch: "Main Campus",
      subjects_taught: ["Mathematics", "Physics"],
      salary: "55000.00",
      location: "Westlands",
      county: "Nairobi",
      gender: "Male"
    },
    {
      first_name: "Gemo",
      last_name: "Khai",
      email: "john.doe@school.com",
      phone_number: "+254712345678",
      tsc_number: "TSC123456",
      id_number: "11223344",
      designation: "Senior Teacher",
      branch: "North Branch",
      subjects_taught: ["English", "Literature"],
      salary: "48000.00",
      location: "Nyali",
      county: "Mombasa",
      gender: "Male"
    }
  ];

  for (const s of samples) {
    // Check if user exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', s.email)
      .eq('school_id', school_id)
      .single();

    if (existing) {
      console.log(`Skipping existing user: ${s.email}`);
      continue;
    }

    // Create user
    const tempPass = 'password123';
    const bcrypt = require('bcryptjs');
    const passHash = await bcrypt.hash(tempPass, 10);

    const { data: user, error: userErr } = await supabase
      .from('users')
      .insert({
        email: s.email,
        password_hash: passHash,
        first_name: s.first_name,
        last_name: s.last_name,
        phone_number: s.phone_number,
        role: 'teacher',
        status: 'active',
        email_verified: true,
        school_id,
        is_active: true,
        id_number: s.id_number
      })
      .select('id')
      .single();

    if (userErr) {
      console.error(`User insert error for ${s.email}:`, userErr);
      continue;
    }

    // Create teacher
    const extraInfo = {
      designation: s.designation,
      branch: s.branch,
      subjects_taught: s.subjects_taught,
      salary: s.salary,
      location: s.location,
      county: s.county,
      gender: s.gender
    };

    const { error: teacherErr } = await supabase
      .from('teachers')
      .insert({
        user_id: user.id,
        school_id,
        tsc_number: s.tsc_number,
        id_number: s.id_number,
        qualifications: s.subjects_taught.join(', '),
        date_joined: '2024-01-01',
        is_active: true,
        extra_info: JSON.stringify(extraInfo)
      });

    if (teacherErr) {
      console.error(`Teacher insert error for ${s.email}:`, teacherErr);
      // Cleanup user
      await supabase.from('users').delete().eq('id', user.id);
    } else {
      console.log(`✅ Seeded ${s.first_name} ${s.last_name}`);
    }
  }

  console.log('🎉 Seeding complete! Login with email/password123');
}

seedTeachers().catch(console.error);

