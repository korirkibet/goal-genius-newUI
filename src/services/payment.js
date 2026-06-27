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
 * Polls the payment API /status endpoint and only calls onComplete
 * when the payment is CONFIRMED (paid === true).
 * @param {string} reference - Payment reference
 * @param {Object} options - Polling options
 * @param {number} options.interval - Poll interval in ms (default: 6000)
 * @param {number} options.maxAttempts - Max attempts (default: 30)
 * @param {Function} options.onStatus - Callback for each status check (result, attempts)
 * @param {Function} options.onComplete - Callback when payment is CONFIRMED (paid=true)
 * @param {Function} options.onFail - Callback when payment fails, times out, or is abandoned
 * @returns {Function} Cleanup function to stop polling
 */
export function pollPaymentStatus(reference, options = {}) {
  const {
    interval = 6000,
    maxAttempts = 30,
    onStatus,
    onComplete,
    onFail,
  } = options;

  let attempts = 0;
  let timer = null;
  let isRunning = true;

  // Terminal statuses that mean the payment is done (one way or another)
  const FAILED_STATUSES = ['failed', 'abandoned', 'reversed', 'cancelled'];
  const SUCCESS_STATUS = 'success';
  const WAITING_STATUSES = ['pending', 'processing', 'queued', 'ongoing', 'pay_offline', 'send_otp'];

  const poll = async () => {
    if (!isRunning) return;
    if (attempts >= maxAttempts) {
      isRunning = false;
      onFail?.('Payment is taking too long. Please check your M-Pesa messages and try again.');
      return;
    }

    try {
      const result = await checkPaymentStatus(reference);
      attempts++;
      onStatus?.(result, attempts);

      // CONFIRMED SUCCESS — payment is actually paid
      if (result.paid === true || result.status === SUCCESS_STATUS) {
        isRunning = false;
        onComplete?.(result);
        return;
      }

      // Terminal failure — payment will never succeed
      if (FAILED_STATUSES.includes(result.status)) {
        isRunning = false;
        onFail?.(result.message || 'Payment was not completed. Please try again.');
        return;
      }

      // Still waiting — schedule next poll
      if (isRunning && WAITING_STATUSES.includes(result.status)) {
        timer = setTimeout(poll, interval);
        return;
      }

      // Unknown status — keep polling a few more times, then give up
      if (isRunning && attempts < maxAttempts) {
        timer = setTimeout(poll, interval);
      } else {
        isRunning = false;
        onFail?.('Payment status unknown. Please check your M-Pesa messages.');
      }
    } catch (error) {
      attempts++;
      onStatus?.({ error: error.message, status: 'error' }, attempts);

      if (isRunning && attempts < maxAttempts) {
        timer = setTimeout(poll, interval);
      } else {
        isRunning = false;
        onFail?.(error.message || 'Unable to check payment status. Please try again.');
      }
    }
  };

  // Start first poll immediately (small delay to let Paystack start processing)
  timer = setTimeout(poll, 2000);

  return () => {
    isRunning = false;
    if (timer) clearTimeout(timer);
  };
}
