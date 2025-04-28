const Notification = require('../models/Notification');
const User = require('../models/User');
const sendEmail = require('./sendEmail');

// Create a notification
const createNotification = async (userId, title, message, type, options = {}) => {
  try {
    const notification = new Notification({
      user: userId,
      title,
      message,
      type,
      relatedId: options.relatedId,
      onModel: options.onModel,
      link: options.link,
      expiresAt: options.expiresAt,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// Send email notification
const sendEmailNotification = async (userId, subject, html) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user has email notifications enabled
    if (user.preferences && user.preferences.emailSubscription) {
      await sendEmail({
        email: user.email,
        subject,
        html,
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error sending email notification:', error);
    return false;
  }
};

// Create booking notification
const createBookingNotification = async (booking) => {
  try {
    const user = await User.findById(booking.user);
    
    // Create in-app notification
    const notification = await createNotification(
      booking.user,
      'Booking Confirmed',
      `Your booking #${booking.bookingNumber} has been confirmed.`,
      'booking',
      {
        relatedId: booking._id,
        onModel: 'Booking',
        link: `/bookings/${booking._id}`,
      }
    );

    // Send email notification
    if (user.preferences && user.preferences.emailSubscription) {
      const html = `
        <h1>Booking Confirmation</h1>
        <p>Dear ${user.name},</p>
        <p>Your booking has been confirmed.</p>
        <p><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
        <p><strong>Total Price:</strong> $${booking.totalPrice}</p>
        <p>Thank you for choosing MovieHub!</p>
      `;

      await sendEmailNotification(booking.user, 'Booking Confirmation', html);
    }

    return notification;
  } catch (error) {
    console.error('Error creating booking notification:', error);
    return null;
  }
};

// Create payment notification
const createPaymentNotification = async (payment, booking) => {
  try {
    const user = await User.findById(payment.user);
    
    // Create in-app notification
    const notification = await createNotification(
      payment.user,
      'Payment Successful',
      `Your payment for booking #${booking.bookingNumber} has been processed successfully.`,
      'payment',
      {
        relatedId: payment._id,
        onModel: 'Payment',
        link: `/payments/${payment._id}`,
      }
    );

    // Send email notification
    if (user.preferences && user.preferences.emailSubscription) {
      const html = `
        <h1>Payment Confirmation</h1>
        <p>Dear ${user.name},</p>
        <p>Your payment has been processed successfully.</p>
        <p><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
        <p><strong>Amount:</strong> $${payment.amount}</p>
        <p><strong>Payment Method:</strong> ${payment.paymentMethod}</p>
        <p>Thank you for choosing MovieHub!</p>
      `;

      await sendEmailNotification(payment.user, 'Payment Confirmation', html);
    }

    return notification;
  } catch (error) {
    console.error('Error creating payment notification:', error);
    return null;
  }
};

// Create reminder notification
const createReminderNotification = async (booking, movie, showtime) => {
  try {
    const user = await User.findById(booking.user);
    
    // Create in-app notification
    const notification = await createNotification(
      booking.user,
      'Movie Reminder',
      `Reminder: Your movie "${movie.title}" starts in 24 hours.`,
      'reminder',
      {
        relatedId: booking._id,
        onModel: 'Booking',
        link: `/bookings/${booking._id}`,
      }
    );

    // Send email notification
    if (user.preferences && user.preferences.emailSubscription) {
      const showtimeDate = new Date(showtime.startTime);
      const formattedDate = showtimeDate.toLocaleDateString();
      const formattedTime = showtimeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const html = `
        <h1>Movie Reminder</h1>
        <p>Dear ${user.name},</p>
        <p>This is a reminder that your movie is starting in 24 hours.</p>
        <p><strong>Movie:</strong> ${movie.title}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${formattedTime}</p>
        <p><strong>Theater:</strong> ${showtime.theater}</p>
        <p><strong>Hall:</strong> ${showtime.hall}</p>
        <p>We look forward to seeing you!</p>
      `;

      await sendEmailNotification(booking.user, 'Movie Reminder', html);
    }

    return notification;
  } catch (error) {
    console.error('Error creating reminder notification:', error);
    return null;
  }
};

// Create promotion notification
const createPromotionNotification = async (users, title, message, link) => {
  try {
    const notifications = [];
    const emailPromises = [];

    for (const userId of users) {
      // Create in-app notification
      const notification = await createNotification(
        userId,
        title,
        message,
        'promotion',
        {
          link,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        }
      );

      notifications.push(notification);

      // Send email notification
      const user = await User.findById(userId);
      if (user && user.preferences && user.preferences.emailSubscription) {
        const html = `
          <h1>${title}</h1>
          <p>Dear ${user.name},</p>
          <p>${message}</p>
          <p>Check out our website for more details.</p>
        `;

        emailPromises.push(sendEmailNotification(userId, title, html));
      }
    }

    await Promise.all(emailPromises);
    return notifications;
  } catch (error) {
    console.error('Error creating promotion notification:', error);
    return null;
  }
};

module.exports = {
  createNotification,
  sendEmailNotification,
  createBookingNotification,
  createPaymentNotification,
  createReminderNotification,
  createPromotionNotification,
};
