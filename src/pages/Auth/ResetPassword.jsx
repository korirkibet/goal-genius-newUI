import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowLeft, CircleCheck as CheckCircle2 } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';
import './Auth.scss';

export default function ResetPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setSent(false);
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
        >
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={handleClose}>
              <X size={20} />
            </button>

            {sent ? (
              <div className="modal-success">
                <div className="success-icon">
                  <CheckCircle2 size={48} />
                </div>
                <h2>Reset Link Sent</h2>
                <p>Check your email at <strong>{email}</strong> for instructions to reset your password.</p>
                <button className="btn" onClick={handleClose}>
                  <ArrowLeft size={16} /> Back to Login
                </button>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <div className="modal-icon">
                    <Mail size={28} />
                  </div>
                  <h2>Reset Password</h2>
                  <p>Enter your email and we'll send you a reset link.</p>
                </div>

                <form onSubmit={handleReset}>
                  <div className="input-group">
                    <label htmlFor="reset-email">Email</label>
                    <input
                      type="email"
                      id="reset-email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  {error && <div className="modal-error">{error}</div>}

                  <button
                    className="btn btn-full"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
