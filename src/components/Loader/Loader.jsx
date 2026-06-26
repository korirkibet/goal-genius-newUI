import { motion } from 'framer-motion';
import './Loader.scss';

export default function Loader() {
  return (
    <div className="loader">
      <div className="loader-content">
        <div className="spinner">
          <div className="spinner-ring ring-1"></div>
          <div className="spinner-ring ring-2"></div>
          <div className="spinner-ring ring-3"></div>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Loading...
        </motion.p>
      </div>
    </div>
  );
}
