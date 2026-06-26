import './Pricing.scss';
import { NavLink, useLocation } from 'react-router-dom';
import { pricings } from '../../data';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';

const planIcons = [Zap, Sparkles, Crown];

export default function Pricing() {
  const location = useLocation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  return (
    <div className='pricing' id='pricing'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h1 className='gradient-text'>Pricing</h1>
        <h2>Choose your winning strategy</h2>
      </motion.div>

      <motion.div
        className="wrapper"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {pricings.map((pricing, index) => {
          const Icon = planIcons[index] || Sparkles;
          return (
            <motion.div
              key={pricing.id}
              variants={itemVariants}
              className={`pricing-card ${index === 1 ? 'featured' : ''}`}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              {index === 1 && (
                <div className="popular-badge">
                  <Sparkles size={14} />
                  Most Popular
                </div>
              )}
              <div className="card-header">
                <div className="plan-icon" style={{ backgroundColor: pricing.color + '15' }}>
                  <Icon size={24} style={{ color: pricing.color }} />
                </div>
                <h1>{pricing.plan}</h1>
                <div className="price">
                  <span className="currency">KSH</span>
                  <span className="amount">{pricing.price}</span>
                  <span className="period">/{pricing.billing}</span>
                </div>
              </div>
              <p className="plan-description">{pricing.title}</p>
              <div className="features">
                <h3>Features</h3>
                <ul>
                  {pricing.features.map((feature, i) => (
                    <li key={i}>
                      <Check size={16} style={{ color: pricing.color }} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <NavLink
                className="btn btn-subscribe"
                style={{ backgroundColor: pricing.color }}
                state={{ from: location, subscription: pricing }}
                to={"/subscribe"}
              >
                Subscribe Now
                <Sparkles size={16} />
              </NavLink>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  )
}
