import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Slider.scss'
import { NavLink } from 'react-router-dom';
import { slides } from '../../data';
import { motion, AnimatePresence } from 'framer-motion';

export default function Slider() {
    const [slideIndex, setSlideIndex] = useState(0);

    const handleClick = useCallback((direction) => {
        if (direction === "left") {
            setSlideIndex(prev => prev > 0 ? prev - 1 : slides.length - 1);
        } else {
            setSlideIndex(prev => prev < slides.length - 1 ? prev + 1 : 0);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClick("right");
        }, 7000);
        return () => clearTimeout(timer);
    }, [slideIndex, handleClick]);

    return (
        <div className="slider-container">
            <AnimatePresence mode="wait">
                <motion.div
                    key={slideIndex}
                    className="slide"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                >
                    <div className="slide-background" style={{
                        backgroundImage: `url(${slides[slideIndex].img})`,
                    }} />
                    <div className="slide-overlay" />
                    <div className="slide-content">
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            {slides[slideIndex].title}
                        </motion.h2>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <NavLink to={slides[slideIndex].link} className='btn'>
                                Explore Now
                            </NavLink>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <button className="slider-arrow left" onClick={() => handleClick("left")} aria-label="Previous slide">
                <ChevronLeft size={24} />
            </button>
            <button className="slider-arrow right" onClick={() => handleClick("right")} aria-label="Next slide">
                <ChevronRight size={24} />
            </button>

            <div className="slider-dots">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        className={`dot ${idx === slideIndex ? 'active' : ''}`}
                        onClick={() => setSlideIndex(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}