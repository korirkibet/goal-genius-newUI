import { motion } from 'framer-motion';
import './Flyer.scss';
import { NavLink, useLocation } from 'react-router-dom';
import { pricings } from '../../data';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Flyer() {
  const location = useLocation();
  return (
    <motion.div
      className="flyer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="flyer-content">
        <div className="flyer-icon">
          <Sparkles size={40} />
        </div>
        <h2>Welcome to the Home of Football Predictions!</h2>
        <p>Ready to make smarter predictions? Join us and access expert insights and real-time match analysis.</p>
        <NavLink to="/subscribe" className="btn" state={{ from: location, subscription: pricings[0]}}>
          Subscribe Now <ArrowRight size={18} />
        </NavLink>
      </div>
    </motion.div>
  )
}
