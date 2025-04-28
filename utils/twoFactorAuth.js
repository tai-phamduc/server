const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const crypto = require('crypto');

// Generate a new secret
const generateSecret = (email) => {
  const secret = speakeasy.generateSecret({
    name: `MovieHub:${email}`,
    issuer: 'MovieHub',
  });

  return {
    otpauth_url: secret.otpauth_url,
    base32: secret.base32,
  };
};

// Generate QR code
const generateQRCode = async (otpauthUrl) => {
  try {
    const qrCodeUrl = await qrcode.toDataURL(otpauthUrl);
    return qrCodeUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
};

// Verify token
const verifyToken = (token, secret) => {
  try {
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1, // Allow 1 step before and after current time
    });

    return verified;
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
};

// Generate backup codes
const generateBackupCodes = (count = 10) => {
  const codes = [];
  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString('hex');
    codes.push(code);
  }
  return codes;
};

// Hash backup codes
const hashBackupCodes = (codes) => {
  return codes.map((code) => {
    const hash = crypto.createHash('sha256').update(code).digest('hex');
    return hash;
  });
};

// Verify backup code
const verifyBackupCode = (code, hashedCodes) => {
  const hash = crypto.createHash('sha256').update(code).digest('hex');
  return hashedCodes.includes(hash);
};

module.exports = {
  generateSecret,
  generateQRCode,
  verifyToken,
  generateBackupCodes,
  hashBackupCodes,
  verifyBackupCode,
};
