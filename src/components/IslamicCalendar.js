import React, { useState, useEffect } from 'react';
import { Bell, Calendar as CalendarIcon } from 'lucide-react';
import './IslamicCalendar.css';

const IslamicCalendar = ({ mode = 'page' }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentHijri, setCurrentHijri] = useState(null);
  const [monthCalendar, setMonthCalendar] = useState([]);

  useEffect(() => {
    fetchIslamicCalendar();
  }, []);

  const fetchIslamicCalendar = async () => {
    try {
      // Get current Hijri date
      const todayResponse = await fetch('https://api.aladhan.com/v1/gToH');
      const todayData = await todayResponse.json();
      
      if (todayData.code === 200) {
        const hijri = todayData.data.hijri;
        setCurrentHijri(hijri);
        
        // Fetch current Hijri month calendar
        const calendarResponse = await fetch(
          `https://api.aladhan.com/v1/hijriCalendar/${hijri.year}/${hijri.month.number}`
        );
        const calendarData = await calendarResponse.json();
        
        if (calendarData.code === 200) {
          setMonthCalendar(calendarData.data);
        }
        
        // Calculate important Islamic dates
        const today = new Date();
        const eventsData = await calculateIslamicEvents(hijri, today);
        setEvents(eventsData);
      }
      setLoading(false);
    } catch (error) {
      console.error('Calendar error:', error);
      setLoading(false);
    }
  };

  const calculateIslamicEvents = async (currentHijri, today) => {
    const events = [];
    
    // Today
    events.push({
      g: today.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' }),
      h: `${currentHijri.day} ${currentHijri.month.ar} ${currentHijri.year}`,
      title: 'اليوم',
      notify: true,
      type: 'today'
    });

    // Calculate Ramadan (9th month)
    const ramadanStart = await convertHijriToGregorian(currentHijri.year, 9, 1);
    if (ramadanStart) {
      events.push({
        g: ramadanStart,
        h: `1 رمضان ${currentHijri.year}`,
        title: 'أول أيام رمضان',
        notify: true,
        type: 'ramadan'
      });
      
      // Laylat al-Qadr (27th Ramadan)
      const laylatAlQadr = await convertHijriToGregorian(currentHijri.year, 9, 27);
      if (laylatAlQadr) {
        events.push({
          g: laylatAlQadr,
          h: `27 رمضان ${currentHijri.year}`,
          title: 'ليلة القدر',
          notify: true,
          type: 'special'
        });
      }
    }

    // Eid al-Fitr (1st Shawwal)
    const eidFitr = await convertHijriToGregorian(currentHijri.year, 10, 1);
    if (eidFitr) {
      events.push({
        g: eidFitr,
        h: `1 شوال ${currentHijri.year}`,
        title: 'عيد الفطر',
        notify: true,
        type: 'eid'
      });
    }

    // Day of Arafah (9th Dhul Hijjah)
    const arafah = await convertHijriToGregorian(currentHijri.year, 12, 9);
    if (arafah) {
      events.push({
        g: arafah,
        h: `9 ذو الحجة ${currentHijri.year}`,
        title: 'يوم عرفة',
        notify: true,
        type: 'special'
      });
    }

    // Eid al-Adha (10th Dhul Hijjah)
    const eidAdha = await convertHijriToGregorian(currentHijri.year, 12, 10);
    if (eidAdha) {
      events.push({
        g: eidAdha,
        h: `10 ذو الحجة ${currentHijri.year}`,
        title: 'عيد الأضحى',
        notify: true,
        type: 'eid'
      });
    }

    // Muharram (Islamic New Year)
    const muharram = await convertHijriToGregorian(currentHijri.year + 1, 1, 1);
    if (muharram) {
      events.push({
        g: muharram,
        h: `1 محرم ${currentHijri.year + 1}`,
        title: 'رأس السنة الهجرية',
        notify: true,
        type: 'newyear'
      });
    }

    // Ashura (10th Muharram)
    const ashura = await convertHijriToGregorian(currentHijri.year, 1, 10);
    if (ashura) {
      events.push({
        g: ashura,
        h: `10 محرم ${currentHijri.year}`,
        title: 'يوم عاشوراء',
        notify: true,
        type: 'special'
      });
    }

    return events;
  };

  const convertHijriToGregorian = async (year, month, day) => {
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/hToG/${day}-${month}-${year}`
      );
      const data = await response.json();
      if (data.code === 200) {
        const greg = data.data.gregorian;
        return `${greg.day} ${greg.month.ar}`;
      }
    } catch (error) {
      console.error('Date conversion error:', error);
    }
    return null;
  };
  return (
    <div className="calendar-page">
      <div className="calendar-header-main">
        <CalendarIcon size={28} />
        <h2>التقويم الإسلامي</h2>
      </div>

      {loading ? (
        <div className="calendar-loading">جاري التحميل...</div>
      ) : (
        <>
          {currentHijri && (
            <div className="current-hijri-date">
              <div className="hijri-large">{currentHijri.day}</div>
              <div className="hijri-month">{currentHijri.month.ar}</div>
              <div className="hijri-year">{currentHijri.year} هـ</div>
            </div>
          )}

          <div className="events-section">
            <h3>المناسبات الإسلامية</h3>
            <div className="timeline">
              {events.map((e, idx) => (
                <div key={idx} className={`timeline-item ${e.type}`}>
                  <div className="date-g">{e.g}</div>
                  <div className="dot" />
                  <div className="content">
                    <div className="title">{e.title}</div>
                    <div className="date-h">{e.h}</div>
                  </div>
                  {e.notify && (
                    <button className="bell-btn">
                      <Bell size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default IslamicCalendar;
