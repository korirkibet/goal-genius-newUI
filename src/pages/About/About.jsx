import { NavLink } from 'react-router-dom';
import './About.scss';
import Faq from '../../components/Faq/Faq';
import Newsletter from '../../components/Newsletter/Newsletter';
import Testimonials from '../../components/Testimonials/Testimonials';
import ScrollToTop from '../ScrollToTop';
import AppHelmet from '../AppHelmet';
import { motion } from 'framer-motion';
import { Target, Users, Zap, Globe, Mail, ArrowRight } from 'lucide-react';

const About = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const features = [
        {
            icon: Target,
            title: "For Football Fans",
            description: "Dive into a world of football predictions and analysis. From the Premier League to international tournaments, we provide forecasts backed by data and expert insights."
        },
        {
            icon: Users,
            title: "For Bettors & Analysts",
            description: "Gain access to detailed match predictions, player stats, and historical data to make informed decisions. Our platform empowers you with the tools you need."
        },
        {
            icon: Zap,
            title: "Real-Time Insights",
            description: "Our platform delivers live updates, ensuring you're always informed about the latest match developments, team news, and performance metrics."
        },
        {
            icon: Globe,
            title: "Our Mission",
            description: "We aim to revolutionize football predictions by combining cutting-edge technology, expert knowledge, and community-driven engagement."
        }
    ];

    return (
        <div className="about">
            <ScrollToTop />
            <AppHelmet title={"About"}/>

            <div className="about-hero">
                <div className="about-hero-content">
                    <h1>About Goal Genius</h1>
                    <p>Your ultimate destination for accurate match forecasts, insightful analysis, and real-time updates. Whether you're a football enthusiast or a seasoned bettor, our platform offers something special for everyone.</p>
                </div>
            </div>

            <motion.div
                className="about-features"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
            >
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        className="feature-card"
                        variants={itemVariants}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    >
                        <div className="feature-icon">
                            <feature.icon size={24} />
                        </div>
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </motion.div>
                ))}
            </motion.div>

            <div className="about-cta">
                <div className="about-cta-content">
                    <h2>Join Our Community</h2>
                    <p>Become part of a thriving community that shares your passion for football.</p>
                    <div className="about-cta-buttons">
                        <NavLink to="/contact" className="btn">
                            <Mail size={16} /> Contact Us
                        </NavLink>
                        <NavLink to="/pricing" className="btn btn-secondary">
                            View Plans <ArrowRight size={16} />
                        </NavLink>
                    </div>
                </div>
            </div>

            <Faq />

            <div className="about-testimonials">
                <h1>What Our Clients Say</h1>
                <Testimonials />
            </div>

            <Newsletter />
        </div>
    );
}

export default About;