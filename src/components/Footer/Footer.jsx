import { motion } from 'framer-motion';
import './Footer.scss';
import { Link } from 'react-router-dom';
import { socialUrls } from '../../data';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atoms';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
    const user = useRecoilValue(userState);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (user && ['kkibetkkoir@gmail.com', 'charleykibet254@gmail.com', 'coongames8@gmail.com'].includes(user.email)) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }, [user]);

    const footerLinks = [
        {
            title: 'Product',
            links: [
                { label: 'Tips', path: '/tips' },
                { label: 'Pricing', path: '/pricing' },
                { label: 'News', path: '/news' },
            ]
        },
        {
            title: 'Company',
            links: [
                { label: 'About', path: '/about' },
                { label: 'Contact', path: '/contact' },
                { label: 'FAQ', path: '/about#faq' },
            ]
        },
        {
            title: 'Account',
            links: [
                { label: 'Login', path: '/login' },
                { label: 'Register', path: '/register' },
            ]
        },
    ];

    return (
        <motion.footer 
            className="footer"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <div className="footer-container">
                <div className="footer-main">
                    <div className="footer-brand">
                        <h3 className="gradient-text">GOAL GENIUS</h3>
                        <p>Expert football predictions and tips for smarter betting decisions. Your trusted partner for accurate match forecasts.</p>
                        <div className="footer-socials">
                            {socialUrls.map(social => (
                                <motion.a
                                    key={social.id}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={social.title}
                                    whileHover={{ scale: 1.15, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    <div className="footer-links">
                        {footerLinks.map((section, idx) => (
                            <div key={idx} className="footer-section">
                                <h4>{section.title}</h4>
                                <ul>
                                    {section.links.map((link, i) => (
                                        <li key={i}>
                                            <Link to={link.path}>
                                                {link.label}
                                                <ArrowUpRight size={14} />
                                            </Link>
                                        </li>
                                    ))}
                                    {section.title === 'Account' && isAdmin && (
                                        <li><Link to="/add-tip">Admin Panel</Link></li>
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Goal Genius. All rights reserved.</p>
                    <div className="footer-meta">
                        <span><Mail size={14} /> support@goalgenius.com</span>
                        <span><MapPin size={14} /> Kenya</span>
                    </div>
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer;
