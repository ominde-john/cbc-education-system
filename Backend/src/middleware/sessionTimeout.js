const db = require('../config/database');

const sessionTimeout = async (req, res, next) => {
  // Skip for login and public endpoints
  const publicPaths = ['/login', '/auth/login', '/register', '/health'];
  if (publicPaths.some(path => req.path.includes(path))) {
    return next();
  }
  
  if (!req.user || !req.user.id) {
    return next();
  }
  
  try {
    const userId = req.user.id;
    
    // Atomic DB-based rate limiting + timeout check
    const result = await db.query(`
      SELECT 
        session_timeout_minutes, 
        last_activity,
        last_activity_update
      FROM users 
      WHERE id = $1
    FOR UPDATE`, [userId]);
    
    if (result.rows.length === 0) {
      return next();
    }
    
    const row = result.rows[0];
    const timeoutMinutes = row.session_timeout_minutes || 120; // Increased default to 120min
    const lastActivity = row.last_activity;
    
    // If no last_activity, initialize and allow
    if (!lastActivity) {
      await db.query('UPDATE users SET last_activity = NOW(), last_activity_update = NOW() WHERE id = $1', [userId]);
      return next();
    }
    
    const inactiveMinutes = (Date.now() - new Date(lastActivity).getTime()) / 1000 / 60;
    console.log(`⏱️ Session check - inactive: ${inactiveMinutes.toFixed(1)}min, timeout: ${timeoutMinutes}min`);
    
    if (inactiveMinutes > timeoutMinutes) {
      console.log(`🔒 SESSION EXPIRED for user ${userId} after ${inactiveMinutes.toFixed(1)}min`);
      return res.status(401).json({
        success: false,
        message: `Session expired due to ${timeoutMinutes} minutes of inactivity`,
        code: 'SESSION_EXPIRED'
      });
    }
    
    // Update every 5min (300000ms) - DB atomic check
    const now = Date.now();
    const lastUpdate = row.last_activity_update ? new Date(row.last_activity_update).getTime() : 0;
    if (now - lastUpdate > 300000) { // 5 minutes
      await db.query(
        'UPDATE users SET last_activity = NOW(), last_activity_update = NOW() WHERE id = $1',
        [userId]
      );
      console.log(`✅ Updated last_activity for user ${userId}`);
    }
    
    next();
  } catch (error) {
    console.error('Session timeout error:', error);
    next();
  }
};

// DB-based rate limiting - no in-memory state needed (add migration: ALTER TABLE users ADD COLUMN last_activity_update TIMESTAMP;)
// Default: UPDATE users SET session_timeout_minutes = 120 WHERE session_timeout_minutes IS NULL;

module.exports = { sessionTimeout };


