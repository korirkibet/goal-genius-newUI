import { useEffect, useState } from 'react'
import Newsletter from '../../components/Newsletter/Newsletter';
import Featured from '../../components/Featured/Featured';
import Slider from '../../components/Slider/Slider';
import './Home.scss';
import Pricing from '../../components/Pricing/Pricing';
import NewsItem from '../../components/NewsItem/NewsItem';
import Testimonials from '../../components/Testimonials/Testimonials';
import Flyer from '../../components/Flyer.jsx/Flyer';
import ScrollToTop from '../ScrollToTop';
import { getNews } from '../../firebase';
import { useSetRecoilState } from 'recoil';
import { notificationState } from '../../recoil/atoms';
import AppHelmet from '../AppHelmet';
import AlertAction from '../../components/AlertAction/AlertAction';
import { motion } from 'framer-motion';

export default function Home() {
  const [news, setNews] = useState([]);
  const setNotification = useSetRecoilState(notificationState);

  useEffect(() => {
    const fetchData = () => {
      getNews(4, setNews, setNotification);
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className='Home'>
      <ScrollToTop />
      <AppHelmet title={""} />
      <AlertAction />
      <Slider />
      <Featured />
      <Pricing />
      {news.length > 0 && (
        <motion.section
          className="news-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
        >
          <motion.h1 variants={itemVariants}>News Feed</motion.h1>
          <motion.h2 variants={itemVariants}>Explore Popular Posts</motion.h2>
          <motion.div className='post-container' variants={containerVariants}>
            {news.map((blog) => (
              <motion.div key={blog.id} variants={itemVariants}>
                <NewsItem data={blog} />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      )}
      <Flyer />
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={containerVariants}
      >
        <motion.h1 variants={itemVariants}>Testimonials</motion.h1>
        <motion.h2 variants={itemVariants}>What clients say</motion.h2>
        <Testimonials />
      </motion.section>
      <Newsletter />
    </div>
  )
}
