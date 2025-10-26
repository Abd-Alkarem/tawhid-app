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
  const [orientationPermission, setOrientationPermission] = useState(false);
  const [isFacingQibla, setIsFacingQibla] = useState(false);

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

  const requestOrientationPermission = async () => {
    // Request orientation permission for iOS 13+
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          setOrientationPermission(true);
        }
      } catch (error) {
        console.error('Orientation permission error:', error);
      }
    } else {
      // For Android and older browsers
      setOrientationPermission(true);
    }
  };

  const requestLocation = async () => {
    setLoading(true);
    setError(null);
    setNeedsPermission(false);
    
    // Request orientation permission first
    await requestOrientationPermission();
    
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
    if (!orientationPermission || qiblaDirection === null) return;

    // Get device orientation (compass)
    const handleOrientation = (event) => {
      let heading = 0;
      
      if (event.webkitCompassHeading !== undefined) {
        // iOS devices - webkitCompassHeading gives true north heading
        heading = event.webkitCompassHeading;
      } else if (event.absolute && event.alpha !== null) {
        // Android with absolute orientation
        heading = 360 - event.alpha;
      } else if (event.alpha !== null) {
        // Fallback for other devices
        heading = 360 - event.alpha;
      }
      
      setCurrentHeading(heading);
      
      // Check if facing Qibla (within 10 degrees tolerance)
      const difference = Math.abs(heading - qiblaDirection);
      const normalizedDiff = difference > 180 ? 360 - difference : difference;
      setIsFacingQibla(normalizedDiff < 10);
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
      window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
    };
  }, [orientationPermission, qiblaDirection]);

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

              <div className={`compass-container ${isFacingQibla ? 'facing-qibla' : ''}`}>
                {/* 4 Green lines outside circle marking cardinal directions */}
                <div className="cardinal-markers">
                  <div className="cardinal-line cardinal-north"></div>
                  <div className="cardinal-line cardinal-east"></div>
                  <div className="cardinal-line cardinal-south"></div>
                  <div className="cardinal-line cardinal-west"></div>
                </div>
                
                {/* Rotating compass background (device heading) */}
                <div 
                  className="compass-circle"
                  style={{ transform: `rotate(${-currentHeading}deg)` }}
                >
                  {/* Small gray arrows for directions */}
                  <div className="direction-arrows">
                    <div className="dir-arrow dir-north">
                      <div className="arrow-shape"></div>
                      <span>N</span>
                    </div>
                    <div className="dir-arrow dir-east">
                      <div className="arrow-shape"></div>
                      <span>E</span>
                    </div>
                    <div className="dir-arrow dir-south">
                      <div className="arrow-shape"></div>
                      <span>S</span>
                    </div>
                    <div className="dir-arrow dir-west">
                      <div className="arrow-shape"></div>
                      <span>W</span>
                    </div>
                  </div>
                  
                  {/* Compass degree marks */}
                  <div className="compass-degrees">
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                      <div 
                        key={deg}
                        className="degree-mark"
                        style={{ transform: `rotate(${deg}deg)` }}
                      >
                        <div className="degree-line"></div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* BIG rotating arrow with Kaaba inside */}
                <div 
                  className="main-arrow"
                  style={{ transform: `rotate(${qiblaDirection - currentHeading}deg)` }}
                >
                  <div className="arrow-body">
                    <div className="arrow-kaaba">🕋</div>
                  </div>
                  <div className="arrow-tip"></div>
                  <div className="arrow-tail"></div>
                </div>
                
                {/* Center pin */}
                <div className="compass-center">
                  <div className="center-pin"></div>
                </div>
              </div>

              <div className="qibla-instructions">
                <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#10b981' }}>
                  🕋 وجّه جهازك نحو السهم للقبلة
                </p>
                <p style={{ fontSize: '0.95rem' }}>
                  Point your device towards the Kaaba icon (🕋) to face Qibla
                </p>
                <p style={{ fontSize: '0.85rem', marginTop: '12px', color: '#94a3b8' }}>
                  Qibla Direction: {qiblaDirection.toFixed(1)}° from North
                </p>
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
