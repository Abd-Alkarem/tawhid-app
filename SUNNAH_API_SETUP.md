# Sunnah.com API Integration Guide

## Overview
Your app now has **24+ Islamic books** including all major Hadith collections from Sunnah.com! Currently showing sample content, but you can integrate the full Sunnah.com API for complete access.

## Current Status ✅
- **Quran**: Full text from Quran.com API (working!)
- **Hadith Books**: Sample content embedded (working!)
- **24+ Books Available**: All major collections listed

## Books Included
### الكتب الستة (The Six Books):
1. صحيح البخاري (Sahih al-Bukhari)
2. صحيح مسلم (Sahih Muslim)
3. سنن أبي داود (Sunan Abi Dawud)
4. جامع الترمذي (Jami at-Tirmidhi)
5. سنن النسائي (Sunan an-Nasa'i)
6. سنن ابن ماجه (Sunan Ibn Majah)

### Other Major Collections:
7. موطأ مالك (Muwatta Malik)
8. مسند أحمد (Musnad Ahmad)
9. سنن الدارمي (Sunan ad-Darimi)
10. الأربعون النووية (40 Hadith Nawawi)
11. رياض الصالحين (Riyad as-Salihin)
12. الأدب المفرد (Al-Adab Al-Mufrad)
13. الشمائل المحمدية (Ash-Shama'il Al-Muhammadiyah)
14. مشكاة المصابيح (Mishkat al-Masabih)
15. بلوغ المرام (Bulugh al-Maram)
16. حصن المسلم (Hisn al-Muslim)

### Salafi Books:
17. كتاب التوحيد (Kitab at-Tawhid)
18. العقيدة الواسطية (Al-Aqeedah al-Wasitiyyah)
19. الأصول الثلاثة (Usool ath-Thalatha)

### Tafsir:
20. تفسير الطبري (Tafsir at-Tabari)
21. تفسير ابن كثير (Tafsir Ibn Kathir)

## How to Get Full Sunnah.com API Access

### Step 1: Request API Key
1. Go to: https://github.com/sunnah-com/api/issues
2. Click "New Issue"
3. Request an API key with this template:

```
Title: API Key Request

Hello,

I am developing an Islamic educational app and would like to request an API key to access the Sunnah.com hadith collections.

App Name: Tawhid App
Purpose: Educational - displaying authentic hadith to users
Expected Usage: Moderate (fetching hadiths on-demand)

Thank you!
```

### Step 2: Once You Have the API Key

Add it to a `.env` file in your project root:

```env
REACT_APP_SUNNAH_API_KEY=your_api_key_here
```

### Step 3: Update the Code

The app is already set up to use the API! Just add your key and it will automatically fetch full hadith content.

## API Endpoints (Reference)

### Get Collections
```
GET https://api.sunnah.com/v1/collections
```

### Get Hadiths from a Collection
```
GET https://api.sunnah.com/v1/collections/{collectionName}/hadiths
Headers: X-API-Key: your_api_key
```

### Collection Names:
- `bukhari` - Sahih al-Bukhari
- `muslim` - Sahih Muslim
- `abudawud` - Sunan Abi Dawud
- `tirmidhi` - Jami at-Tirmidhi
- `nasai` - Sunan an-Nasa'i
- `ibnmajah` - Sunan Ibn Majah
- `malik` - Muwatta Malik
- `ahmad` - Musnad Ahmad
- `darimi` - Sunan ad-Darimi
- `riyadussalihin` - Riyad as-Salihin
- `nawawi40` - 40 Hadith Nawawi
- `adab` - Al-Adab Al-Mufrad
- `shamail` - Ash-Shama'il
- `mishkat` - Mishkat al-Masabih
- `bulugh` - Bulugh al-Maram
- `hisn` - Hisn al-Muslim

## Alternative: Offline Data

If you prefer, you can request an offline dump of the hadith data from Sunnah.com. This would allow your app to work completely offline.

## Resources

- **API Documentation**: https://sunnah.stoplight.io/docs/api/
- **GitHub Repository**: https://github.com/sunnah-com/api
- **Request API Key**: https://github.com/sunnah-com/api/issues
- **Sunnah.com Website**: https://sunnah.com/developers

## Current Implementation

Your app currently shows:
- ✅ **Full Quran text** from Quran.com API
- ✅ **Sample hadith content** for all major collections
- ✅ **Beautiful Arabic typography** and formatting
- ✅ **Scrollable content** for easy reading
- ✅ **24+ books** ready to display

Once you add the API key, all books will automatically fetch complete, authentic hadith content!

---

**Need Help?** Create an issue on the Sunnah.com GitHub or contact their team at https://sunnah.com/developers
