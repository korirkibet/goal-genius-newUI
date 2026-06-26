import { useEffect, useState } from 'react';
import AppHelmet from '../../pages/AppHelmet';
import Loader from '../../components/Loader/Loader';
import '../AdminAdd.scss';
import { addNews } from '../../firebase';
import ScrollToTop from '../../pages/ScrollToTop';
import { useSetRecoilState } from 'recoil';
import { notificationState } from '../../recoil/atoms';
import { motion } from 'framer-motion';
import { ImagePlus, FileText, Tag, Send, ArrowLeft } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function AddPost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const setNotification = useSetRecoilState(notificationState);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !image) {
      return setNotification({
        isVisible: true,
        type: 'error',
        message: "Please fill all fields to continue!",
      });
    }
    addNews({ title, description, category, image }, setLoading);
  }

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className='admin-tips'>
      <AppHelmet title={"Add Post"} />
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
          <h1><FileText size={24} /> Add New Post</h1>
          <p>Create a new article for your readers</p>
        </div>

        {!loading && (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="title"><FileText size={14} /> Post Title</label>
              <textarea 
                id="title" 
                placeholder="Write your post title here..." 
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
                  required 
                />
                {image ? (
                  <img src={URL.createObjectURL(image)} alt="upload_preview" />
                ) : (
                  <div className="upload-placeholder">
                    <ImagePlus size={32} />
                    <p>Click to browse or drag and drop</p>
                  </div>
                )}
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
                placeholder="Write your post content here..." 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
                rows={10}
              />
            </div>

            <div className="form-actions">
              <NavLink to="/news" className="btn btn-ghost">Cancel</NavLink>
              <button className='btn' type="submit">
                <Send size={16} /> Publish Post
              </button>
            </div>
          </form>
        )}
        {loading && <Loader />}
      </motion.div>
    </div>
  )
}
