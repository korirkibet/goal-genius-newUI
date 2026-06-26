import { useState } from 'react';
import './Newsletter.scss';
import { addMailList } from '../../firebase';
import { useSetRecoilState } from 'recoil';
import { notificationState } from '../../recoil/atoms';
import { motion } from 'framer-motion';
import { Send, Mail } from 'lucide-react';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const setNotification = useSetRecoilState(notificationState);

    const handleSubmit = (event) => {
      event.preventDefault();
      if (!email || !email.includes('@')) {
        setNotification({
          isVisible: true,
          type: 'warning',
          message: 'Please enter a valid email address',
        });
        return;
      }
      addMailList({ email }, setNotification, setEmail);
    };

    return (
      <motion.div
        className='newsletter'
        id='subscribe'
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="newsletter-icon">
          <Mail size={32} />
        </div>
        <h3>Stay in the Game</h3>
        <p>Get exclusive tips and updates delivered to your inbox</p>
        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <Mail size={18} className="input-icon" />
            <input
              type='email'
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <motion.button
            type='submit'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Send size={16} />
            Subscribe
          </motion.button>
        </form>
      </motion.div>
    );
}

export default Newsletter;
