import { IoCheckmarkCircleOutline, IoTimeOutline, IoWarningOutline } from "react-icons/io5";
import './TipCard.scss';
import { truncateTitle } from "../../utils/textUtils";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { BiEdit } from "react-icons/bi";
import { MdPending } from "react-icons/md";
import { motion } from 'framer-motion';
import { Trophy, Lock, EyeOff } from 'lucide-react';

export default function TipCard({ tip, isAdmin, timeSlot, plan, today }) {
    const [hidden, setHidden] = useState(true);

    useEffect(() => {
        if (isAdmin) {
            setHidden(false);
        } else if (tip.date === today && tip.premium) {
            if (tip.status !== "finished") {
                if (plan === null || (plan.timeSlot !== timeSlot)) {
                    setHidden(true);
                } else {
                    if (plan.type !== tip.type) {
                        setHidden(true);
                    } else {
                        setHidden(false);
                    }
                }
            } else {
                setHidden(false);
            }
        } else {
            setHidden(false);
        }
    }, [plan, timeSlot, tip.type, isAdmin, tip.date, today, tip.premium, tip.status]);

    const statusBadge = () => {
        if (tip.status === 'finished') {
            return tip.won === 'won' 
                ? <span className="badge won"><Trophy size={12} /> Won</span>
                : <span className="badge lost"><IoWarningOutline size={12} /> Lost</span>;
        }
        if (tip.status === 'live') {
            return <span className="badge live">Live</span>;
        }
        return <span className="badge pending"><MdPending size={12} /> Pending</span>;
    };

    return (
        <motion.div 
            className={`tip-card ${hidden ? 'hidden' : ''} ${tip.premium ? 'premium' : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="tip-card-header">
                <div className="tip-type">{tip.type}</div>
                {tip.premium && <div className="premium-tag"><Lock size={10} /> PRO</div>}
                {statusBadge()}
            </div>
            
            <div className="tip-card-body">
                <div className="teams">
                    <div className="team">
                        <span className="team-name">{hidden ? '???' : truncateTitle(tip.home, 40)}</span>
                    </div>
                    <div className="vs">VS</div>
                    <div className="team">
                        <span className="team-name">{hidden ? '???' : truncateTitle(tip.away, 40)}</span>
                    </div>
                </div>
                
                <div className="pick-row">
                    <span className="pick-label">Pick</span>
                    <span className="pick-value">{hidden ? '???' : tip.pick}</span>
                </div>
                
                <div className="tip-meta">
                    <div className="meta-item">
                        <IoTimeOutline size={14} />
                        <span>{tip.time}</span>
                    </div>
                    <div className="meta-item odds">
                        <span>@{tip.odd}</span>
                    </div>
                </div>
            </div>

            {isAdmin && (
                <div className="tip-card-footer">
                    <NavLink to={"/edit-tip"} state={tip} className="edit-btn">
                        <BiEdit size={16} /> Edit
                    </NavLink>
                </div>
            )}
        </motion.div>
    )
}
