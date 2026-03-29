const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://ywcrsgaxftooovqipkdr.supabase.co';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function addFields() {
  console.log('🔧 Adding teacher fields...');

  // Add extra_info column if missing
  const { error: err1 } = await supabase.rpc('add_column_if_not_exists', {
    table_name: 'teachers',
    column_name: 'extra_info',
    column_type: 'text'
  });

  if (err1) {
    console.log('Using SQL direct...');
    await supabase.rpc('execute_sql', {
      sql: `ALTER TABLE teachers ADD COLUMN IF NOT EXISTS extra_info text;`
    });
  }

  // Add id_number to users if missing
  await supabase.rpc('execute_sql', {
    sql: `ALTER TABLE users ADD COLUMN IF NOT EXISTS id_number text;`
  });

  console.log('✅ Fields added');
}

addFields().catch(console.error);

