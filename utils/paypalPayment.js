const axios = require('axios');

// Get PayPal access token
const getAccessToken = async () => {
  try {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString('base64');

    const response = await axios({
      method: 'post',
      url: `${process.env.PAYPAL_API}/v1/oauth2/token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${auth}`,
      },
      data: 'grant_type=client_credentials',
    });

    return {
      success: true,
      accessToken: response.data.access_token,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error_description || error.message,
    };
  }
};

// Create a PayPal order
const createOrder = async (amount, currency = 'USD', description = '') => {
  try {
    const { success, accessToken, error } = await getAccessToken();

    if (!success) {
      return { success: false, error };
    }

    const response = await axios({
      method: 'post',
      url: `${process.env.PAYPAL_API}/v2/checkout/orders`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount.toFixed(2),
            },
            description,
          },
        ],
        application_context: {
          brand_name: 'MovieHub',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW',
        },
      },
    });

    return {
      success: true,
      order: response.data,
      orderId: response.data.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

// Capture a PayPal order
const captureOrder = async (orderId) => {
  try {
    const { success, accessToken, error } = await getAccessToken();

    if (!success) {
      return { success: false, error };
    }

    const response = await axios({
      method: 'post',
      url: `${process.env.PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      success: true,
      captureData: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

// Get order details
const getOrderDetails = async (orderId) => {
  try {
    const { success, accessToken, error } = await getAccessToken();

    if (!success) {
      return { success: false, error };
    }

    const response = await axios({
      method: 'get',
      url: `${process.env.PAYPAL_API}/v2/checkout/orders/${orderId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      success: true,
      orderDetails: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

// Refund a PayPal payment
const refundPayment = async (captureId, amount, currency = 'USD', note = '') => {
  try {
    const { success, accessToken, error } = await getAccessToken();

    if (!success) {
      return { success: false, error };
    }

    const response = await axios({
      method: 'post',
      url: `${process.env.PAYPAL_API}/v2/payments/captures/${captureId}/refund`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        amount: {
          currency_code: currency,
          value: amount.toFixed(2),
        },
        note_to_payer: note,
      },
    });

    return {
      success: true,
      refundData: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

module.exports = {
  getAccessToken,
  createOrder,
  captureOrder,
  getOrderDetails,
  refundPayment,
};
