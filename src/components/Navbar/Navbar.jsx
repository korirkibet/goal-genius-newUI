import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userState } from '../../recoil/atoms';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import './Navbar.scss';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/tips', label: 'Tips' },
    { path: '/news', label: 'News' },
    { path: '/about', label: 'About' },
  ];

  const adminLinks = [
    { path: '/add-tip', label: 'Add Tip' },
    { path: '/add-post', label: 'Add Post' },
    { path: '/users', label: 'Users' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user && ['kkibetkkoir@gmail.com', 'charleykibet254@gmail.com', 'coongames8@gmail.com'].includes(user.email)) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
    setIsOpen(false);
  };

  return (
    <motion.header
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">GOAL</span>
          <span className="logo-text accent">GENIUS</span>
        </Link>

        <nav className="navbar-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          
          {isAdmin && (
            <div className="dropdown">
              <span className="nav-link dropdown-trigger">
                Admin <ChevronDown size={14} />
              </span>
              <div className="dropdown-menu">
                {adminLinks.map((link) => (
                  <Link key={link.path} to={link.path} className="dropdown-item">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>

        <div className="navbar-actions">
          {user ? (
            <div className="user-menu">
              <span className="user-email">{user.username || user.email?.split('@')[0]}</span>
              <button onClick={handleLogout} className="btn-icon" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn">Get Started</Link>
            </>
          )}
        </div>

        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`mobile-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && adminLinks.map((link) => (
              <Link key={link.path} to={link.path} className="mobile-link admin">
                {link.label}
              </Link>
            ))}
            <div className="mobile-actions">
              {user ? (
                <button onClick={handleLogout} className="btn btn-danger">
                  <LogOut size={16} /> Logout
                </button>
              ) : (
                <>
                  <Link to="/login" className="btn btn-secondary">Login</Link>
                  <Link to="/register" className="btn">Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
