const cron = require('node-cron');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { sendBookingReminderEmail } = require('../utils/emailSender');

// This would be a real SMS service in production
const sendSms = async (phoneNumber, message) => {
  console.log(`[SMS] To: ${phoneNumber}, Message: ${message}`);
  // In a real app, this would call an SMS API like Twilio
  return true;
};

/**
 * Service to handle sending reminders for upcoming bookings
 */
class ReminderService {
  constructor() {
    // Schedule to run every hour
    this.reminderJob = cron.schedule('0 * * * *', () => {
      this.sendUpcomingShowtimeReminders();
    });
  }

  /**
   * Start the reminder service
   */
  start() {
    console.log('Reminder service started');
    this.reminderJob.start();
  }

  /**
   * Stop the reminder service
   */
  stop() {
    console.log('Reminder service stopped');
    this.reminderJob.stop();
  }

  /**
   * Send reminders for upcoming showtimes
   */
  async sendUpcomingShowtimeReminders() {
    try {
      console.log('Checking for upcoming showtimes to send reminders...');

      const now = new Date();
      const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      // Find confirmed bookings with showtimes in the next 24 hours
      // that haven't had reminders sent yet
      const bookings = await Booking.find({
        showtimeDate: { $gt: now, $lt: in24Hours },
        bookingStatus: 'confirmed',
        reminderSent: { $ne: true }
      }).populate('user');

      console.log(`Found ${bookings.length} bookings that need reminders`);

      // Send reminders for each booking
      for (const booking of bookings) {
        try {
          // Get user
          const user = booking.user;

          if (!user) {
            console.log(`No user found for booking ${booking._id}`);
            continue;
          }

          let reminderSent = false;

          // Check user preferences
          const userPreferences = user.preferences || {};
          const enableReminders = userPreferences.enableReminders !== undefined ? userPreferences.enableReminders : true;

          if (enableReminders) {
            // Send email reminder
            if (user.email) {
              try {
                await sendBookingReminderEmail(booking, user.email);
                console.log(`Email reminder sent to ${user.email} for booking ${booking.bookingNumber}`);
                reminderSent = true;
              } catch (emailError) {
                console.error(`Error sending email reminder for booking ${booking._id}:`, emailError);
              }
            }

            // Send SMS reminder if enabled
            const enableSmsReminders = userPreferences.enableSmsReminders || false;
            const phoneNumber = userPreferences.phoneNumber;

            if (enableSmsReminders && phoneNumber) {
              try {
                // Format movie time for SMS
                const movieDate = new Date(booking.showtimeDate).toLocaleDateString();
                const movieTime = booking.showtimeDisplay || new Date(booking.showtimeDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                // Create SMS message
                const smsMessage = `Reminder: Your movie "${booking.movieTitle}" is scheduled for ${movieDate} at ${movieTime}. Theater: ${booking.theaterName}, Hall: ${booking.hall}, Seats: ${booking.seats.join(', ')}. Booking #: ${booking.bookingNumber}`;

                await sendSms(phoneNumber, smsMessage);
                console.log(`SMS reminder sent to ${phoneNumber} for booking ${booking.bookingNumber}`);
                reminderSent = true;
              } catch (smsError) {
                console.error(`Error sending SMS reminder for booking ${booking._id}:`, smsError);
              }
            }
          }

          // Mark reminder as sent if at least one method succeeded
          if (reminderSent) {
            booking.reminderSent = true;
            booking.reminderSentAt = new Date();
            await booking.save();
          }
        } catch (error) {
          console.error(`Error processing reminder for booking ${booking._id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error in sendUpcomingShowtimeReminders:', error);
    }
  }

  /**
   * Send a reminder for a specific booking
   * @param {string} bookingId - Booking ID
   * @returns {Promise<boolean>} - Success status
   */
  async sendReminderForBooking(bookingId) {
    try {
      const booking = await Booking.findById(bookingId).populate('user');

      if (!booking) {
        throw new Error('Booking not found');
      }

      if (booking.bookingStatus !== 'confirmed') {
        throw new Error('Cannot send reminder for non-confirmed booking');
      }

      const user = booking.user;

      if (!user) {
        throw new Error('User not found');
      }

      let reminderSent = false;

      // Check user preferences
      const userPreferences = user.preferences || {};
      const enableReminders = userPreferences.enableReminders !== undefined ? userPreferences.enableReminders : true;

      if (enableReminders) {
        // Send email reminder
        if (user.email) {
          try {
            await sendBookingReminderEmail(booking, user.email);
            console.log(`Email reminder sent to ${user.email} for booking ${booking.bookingNumber}`);
            reminderSent = true;
          } catch (emailError) {
            console.error(`Error sending email reminder for booking ${booking._id}:`, emailError);
          }
        }

        // Send SMS reminder if enabled
        const enableSmsReminders = userPreferences.enableSmsReminders || false;
        const phoneNumber = userPreferences.phoneNumber;

        if (enableSmsReminders && phoneNumber) {
          try {
            // Format movie time for SMS
            const movieDate = new Date(booking.showtimeDate).toLocaleDateString();
            const movieTime = booking.showtimeDisplay || new Date(booking.showtimeDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Create SMS message
            const smsMessage = `Reminder: Your movie "${booking.movieTitle}" is scheduled for ${movieDate} at ${movieTime}. Theater: ${booking.theaterName}, Hall: ${booking.hall}, Seats: ${booking.seats.join(', ')}. Booking #: ${booking.bookingNumber}`;

            await sendSms(phoneNumber, smsMessage);
            console.log(`SMS reminder sent to ${phoneNumber} for booking ${booking.bookingNumber}`);
            reminderSent = true;
          } catch (smsError) {
            console.error(`Error sending SMS reminder for booking ${booking._id}:`, smsError);
          }
        }
      }

      // Mark reminder as sent if at least one method succeeded
      if (reminderSent) {
        booking.reminderSent = true;
        booking.reminderSentAt = new Date();
        await booking.save();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(`Error sending reminder for booking ${bookingId}:`, error);
      return false;
    }
  }
}

// Create a singleton instance
const reminderService = new ReminderService();

module.exports = reminderService;
