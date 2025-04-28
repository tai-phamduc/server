const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a payment intent
const createPaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Confirm a payment intent
const confirmPaymentIntent = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return {
      success: true,
      paymentIntent,
      status: paymentIntent.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Refund a payment
const refundPayment = async (paymentIntentId, amount = null, reason = null) => {
  try {
    const refundParams = {
      payment_intent: paymentIntentId,
    };

    if (amount) {
      refundParams.amount = Math.round(amount * 100); // Convert to cents
    }

    if (reason) {
      refundParams.reason = reason;
    }

    const refund = await stripe.refunds.create(refundParams);

    return {
      success: true,
      refund,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Create a customer
const createCustomer = async (email, name, phone, metadata = {}) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      phone,
      metadata,
    });

    return {
      success: true,
      customer,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Create a payment method
const createPaymentMethod = async (type, card, billingDetails) => {
  try {
    const paymentMethod = await stripe.paymentMethods.create({
      type,
      card,
      billing_details: billingDetails,
    });

    return {
      success: true,
      paymentMethod,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Attach a payment method to a customer
const attachPaymentMethod = async (paymentMethodId, customerId) => {
  try {
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    return {
      success: true,
      paymentMethod,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Create a webhook event handler
const handleWebhookEvent = async (event) => {
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Handle successful payment
        return {
          success: true,
          paymentIntent: event.data.object,
        };
      case 'payment_intent.payment_failed':
        // Handle failed payment
        return {
          success: false,
          paymentIntent: event.data.object,
          error: event.data.object.last_payment_error?.message || 'Payment failed',
        };
      case 'charge.refunded':
        // Handle refund
        return {
          success: true,
          charge: event.data.object,
        };
      default:
        return {
          success: true,
          event: event.type,
        };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  createPaymentIntent,
  confirmPaymentIntent,
  refundPayment,
  createCustomer,
  createPaymentMethod,
  attachPaymentMethod,
  handleWebhookEvent,
};
