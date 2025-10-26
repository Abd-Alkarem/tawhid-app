import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import './AudioPlayer.css';

function AudioPlayer({ 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrevious, 
  currentAyah, 
  totalAyahs,
  surahName 
}) {
  return (
    <div className="audio-player">
      <div className="player-info">
        <h2 className="surah-name">{surahName}</h2>
        <p className="ayah-counter">
          Ayah {currentAyah} of {totalAyahs}
        </p>
      </div>

      <div className="player-controls">
        <button 
          className="control-btn" 
          onClick={onPrevious}
          aria-label="Previous Ayah"
        >
          <SkipBack size={24} />
        </button>

        <button 
          className="control-btn play-btn" 
          onClick={onPlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={32} /> : <Play size={32} />}
        </button>

        <button 
          className="control-btn" 
          onClick={onNext}
          aria-label="Next Ayah"
        >
          <SkipForward size={24} />
        </button>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${(currentAyah / totalAyahs) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default AudioPlayer;
