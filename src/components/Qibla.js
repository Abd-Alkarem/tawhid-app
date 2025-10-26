import React, { useState, useEffect } from 'react';
import { Compass, X, Loader2, MapPin } from 'lucide-react';
import './Qibla.css';

function Qibla({ onClose }) {
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [currentHeading, setCurrentHeading] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [needsPermission, setNeedsPermission] = useState(true);

  // Kaaba coordinates
  const KAABA_LAT = 21.4225;
  const KAABA_LNG = 39.8262;

  // Calculate Qibla direction
  const calculateQibla = (lat, lng) => {
    const toRadians = (deg) => deg * (Math.PI / 180);
    const toDegrees = (rad) => rad * (180 / Math.PI);

    const lat1 = toRadians(lat);
    const lng1 = toRadians(lng);
    const lat2 = toRadians(KAABA_LAT);
    const lng2 = toRadians(KAABA_LNG);

    const dLng = lng2 - lng1;

    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
    
    let bearing = toDegrees(Math.atan2(y, x));
    bearing = (bearing + 360) % 360;

    return bearing;
  };

  const requestLocation = () => {
    setLoading(true);
    setError(null);
    setNeedsPermission(false);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          const qibla = calculateQibla(latitude, longitude);
          setQiblaDirection(qibla);
          setLoading(false);
        },
        (err) => {
          let errorMessage = 'يرجى السماح بالوصول إلى موقعك\nPlease allow location access';
          
          if (err.code === err.PERMISSION_DENIED) {
            errorMessage = 'تم رفض الوصول إلى الموقع. يرجى تفعيله من إعدادات المتصفح.\nLocation access denied. Please enable it in browser settings.';
          }
          
          setError(errorMessage);
          setLoading(false);
          setNeedsPermission(true);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setError('متصفحك لا يدعم خدمة الموقع\nGeolocation is not supported by your browser.');
      setLoading(false);
    }
  };

  useEffect(() => {

    // Get device orientation (compass)
    const handleOrientation = (event) => {
      if (event.alpha !== null) {
        // Alpha is the compass direction
        setCurrentHeading(360 - event.alpha);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const getDistance = () => {
    if (!userLocation) return null;

    const R = 6371; // Earth's radius in km
    const toRadians = (deg) => deg * (Math.PI / 180);

    const dLat = toRadians(KAABA_LAT - userLocation.lat);
    const dLng = toRadians(KAABA_LNG - userLocation.lng);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(userLocation.lat)) * Math.cos(toRadians(KAABA_LAT)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance.toFixed(0);
  };

  return (
    <div className="qibla-modal-overlay" onClick={onClose}>
      <div className="qibla-modal" onClick={(e) => e.stopPropagation()}>
        <div className="qibla-header">
          <div className="qibla-title">
            <Compass size={24} />
            <h2>Qibla Direction</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="qibla-content">
          {needsPermission && !loading && !qiblaDirection && (
            <div className="qibla-permission">
              <Compass size={64} className="compass-icon-large" />
              <h3>اتجاه القبلة</h3>
              <h3>Qibla Direction</h3>
              <p>انقر على الزر للحصول على اتجاه القبلة</p>
              <p>Click the button to get Qibla direction</p>
              <button 
                className="location-button"
                onClick={requestLocation}
              >
                📍 احصل على اتجاه القبلة
                <br />
                Get Qibla Direction
              </button>
            </div>
          )}

          {loading && (
            <div className="qibla-loading">
              <Loader2 className="loading-spinner" size={48} />
              <p>جاري تحديد موقعك...</p>
              <p>Getting your location...</p>
            </div>
          )}

          {error && (
            <div className="qibla-error">
              <MapPin size={48} />
              <p style={{ whiteSpace: 'pre-line' }}>{error}</p>
              <button 
                className="retry-button"
                onClick={requestLocation}
              >
                🔄 حاول مرة أخرى / Try Again
              </button>
            </div>
          )}

          {!loading && !error && qiblaDirection !== null && (
            <>
              <div className="qibla-info">
                <div className="info-item">
                  <span className="info-label">Direction to Kaaba:</span>
                  <span className="info-value">{qiblaDirection.toFixed(1)}°</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Distance:</span>
                  <span className="info-value">{getDistance()} km</span>
                </div>
              </div>

              <div className="compass-container">
                <div 
                  className="compass-circle"
                  style={{ transform: `rotate(${-currentHeading}deg)` }}
                >
                  <div className="compass-north">N</div>
                  <div className="compass-marks">
                    <div className="compass-mark"></div>
                    <div className="compass-mark"></div>
                    <div className="compass-mark"></div>
                    <div className="compass-mark"></div>
                  </div>
                </div>
                
                <div 
                  className="qibla-arrow"
                  style={{ transform: `rotate(${qiblaDirection - currentHeading}deg)` }}
                >
                  <div className="arrow-pointer">▲</div>
                  <div className="arrow-label">Qibla</div>
                </div>
              </div>

              <div className="qibla-instructions">
                <p>Point your device towards the arrow to face Qibla</p>
                <p className="qibla-note">
                  <MapPin size={14} />
                  Location: {userLocation.lat.toFixed(4)}°, {userLocation.lng.toFixed(4)}°
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Qibla;
