import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Plus, Minus } from 'lucide-react';
import './Tasbih.css';

const Tasbih = ({ onClose }) => {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [vibrate, setVibrate] = useState(true);

  const presets = [
    { name: 'SubhanAllah', arabic: 'سُبْحَانَ اللهِ', count: 33 },
    { name: 'Alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', count: 33 },
    { name: 'Allahu Akbar', arabic: 'اللهُ أَكْبَرُ', count: 33 },
    { name: 'Istighfar', arabic: 'أَسْتَغْفِرُ اللهَ', count: 100 },
    { name: 'Salawat', arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', count: 100 },
    { name: 'La ilaha illallah', arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', count: 100 }
  ];

  const [selectedPreset, setSelectedPreset] = useState(presets[0]);

  useEffect(() => {
    if (count === target && vibrate && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  }, [count, target, vibrate]);

  const handleIncrement = () => {
    if (count < target) {
      setCount(count + 1);
      if (vibrate && navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  const selectPreset = (preset) => {
    setSelectedPreset(preset);
    setTarget(preset.count);
    setCount(0);
  };

  const progress = (count / target) * 100;

  return (
    <div className="tasbih-modal-overlay" onClick={onClose}>
      <div className="tasbih-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tasbih-header">
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
          <h2>تسبيح</h2>
          <div className="header-spacer"></div>
        </div>

        <div className="tasbih-content">
          {/* Selected Dhikr */}
          <div className="selected-dhikr">
            <h3 className="dhikr-arabic">{selectedPreset.arabic}</h3>
            <p className="dhikr-name">{selectedPreset.name}</p>
          </div>

          {/* Counter Display */}
          <div className="counter-display">
            <svg className="progress-ring" width="280" height="280">
              <circle
                className="progress-ring-bg"
                cx="140"
                cy="140"
                r="120"
              />
              <circle
                className="progress-ring-fill"
                cx="140"
                cy="140"
                r="120"
                style={{
                  strokeDasharray: `${2 * Math.PI * 120}`,
                  strokeDashoffset: `${2 * Math.PI * 120 * (1 - progress / 100)}`
                }}
              />
            </svg>
            <div className="counter-text">
              <div className="count-number">{count}</div>
              <div className="count-target">/ {target}</div>
            </div>
          </div>

          {/* Main Counter Button */}
          <button 
            className={`counter-button ${count === target ? 'completed' : ''}`}
            onClick={handleIncrement}
            disabled={count === target}
          >
            {count === target ? '✓ Completed' : 'Tap to Count'}
          </button>

          {/* Controls */}
          <div className="tasbih-controls">
            <button className="control-btn" onClick={handleReset}>
              <RotateCcw size={20} />
              <span>Reset</span>
            </button>
            
            <div className="target-controls">
              <button 
                className="target-btn"
                onClick={() => setTarget(Math.max(1, target - 1))}
              >
                <Minus size={18} />
              </button>
              <span className="target-value">{target}</span>
              <button 
                className="target-btn"
                onClick={() => setTarget(target + 1)}
              >
                <Plus size={18} />
              </button>
            </div>

            <label className="vibrate-toggle">
              <input
                type="checkbox"
                checked={vibrate}
                onChange={(e) => setVibrate(e.target.checked)}
              />
              <span>Vibrate</span>
            </label>
          </div>

          {/* Presets */}
          <div className="dhikr-presets">
            <h4>Quick Select</h4>
            <div className="presets-grid">
              {presets.map((preset, index) => (
                <button
                  key={index}
                  className={`preset-btn ${selectedPreset.name === preset.name ? 'active' : ''}`}
                  onClick={() => selectPreset(preset)}
                >
                  <span className="preset-arabic">{preset.arabic}</span>
                  <span className="preset-count">{preset.count}x</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasbih;
