import React, { useState, useEffect, useRef } from 'react';
import { reciters, surahs } from './data/reciters';
import ReciterSelector from './components/ReciterSelector';
import SurahSelector from './components/SurahSelector';
import AudioPlayer from './components/AudioPlayer';
import QuranText from './components/QuranText';
import Header from './components/Header';
import Qibla from './components/Qibla';
import Books from './components/Books';
import Hadith from './components/Hadith';
import HadithSearch from './components/HadithSearch';
import PrayerTimes from './components/PrayerTimes';
import Duas from './components/Duas';
import NamesOfAllah from './components/NamesOfAllah';
import Tasbih from './components/Tasbih';
import Settings from './components/Settings';
import IslamicCalendar from './components/IslamicCalendar';
import BottomNav from './components/BottomNav';
import QuranTabs from './components/QuranTabs';
import AdhkarPage from './components/AdhkarPage';
import DuaPage from './components/DuaPage';
import './App.css';

function App() {
  const [selectedReciter, setSelectedReciter] = useState(reciters[0]);
  const [selectedSurah, setSelectedSurah] = useState(surahs[0]);
  const [currentAyah, setCurrentAyah] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [surahData, setSurahData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('quran'); // Bottom nav active tab
  const [showQibla, setShowQibla] = useState(false);
  const [showBooks, setShowBooks] = useState(false);
  const [showHadith, setShowHadith] = useState(false);
  const [showHadithSearch, setShowHadithSearch] = useState(false);
  const [showPrayerTimes, setShowPrayerTimes] = useState(false);
  const [showDuas, setShowDuas] = useState(false);
  const [showNamesOfAllah, setShowNamesOfAllah] = useState(false);
  const [showTasbih, setShowTasbih] = useState(false);
  const audioRef = useRef(null);

  // Fetch Quran text data
  useEffect(() => {
    const fetchSurahData = async () => {
      setLoading(true);
      try {
        // Using Quran.com API which properly handles Bismillah
        // Set per_page to a high number to get all verses (max is 50, so we need pagination)
        const allVerses = [];
        let page = 1;
        let hasMore = true;
        
        while (hasMore) {
          const response = await fetch(
            `https://api.quran.com/api/v4/verses/by_chapter/${selectedSurah.number}?language=ar&words=false&page=${page}&per_page=50&fields=text_uthmani`
          );
          const data = await response.json();
          
          if (data.verses && data.verses.length > 0) {
            allVerses.push(...data.verses);
            
            // Check if there are more pages
            if (data.pagination && page < data.pagination.total_pages) {
              page++;
            } else {
              hasMore = false;
            }
          } else {
            hasMore = false;
          }
        }
        
        // Transform data to match expected format
        const transformedData = {
          number: selectedSurah.number,
          name: selectedSurah.name,
          englishName: selectedSurah.name,
          englishNameTranslation: selectedSurah.name,
          numberOfAyahs: selectedSurah.ayahs,
          ayahs: allVerses.map(verse => ({
            number: verse.id,
            numberInSurah: verse.verse_number,
            text: verse.text_uthmani
          }))
        };
        
        setSurahData(transformedData);
        setCurrentAyah(1);
      } catch (error) {
        console.error('Error fetching surah data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurahData();
  }, [selectedSurah]);

  const getAudioUrl = (surahNum, ayahNum) => {
    const paddedSurah = String(surahNum).padStart(3, '0');
    const paddedAyah = String(ayahNum).padStart(3, '0');
    return `https://everyayah.com/data/${selectedReciter.subfolder}/${paddedSurah}${paddedAyah}.mp3`;
  };

  const playAyah = (ayahNumber) => {
    if (audioRef.current) {
      audioRef.current.src = getAudioUrl(selectedSurah.number, ayahNumber);
      audioRef.current.play();
      setCurrentAyah(ayahNumber);
      setIsPlaying(true);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // If no audio source is set, load the current ayah
        if (!audioRef.current.src || audioRef.current.src === '') {
          audioRef.current.src = getAudioUrl(selectedSurah.number, currentAyah);
        }
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
        setIsPlaying(true);
      }
    }
  };

  const handleNext = () => {
    if (currentAyah < selectedSurah.ayahs) {
      playAyah(currentAyah + 1);
    } else if (selectedSurah.number < 114) {
      // Move to next surah
      const nextSurah = surahs.find(s => s.number === selectedSurah.number + 1);
      setSelectedSurah(nextSurah);
      setCurrentAyah(1);
    }
  };

  const handlePrevious = () => {
    if (currentAyah > 1) {
      playAyah(currentAyah - 1);
    } else if (selectedSurah.number > 1) {
      // Move to previous surah
      const prevSurah = surahs.find(s => s.number === selectedSurah.number - 1);
      setSelectedSurah(prevSurah);
      setCurrentAyah(prevSurah.ayahs);
    }
  };

  const handleAudioEnded = () => {
    handleNext();
  };

  const handleReciterChange = (reciter) => {
    setSelectedReciter(reciter);
    if (isPlaying) {
      playAyah(currentAyah);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="App app-layout">
      {/* Conditional rendering based on active tab */}
      {activeTab === 'quran' ? (
        <>
          <QuranTabs 
            surahs={surahs}
            onSurahSelect={setSelectedSurah}
            onJuzSelect={(juzNumber) => {
              console.log('Selected Juz:', juzNumber);
              // Handle Juz selection
            }}
          />
          
          <audio
            ref={audioRef}
            onEnded={handleAudioEnded}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </>
      ) : activeTab === 'home' ? (
        <>
          <Header 
            onPrayerTimesClick={() => setShowPrayerTimes(true)}
            onDuasClick={() => setShowDuas(true)}
            onNamesClick={() => setShowNamesOfAllah(true)}
            onTasbihClick={() => setShowTasbih(true)}
          />
          
          <div className="container">
            <div className="controls-section">
              <ReciterSelector
                reciters={reciters}
                selectedReciter={selectedReciter}
                onReciterChange={handleReciterChange}
              />
              
              <SurahSelector
                surahs={surahs}
                selectedSurah={selectedSurah}
                onSurahChange={setSelectedSurah}
              />
            </div>

            <AudioPlayer
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onNext={handleNext}
              onPrevious={handlePrevious}
              currentAyah={currentAyah}
              totalAyahs={selectedSurah.ayahs}
              surahName={selectedSurah.nameArabic}
            />

            <QuranText
              surahData={surahData}
              currentAyah={currentAyah}
              onAyahClick={playAyah}
              loading={loading}
            />

            <audio
              ref={audioRef}
              onEnded={handleAudioEnded}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Floating Action Buttons */}
            <div className="fab-container">
          {/* Hadith Search Button */}
          <button 
            className="hadith-search-fab"
            onClick={() => setShowHadithSearch(true)}
            title="Hadith Search - Dorar.net"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>

          {/* Hadith Books Button */}
          <button 
            className="hadith-fab"
            onClick={() => setShowHadith(true)}
            title="Hadith Library"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </button>

          {/* Books Button */}
          <button 
            className="books-fab"
            onClick={() => setShowBooks(true)}
            title="Islamic Books Library"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </button>

          {/* Qibla Button */}
          <button 
            className="qibla-fab"
            onClick={() => setShowQibla(true)}
            title="Find Qibla Direction"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"/>
              <polygon points="12 2 15 8 12 14 9 8"/>
            </svg>
          </button>
            </div>
          </div>
        </>
      ) : activeTab === 'prayer' ? (
        <PrayerTimes mode="page" />
      ) : activeTab === 'library' ? (
        <div className="library-tabs">
          <div className="library-tab-switcher">
            <button className="lib-tab active">أذكار</button>
            <button className="lib-tab">دعاء</button>
          </div>
          <AdhkarPage />
        </div>
      ) : activeTab === 'duas' ? (
        <DuaPage />
      ) : activeTab === 'calendar' ? (
        <IslamicCalendar mode="page" />
      ) : activeTab === 'more' ? (
        <Settings 
          onBack={() => setActiveTab('home')} 
          onOpenCalendar={() => setActiveTab('calendar')}
          onOpenPrayer={() => setActiveTab('prayer')}
          onOpenAdhkar={() => setActiveTab('library')}
        />
      ) : null}

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Modals */}
      {showQibla && <Qibla onClose={() => setShowQibla(false)} />}
      {showBooks && <Books onClose={() => setShowBooks(false)} />}
      {showHadith && <Hadith onClose={() => setShowHadith(false)} />}
      {showHadithSearch && <HadithSearch onClose={() => setShowHadithSearch(false)} />}
      {showPrayerTimes && <PrayerTimes onClose={() => setShowPrayerTimes(false)} />}
      {showDuas && <Duas onClose={() => setShowDuas(false)} />}
      {showNamesOfAllah && <NamesOfAllah onClose={() => setShowNamesOfAllah(false)} />}
      {showTasbih && <Tasbih onClose={() => setShowTasbih(false)} />}
    </div>
  );
}

export default App;
