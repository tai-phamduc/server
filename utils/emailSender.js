const nodemailer = require('nodemailer');

/**
 * Send booking confirmation email
 * @param {Object} booking - Booking object
 * @param {string} email - Recipient email
 * @returns {Promise<boolean>} - Success status
 */
const sendBookingConfirmationEmail = async (booking, email) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      // Configure email service
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Format date and time
    const showtimeDate = new Date(booking.showtimeDate);
    const formattedDate = showtimeDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = booking.showtimeDisplay || showtimeDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // Format price
    const formatPrice = (price) => {
      return `$${parseFloat(price).toFixed(2)}`;
    };

    // Email content
    const mailOptions = {
      from: `"Cinema Booking" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Booking Confirmation - ${booking.bookingNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #333;">Booking Confirmation</h1>
            <p style="font-size: 18px; color: #666;">Thank you for your booking!</p>
          </div>

          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">${booking.movieTitle}</h2>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedDate}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${formattedTime}</p>
            <p style="margin: 5px 0;"><strong>Theater:</strong> ${booking.theaterName}</p>
            <p style="margin: 5px 0;"><strong>Hall:</strong> ${booking.hall}</p>
            <p style="margin: 5px 0;"><strong>Seats:</strong> ${booking.seats.join(', ')}</p>
            <p style="margin: 5px 0;"><strong>Format:</strong> ${booking.format}</p>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="color: #333;">Payment Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0;">Ticket Price (${booking.seats.length} x ${formatPrice(booking.ticketPrice)})</td>
                <td style="text-align: right; padding: 8px 0;">${formatPrice(booking.ticketPrice * booking.seats.length)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">Service Fee</td>
                <td style="text-align: right; padding: 8px 0;">${formatPrice(booking.serviceFee)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">Tax</td>
                <td style="text-align: right; padding: 8px 0;">${formatPrice(booking.tax)}</td>
              </tr>
              <tr style="font-weight: bold;">
                <td style="padding: 8px 0; border-top: 1px solid #e0e0e0;">Total</td>
                <td style="text-align: right; padding: 8px 0; border-top: 1px solid #e0e0e0;">${formatPrice(booking.totalPrice)}</td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; margin-bottom: 20px;">
            <p style="margin-bottom: 10px;"><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
            <div style="margin: 0 auto; width: 200px;">
              <img src="${booking.qrCode}" alt="QR Code" style="width: 100%; height: auto;" />
            </div>
            <p style="font-size: 14px; color: #666;">Please show this QR code at the theater entrance.</p>
          </div>

          <div style="font-size: 14px; color: #666; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p>If you have any questions, please contact our customer service.</p>
            <p>&copy; ${new Date().getFullYear()} Cinema Booking. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
};

/**
 * Send booking cancellation email
 * @param {Object} booking - Booking object
 * @param {string} email - Recipient email
 * @returns {Promise<boolean>} - Success status
 */
const sendBookingCancellationEmail = async (booking, email) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      // Configure email service
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Format date and time
    const showtimeDate = new Date(booking.showtimeDate);
    const formattedDate = showtimeDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = booking.showtimeDisplay || showtimeDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // Format price
    const formatPrice = (price) => {
      return `$${parseFloat(price).toFixed(2)}`;
    };

    // Email content
    const mailOptions = {
      from: `"Cinema Booking" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Booking Cancellation - ${booking.bookingNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #333;">Booking Cancellation</h1>
            <p style="font-size: 18px; color: #666;">Your booking has been cancelled</p>
          </div>

          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">${booking.movieTitle}</h2>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedDate}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${formattedTime}</p>
            <p style="margin: 5px 0;"><strong>Theater:</strong> ${booking.theaterName}</p>
            <p style="margin: 5px 0;"><strong>Hall:</strong> ${booking.hall}</p>
            <p style="margin: 5px 0;"><strong>Seats:</strong> ${booking.seats.join(', ')}</p>
            <p style="margin: 5px 0;"><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="color: #333;">Refund Details</h3>
            ${booking.refundAmount > 0 ? `
              <p>Based on our cancellation policy, you will receive a refund of ${formatPrice(booking.refundAmount)} (${booking.refundPercentage}% of your original payment).</p>
              <p>Refund Status: <strong>${booking.refundStatus.replace('_', ' ').toUpperCase()}</strong></p>
              ${booking.refundStatus === 'completed' ? `
                <p>Refund Transaction ID: ${booking.refundTransactionId}</p>
                <p>The refund has been processed and should appear in your account within 5-7 business days, depending on your payment provider.</p>
              ` : booking.refundStatus === 'pending' ? `
                <p>Your refund is being processed and should appear in your account within 5-7 business days, depending on your payment provider.</p>
              ` : booking.refundStatus === 'manual_required' ? `
                <p>Since you paid in cash, please visit our theater with your booking number to receive your refund.</p>
              ` : `
                <p>There was an issue processing your refund. Please contact our customer service for assistance.</p>
              `}
            ` : `
              <p>Based on our cancellation policy, no refund is applicable for this cancellation due to the short notice.</p>
            `}
          </div>

          <div style="font-size: 14px; color: #666; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p>If you have any questions, please contact our customer service.</p>
            <p>&copy; ${new Date().getFullYear()} Cinema Booking. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending cancellation email:', error);
    return false;
  }
};

