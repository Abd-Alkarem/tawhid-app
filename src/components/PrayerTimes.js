import React, { useState, useEffect } from 'react';
import { X, Calendar, Share2, Volume2, Sun } from 'lucide-react';
import './PrayerTimes.css';

const PrayerTimes = ({ onClose, mode = 'modal' }) => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hijriDate, setHijriDate] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('2'); // ISNA (Islamic Society of North America) - More accurate
  const [selectedMadhab, setSelectedMadhab] = useState('0'); // Shafi

  const prayerNames = {
    fajr: { ar: 'الفجر', en: 'Fajr' },
    sunrise: { ar: 'الشروق', en: 'Sunrise' },
    dhuhr: { ar: 'الظهر', en: 'Dhuhr' },
    asr: { ar: 'العصر', en: 'Asr' },
    maghrib: { ar: 'المغرب', en: 'Maghrib' },
    isha: { ar: 'العشاء', en: 'Isha' },
    midnight: { ar: 'منتصف الليل', en: 'Midnight' }
  };

  const calculationMethods = {
    '0': 'Shia Ithna-Ashari',
    '1': 'University of Islamic Sciences, Karachi',
    '2': 'Islamic Society of North America (ISNA)',
    '3': 'Muslim World League (MWL)',
    '4': 'Umm al-Qura, Makkah',
    '5': 'Egyptian General Authority of Survey',
    '7': 'Institute of Geophysics, University of Tehran',
    '8': 'Gulf Region',
    '9': 'Kuwait',
    '10': 'Qatar',
    '11': 'Majlis Ugama Islam Singapura, Singapore',
    '12': 'Union Organization islamic de France',
    '13': 'Diyanet İşleri Başkanlığı, Turkey',
    '14': 'Spiritual Administration of Muslims of Russia'
  };

  useEffect(() => {
    fetchPrayerTimes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMethod, selectedMadhab]);

  const fetchPrayerTimes = async () => {
    setLoading(true);
    try {
      // Get user location
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });

          // Get current date
          const date = new Date();
          const timestamp = Math.floor(date.getTime() / 1000);

          // Fetch prayer times from Aladhan API
          const response = await fetch(
            `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=${selectedMethod}&school=${selectedMadhab}`
          );
          const data = await response.json();

          if (data.code === 200 && data.data && data.data.timings) {
            console.log('Prayer times received:', data.data.timings);
            setPrayerTimes(data.data.timings);
            setHijriDate(data.data.date.hijri);
          } else {
            console.error('Invalid API response:', data);
          }
          setLoading(false);
        },
        (error) => {
          console.error('Location error:', error);
          setLoading(false);
        }
      );
    } catch (error) {
      console.error('Prayer times error:', error);
      setLoading(false);
    }
  };

  const formatTime = (time24) => {
    if (!time24 || typeof time24 !== 'string') return '';
    const parts = time24.split(':');
    if (parts.length < 2) return time24;
    
    const [hours, minutes] = parts;
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getCurrentPrayer = () => {
    if (!prayerTimes) return null;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    
    for (let i = 0; i < prayers.length; i++) {
      const prayerTime = prayerTimes[prayers[i]];
      if (!prayerTime) continue;
      
      const [hours, minutes] = prayerTime.split(':');
      const prayerMinutes = parseInt(hours) * 60 + parseInt(minutes);
      
      if (currentMinutes < prayerMinutes) {
        return prayers[i].toLowerCase();
      }
    }
    return 'fajr'; // Next day Fajr
  };

  const sharePrayerTimes = () => {
    if (!prayerTimes) return;
    const text = `Prayer Times:\nFajr: ${formatTime(prayerTimes.Fajr)}\nDhuhr: ${formatTime(prayerTimes.Dhuhr)}\nAsr: ${formatTime(prayerTimes.Asr)}\nMaghrib: ${formatTime(prayerTimes.Maghrib)}\nIsha: ${formatTime(prayerTimes.Isha)}`;
    
    if (navigator.share) {
      navigator.share({ title: 'Prayer Times', text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Prayer times copied to clipboard!');
    }
  };

  const ContainerStart = () => (
    mode === 'modal' ? (
      <div className="prayer-times-modal-overlay" onClick={onClose}>
        <div className="prayer-times-modal" onClick={(e) => e.stopPropagation()}>
          <HeaderBar />
          <CloseTop />
          <Content />
        </div>
      </div>
    ) : (
      <div className="prayer-times-page">
        <HeaderBar showBack={!!onClose} />
        <Content />
      </div>
    )
  );

  const HeaderBar = ({ showBack = false }) => (
        <div className="prayer-times-header">
          <button className="header-icon-btn">
            <Calendar size={24} />
          </button>
          <h2>اليوم</h2>
          <button className="header-icon-btn" onClick={sharePrayerTimes}>
            <Share2 size={24} />
          </button>
        </div>
  );

  const CloseTop = () => (
    mode === 'modal' ? (
      <button className="close-button-top" onClick={onClose}>
        <X size={24} />
      </button>
    ) : null
  );

  const Content = () => (
        <div className="prayer-times-content">
          {loading ? (
            <div className="prayer-loading">
              <div className="spinner"></div>
              <p>Loading prayer times...</p>
            </div>
          ) : prayerTimes ? (
            <>
              {hijriDate && (
                <div className="hijri-date">
                  {hijriDate.day} {hijriDate.month.ar} {hijriDate.year}
                </div>
              )}

              <div className="prayers-list">
                {Object.entries(prayerNames).map(([key, names]) => {
                  // Hide Sunrise and Midnight
                  if (key === 'sunrise' || key === 'midnight') return null;
                  
                  const isCurrentPrayer = getCurrentPrayer() === key;
                  const time = prayerTimes[key.charAt(0).toUpperCase() + key.slice(1)];
                  
                  if (!time) return null;

                  return (
                    <div 
                      key={key} 
                      className={`prayer-item ${isCurrentPrayer ? 'current-prayer' : ''}`}
                    >
                      <div className="prayer-icon">
                        <div className={`prayer-circle ${isCurrentPrayer ? 'active' : ''}`} />
                      </div>
                      <div className="prayer-name">
                        <span className="prayer-name-ar">{names.ar}</span>
                        <span className="prayer-name-en">{names.en}</span>
                      </div>
                      <div className="prayer-time">{formatTime(time)}</div>
                      <button className="prayer-sound-btn">
                        <Volume2 size={20} />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="prayer-settings">
                <div className="setting-item">
                  <span className="setting-label">
                    <span className="setting-label-ar">طريقة الحساب</span>
                    <span className="setting-label-en">Calculation Method</span>
                  </span>
                  <span className="setting-value">أهل السنة والجماعة</span>
                </div>

                <div className="setting-item">
                  <span className="setting-label">
                    <span className="setting-label-ar">المذهب الفقهي</span>
                    <span className="setting-label-en">Madhab</span>
                  </span>
                  <select 
                    value={selectedMadhab} 
                    onChange={(e) => setSelectedMadhab(e.target.value)}
                    className="setting-select"
                  >
                    <option value="0">Shafi/Maliki/Hanbali</option>
                    <option value="1">Hanafi</option>
                  </select>
                </div>
              </div>

              {location && (
                <div className="location-info">
                  <span>📍 Location: {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°</span>
                </div>
              )}
            </>
          ) : (
            <div className="prayer-error">
              <p>Unable to load prayer times</p>
              <button onClick={fetchPrayerTimes} className="retry-btn">
                Try Again
              </button>
            </div>
          )}
        </div>
  );

  return <ContainerStart />;
};

export default PrayerTimes;
