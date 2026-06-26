const PAYMENT_API_BASE = 'https://payment-api-production-aa2b.up.railway.app/api';

/**
 * Initialize M-Pesa payment via payment API
 * @param {string} email - User email
 * @param {number} amount - Payment amount
 * @param {string} phone - Phone number (format: 2547XXXXXXXX)
 * @param {string} [userId] - Optional user ID
 * @param {string} [activationType] - Optional activation type
 * @returns {Promise<Object>} Payment initialization result
 */
export async function initializePayment({ email, amount, phone, userId, activationType }) {
  const response = await fetch(`${PAYMENT_API_BASE}/initialize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount,
      phone,
      ...(userId && { userId }),
      ...(activationType && { activation_type: activationType }),
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || `Payment initialization failed (${response.status})`);
  }

  return data;
}

/**
 * Verify payment status by reference
 * @param {string} reference - Payment reference
 * @returns {Promise<Object>} Payment status
 */
export async function verifyPayment(reference) {
  const response = await fetch(`${PAYMENT_API_BASE}/verify/${reference}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Verification failed (${response.status})`);
  }

  return data;
}

/**
 * Check payment status by reference (for polling)
 * @param {string} reference - Payment reference
 * @returns {Promise<Object>} Payment status
 */
export async function checkPaymentStatus(reference) {
  const response = await fetch(`${PAYMENT_API_BASE}/status/${reference}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Status check failed (${response.status})`);
  }

  return data;
}

/**
 * Submit OTP for payment authorization
 * @param {string} reference - Payment reference
 * @param {string} otp - OTP code
 * @returns {Promise<Object>} OTP submission result
 */
export async function submitOTP(reference, otp) {
  const response = await fetch(`${PAYMENT_API_BASE}/submit-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      reference,
      otp,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || `OTP submission failed (${response.status})`);
  }

  return data;
}

/**
 * Payment status messages for display
 */
export const STATUS_MESSAGES = {
  pending: 'Payment is pending. Please check your phone...',
  processing: 'Payment is being processed...',
  completed: 'Payment completed successfully!',
  failed: 'Payment failed. Please try again.',
  cancelled: 'Payment was cancelled.',
  otp_required: 'OTP required. Please enter the code sent to your phone.',
};

/**
 * Payment status polling helper
 * @param {string} reference - Payment reference
 * @param {Object} options - Polling options
 * @param {number} options.interval - Poll interval in ms (default: 5000)
 * @param {number} options.maxAttempts - Max attempts (default: 24)
 * @param {Function} options.onStatus - Callback for status updates
 * @param {Function} options.onComplete - Callback when payment completes
 * @param {Function} options.onFail - Callback when payment fails
 * @returns {Function} Cleanup function to stop polling
 */
export function pollPaymentStatus(reference, options = {}) {
  const {
    interval = 5000,
    maxAttempts = 24,
    onStatus,
    onComplete,
    onFail,
  } = options;

  let attempts = 0;
  let timer = null;
  let isRunning = true;

  const poll = async () => {
    if (!isRunning || attempts >= maxAttempts) {
      onFail?.('Polling timeout');
      return;
    }

    try {
      const result = await checkPaymentStatus(reference);
      attempts++;
      onStatus?.(result, attempts);

      if (result.status === 'completed' || result.success) {
        onComplete?.(result);
        isRunning = false;
        return;
      }

      if (result.status === 'failed' || result.status === 'cancelled') {
        onFail?.(result.message || 'Payment failed');
        isRunning = false;
        return;
      }

      if (isRunning) {
        timer = setTimeout(poll, interval);
      }
    } catch (error) {
      attempts++;
      onStatus?.({ error: error.message }, attempts);

      if (isRunning && attempts < maxAttempts) {
        timer = setTimeout(poll, interval);
      } else {
        onFail?.(error.message);
        isRunning = false;
      }
    }
  };

  timer = setTimeout(poll, interval);

  return () => {
    isRunning = false;
    if (timer) clearTimeout(timer);
  };
}
