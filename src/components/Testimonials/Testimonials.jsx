import { motion } from 'framer-motion';
import './Testimonials.scss'
import { testimonials } from '../../data'
import { Quote } from 'lucide-react';

export default function Testimonials() {
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
        <div className='testimonials'>
            <motion.div
                className="wrapper"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
            >
                {testimonials.map(testimonial => (
                    <motion.div
                        className='testimonial'
                        key={testimonial.id}
                        variants={itemVariants}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    >
                        <div className="quote-icon">
                            <Quote size={24} />
                        </div>
                        <div className='content'>
                            <span className="plan-badge">{testimonial.title}</span>
                            <p>{testimonial.description}</p>
                        </div>
                        <h2 className="author">{testimonial.name}</h2>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}
