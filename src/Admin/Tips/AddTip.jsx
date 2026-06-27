import { useState } from 'react'
import AppHelmet from '../../pages/AppHelmet';
import Loader from '../../components/Loader/Loader';
import '../AdminAdd.scss';
import { addTip } from '../../firebase';
import ScrollToTop from '../../pages/ScrollToTop';
import { notificationState } from '../../recoil/atoms';
import { useSetRecoilState } from 'recoil';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Target, Send } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function AddTip() {
    const [home, setHome] = useState('');
    const [away, setAway] = useState('');
    const [odd, setOdd] = useState('');
    const [pick, setPick] = useState('');
    const [status, setStatus] = useState('');
    const [time, setTime] = useState('');
    const [won, setWon] = useState('');
    const [premium, setPremium] = useState(false);
    const [results, setResults] = useState('');
    const [loading, setLoading] = useState(false);
    const setNotification = useSetRecoilState(notificationState);
    const [gamesType, setGamesType] = useState("1X2");

    const handleChange = (event) => {
        setGamesType(event.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const d = new Date(time);
        const date = new Intl.DateTimeFormat('en-US').format(d);
        const timeOnly = d.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
        addTip({
            home,
            away,
            date,
            odd,
            pick,
            status,
            time: timeOnly,
            won,
            premium,
            results,
            type: gamesType
        }, setNotification, setLoading);
    };

    return (
        <div className='admin-tips'>
            <AppHelmet title={"Add Tip"}/>
            <ScrollToTop />
            <motion.div className="admin-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="admin-header">
                    <NavLink to="/tips" className="back-link"><ArrowLeft size={18} /> Back to Tips</NavLink>
                    <h1><Target size={24} /> Add Match Tip</h1>
                    <p>Create a new prediction for your users</p>
                </div>
                {!loading && <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="input-group">
                            <label htmlFor="home">Home Team</label>
                            <input type="text" placeholder='e.g. Manchester United' id='home' value={home} onChange={(e) => setHome(e.target.value)} required/>
                        </div>
                        <div className="input-group">
                            <label htmlFor="away">Away Team</label>
                            <input type="text" placeholder='e.g. Liverpool' id='away' value={away} onChange={(e) => setAway(e.target.value)} required/>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="input-group">
                            <label htmlFor="odds">Odds</label>
                            <input type="text" placeholder='1.85' id='odds' value={odd} onChange={(e) => setOdd(e.target.value)} required/>
                        </div>
                        <div className="input-group">
                            <label htmlFor="pick">Pick</label>
                            <input type="text" placeholder='1X / Over 2.5' id='pick' value={pick} onChange={(e) => setPick(e.target.value)} required/>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="input-group">
                            <label htmlFor="status">Status</label>
                            <select id='status' value={status} onChange={(e) => setStatus(e.target.value)} required>
                                <option value="">Select status</option>
                                <option value="pending">Pending</option>
                                <option value="live">Live</option>
                                <option value="finished">Finished</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label htmlFor="time">Date/Time</label>
                            <input type="datetime-local" id='time' value={time} onChange={(e) => setTime(e.target.value)} required/>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="input-group">
                            <label htmlFor="results">Results</label>
                            <input type="text" placeholder='2-1' id='results' value={results} onChange={(e) => setResults(e.target.value)}/>
                        </div>
                        <div className="input-group">
                            <label htmlFor="won">Outcome</label>
                            <select id='won' value={won} onChange={(e) => setWon(e.target.value)} required>
                                <option value="">Select outcome</option>
                                <option value="pending">Pending</option>
                                <option value="won">Won</option>
                                <option value="lost">Lost</option>
                            </select>
                        </div>
                    </div>
                    <div className="input-group">
                        <label className="checkbox-label">
                            <input type="checkbox" id='premium' onChange={(e) => setPremium(e.target.checked)} checked={premium}/>
                            <Shield size={16} /> Premium (subscription only)
                        </label>
                    </div>
                    <div className="input-group">
                        <label>Prediction Type</label>
                        <div className="radio-group">
                            <label><input type="radio" name="games-type" value={"1X2"} checked={gamesType === "1X2"} onChange={handleChange}/>WDW</label>
                            <label><input type="radio" name="games-type" value={"CS"} checked={gamesType === "CS"} onChange={handleChange}/>CS</label>
                            <label><input type="radio" name="games-type" value={"GG"} checked={gamesType === "GG"} onChange={handleChange}/>BTTS</label>
                            <label><input type="radio" name="games-type" value={"OV_UN"} checked={gamesType === "OV_UN"} onChange={handleChange}/>O/U</label>
                            <label><input type="radio" name="games-type" value={"DC"} checked={gamesType === "DC"} onChange={handleChange}/>DC</label>
                        </div>
                    </div>
                    <div className="form-actions">
                        <NavLink to="/tips" className="btn btn-ghost">Cancel</NavLink>
                        <button type="submit" className='btn'><Send size={16} /> Add Tip</button>
                    </div>
                </form>}
                {loading && <Loader />}
            </motion.div>
        </div>
    );
}
