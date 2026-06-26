import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AppHelmet from '../../pages/AppHelmet';
import Loader from '../../components/Loader/Loader';
import '../AdminAdd.scss';
import { updateNews } from '../../firebase';
import ScrollToTop from '../../pages/ScrollToTop';
import { useSetRecoilState } from 'recoil';
import { notificationState } from '../../recoil/atoms';
import { motion } from 'framer-motion';
import { FileText, ImagePlus, Tag, Save, ArrowLeft } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function EditPost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const setNotification = useSetRecoilState(notificationState);
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    updateNews(data.id, { title, description, category, image }, setLoading, setNotification);
  }

  useEffect(() => {
    setData(location.state);
  }, [location]);

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setDescription(data.description);
      setCategory(data.category || 'all');
    }
  }, [data]);

  return (
    <div className='admin-tips'>
      <AppHelmet title={"Edit Post"} />
      <ScrollToTop />
      
      <motion.div
        className="admin-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="admin-header">
          <NavLink to="/news" className="back-link">
            <ArrowLeft size={18} /> Back to News
          </NavLink>
          <h1><FileText size={24} /> Edit Post</h1>
          <p>Update article content</p>
        </div>

        {!loading && data && (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="title"><FileText size={14} /> Post Title</label>
              <textarea 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
                rows={2}
              />
            </div>

            <div className="input-group">
              <label><ImagePlus size={14} /> Post Image</label>
              <div className="image-upload">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])} 
                />
                <img src={data.imageUrl} alt="current" />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="category"><Tag size={14} /> Category</label>
              <select 
                id="category" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="all">All</option>
                <option value="football">Football</option>
                <option value="betting">Betting</option>
                <option value="insights">Insights</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="description"><FileText size={14} /> Content</label>
              <textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
                rows={10}
              />
            </div>

            <div className="form-actions">
              <NavLink to="/news" className="btn btn-ghost">Cancel</NavLink>
              <button className='btn' type="submit">
                <Save size={16} /> Save Changes
              </button>
            </div>
          </form>
        )}
        {loading && <Loader />}
      </motion.div>
    </div>
  )
}