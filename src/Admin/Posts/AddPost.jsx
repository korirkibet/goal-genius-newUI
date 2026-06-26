import { useEffect, useState } from 'react';
import AppHelmet from '../../pages/AppHelmet';
import Loader from '../../components/Loader/Loader';
import './AddPost.scss';
import { addNews } from '../../firebase';
import { MdAddAPhoto, MdForward } from 'react-icons/md';
import ScrollToTop from '../../pages/ScrollToTop';
import { useSetRecoilState } from 'recoil';
import { notificationState } from '../../recoil/atoms';

export default function AddPost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const setNotification = useSetRecoilState(notificationState);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title && !description && !image) {
      return setNotification({
        isVisible: true,
        type: 'error',
        message: "Enter all fields to continue!",
      });
    }
    addNews({ title, description, category: category, image }, setLoading);
  }


  useEffect(() => {
    setLoading(false);
  }, []);


  return (
    <div className='add-post'>
      <AppHelmet title={"Add Post"} />
      <ScrollToTop />
      {!loading && <form onSubmit={handleSubmit}>
        <label htmlFor="title">post title:</label>
        <textarea type="text" placeholder="Write your post title here..." name='title' required value={title} onChange={(e) => setTitle(e.target.value)} />
        <label htmlFor="image">post image:</label>
        <div className="image">
          <input type="file" placeholder="enter post image" name='image' required onChange={(e) => {
            setImage(e.target.files[0]);
          }} />
          {image ? <img src={URL.createObjectURL(image)} alt="upload_image" /> : <>
            <h4>Click to browse</h4>
            <p>or</p>
            <h4>Drag and drop to upload</h4>
            <MdAddAPhoto className='icon' />
          </>
          }
        </div>
        <label htmlFor='category'>Select category:</label>
        <select defaultValue={'all'} placeholder="Select option" id='category' name='category'
          onChange={(e) => setCategory(e.target.value)}>
          <option value="all" >All</option>
          <option value="football" >Football</option>
          <option value="betting" >Betting</option>
          <option value="insights" >Insights</option>
        </select>
        <label htmlFor="description">post description:</label>
        <textarea placeholder="Write post content here..." name='description' id='description' required value={description} onChange={(e) => setDescription(e.target.value)} />
        <button className='btn' aria-label="publish">Publish <MdForward /></button>
      </form>}
      {
        loading && <Loader />
      }
    </div>
  )
}