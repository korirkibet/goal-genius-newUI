import { useLocation, useNavigate } from 'react-router-dom';
import './Pay.scss';
import { useEffect, useState, useCallback, useRef } from 'react';
import AppHelmet from '../AppHelmet';
import ScrollToTop from '../ScrollToTop';
import Loader from '../../components/Loader/Loader';
import { pricings } from '../../data';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { notificationState, subscriptionState, userState } from '../../recoil/atoms';
import { PaystackButton } from 'react-paystack';
import { getUser, updateUser } from '../../firebase';
import { motion } from 'framer-motion';
import { initializePayment, pollPaymentStatus }  from '../../services/payment';
import { Smartphone, CreditCard, Loader as Loader2, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, Shield, Lock } from 'lucide-react';

const PAYMENT_METHODS = {
  MPESA: 'mpesa',
  PAYSTACK: 'paystack',
};

export default function Subscription() {
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.PAYSTACK);
  const [phone, setPhone] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [pollCount, setPollCount] = useState(0);
  const [reference, setReference] = useState(null);
  const cleanupRef = useRef(null);
  const location = useLocation();
  const [data, setData] = useState(null);
  const setNotification = useSetRecoilState(notificationState);
  const [subscription, setSubscription] = useRecoilState(subscriptionState);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state) {
      setData(location.state.subscription)
      setSubscription(location.state.subscription)
    } else {
      setData(pricings[1])
      setSubscription(pricings[1])
    }
  }, [location]);

  useEffect(() => {
    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, []);

  const handleUpgrade = useCallback(async () => {
    const currentDate = new Date().toISOString();
    await updateUser(user.email, true, {
      subDate: currentDate,
      billing: subscription.billing,
      plan: subscription.plan,
    }, setNotification).then(() => {
      getUser(user.email, setUser);
    }).then(() => {
      navigate("/plans", { replace: true });
    });
  }, [user, subscription, setNotification, setUser, navigate]);

  const handlePaystackSuccess = useCallback(() => {
    setPaymentStatus('success');
    setNotification({
      isVisible: true,
      type: 'success',
      message: 'Payment successful! Activating your plan...',
    });
    handleUpgrade();
  }, [handleUpgrade, setNotification]);

  const handleMpesaInitiate = async () => {
    if (!phone || phone.length < 10) {
      setNotification({
        isVisible: true,
        type: 'warning',
        message: 'Please enter a valid phone number (e.g., 254712345678)',
      });
      return;
    }

    setLoading(true);
    setPaymentStatus('pending');
    setPollCount(0);

    try {
      const result = await initializePayment({
        email: user?.email || 'guest@goalgenius.com',
        amount: data?.price || subscription?.price || 500,
        phone,
        activationType: subscription?.plan || '1X2',
      });

      if (result.success) {
        const ref = result.reference || result.data?.reference;
        setReference(ref);
        setNotification({
          isVisible: true,
          type: 'success',
          message: result.message || 'STK push sent! Check your phone to complete payment.',
        });

        const cleanup = pollPaymentStatus(ref, {
          interval: 5000,
          maxAttempts: 24,
          onStatus: (result, attempts) => {
            setPollCount(attempts);
          },
          onComplete: () => {
            setPaymentStatus('success');
            setNotification({
              isVisible: true,
              type: 'success',
              message: 'Payment confirmed! Activating your plan...',
            });
            handleUpgrade();
          },
          onFail: (message) => {
            setPaymentStatus('failed');
            setNotification({
              isVisible: true,
              type: 'error',
              message: message || 'Payment failed. Please try again.',
            });
          },
        });
        cleanupRef.current = cleanup;
      } else {
        setPaymentStatus('failed');
        setNotification({
          isVisible: true,
          type: 'error',
          message: result.message || 'Payment initialization failed',
        });
      }
    } catch (error) {
      setPaymentStatus('failed');
      setNotification({
        isVisible: true,
        type: 'error',
        message: error.message || 'Network error. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const paystackProps = {
    reference: (new Date()).getTime().toString(),
    email: user?.email || "guest@goalgenius.com",
    amount: (data?.price || subscription?.price || 500) * 100,
    publicKey: 'pk_live_71bf88a41666c28d7e035b7086eddedda3ba8c47',
    currency: "KES",
    metadata: {
      name: user?.email || "guest@goalgenius.com",
      plan: subscription?.plan || '1X2',
    },
    text: 'Pay with Card',
    onSuccess: handlePaystackSuccess,
    onClose: () => {
      setNotification({
        isVisible: true,
        type: 'warning',
        message: 'Payment window closed. You can try again.',
      });
    },
  };

  return (
    <div className='pay'>
      <AppHelmet title={"Subscribe"} />
      <ScrollToTop />

      {loading && <Loader />}

      <motion.div
        className="pay-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="pay-header">
          <h1>Subscribe to {data?.plan || subscription?.plan}</h1>
          <p className="pay-subtitle">Unlock premium football predictions</p>
        </div>

        {data && (
          <motion.div
            className="pay-summary"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="summary-item">
              <span className="label">Plan</span>
              <span className="value">{data.plan || subscription?.plan} Tips</span>
            </div>
            <div className="summary-item">
              <span className="label">Billing</span>
              <span className="value">{data.billing || subscription?.billing}</span>
            </div>
            <div className="summary-item">
              <span className="label">Features</span>
              <span className="value">{data.features?.length || 3} features</span>
            </div>
            <div className="summary-item total">
              <span className="label">Total</span>
              <span className="value">KSH {data.price || subscription?.price}</span>
            </div>
          </motion.div>
        )}

        <div className="payment-methods">
          <h3>Select Payment Method</h3>

          <div className="method-tabs">
            <button
              className={`method-tab ${paymentMethod === PAYMENT_METHODS.PAYSTACK ? 'active' : ''}`}
              onClick={() => setPaymentMethod(PAYMENT_METHODS.PAYSTACK)}
            >
              <CreditCard size={20} />
              <span>Card Payment</span>
            </button>
            <button
              className={`method-tab ${paymentMethod === PAYMENT_METHODS.MPESA ? 'active' : ''}`}
              onClick={() => setPaymentMethod(PAYMENT_METHODS.MPESA)}
            >
              <Smartphone size={20} />
              <span>M-Pesa</span>
            </button>
          </div>

          <div className="payment-form">
            {paymentMethod === PAYMENT_METHODS.MPESA && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="input-group">
                  <label htmlFor="phone">M-Pesa Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="254712345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={paymentStatus === 'pending'}
                  />
                  <span className="input-hint">Enter number starting with 254</span>
                </div>

                {paymentStatus === 'pending' && (
                  <div className="status-pending">
                    <Loader2 className="spin" size={20} />
                    <span>Checking payment status... ({pollCount}/24)</span>
                  </div>
                )}

                {paymentStatus === 'success' && (
                  <div className="status-success">
                    <CheckCircle2 size={20} />
                    <span>Payment successful! Redirecting...</span>
                  </div>
                )}

                {paymentStatus === 'failed' && (
                  <div className="status-failed">
                    <AlertCircle size={20} />
                    <span>Payment failed. Please try again.</span>
                  </div>
                )}

                <button
                  className="btn btn-full"
                  onClick={handleMpesaInitiate}
                  disabled={paymentStatus === 'pending' || loading}
                >
                  {paymentStatus === 'pending' ? (
                    <><Loader2 className="spin" size={18} /> Processing...</>
                  ) : (
                    <><Smartphone size={18} /> Pay with M-Pesa</>
                  )}
                </button>
              </motion.div>
            )}

            {paymentMethod === PAYMENT_METHODS.PAYSTACK && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="paystack-wrapper"
              >
                <p className="paystack-info">Pay securely with your card via Paystack</p>
                <PaystackButton {...paystackProps} className='btn btn-full' />
              </motion.div>
            )}
          </div>
        </div>

        <div className="pay-security">
          <div className="security-badge">
            <Shield size={16} />
            <span>SSL Secure Payment</span>
          </div>
          <div className="security-badge">
            <Lock size={16} />
            <span>256-bit Encryption</span>
          </div>
          <p className="security-text">Your payment information is encrypted and never stored on our servers</p>
        </div>
      </motion.div>
    </div>
  );
}
