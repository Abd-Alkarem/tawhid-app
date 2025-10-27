// Comprehensive Duas and Adhkar database
export const duasData = [
  {
    id: 'morning',
    title: { ar: 'أذكار الصباح', en: 'Morning Adhkar' },
    icon: '🌅',
    duas: [
      {
        id: 'm1',
        title: { ar: 'آية الكرسي', en: 'Ayat al-Kursi' },
        arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ',
        transliteration: 'Allahu la ilaha illa huwa al-hayyul-qayyum...',
        translation: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence...',
        reference: 'Quran 2:255'
      },
      {
        id: 'm2',
        title: { ar: 'سبحان الله وبحمده', en: 'SubhanAllah wa bihamdihi' },
        arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ',
        transliteration: 'Subhan-Allahi wa bihamdihi, AAadada khalqihi warida nafsihi wazinata AAarshihi wamidada kalimatihi',
        translation: 'Glory is to Allah and praise is to Him, by the multitude of His creation, by His Pleasure, by the weight of His Throne, and by the extent of His Words.',
        reference: 'Muslim 2726'
      }
    ]
  },
  {
    id: 'evening',
    title: { ar: 'أذكار المساء', en: 'Evening Adhkar' },
    icon: '🌙',
    duas: [
      {
        id: 'e1',
        title: { ar: 'أمسينا وأمسى الملك لله', en: 'We have reached evening' },
        arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
        transliteration: 'Amsayna wa-amsal-mulku lillah, walhamdu lillah, la ilaha illal-lahu wahdahu la shareeka lah',
        translation: 'We have reached the evening and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.',
        reference: 'Muslim 2723'
      }
    ]
  },
  {
    id: 'sleep',
    title: { ar: 'النوم', en: 'Sleep' },
    icon: '😴',
    duas: [
      {
        id: 's1',
        title: { ar: 'دعاء النوم', en: 'Before Sleep' },
        arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        transliteration: 'Bismika Allahumma amootu wa-ahya',
        translation: 'In Your name O Allah, I die and I live.',
        reference: 'Bukhari 6312'
      },
      {
        id: 's2',
        title: { ar: 'قراءة آية الكرسي', en: 'Ayat al-Kursi before sleep' },
        arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
        transliteration: 'Allahu la ilaha illa huwa al-hayyul-qayyum',
        translation: 'Allah - there is no deity except Him, the Ever-Living...',
        reference: 'Bukhari 2311'
      }
    ]
  },
  {
    id: 'wakeup',
    title: { ar: 'الاستيقاظ', en: 'Waking Up' },
    icon: '☀️',
    duas: [
      {
        id: 'w1',
        title: { ar: 'دعاء الاستيقاظ', en: 'Upon Waking Up' },
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
        transliteration: 'Alhamdu lillahil-lathee ahyana baAAda ma amatana wa-ilayhin-nushoor',
        translation: 'All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.',
        reference: 'Bukhari 6312'
      }
    ]
  },
  {
    id: 'wudhu',
    title: { ar: 'الوضوء', en: 'Ablution' },
    icon: '💧',
    duas: [
      {
        id: 'wu1',
        title: { ar: 'بعد الوضوء', en: 'After Wudhu' },
        arabic: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
        transliteration: 'Ashhadu an la ilaha illal-lahu wahdahu la shareeka lah, wa-ashhadu anna Muhammadan AAabduhu warasooluh',
        translation: 'I bear witness that none has the right to be worshipped but Allah alone, Who has no partner; and I bear witness that Muhammad is His slave and His Messenger.',
        reference: 'Muslim 234'
      }
    ]
  },
  {
    id: 'prayer',
    title: { ar: 'الصلاة', en: 'Prayer' },
    icon: '🤲',
    duas: [
      {
        id: 'p1',
        title: { ar: 'دعاء الاستفتاح', en: 'Opening Dua' },
        arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ',
        transliteration: 'Subhanakal-lahumma wabihamdika watabarakas-muka wataAAala jadduka wala ilaha ghayruk',
        translation: 'Glory is to You O Allah, and praise. Blessed is Your Name and Exalted is Your Majesty. There is none worthy of worship but You.',
        reference: 'Abu Dawud 775'
      },
      {
        id: 'p2',
        title: { ar: 'دعاء الركوع', en: 'In Ruku' },
        arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
        transliteration: 'Subhana rabbiyal-AAatheem',
        translation: 'Glory is to my Lord, the Most Great.',
        reference: 'Abu Dawud 870'
      },
      {
        id: 'p3',
        title: { ar: 'دعاء السجود', en: 'In Sujood' },
        arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
        transliteration: 'Subhana rabbiyal-aAAla',
        translation: 'Glory is to my Lord, the Most High.',
        reference: 'Abu Dawud 870'
      }
    ]
  },
  {
    id: 'afterprayer',
    title: { ar: 'بعد الصلاة', en: 'After Prayer' },
    icon: '📿',
    duas: [
      {
        id: 'ap1',
        title: { ar: 'أستغفر الله', en: 'Istighfar' },
        arabic: 'أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ',
        transliteration: 'Astaghfirullah (3 times)',
        translation: 'I seek Allah\'s forgiveness (3 times)',
        reference: 'Muslim 591'
      },
      {
        id: 'ap2',
        title: { ar: 'سبحان الله والحمد لله', en: 'Tasbih' },
        arabic: 'سُبْحَانَ اللَّهِ (33)، الْحَمْدُ لِلَّهِ (33)، اللَّهُ أَكْبَرُ (34)',
        transliteration: 'SubhanAllah (33), Alhamdulillah (33), Allahu Akbar (34)',
        translation: 'Glory be to Allah (33), All praise is to Allah (33), Allah is the Greatest (34)',
        reference: 'Muslim 596'
      }
    ]
  },
  {
    id: 'mosque',
    title: { ar: 'مسجد', en: 'Mosque' },
    icon: '🕌',
    duas: [
      {
        id: 'mo1',
        title: { ar: 'دخول المسجد', en: 'Entering Mosque' },
        arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
        transliteration: 'Allahumma iftah lee abwaba rahmatik',
        translation: 'O Allah, open before me the doors of Your mercy.',
        reference: 'Muslim 713'
      },
      {
        id: 'mo2',
        title: { ar: 'الخروج من المسجد', en: 'Leaving Mosque' },
        arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
        transliteration: 'Allahumma innee as-aluka min fadlik',
        translation: 'O Allah, I ask You from Your favor.',
        reference: 'Muslim 713'
      }
    ]
  },
  {
    id: 'home',
    title: { ar: 'منزل', en: 'Home' },
    icon: '🏠',
    duas: [
      {
        id: 'h1',
        title: { ar: 'دخول المنزل', en: 'Entering Home' },
        arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ، وَخَيْرَ الْمَخْرَجِ، بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
        transliteration: 'Allahumma innee as-aluka khayral-mawliji, wakhayral-makhraji, bismil-lahi walajnaa, wabismil-lahi kharajnaa, waAAalal-lahi rabbina tawakkalnaa',
        translation: 'O Allah, I ask You for the best entering and the best exiting. In the Name of Allah we enter, and in the Name of Allah we leave, and upon Allah, our Lord, we depend.',
        reference: 'Abu Dawud 5096'
      }
    ]
  },
  {
    id: 'travel',
    title: { ar: 'سفر', en: 'Travel' },
    icon: '✈️',
    duas: [
      {
        id: 't1',
        title: { ar: 'دعاء السفر', en: 'Travel Dua' },
        arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
        transliteration: 'Subhanal-lathee sakhkhara lana hatha wama kunna lahu muqrineen, wa-inna ila rabbina lamunqaliboon',
        translation: 'Glory unto Him Who has provided this for us though we were unable to provide it for ourselves. Surely, unto our Lord we are returning.',
        reference: 'Tirmidhi 3446'
      }
    ]
  },
  {
    id: 'food',
    title: { ar: 'طعام', en: 'Food' },
    icon: '🍽️',
    duas: [
      {
        id: 'f1',
        title: { ar: 'قبل الطعام', en: 'Before Eating' },
        arabic: 'بِسْمِ اللَّهِ',
        transliteration: 'Bismil-lah',
        translation: 'In the Name of Allah.',
        reference: 'Abu Dawud 3767'
      },
      {
        id: 'f2',
        title: { ar: 'بعد الطعام', en: 'After Eating' },
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
        transliteration: 'Alhamdu lillahil-lathee atAAamana wasaqana wajaAAalana muslimeen',
        translation: 'All praise is for Allah Who has fed us and given us drink and made us Muslims.',
        reference: 'Abu Dawud 3850'
      }
    ]
  },
  {
    id: 'provision',
    title: { ar: 'الرزق', en: 'Provision' },
    icon: '💰',
    duas: [
      {
        id: 'pr1',
        title: { ar: 'دعاء الرزق', en: 'For Provision' },
        arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
        transliteration: 'Allahumma ikfini bihalalika AAan haramika wa-aghnini bifadlika AAamman siwak',
        translation: 'O Allah, make Your lawful enough for me, as opposed to Your unlawful, and spare me by Your grace, of need of others.',
        reference: 'Tirmidhi 3563'
      }
    ]
  },
  {
    id: 'patience',
    title: { ar: 'الصبر', en: 'Patience' },
    icon: '💪',
    duas: [
      {
        id: 'pa1',
        title: { ar: 'دعاء الصبر', en: 'For Patience' },
        arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الصَّبْرَ عِنْدَ الْبَلَاءِ',
        transliteration: 'Allahumma innee as-alukas-sabra AAindal-balaa',
        translation: 'O Allah, I ask You for patience in times of trial.',
        reference: 'Hisn al-Muslim'
      }
    ]
  },
  {
    id: 'health',
    title: { ar: 'الصحة/المرض', en: 'Health/Sickness' },
    icon: '🏥',
    duas: [
      {
        id: 'he1',
        title: { ar: 'دعاء المريض', en: 'For the Sick' },
        arabic: 'اللَّهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَأْسَ، اشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا',
        transliteration: 'Allahumma rabban-nas, athhib al-baas, ishfi antas-shafi, la shifaa illa shifaauk, shifaan la yughadiru saqama',
        translation: 'O Allah, Lord of mankind, remove the harm and heal, You are the Healer, there is no healing except Your healing, a healing that leaves no illness.',
        reference: 'Bukhari 5675'
      }
    ]
  },
  {
    id: 'protection',
    title: { ar: 'الحماية', en: 'Protection' },
    icon: '🛡️',
    duas: [
      {
        id: 'pro1',
        title: { ar: 'المعوذات', en: 'Protective Surahs' },
        arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
        transliteration: 'Qul aAAoothu birabbi alfalaq',
        translation: 'Say: I seek refuge in the Lord of daybreak...',
        reference: 'Quran 113'
      }
    ]
  },
  {
    id: 'ramadan',
    title: { ar: 'رمضان', en: 'Ramadan' },
    icon: '🌙',
    duas: [
      {
        id: 'r1',
        title: { ar: 'دعاء الإفطار', en: 'Breaking Fast' },
        arabic: 'ذَهَبَ الظَّمَأُ، وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
        transliteration: 'Thahaba aththama-u wabtallatil-AAurooqu wathabatal-ajru in shaa Allah',
        translation: 'The thirst has gone, the veins are moistened and the reward is confirmed, if Allah wills.',
        reference: 'Abu Dawud 2357'
      }
    ]
  },
  {
    id: 'hajj',
    title: { ar: 'الحج/العمرة', en: 'Hajj/Umrah' },
    icon: '🕋',
    duas: [
      {
        id: 'hj1',
        title: { ar: 'التلبية', en: 'Talbiyah' },
        arabic: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ',
        transliteration: 'Labbayka Allahumma labbayk, labbayka la shareeka laka labbayk, innal-hamda wan-niAAmata laka walmulk, la shareeka lak',
        translation: 'Here I am O Allah, here I am. Here I am, You have no partner, here I am. Surely all praise, grace and sovereignty belong to You. You have no partner.',
        reference: 'Muslim 1184'
      }
    ]
  },
  {
    id: 'forgiveness',
    title: { ar: 'التوبة/مغفرة', en: 'Repentance' },
    icon: '🤲',
    duas: [
      {
        id: 'fo1',
        title: { ar: 'سيد الاستغفار', en: 'Master of Seeking Forgiveness' },
        arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ',
        transliteration: 'Allahumma anta rabbee la ilaha illa ant, khalaqtanee wa-ana AAabduk, wa-ana AAala AAahdika wawaAAdika mas-tataAAt',
        translation: 'O Allah, You are my Lord, there is no deity except You. You created me and I am Your servant...',
        reference: 'Bukhari 6306'
      }
    ]
  },
  {
    id: 'istikhara',
    title: { ar: 'الاستخارة', en: 'Istikhara' },
    icon: '🤲',
    duas: [
      {
        id: 'is1',
        title: { ar: 'دعاء الاستخارة', en: 'Istikhara Prayer' },
        arabic: 'اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ',
        transliteration: 'Allahumma innee astakheeruka biAAilmik, wa-astaqdiruka biqudratik, wa-as-aluka min fadlikal-AAatheem',
        translation: 'O Allah, I seek Your guidance by Your knowledge, and I seek ability by Your power, and I ask You of Your great bounty...',
        reference: 'Bukhari 1162'
      }
    ]
  }
];
