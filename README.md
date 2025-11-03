# Quran Listener App

A beautiful web application for listening to the Holy Quran with multiple reciters and synchronized text tracking.

## Features

- 🎧 Multiple renowned reciters to choose from (25+ reciters)
- 🔍 Search functionality for reciters by name (English or Arabic)
- 📚 Search for Surahs by name, number, or Arabic name
- 🔎 Search within ayahs to find specific verses
- 📖 Full Quran text with Arabic script
- 🎵 Audio playback with controls (play, pause, next, previous)
- 📍 Real-time tracking of current ayah being recited
- 📝 **Tafsir (Commentary) from 8 renowned scholars**:
  - Tafsir Ibn Kathir (English)
  - Tafsir al-Tabari (Arabic)
  - Tafsir al-Qurtubi (Arabic)
  - Tafsir As-Sa'di (Arabic)
  - Tafsir al-Baghawi (Arabic)
  - Maarif-ul-Quran by Mufti Muhammad Shafi (English)
  - Tafsir al-Jalalayn (Arabic)
  - Tafhim-ul-Quran by Abul A'la Maududi (English)
- 🌙 Modern and clean UI design
- 📱 Responsive design (can be converted to React Native later)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

npm run build
git add .
git commit -m "Fix Hadith API to use direct endpoint"
git push

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

### Listening to Quran
1. Select a reciter from the dropdown (use search to find quickly)
2. Select a surah (use search to find by name or number)
3. Click play to start listening
4. Click on any ayah to jump to it

### Viewing Tafsir
1. Click the **"Tafsir"** button on any ayah
2. A modal will open showing commentary from multiple scholars
3. Click on any scholar's name to expand and view their tafsir
4. Tafsir is available in both English and Arabic depending on the scholar

## Available Reciters

- Abdul Basit (Murattal)
- Mishary Rashid Alafasy
- Sa'd Al-Ghamdi
- Ahmed Al-Ajmy
- Mahmoud Khalil Al-Hussary
- Abdulrahman Al-Sudais
- Maher Al-Muaiqly
- Muhammad Siddiq Al-Minshawi
- Nasser Al-Qatami
- Sahl Yasin
- **Yasser Al-Dosari**
- Bandar Baleela
- Khalid Al-Qahtani
- Muhammad Jibreel
- Ali Jaber
- Fares Abbad
- Ahmed Neana
- Salah Bukhatir
- Abdullah Basfar
- Abdullah Awad Al-Juhany
- Hani Ar-Rifai
- Ibrahim Al-Akhdar
- Muhammad Ayyub
- Emad Al-Mansary
- And more...

## API Used

This app uses the [Quran.com API](https://api.quran.com) and [Every Ayah API](https://everyayah.com) for Quran text and audio.

## Converting to React Native

This project is structured to be easily convertible to React Native:
1. Replace web-specific components with React Native equivalents
2. Use React Native's Audio API instead of HTML5 audio
3. Adapt styling from CSS to React Native StyleSheet

## License

MIT
