import { ChevronLeft, ChevronRight } from 'lucide-react';
import TipCard from '../../components/TipCard/TipCard';
import './Tips.scss';
import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import AppHelmet from '../AppHelmet';
import ScrollToTop from '../ScrollToTop';
import { useRecoilState } from 'recoil';
import { userState } from '../../recoil/atoms';
import Loader from '../../components/Loader/Loader';
import { getTips } from '../../firebase';
import { motion } from 'framer-motion';
import { Crown, Calendar } from 'lucide-react';

export default function Tips() {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [firstIcon, setFirstIcon] = useState("flex");
  const [lastIcon, setLastIcon] = useState("flex");

  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);
  const [user, setUser] = useRecoilState(userState);
  const [isAdmin, setAdmin] = useState(false);
  const [filteredTips, setFilteredTips] = useState(null);
  const [gamesType, setGamesType] = useState("ALL");
  const [tips, setTips] = useState(null);

  const tabBoxRef = useRef();

  const handleIcons = () => {
    let scrollVal = Math.round(tabBoxRef.current.scrollLeft);
    let maxScrollableWidth = tabBoxRef.current.scrollWidth - tabBoxRef.current.clientWidth;
    setFirstIcon(scrollVal >= 1 ? "flex" : "none");
    setLastIcon(maxScrollableWidth > scrollVal + 1 ? "flex" : "none");
  };

  const handleClick = (direction) => {
    const scrollAmount = direction === "left" ? -350 : 350;
    tabBoxRef.current.scrollLeft += scrollAmount;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  };

  const returnDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    const tabBox = tabBoxRef.current;

    const mouseDownHandler = (e) => {
      setIsDragging(true);
      setStartX(e.pageX - tabBox.offsetLeft);
      setScrollLeft(tabBox.scrollLeft);
    };

    const mouseMoveHandler = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - tabBox.offsetLeft;
      const walk = (x - startX) * 5;
      tabBox.scrollLeft = scrollLeft - walk;
    };

    const mouseUpHandler = () => {
      setIsDragging(false);
    };

    tabBox.addEventListener('mousedown', mouseDownHandler);
    tabBox.addEventListener('mousemove', mouseMoveHandler);
    tabBox.addEventListener('mouseup', mouseUpHandler);
    tabBox.addEventListener('mouseleave', mouseUpHandler);
    tabBox.addEventListener('scroll', handleIcons);

    return () => {
      tabBox.removeEventListener('mousedown', mouseDownHandler);
      tabBox.removeEventListener('mousemove', mouseMoveHandler);
      tabBox.removeEventListener('mouseup', mouseUpHandler);
      tabBox.removeEventListener('mouseleave', mouseUpHandler);
      tabBox.removeEventListener('scroll', handleIcons);
    };
  }, [isDragging, startX, scrollLeft]);

  useEffect(() => {
    let dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      let date = new Date(today);
      date.setDate(date.getDate() - i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      dates.push(`${year}-${month}-${day}`);
    }
    setDays(dates.reverse());
  }, []);

  useEffect(() => {
    days && setCurrentDate(days[days.length - 1]);
  }, [days]);

  useEffect(() => {
    if (!tabBoxRef.current) return;
    const tabBox = tabBoxRef.current;
    tabBox.scrollLeft = tabBox.scrollWidth - tabBox.clientWidth;
    handleIcons();
  }, [tabBoxRef.current]);

  useEffect(() => {
    getTips(setTips, setLoading, formatDate(currentDate));
  }, [currentDate]);

  useEffect(() => {
    if (tips !== null) {
      const groupedData = tips.reduce((acc, item) => {
        const time = item.time;
        const [hours, minutes] = time.split(':').map(Number);

        let timeSlot = '';
        if (hours >= 0 && hours < 6) {
          timeSlot = 'Morning';
        } else if (hours >= 6 && hours < 12) {
          timeSlot = 'Afternoon';
        } else if (hours >= 12 && hours < 18) {
          timeSlot = 'Evening';
        } else if (hours >= 18 && hours <= 23) {
          timeSlot = 'Night';
        }

        if (!acc[timeSlot]) {
          acc[timeSlot] = [];
        }

        acc[timeSlot].push(item);

        return acc;
      }, {});

      const result = Object.keys(groupedData).map(timeSlot => ({
        timeSlot,
        items: groupedData[timeSlot]
      })).sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));

      setFilteredTips(result);
    }
  }, [tips]);

  useEffect(() => {
    if (user && ['kkibetkkoir@gmail.com', 'charleykibet254@gmail.com', 'coongames8@gmail.com'].includes(user.email)) {
      setAdmin(true);
    } else {
      setAdmin(false);
    }
  }, [user]);

  const typeLabels = {
    "ALL": "All",
    "1X2": "WDW",
    "CS": "CS",
    "GG": "BTTS",
    "OV_UN": "O/U",
    "DC": "DC"
  };

  return (
    <div className='tips'>
      <AppHelmet title={"Tips"} />
      <ScrollToTop />

      <div className="tips-header">
        <div className="tips-header-content">
          <h1><Calendar size={24} /> Match Tips</h1>
          <p>Expert predictions for today's matches</p>
        </div>
      </div>

      <div className="date-wrapper">
        <div className="icon" style={{ display: firstIcon }}>
          <button className="scroll-btn" onClick={() => handleClick("left")}>
            <ChevronLeft size={20} />
          </button>
        </div>
        <ul className={`tabs-box ${isDragging ? "dragging" : ""}`} ref={tabBoxRef}>
          {days && days.map((day) => (
            <li
              className={`tab ${(currentDate === day) && 'active'}`}
              onClick={() => setCurrentDate(day)}
              key={day}
            >
              <span className="day-name">{returnDate(day).split(" ")[0]}</span>
              <span className="day-date">{returnDate(day).split(" ")[1]} {returnDate(day).split(" ")[2]}</span>
            </li>
          ))}
        </ul>
        <div className="icon" style={{ display: lastIcon }}>
          <button className="scroll-btn" onClick={() => handleClick("right")}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <NavLink to={`${user && user.isPremium ? '/plans' : "/pricing"}`} className={"subscribe-btn"}>
        <Crown size={16} />
        SUBSCRIBE TO VIEW TIPS
      </NavLink>

      <div className="type-filter">
        {Object.keys(typeLabels).map((type) => (
          <button
            key={type}
            className={`type-btn ${gamesType === type ? 'active' : ''}`}
            onClick={() => setGamesType(type)}
          >
            {typeLabels[type]}
          </button>
        ))}
      </div>

      {loading && <Loader />}
      {!loading && (
        <>
          {filteredTips && filteredTips.map(filteredTip => {
            const timeSlotDescription = {
              'Morning': 'Morning (12AM-6AM)',
              'Afternoon': 'Afternoon (6AM-12PM)',
              'Evening': 'Evening (12PM-6PM)',
              'Night': 'Night (6PM-12AM)'
            }[filteredTip.timeSlot];

            const filteredItems = gamesType === "ALL" ? filteredTip.items : filteredTip.items.filter(doc => doc.type === gamesType);

            if (filteredItems.length === 0) return null;

            return (
              <motion.div
                className="tips-section"
                key={filteredTip.timeSlot}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className='section-title'>
                  <span className="time-badge">{filteredTip.timeSlot}</span>
                  {timeSlotDescription}
                </h2>
                <div className="tips-grid">
                  {filteredItems.map((tip, index) => (
                    <TipCard
                      key={index}
                      tip={tip}
                      timeSlot={timeSlotDescription}
                      isAdmin={isAdmin}
                      plan={user && user.plan ? user.plan : null}
                      today={formatDate(days[days.length - 1])}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </>
      )}
    </div>
  );
}
