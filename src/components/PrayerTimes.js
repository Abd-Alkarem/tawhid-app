import React, { useState, useEffect } from 'react';
import { X, Calendar, Share2, Volume2, Sun } from 'lucide-react';
import './PrayerTimes.css';

const PrayerTimes = ({ onClose, mode = 'modal' }) => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hijriDate, setHijriDate] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null); // Auto-detect based on location
  const [selectedMadhab, setSelectedMadhab] = useState('0'); // Shafi
  const [timezone, setTimezone] = useState(null);
  const [cityName, setCityName] = useState('');

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
    '14': 'Spiritual Administration of Muslims of Russia',
    '15': 'Moonsighting Committee Worldwide'
  };

  // Auto-detect best calculation method based on location
  const getMethodByLocation = (lat, lng) => {
    // Middle East (Saudi Arabia, UAE, etc.)
    if (lat >= 12 && lat <= 32 && lng >= 34 && lng <= 56) {
      return '4'; // Umm al-Qura (Makkah) - Most accurate for Middle East
    }
    // Egypt and North Africa
    else if (lat >= 22 && lat <= 32 && lng >= 25 && lng <= 36) {
      return '5'; // Egyptian General Authority
    }
    // Turkey
    else if (lat >= 36 && lat <= 42 && lng >= 26 && lng <= 45) {
      return '13'; // Diyanet Turkey
    }
    // Iran
    else if (lat >= 25 && lat <= 40 && lng >= 44 && lng <= 64) {
      return '7'; // University of Tehran
    }
    // Pakistan, India, Bangladesh
    else if (lat >= 8 && lat <= 37 && lng >= 60 && lng <= 97) {
      return '1'; // University of Karachi
    }
    // Southeast Asia (Malaysia, Indonesia, Singapore)
    else if (lat >= -11 && lat <= 20 && lng >= 95 && lng <= 141) {
      return '11'; // Singapore (widely used in SE Asia)
    }
    // Kuwait
    else if (lat >= 28.5 && lat <= 30.5 && lng >= 46.5 && lng <= 48.5) {
      return '9'; // Kuwait
    }
    // Qatar
    else if (lat >= 24.5 && lat <= 26.5 && lng >= 50.5 && lng <= 52) {
      return '10'; // Qatar
    }
    // North America
    else if (lat >= 25 && lat <= 72 && lng >= -168 && lng <= -52) {
      return '2'; // ISNA - Most accurate for North America
    }
    // Europe
    else if (lat >= 36 && lat <= 71 && lng >= -10 && lng <= 40) {
      return '3'; // Muslim World League - Standard for Europe
    }
    // Russia
    else if (lat >= 41 && lat <= 82 && lng >= 19 && lng <= 180) {
      return '14'; // Russia
    }
    // Default: Muslim World League (most widely accepted)
    else {
      return '3';
    }
  };

  useEffect(() => {
    fetchPrayerTimes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMethod, selectedMadhab]);

  const fetchPrayerTimes = async () => {
    setLoading(true);
    try {
      // Get user location with high accuracy
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });

          // Auto-detect best calculation method if not manually selected
          const method = selectedMethod || getMethodByLocation(latitude, longitude);
          if (!selectedMethod) {
            setSelectedMethod(method);
          }

          // Get timezone
          const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          setTimezone(userTimezone);

          // Get current date
          const date = new Date();
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();

          try {
            // Method 1: Try with address API (most accurate with timezone)
            const addressResponse = await fetch(
              `https://api.aladhan.com/v1/timingsByAddress/${day}-${month}-${year}?address=${latitude},${longitude}&method=${method}&school=${selectedMadhab}`
            );
            const addressData = await addressResponse.json();

            if (addressData.code === 200 && addressData.data && addressData.data.timings) {
              console.log('Prayer times received (address method):', addressData.data);
              setPrayerTimes(addressData.data.timings);
              setHijriDate(addressData.data.date.hijri);
              
              // Get city name
              if (addressData.data.meta && addressData.data.meta.timezone) {
                const parts = addressData.data.meta.timezone.split('/');
                setCityName(parts[parts.length - 1].replace(/_/g, ' '));
              }
              setLoading(false);
              return;
            }
          } catch (addressError) {
            console.log('Address method failed, trying coordinates method');
          }

          // Method 2: Fallback to coordinates with timezone
          try {
            const coordResponse = await fetch(
              `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=${method}&school=${selectedMadhab}&timezonestring=${userTimezone}`
            );
            const coordData = await coordResponse.json();

            if (coordData.code === 200 && coordData.data && coordData.data.timings) {
              console.log('Prayer times received (coordinates method):', coordData.data);
              setPrayerTimes(coordData.data.timings);
              setHijriDate(coordData.data.date.hijri);
              setLoading(false);
              return;
            }
          } catch (coordError) {
            console.error('Coordinates method failed:', coordError);
          }

          // Method 3: Last fallback - simple timestamp method
          const timestamp = Math.floor(date.getTime() / 1000);
          const fallbackResponse = await fetch(
            `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=${method}&school=${selectedMadhab}`
          );
          const fallbackData = await fallbackResponse.json();

          if (fallbackData.code === 200 && fallbackData.data && fallbackData.data.timings) {
            console.log('Prayer times received (fallback method):', fallbackData.data);
            setPrayerTimes(fallbackData.data.timings);
            setHijriDate(fallbackData.data.date.hijri);
          } else {
            console.error('All methods failed. Last response:', fallbackData);
            alert('فشل في جلب أوقات الصلاة. يرجى المحاولة مرة أخرى.');
          }
          setLoading(false);
        },
        (error) => {
          console.error('Location error:', error);
          alert('يرجى السماح بالوصول إلى الموقع لعرض أوقات الصلاة الدقيقة.');
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } catch (error) {
      console.error('Prayer times error:', error);
      alert('حدث خطأ في جلب أوقات الصلاة.');
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
                  <select 
                    value={selectedMethod || '3'} 
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="setting-select"
                  >
                    {Object.entries(calculationMethods).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value} {selectedMethod === key && !cityName ? ' (Auto)' : ''}
                      </option>
                    ))}
                  </select>
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
                  <span>
                    📍 {cityName || 'Your Location'} 
                    {timezone && ` (${timezone})`}
                  </span>
                  <br />
                  <span style={{fontSize: '12px', opacity: 0.7}}>
                    {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°
                  </span>
                  {selectedMethod && (
                    <>
                      <br />
                      <span style={{fontSize: '12px', color: '#10b981'}}>
                        ✓ Using {calculationMethods[selectedMethod]}
                      </span>
                    </>
                  )}
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
