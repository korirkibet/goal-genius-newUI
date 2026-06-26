import { formatDate, readingTime, truncateTitle } from '../../utils/textUtils';
import './NewsItem.scss'
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';

export default function NewsItem({data}) {
  return (
  <motion.div 
    className="news-item"
    whileHover={{ y: -4 }}
    transition={{ duration: 0.3 }}
  >
    <NavLink to={`/news/${data.id.trim().split(' ').join("_")}`}  state={data}>
      <div className="image-container" style={{
        backgroundImage: `url(${data.imageUrl})`
      }}>
        <div className="image-overlay">
          <span className="read-more">Read <ArrowRight size={14} /></span>
        </div>
      </div>
      <div className="news-content">
        <div className="news-meta">
          <span className="category">{data.category}</span>
          <span className="separator">•</span>
          <span className="date">{formatDate(data.timestamp)}</span>
          <span className="separator">•</span>
          <span className="read-time"><Clock size={12} /> {readingTime(data.description)} min</span>
        </div>
        <h3>{truncateTitle(data.title, 50)}</h3>
      </div>
    </NavLink>
  </motion.div>
  )
}