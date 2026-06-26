import "./UserCard.scss";
import { NavLink } from "react-router-dom";
import { motion } from 'framer-motion';
import { Crown, Mail, Calendar, User } from 'lucide-react';

const UserCard = ({user}) => {
  function formatDate(dateString) {
    const date = new Date(dateString);
    let day = date.getDate();
    const suffix = (day) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };
    return `${day}${suffix(day)} ${date.toLocaleString('en-GB', { month: 'long', year: 'numeric' })}`;
  }

  return (  
  <NavLink className="user-card" to={`/users/${user.username ? "@" + user.username : user.email}`} state={user}>
    <div className="card-header">
      <div className="avatar">
        <User size={24} />
      </div>
      {user.isPremium && (
        <div className="premium-badge">
          <Crown size={14} /> PRO
        </div>
      )}
    </div>
    <div className="card-body">
      <div className="user-plan">{user.subscription || "Free"} Plan</div>
      <div className="user-name">@{user.username || user.email.split('@')[0]}</div>
      <div className="user-email">
        <Mail size={14} /> {user.email}
      </div>
      {user.subDate && (
        <div className="user-date">
          <Calendar size={14} /> {formatDate(user.subDate)}
        </div>
      )}
    </div>
  </NavLink>
)};

export default UserCard;
