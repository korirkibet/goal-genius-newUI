import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { notificationState } from '../../recoil/atoms';
import { motion, AnimatePresence } from 'framer-motion';
import { CircleCheck as CheckCircle2, CircleAlert as AlertCircle, TriangleAlert as AlertTriangle, X } from 'lucide-react';
import './Notification.scss';

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
};

const colors = {
  success: { bg: '#dcfce7', border: '#22c55e', text: '#15803d' },
  error: { bg: '#fee2e2', border: '#ef4444', text: '#b91c1c' },
  warning: { bg: '#fef3c7', border: '#f59e0b', text: '#b45309' },
};

export default function Notification() {
  const [notification, setNotification] = useRecoilState(notificationState);

  useEffect(() => {
    if (!notification.isVisible) return;

    const visibilityTimer = setTimeout(() => {
      setNotification((prev) => ({ ...prev, isVisible: false }));
      const resetTimer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, type: null, message: null }));
      }, 400);
      return () => clearTimeout(resetTimer);
    }, 4000);

    return () => clearTimeout(visibilityTimer);
  }, [notification.isVisible, setNotification]);

  const handleClose = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, type: null, message: null }));
    }, 400);
  };

  const Icon = icons[notification.type] || AlertCircle;
  const color = colors[notification.type] || colors.warning;

  return (
    <AnimatePresence>
      {notification.isVisible && (
        <motion.div
          className="notification-toast"
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.9 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            backgroundColor: color.bg,
            borderColor: color.border,
            color: color.text,
          }}
        >
          <div className="notification-content">
            <Icon size={20} style={{ color: color.border, flexShrink: 0 }} />
            <span className="notification-message">{notification.message}</span>
          </div>
          <button
            className="notification-close"
            onClick={handleClose}
            style={{ color: color.text }}
          >
            <X size={16} />
          </button>
          <motion.div
            className="notification-progress"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 4, ease: 'linear' }}
            style={{ backgroundColor: color.border }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
