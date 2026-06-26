import { useEffect, useState } from 'react';
import './News.scss';
import NewsItem from '../../components/NewsItem/NewsItem';
import ScrollToTop from '../ScrollToTop';
import { fetchData } from '../../firebase';
import Loader from '../../components/Loader/Loader';
import { Newspaper, ChevronDown, Filter } from 'lucide-react';
import AppHelmet from '../AppHelmet';
import { notificationState } from '../../recoil/atoms';
import { useSetRecoilState } from 'recoil';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function News() {
  const [data, setData] = useState([]);
  const [lastDoc, setLastDoc] = useState(null); // To keep track of the last document
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // To check if more data exists
  const setNotification = useSetRecoilState(notificationState);
  const [category, setCategory] = useState('');
  const location = useLocation();

  // Fetch data when component mounts or category changes
  useEffect(() => {
    fetchData(loading, null, setData, setLastDoc, setHasMore, setLoading, setNotification, category);
  }, [category]);

  // Update category when URL changes
  useEffect(() => {
    const newCategory = new URLSearchParams(location.search).get('category');
    setCategory(newCategory || ''); // Use empty string if no category is provided
  }, [location.search]);

  // Load more data
  const loadMore = () => {
    if (hasMore && !loading) {
      fetchData(loading, lastDoc, setData, setLastDoc, setHasMore, setLoading, setNotification, category);
    }
  };

  return (
    <div className="news">
      <ScrollToTop />
      <AppHelmet title={"News"}/>

      <div className="news-header">
        <div className="news-header-content">
          <h1><Newspaper size={24} /> Football News</h1>
          <p>Latest updates, insights, and analysis</p>
        </div>
      </div>

      <div className="news-filters">
        <div className="filter-label">
          <Filter size={14} />
          <span>Filter by category:</span>
        </div>
        <div className="filter-buttons">
          {['all', 'football', 'betting', 'insights'].map(cat => (
            <button
              key={cat}
              className={`filter-btn ${category === cat || (!category && cat === 'all') ? 'active' : ''}`}
              onClick={() => setCategory(cat === 'all' ? '' : cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="news-grid">
        {loading && <Loader />}
        {!loading && data.length > 0 && (
          <motion.div
            className="news-items"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {data.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <NewsItem data={blog} />
              </motion.div>
            ))}
          </motion.div>
        )}
        {!loading && data.length === 0 && (
          <div className="empty-state">
            <Newspaper size={48} />
            <h3>No articles yet</h3>
            <p>Check back soon for the latest football news.</p>
          </div>
        )}
      </div>

      {hasMore && !loading && (
        <div className="load-more">
          <button className="btn btn-secondary" onClick={loadMore}>
            <ChevronDown size={16} /> Load More
          </button>
        </div>
      )}
      {loading && hasMore && <Loader />}
    </div>
  );
}