/**
 * Send booking reminder email
 * @param {Object} booking - Booking object
 * @param {string} email - Recipient email
 * @returns {Promise<boolean>} - Success status
 */
const sendBookingReminderEmail = async (booking, email) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      // Configure email service
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Format date and time
    const showtimeDate = new Date(booking.showtimeDate);
    const formattedDate = showtimeDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = booking.showtimeDisplay || showtimeDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // Calculate hours until showtime
    const now = new Date();
    const hoursUntilShowtime = Math.round((showtimeDate - now) / (1000 * 60 * 60));

    // Email content
    const mailOptions = {
      from: `"Cinema Booking" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Reminder: Your Movie is Coming Up Soon - ${booking.movieTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #333;">Movie Reminder</h1>
            <p style="font-size: 18px; color: #666;">Your movie is coming up in ${hoursUntilShowtime} hours!</p>
          </div>

          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">${booking.movieTitle}</h2>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedDate}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${formattedTime}</p>
            <p style="margin: 5px 0;"><strong>Theater:</strong> ${booking.theaterName}</p>
            <p style="margin: 5px 0;"><strong>Hall:</strong> ${booking.hall}</p>
            <p style="margin: 5px 0;"><strong>Seats:</strong> ${booking.seats.join(', ')}</p>
            <p style="margin: 5px 0;"><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="color: #333;">Reminders:</h3>
            <ul style="padding-left: 20px;">
              <li>Please arrive at least 15 minutes before the showtime.</li>
              <li>Have your booking QR code ready for scanning at the entrance.</li>
              <li>Outside food and beverages are not allowed in the theater.</li>
              <li>Please silence your mobile phones during the movie.</li>
            </ul>
          </div>

          <div style="text-align: center; margin-bottom: 20px;">
            ${booking.qrCode ? `
              <p style="margin-bottom: 10px;">Your Ticket QR Code:</p>
              <div style="margin: 0 auto; width: 200px;">
                <img src="${booking.qrCode}" alt="QR Code" style="width: 100%; height: auto;" />
              </div>
            ` : ''}
          </div>

          <div style="font-size: 14px; color: #666; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p>We hope you enjoy the movie!</p>
            <p>&copy; ${new Date().getFullYear()} Cinema Booking. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Update booking
    booking.reminderSent = true;
    booking.reminderSentAt = new Date();
    await booking.save();

    return true;
  } catch (error) {
    console.error('Error sending reminder email:', error);
    return false;
  }
};

module.exports = {
  sendBookingConfirmationEmail,
  sendBookingCancellationEmail,
  sendBookingReminderEmail
};
