const { query } = require('./config/database');

async function activateUser() {
  try {
    const result = await query(
      `UPDATE users 
       SET is_active = true, 
           email_verified = true,
           status = 'active',
           updated_at = NOW()
       WHERE email = 'codemaster@gmail.com'
       RETURNING id, email, is_active, email_verified, status`
    );
    
    if (result.rowCount > 0) {
      console.log('✅ User activated:', result.rows[0]);
    } else {
      console.log('❌ No user found');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

activateUser();

