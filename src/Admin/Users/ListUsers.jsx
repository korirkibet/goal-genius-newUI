import { useEffect, useState } from 'react';
import { getAllusers } from '../../firebase';
import Loader from '../../components/Loader/Loader';
import UserCard from '../../components/UserCard/UserCard';
import './ListUsers.scss';
import ScrollToTop from '../../pages/ScrollToTop';
import AppHelmet from '../../pages/AppHelmet';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export default function ListUsers() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllusers(setUsers, setLoading);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className='list-users'>
      <ScrollToTop />
      <AppHelmet title={"All Users"} />
      
      <div className="list-users-header">
        <h1><Users size={24} /> All Users</h1>
        <p>{users.length} registered users</p>
      </div>

      {loading && <Loader />}
      
      <motion.div 
        className="users-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {users.length > 0 && users.map(user => (
          <motion.div key={user.email} variants={itemVariants}>
            <UserCard user={user} />
          </motion.div>
        ))}
      </motion.div>
      
      {!loading && users.length === 0 && (
        <div className="empty-state">
          <Users size={48} />
          <h3>No users found</h3>
        </div>
      )}
    </div>
  );
}
