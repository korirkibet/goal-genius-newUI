import { motion } from 'framer-motion';
import './Topbar.scss';
import { Link } from 'react-router-dom';
import { socialUrls } from '../../data';

export default function Topbar() {
  return (
    <motion.div 
      className='topbar'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="topbar-content">
        <span className="topbar-text">Expert Football Predictions & Tips</span>
        <div className="topbar-socials">
          {socialUrls.map(social => (
            <motion.a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              title={social.title}
              whileHover={{ scale: 1.2, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              {social.icon}
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
