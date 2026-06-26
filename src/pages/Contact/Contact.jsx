import { useEffect, useState } from 'react';
import './Contact.scss';
import ScrollToTop from '../ScrollToTop';
import { notificationState, userState } from '../../recoil/atoms';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { addContact } from '../../firebase';
import AppHelmet from '../AppHelmet';
import { motion } from 'framer-motion';
import { Send, User, Mail, MessageSquare } from 'lucide-react';

const Contact = () => {
  const user = useRecoilValue(userState);
  const setNotification = useSetRecoilState(notificationState);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    addContact({name, email, message}, setNotification);
    setLoading(false);
  };

  useEffect(() => {
    user && setEmail(user.email);
  }, [user]);

  return (
    <div className="contact">
      <ScrollToTop />
      <AppHelmet title={"Contact"}/>

      <motion.div
        className="contact-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="contact-header">
          <h1>Get Connected</h1>
          <h2>Feel free to ask any questions</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">
              <User size={14} /> Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Your name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">
              <Mail size={14} /> Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="your@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="message">
              <MessageSquare size={14} /> Message
            </label>
            <textarea
              id="message"
              placeholder="How can we help you?"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
            />
          </div>

          <motion.button
            className='btn'
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Send size={16} />
            {loading ? 'Sending...' : 'Send Message'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Contact;
