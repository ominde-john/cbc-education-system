const crypto = require('crypto');

const getDeviceFingerprint = (userAgent, ip) => {
  const fingerprint = `${userAgent}|${ip}`;
  return crypto.createHash('sha256').update(fingerprint).digest('hex');
};

const getDeviceInfo = (userAgent) => {
  const ua = userAgent || '';
  
  let deviceType = 'desktop';
  let deviceName = 'Unknown Device';
  
  if (ua.includes('Mobile') || ua.includes('Android') || ua.includes('iPhone')) {
    deviceType = 'mobile';
  } else if (ua.includes('iPad')) {
    deviceType = 'tablet';
  }
  
  if (ua.includes('Chrome')) deviceName = 'Chrome';
  else if (ua.includes('Firefox')) deviceName = 'Firefox';
  else if (ua.includes('Safari')) deviceName = 'Safari';
  else if (ua.includes('Edge')) deviceName = 'Edge';
  
  let os = 'Unknown OS';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS') || ua.includes('iPhone')) os = 'iOS';
  
  return { deviceType, deviceName: `${deviceName} on ${os}` };
};

module.exports = { getDeviceFingerprint, getDeviceInfo };

