const QRCode = require('qrcode');

/**
 * Generate QR code for booking
 * @param {string} bookingNumber - Booking number
 * @returns {Promise<string>} - QR code data URL
 */
const generateQRCode = async (bookingNumber) => {
  try {
    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(bookingNumber, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
};

module.exports = { generateQRCode };
