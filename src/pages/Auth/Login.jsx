import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Auth.scss'
import { signInUser } from '../../firebase';
import AppHelmet from '../AppHelmet';
import ScrollToTop from '../ScrollToTop';
import { notificationState } from '../../recoil/atoms';
import { useSetRecoilState } from 'recoil';
import ResetPasswordModal from './ResetPassword';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showReset, setShowReset] = useState(false);
  const setNotification = useSetRecoilState(notificationState);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      signInUser(email, password, setNotification)
    } else {
      setNotification({
        isVisible: true,
        type: 'warning',
        message: "You have entered an invalid email address!",
      });
    };
  }

  return (
    <div className='auth'>
      <AppHelmet title={"Login"} />
      <ScrollToTop />
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Welcome Back</h1>
        <p className="form-subtitle">Sign in to access your account</p>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <div className="input-wrapper">
            <Mail size={16} className="input-icon" />
            <input type="email" id='email' placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <div className="input-wrapper">
            <Lock size={16} className="input-icon" />
            <input type="password" id='password' placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>

        <div className="forgot-password">
          <button type="button" className="link-btn" onClick={() => setShowReset(true)}>
            Forgot password?
          </button>
        </div>

        <button type='submit' className='btn btn-full'>
          <LogIn size={16} /> Sign In
        </button>
      </motion.form>
      <span>
        Don't have an account? <NavLink to='/register'>Register</NavLink>
      </span>

      <ResetPasswordModal isOpen={showReset} onClose={() => setShowReset(false)} />
    </div>
  )
}
