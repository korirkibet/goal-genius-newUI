import { useState } from 'react';
import './Faq.scss';
import { faqs } from '../../data';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function Faq() {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleAccordion = (id) => {
    setActiveFaq((prev) => (prev === id ? null : id));
  };

  return (
    <motion.div
      className="faq-container"
      id='faq'
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="faq-header">
        <HelpCircle size={32} className="faq-icon" />
        <h1>Frequently Asked Questions</h1>
        <h2>Everything you need to know</h2>
      </div>
      <div className="accordion">
        {faqs.map((faq, index) => (
          <div
            className={`accordion-item ${activeFaq === faq.id ? 'active' : ''}`}
            key={faq.id}
          >
            <button
              onClick={() => toggleAccordion(faq.id)}
              aria-expanded={activeFaq === faq.id}
            >
              <span className="accordion-title">{faq.question}</span>
              <motion.span
                className="icon"
                animate={{ rotate: activeFaq === faq.id ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={20} />
              </motion.span>
            </button>
            <AnimatePresence>
              {activeFaq === faq.id && (
                <motion.div
                  className="accordion-content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <p>{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
