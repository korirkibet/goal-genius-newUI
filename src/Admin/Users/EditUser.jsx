import { useEffect, useState }  from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import AppHelmet from '../../pages/AppHelmet';
import Loader from '../../components/Loader/Loader';
import '../AdminAdd.scss';
import { db } from '../../firebase';
import ScrollToTop from '../../pages/ScrollToTop';
import { useSetRecoilState } from 'recoil';
import { notificationState } from '../../recoil/atoms';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Crown, Save, ArrowLeft } from 'lucide-react';

export default function EditUser() {
    const location = useLocation();
    const [user, setUserState] = useState(null);
    const [loading, setLoading] = useState(false);
    const setNotification = useSetRecoilState(notificationState);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [subscription, setSubscription] = useState("");
    const [subDate, setSubDate] = useState('');
    const [isPremium, setIsPremium] = useState(false);

    function toDateTimeLocal(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '1');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    useEffect(() => {
        if(user) {
            setEmail(user.email)
            setUsername(user.username)
            setIsPremium(user.isPremium)
            user.subscription ? setSubscription(user.subscription) : setSubscription("Free")
            user.subDate && setSubDate(toDateTimeLocal(user.subDate))
        }
    }, [user]);

    useEffect(() => {
        setUserState(location.state)
    }, [location]);

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true);
        const usercollref = doc(db,'users', user.email)
        updateDoc(usercollref,{
          isPremium, 
          subscription: subscription === "Free" ? "" : subscription,
          subDate           
        } ).then(response => {
            setNotification({
                isVisible: true,
                type: 'success',
                message: "User Updated " + response,
            });
            setLoading(false);
        }).catch(error =>{
          setNotification({
            isVisible: true,
            type: 'error',
            message: error.message,
          });
          setLoading(false)
      })
    }

    return (
        <div className='admin-tips'>
            <AppHelmet title={"Edit User"}/>
            <ScrollToTop />
            <motion.div className="admin-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="admin-header">
                    <NavLink to="/users" className="back-link"><ArrowLeft size={18} /> Back to Users</NavLink>
                    <h1><User size={24} /> Edit User</h1>
                    <p>Manage user subscription details</p>
                </div>
                {loading && <Loader />}
                {!loading && <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username"><User size={14} /> Username</label>
                        <input type="text" placeholder='@someone' id='username' value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div className="input-group">
                        <label htmlFor="email"><Mail size={14} /> Email</label>
                        <input type="text" placeholder='example@gmail.com' id='email' value={email} onChange={(e) => setEmail(e.target.value)} readOnly/>
                    </div>  
                    <div className="input-group">
                        <label htmlFor="subscription"><Crown size={14} /> Subscription</label>
                        <input type="text" placeholder='Daily / Weekly / Monthly' id='subscription' value={subscription} onChange={(e) => setSubscription(e.target.value)}/>
                    </div>
                    <div className="input-group">
                        <label htmlFor="subDate"><Calendar size={14} /> Subscribed On</label>
                        <input type="datetime-local" id='subDate' value={subDate} onChange={(e) => setSubDate(e.target.value)}/>
                    </div>
                    <div className="input-group">
                        <label className="checkbox-label">
                            <input type="checkbox" id='premium' onChange={(e) => setIsPremium(e.target.checked)} checked={isPremium}/>
                            <Crown size={16} /> Premium User
                        </label>
                    </div>
                    
                    <div className="form-actions">
                        <NavLink to="/users" className="btn btn-ghost">Cancel</NavLink>
                        <button type="submit" className='btn' title='Submit' aria-label="add"><Save size={16} /> Update User</button>
                    </div>
                </form>}
            </motion.div>
        </div>
    )
}