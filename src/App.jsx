import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { notificationState, userState } from './recoil/atoms';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, getUser } from './firebase';
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

import Topbar from './components/Topbar/Topbar';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Loader from './components/Loader/Loader';
import Home from './pages/Home/Home';
import News from './pages/News/News';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import SinglePost from './pages/SinglePost/SinglePost';
import Tips from './pages/Tips/Tips';
import NotFound from './pages/NotFound/NotFound';
import Plans from './pages/Plans/Plans';
import Pay from './pages/Pay/Pay';
import AddPost from './Admin/Posts/AddPost';
import EditPost from './Admin/Posts/EditPost';
import AddTip from './Admin/Tips/AddTip';
import EditTip from './Admin/Tips/EditTip';
import ListUsers from './Admin/Users/ListUsers';
import EditUser from './Admin/Users/EditUser';
import ProtectedRoute from './utils/ProtectedRoute';
import ProtectedAuthRoute from './utils/ProtectedAuthRoute';
import ProtectedAdminRoute from './utils/ProtectedAdminRoute';
import { checkSubscriptionStatus } from './utils/subscription';
import Subscription from './pages/Pay/Subscription';
import Pricing from './components/Pricing/Pricing';
import Notification from './components/Notification/Notification';
import ProtectedPricingRoute from './utils/ProtectedPricingRoute';

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useRecoilState(userState);
  const [isScrolled, setIsScrolled] = useState(false);
  const setNotification = useSetRecoilState(notificationState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        getUser(currentUser.email, setUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser]);

  useEffect(() => {
    checkSubscriptionStatus(user, setNotification);
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="App">
      {loading ? <Loader /> : (
        <>
          <Topbar />
          <Navbar />
          <Notification />
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="pricing" element={<Pricing />} />
            <Route path="subscribe" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
            <Route path="plans" element={<ProtectedPricingRoute><Plans /></ProtectedPricingRoute>} />
            <Route path="pay" element={<Pay />} />

            <Route path="tips" element={<Tips />} />
            <Route path="news" element={<News />} />
            <Route path="news/:post" element={<SinglePost />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<ProtectedAuthRoute><Login /></ProtectedAuthRoute>} />
            <Route path="register" element={<ProtectedAuthRoute><Register /></ProtectedAuthRoute>} />
            <Route path="add-post" element={<ProtectedAdminRoute><AddPost /></ProtectedAdminRoute>} />
            <Route path="edit-post" element={<ProtectedAdminRoute><EditPost /></ProtectedAdminRoute>} />
            <Route path="add-tip" element={<ProtectedAdminRoute><AddTip /></ProtectedAdminRoute>} />
            <Route path="edit-tip" element={<ProtectedAdminRoute><EditTip /></ProtectedAdminRoute>} />
            <Route path="users" element={<ProtectedAdminRoute><ListUsers /></ProtectedAdminRoute>} />
            <Route path="users/:id" element={<ProtectedAdminRoute><EditUser /></ProtectedAdminRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AnimatePresence>
            {isScrolled && (
              <motion.button
                className="btn top"
                title="Scroll to top"
                onClick={handleScrollToTop}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowUp size={20} />
              </motion.button>
            )}
          </AnimatePresence>
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
