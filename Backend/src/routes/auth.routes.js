// Login with REAL error messages (temporary for debugging)
exports.login = async (req, res) => {
  console.log('\n========== LOGIN ATTEMPT ==========');
  console.log('Time:', new Date().toISOString());
  console.log('Email:', req.body?.email);
  console.log('Password provided:', !!req.body?.password);
  
  try {
    const { email, password } = req.body;

    // Step 1: Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    // Step 2: Check if isValidEmail function exists
    console.log('Checking isValidEmail function...');
    if (typeof isValidEmail !== 'function') {
      console.error('isValidEmail is not a function');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error: isValidEmail missing'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format.'
      });
    }

    // Step 3: Try database query
    console.log('Attempting database query...');
    let userResult;
    try {
      userResult = await query(
        `SELECT u.id, u.email, u.password_hash, u.role, u.status, 
                u.school_id, u.login_attempts, u.locked_until, u.email_verified
         FROM users u
         WHERE u.email = $1 AND u.status != 'deleted'
         LIMIT 1`,
        [email]
      );
      console.log('Database query successful');
    } catch (dbError) {
      console.error('DATABASE QUERY ERROR:', {
        message: dbError.message,
        code: dbError.code,
        stack: dbError.stack
      });
      return res.status(500).json({
        success: false,
        message: `Database error: ${dbError.message}`
      });
    }

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    const user = userResult.rows[0];
    console.log('User found:', { id: user.id, email: user.email, role: user.role });

    // Step 4: Check verifyPassword function
    console.log('Checking verifyPassword function...');
    if (typeof verifyPassword !== 'function') {
      console.error('verifyPassword is not a function');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error: verifyPassword missing'
      });
    }

    // Step 5: Verify password
    console.log('Verifying password...');
    let isValidPassword;
    try {
      isValidPassword = await verifyPassword(password, user.password_hash);
      console.log('Password verification result:', isValidPassword);
    } catch (pwError) {
      console.error('PASSWORD VERIFICATION ERROR:', {
        message: pwError.message,
        stack: pwError.stack
      });
      return res.status(500).json({
        success: false,
        message: `Password verification error: ${pwError.message}`
      });
    }

    if (!isValidPassword) {
      // Try to increment login attempts, but don't fail if it errors
      try {
        await incrementLoginAttempts(user.id);
      } catch (err) {
        console.error('Failed to increment login attempts:', err.message);
      }
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    // Step 6: Check generateTokens function
    console.log('Checking generateTokens function...');
    if (typeof generateTokens !== 'function') {
      console.error('generateTokens is not a function');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error: generateTokens missing'
      });
    }

    // Step 7: Generate tokens
    console.log('Generating tokens...');
    let tokens;
    try {
      tokens = await generateTokens(user);
      console.log('Tokens generated successfully');
    } catch (tokenError) {
      console.error('TOKEN GENERATION ERROR:', {
        message: tokenError.message,
        stack: tokenError.stack
      });
      return res.status(500).json({
        success: false,
        message: `Token generation error: ${tokenError.message}`
      });
    }

    // Step 8: Reset login attempts (don't fail if it errors)
    try {
      await resetLoginAttempts(user.id);
    } catch (err) {
      console.error('Failed to reset login attempts:', err.message);
    }

    // Step 9: Update session (don't fail if it errors)
    try {
      const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
      const userAgent = req.get('User-Agent') || 'unknown';
      
      await query(
        `UPDATE user_sessions 
         SET ip_address = $1, user_agent = $2 
         WHERE session_token = $3`,
        [clientIp, userAgent, tokens.refreshToken]
      );
    } catch (err) {
      console.error('Failed to update session:', err.message);
    }

    // Success!
    console.log('✅ Login successful for:', email);
    return res.json({
      success: true,
      message: 'Login successful.',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          schoolId: user.school_id
        },
        tokens: tokens
      }
    });

  } catch (error) {
    console.error('\n❌ UNCAUGHT ERROR IN LOGIN:');
    console.error('Name:', error.name);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('=====================================\n');
    
    // Send the REAL error message in development
    return res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'development' 
        ? `Login error: ${error.message}` 
        : 'An error occurred during login. Please try again.',
      error: process.env.NODE_ENV === 'development' ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }
};