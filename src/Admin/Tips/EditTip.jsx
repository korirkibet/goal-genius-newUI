import { useEffect, useState } from 'react'
import { useLocation, NavLink } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import AppHelmet from '../../pages/AppHelmet';
import '../AdminAdd.scss';
import { updateTip } from '../../firebase';
import ScrollToTop from '../../pages/ScrollToTop';
import { useSetRecoilState } from 'recoil';
import { notificationState } from '../../recoil/atoms';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Shield, Target } from 'lucide-react';

export default function EditTip() {
    const [home, setHome] = useState('');
    const [away, setAway] = useState('');
    const [odd, setOdd] = useState('');
    const [pick, setPick] = useState('');
    const [status, setStatus] = useState('');
    const [time, setTime] = useState('');
    const [won, setWon] = useState('');
    const [premium, setPremium] = useState(false);
    const [gamesType, setGamesType] = useState("1X2");
    const [results, setResults] = useState('');
    const [loading, setLoading] = useState(false);
    const setNotification = useSetRecoilState(notificationState);
    const [data, setData] = useState(null);

    const handleChange = (event) => setGamesType(event.target.value);

    const location = useLocation();

    useEffect(() => {
        setData(location.state);
    }, [location]);

    const handleSubmit = (e) => {
        e.preventDefault()
        const d = new Date(time);
        const date = new Intl.DateTimeFormat('en-US').format(d);
        const timeOnly = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        updateTip(data.id, { home, away, odd, pick, status, won, premium, type: gamesType, results, date, time: timeOnly }, setNotification, setLoading, setData);
    }

    const formatDateTimeForInput = (date, time) => {
        const [month, day, year] = date.split('/').map(Number);
        const formattedDate = new Date(year, month - 1, day);
        const yearStr = formattedDate.getFullYear();
        const monthStr = String(formattedDate.getMonth() + 1).padStart(2, '0');
        const dayStr = String(formattedDate.getDate()).padStart(2, '0');
        return `${yearStr}-${monthStr}-${dayStr}T${time}`;
    };

    useEffect(() => {
        if (data) {
            setHome(data.home);
            setAway(data.away);
            setOdd(data.odd);
            setPick(data.pick);
            setStatus(data.status);
            setResults(data.results)
            setWon(data.won);
            setPremium(data.premium);
            setGamesType(data.type);
            const datetimeLocal = formatDateTimeForInput(data.date, data.time);
            setTime(datetimeLocal);
        }
    }, [data]);

    return (
        <div className='admin-tips'>
            <AppHelmet title={"Edit Tip"} />
            <ScrollToTop />
            <motion.div className="admin-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="admin-header">
                    <NavLink to="/tips" className="back-link"><ArrowLeft size={18} /> Back to Tips</NavLink>
                    <h1><Target size={24} /> Edit Match Tip</h1>
                    <p>Update prediction details</p>
                </div>
                {!loading && <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="input-group">
                            <label htmlFor="home">Home Team</label>
                            <input type="text" id='home' value={home} onChange={(e) => setHome(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="away">Away Team</label>
                            <input type="text" id='away' value={away} onChange={(e) => setAway(e.target.value)} required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="input-group">
                            <label htmlFor="odds">Odds</label>
                            <input type="text" id='odds' value={odd} onChange={(e) => setOdd(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="pick">Pick</label>
                            <input type="text" id='pick' value={pick} onChange={(e) => setPick(e.target.value)} required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="input-group">
                            <label htmlFor="status">Status</label>
                            <select id='status' value={status} onChange={(e) => setStatus(e.target.value)} required>
                                <option value="pending">Pending</option>
                                <option value="live">Live</option>
                                <option value="finished">Finished</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label htmlFor="time">Date/Time</label>
                            <input type="datetime-local" id='time' value={time} onChange={(e) => setTime(e.target.value)} required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="input-group">
                            <label htmlFor="results">Results</label>
                            <input type="text" id='results' value={results} onChange={(e) => setResults(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="won">Outcome</label>
                            <select id='won' value={won} onChange={(e) => setWon(e.target.value)} required>
                                <option value="pending">Pending</option>
                                <option value="won">Won</option>
                                <option value="lost">Lost</option>
                            </select>
                        </div>
                    </div>
                    <div className="input-group">
                        <label className="checkbox-label">
                            <input type="checkbox" id='premium' onChange={(e) => setPremium(e.target.checked)} checked={premium} />
                            <Shield size={16} /> Premium (subscription only)
                        </label>
                    </div>
                    <div className="input-group">
                        <label>Prediction Type</label>
                        <div className="radio-group">
                            <label><input type="radio" name="games-type" value={"1X2"} checked={gamesType === "1X2"} onChange={handleChange} />WDW</label>
                            <label><input type="radio" name="games-type" value={"CS"} checked={gamesType === "CS"} onChange={handleChange} />CS</label>
                            <label><input type="radio" name="games-type" value={"GG"} checked={gamesType === "GG"} onChange={handleChange} />BTTS</label>
                            <label><input type="radio" name="games-type" value={"OV_UN"} checked={gamesType === "OV_UN"} onChange={handleChange} />O/U</label>
                            <label><input type="radio" name="games-type" value={"DC"} checked={gamesType === "DC"} onChange={handleChange} />DC</label>
                        </div>
                    </div>
                    <div className="form-actions">
                        <NavLink to="/tips" className="btn btn-ghost">Cancel</NavLink>
                        <button type="submit" className='btn'><Save size={16} /> Save Changes</button>
                    </div>
                </form>}
                {loading && <Loader />}
            </motion.div>
        </div>
    )
}
