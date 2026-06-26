import { motion } from 'framer-motion';
import './Featured.scss';
import { featured } from '../../data';
import { Shield, Trophy, Zap, Lock } from 'lucide-react';

const iconMap = [Shield, Trophy, Zap, Lock];

const Featured = () => {
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

    return (
        <motion.section
            className="featured"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={containerVariants}
        >
            <motion.h1 variants={itemVariants} className="gradient-text">Play Like A Pro</motion.h1>
            <motion.div className="wrapper" variants={containerVariants}>
                {featured.map((feature, index) => {
                    const Icon = iconMap[index] || Zap;
                    return (
                        <motion.div
                            className="item"
                            key={feature.title}
                            variants={itemVariants}
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        >
                            <div className="icon-wrapper">
                                <Icon size={24} strokeWidth={2.5} />
                            </div>
                            <h3>{feature.title}</h3>
                        </motion.div>
                    );
                })}
            </motion.div>
        </motion.section>
    );
}

export default Featured;
