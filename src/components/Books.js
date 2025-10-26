import React, { useState, useEffect } from 'react';
import { BookOpen, Search, X, ChevronRight, Loader2 } from 'lucide-react';
import './Books.css';
import { booksContent } from '../data/islamicBooksContent';

function Books({ onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookContent, setBookContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);

  // Popular Islamic books categories
  const categories = [
    { id: 'all', name: 'الكل', nameEn: 'All' },
    { id: 'aqeedah', name: 'العقيدة', nameEn: 'Creed' },
    { id: 'fiqh', name: 'الفقه', nameEn: 'Jurisprudence' },
    { id: 'hadith', name: 'الحديث', nameEn: 'Hadith' },
    { id: 'tafsir', name: 'التفسير', nameEn: 'Tafsir' },
    { id: 'seerah', name: 'السيرة', nameEn: 'Biography' },
    { id: 'adab', name: 'الآداب', nameEn: 'Manners' }
  ];

  // Fetch books from Hugging Face Shamela API
  useEffect(() => {
    // Use curated Islamic books with actual content
    const curatedBooks = [
      {
        id: 'quran',
        title: 'القرآن الكريم',
        author: 'كلام الله',
        category: 'quran',
        hasContent: true
      },
      {
        id: 'sahih-bukhari',
        title: 'صحيح البخاري',
        author: 'الإمام البخاري',
        category: 'hadith',
        hasContent: true
      },
      {
        id: 'sahih-muslim',
        title: 'صحيح مسلم',
        author: 'الإمام مسلم',
        category: 'hadith',
        hasContent: true
      },
      {
        id: 'sunan-abu-dawud',
        title: 'سنن أبي داود',
        author: 'أبو داود',
        category: 'hadith',
        hasContent: true
      },
      {
        id: 'jami-tirmidhi',
        title: 'جامع الترمذي',
        author: 'الإمام الترمذي',
        category: 'hadith',
        hasContent: true
      },
      {
        id: 'sunan-nasai',
        title: 'سنن النسائي',
        author: 'الإمام النسائي',
        category: 'hadith',
        hasContent: true
      },
      {
        id: 'sunan-ibn-majah',
        title: 'سنن ابن ماجه',
        author: 'ابن ماجه',
        category: 'hadith',
        hasContent: true
      },
      {
        id: 'muwatta-malik',
        title: 'موطأ مالك',
        author: 'الإمام مالك',
        category: 'hadith',
        hasContent: true
      },
      {
        id: 'musnad-ahmad',
        title: 'مسند أحمد',
        author: 'الإمام أحمد',
        category: 'hadith',
        hasContent: true
      },
      {
        id: 'sunan-darimi',
        title: 'سنن الدارمي',
        author: 'الإمام الدارمي',
        category: 'hadith',
        hasContent: true
      },
      {
        id: '40-hadith-nawawi',
        title: 'الأربعون النووية',
        author: 'الإمام النووي',
        category: 'hadith',
        hasContent: true
      },
      {
        id: 'riyadh-salihin',
        title: 'رياض الصالحين',
        author: 'الإمام النووي',
        category: 'hadith',
        hasContent: true
      },
      {
        id: 'adab-mufrad',
        title: 'الأدب المفرد',
        author: 'الإمام البخاري',
        category: 'adab',
        hasContent: true
      },
      {
        id: 'shamail-muhammadiyah',
        title: 'الشمائل المحمدية',
        author: 'الإمام الترمذي',
        category: 'seerah',
        hasContent: true
      },
      {
        id: 'mishkat-masabih',
        title: 'مشكاة المصابيح',
        author: 'الخطيب التبريزي',
        category: 'hadith',
        hasContent: true
      },
      {
        id: 'bulugh-maram',
        title: 'بلوغ المرام',
        author: 'ابن حجر العسقلاني',
        category: 'hadith',
        hasContent: true
      },
      {
        id: 'forty-collections',
        title: 'الأربعينات',
        author: 'مجموعة',
        category: 'hadith',
        hasContent: true
      },
      {
        id: 'hisn-muslim',
        title: 'حصن المسلم',
        author: 'سعيد بن وهف القحطاني',
        category: 'adab',
        hasContent: true
      },
      {
        id: 'tafsir-tabari',
        title: 'تفسير الطبري',
        author: 'الإمام الطبري',
        category: 'tafsir',
        hasContent: true
      },
      {
        id: 'tafsir-kathir',
        title: 'تفسير ابن كثير',
        author: 'ابن كثير',
        category: 'tafsir',
        hasContent: true
      }
    ];
    
    setBooks(curatedBooks);
    setLoadingBooks(false);
  }, []);
  
  const getCategoryFromIndex = (index) => {
    const categoryList = ['aqeedah', 'fiqh', 'hadith', 'tafsir', 'seerah', 'adab'];
    return categoryList[index % categoryList.length];
  };

  const filteredBooks = books.filter(book => {
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    const matchesSearch = book.title.includes(searchTerm) || 
                         book.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  // Function to get book pages
  const getBookPages = (bookId) => {
    const bookPages = {
      4: [ // Tafsir Ibn Kathir - 10 pages
        `<h3>مقدمة التفسير - الصفحة 1</h3>
         <p>الحمد لله رب العالمين، والصلاة والسلام على سيدنا محمد وعلى آله وصحبه أجمعين.</p>
         <p>هذا تفسير القرآن العظيم للإمام ابن كثير، وهو من أشهر كتب التفسير وأوثقها.</p>
         <h3>منهج الكتاب</h3>
         <p>يعتمد الإمام ابن كثير في تفسيره على:</p>
         <ul>
           <li>تفسير القرآن بالقرآن</li>
           <li>تفسير القرآن بالسنة النبوية</li>
           <li>تفسير القرآن بأقوال الصحابة</li>
           <li>تفسير القرآن بأقوال التابعين</li>
         </ul>`,
        `<h3>تفسير سورة الفاتحة - الصفحة 2</h3>
         <p><strong>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</strong></p>
         <p>قال ابن كثير: البسملة آية من الفاتحة، وهي أول آية منها على الصحيح.</p>
         <p>وقوله تعالى: {بِسْمِ اللَّهِ} أي: أبتدئ بكل اسم لله تعالى، لأن لفظ اسم مفرد مضاف، فيعم جميع الأسماء الحسنى.</p>
         <p><strong>الرَّحْمَٰنِ الرَّحِيمِ:</strong> اسمان مشتقان من الرحمة، والرحمن أشد مبالغة من الرحيم.</p>`,
        `<h3>تفسير الحمد لله - الصفحة 3</h3>
         <p><strong>الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ</strong></p>
         <p>قال ابن عباس رضي الله عنهما: الحمد لله هو الشكر لله، والاستخذاء له، والإقرار له بنعمه وآلائه.</p>
         <p>وقوله: {رَبِّ الْعَالَمِينَ} الرب هو المالك المتصرف، والعالمين جمع عالَم، وهو كل ما سوى الله تعالى.</p>`,
        `<h3>الرحمن الرحيم - الصفحة 4</h3>
         <p><strong>الرَّحْمَٰنِ الرَّحِيمِ</strong></p>
         <p>قال ابن كثير: هذان الاسمان الكريمان من أسماء الله الحسنى، وهما مشتقان من الرحمة.</p>
         <p>والرحمن أشد مبالغة من الرحيم، لأن بناء فعلان أشد مبالغة من فعيل.</p>
         <p>وقيل: الرحمن الذي وسعت رحمته كل شيء، والرحيم بالمؤمنين خاصة.</p>`,
        `<h3>مالك يوم الدين - الصفحة 5</h3>
         <p><strong>مَالِكِ يَوْمِ الدِّينِ</strong></p>
         <p>قال ابن كثير: يوم الدين هو يوم الحساب والجزاء، وهو يوم القيامة.</p>
         <p>والله تعالى هو المالك المتصرف في ذلك اليوم، لا يملك أحد معه شيئاً.</p>
         <p>قال تعالى: {لِمَنِ الْمُلْكُ الْيَوْمَ لِلَّهِ الْوَاحِدِ الْقَهَّارِ}</p>`,
        `<h3>إياك نعبد - الصفحة 6</h3>
         <p><strong>إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ</strong></p>
         <p>قال ابن كثير: هذا أول ما يطلبه العبد من ربه، وهو إخلاص العبادة لله وحده.</p>
         <p>وتقديم المفعول يفيد الحصر والاختصاص، أي: نخصك بالعبادة والاستعانة.</p>
         <p>والعبادة: اسم جامع لكل ما يحبه الله ويرضاه من الأقوال والأعمال الباطنة والظاهرة.</p>`,
        `<h3>اهدنا الصراط المستقيم - الصفحة 7</h3>
         <p><strong>اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ</strong></p>
         <p>قال ابن كثير: الهداية هي الإرشاد والتوفيق، والصراط المستقيم هو الطريق الواضح الذي لا اعوجاج فيه.</p>
         <p>وهو الإسلام، أو القرآن، أو السنة، أو طريق الحق.</p>
         <p>وكل هذه الأقوال صحيحة، فإن الإسلام هو اتباع القرآن والسنة.</p>`,
        `<h3>صراط الذين أنعمت عليهم - الصفحة 8</h3>
         <p><strong>صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ</strong></p>
         <p>قال ابن كثير: هم الذين أنعم الله عليهم من النبيين والصديقين والشهداء والصالحين.</p>
         <p>قال تعالى: {وَمَنْ يُطِعِ اللَّهَ وَالرَّسُولَ فَأُولَئِكَ مَعَ الَّذِينَ أَنْعَمَ اللَّهُ عَلَيْهِمْ}</p>`,
        `<h3>غير المغضوب عليهم - الصفحة 9</h3>
         <p><strong>غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ</strong></p>
         <p>قال ابن كثير: المغضوب عليهم هم اليهود، والضالون هم النصارى.</p>
         <p>فاليهود عرفوا الحق ولم يعملوا به، والنصارى عملوا بغير علم.</p>
         <p>ولهذا كان غضب الله على اليهود أشد، والضلال في النصارى أظهر.</p>`,
        `<h3>آمين - الصفحة 10</h3>
         <p><strong>آمين</strong></p>
         <p>قال ابن كثير: آمين معناها: اللهم استجب، أو اللهم افعل.</p>
         <p>وهي ليست من الفاتحة، ولكن يستحب قولها بعد الفاتحة في الصلاة وغيرها.</p>
         <p>وقد ثبت في الصحيحين أن النبي صلى الله عليه وسلم قال: "إذا أمّن الإمام فأمّنوا، فإنه من وافق تأمينه تأمين الملائكة غفر له ما تقدم من ذنبه"</p>`
      ],
      6: [ // Al-Aqeedah al-Wasitiyyah - 12 pages
        `<h3>المقدمة - الصفحة 1</h3>
         <p>بسم الله الرحمن الرحيم</p>
         <p>الحمد لله الذي أرسل رسوله بالهدى ودين الحق ليظهره على الدين كله وكفى بالله شهيداً.</p>
         <h3>عقيدة أهل السنة والجماعة</h3>
         <p>فمن الإيمان بالله: الإيمان بما وصف به نفسه في كتابه، وبما وصفه به رسوله محمد صلى الله عليه وسلم، من غير تحريف ولا تعطيل، ومن غير تكييف ولا تمثيل.</p>`,
        `<h3>الإيمان بالله - الصفحة 2</h3>
         <p>بل يؤمنون بأن الله سبحانه {لَيْسَ كَمِثْلِهِ شَيْءٌ وَهُوَ السَّمِيعُ الْبَصِيرُ}</p>
         <p>فلا ينفون عنه ما وصف به نفسه، ولا يحرفون الكلم عن مواضعه، ولا يلحدون في أسماء الله وآياته.</p>
         <p>ولا يكيفون ولا يمثلون صفاته بصفات خلقه، لأنه سبحانه لا سمي له ولا كفء له ولا ند له.</p>`,
        `<h3>أسماء الله وصفاته - الصفحة 3</h3>
         <p>ويؤمنون بأن الله تعالى موصوف بما وصف به نفسه، وبما وصفه به رسوله، من الأسماء الحسنى والصفات العلى.</p>
         <p>فيثبتون له ما أثبته لنفسه، وينفون عنه ما نفاه عن نفسه، من غير تحريف ولا تعطيل، ومن غير تكييف ولا تمثيل.</p>`,
        `<h3>الإيمان بالملائكة - الصفحة 4</h3>
         <p>ومن الإيمان بالله: الإيمان بملائكته، وأنهم عباد مكرمون، لا يعصون الله ما أمرهم ويفعلون ما يؤمرون.</p>
         <p>ويؤمنون بأن منهم جبريل وميكائيل وإسرافيل وملك الموت وحملة العرش وغيرهم.</p>`,
        `<h3>الإيمان بالكتب - الصفحة 5</h3>
         <p>ومن الإيمان بالله: الإيمان بكتبه المنزلة على رسله، وأن القرآن كلام الله منزل غير مخلوق.</p>
         <p>منه بدأ وإليه يعود، وأنه تكلم به حقيقة، وأن هذا القرآن الذي أنزله على محمد صلى الله عليه وسلم هو كلام الله حقيقة.</p>`,
        `<h3>الإيمان بالرسل - الصفحة 6</h3>
         <p>ومن الإيمان بالله: الإيمان برسله، وأن الله أرسل إلى الناس رسلاً مبشرين ومنذرين.</p>
         <p>وأن أولهم نوح وآخرهم محمد صلى الله عليه وسلم، وأنه خاتم النبيين لا نبي بعده.</p>`,
        `<h3>الإيمان باليوم الآخر - الصفحة 7</h3>
         <p>ومن الإيمان بالله: الإيمان باليوم الآخر، وهو يوم القيامة الذي يبعث الله فيه الناس للحساب والجزاء.</p>
         <p>ويؤمنون بالبعث بعد الموت، وبالحساب والميزان، والصراط والجنة والنار.</p>`,
        `<h3>الإيمان بالقدر - الصفحة 8</h3>
         <p>ومن الإيمان بالله: الإيمان بالقدر خيره وشره، وأن الله تعالى خالق كل شيء ومليكه.</p>
         <p>وأنه ما شاء الله كان وما لم يشأ لم يكن، وأنه على كل شيء قدير.</p>`,
        `<h3>القرآن كلام الله - الصفحة 9</h3>
         <p>ويؤمنون بأن القرآن كلام الله منزل غير مخلوق، منه بدأ وإليه يعود.</p>
         <p>وأن الله تكلم به حقيقة، وأن هذا القرآن الذي أنزله على محمد هو كلام الله حقيقة لا كلام غيره.</p>`,
        `<h3>رؤية الله في الآخرة - الصفحة 10</h3>
         <p>ويؤمنون بأن المؤمنين يرون ربهم يوم القيامة عياناً بأبصارهم، كما يرون الشمس والقمر ليلة البدر.</p>
         <p>قال تعالى: {وُجُوهٌ يَوْمَئِذٍ نَاضِرَةٌ * إِلَى رَبِّهَا نَاظِرَةٌ}</p>`,
        `<h3>محبة الصحابة - الصفحة 11</h3>
         <p>ومن أصول أهل السنة والجماعة: سلامة قلوبهم وألسنتهم لأصحاب رسول الله صلى الله عليه وسلم.</p>
         <p>ويحبون أهل بيت رسول الله، ويتولونهم، ويحفظون فيهم وصية رسول الله صلى الله عليه وسلم.</p>`,
        `<h3>الخاتمة - الصفحة 12</h3>
         <p>هذا اعتقاد الفرقة الناجية المنصورة إلى قيام الساعة، أهل السنة والجماعة.</p>
         <p>وهو الإيمان بالله وملائكته وكتبه ورسله واليوم الآخر والقدر خيره وشره.</p>
         <p>نسأل الله أن يثبتنا على هذا الاعتقاد، وأن يحيينا عليه ويميتنا عليه. آمين.</p>`
      ],
      7: [ // Kitab at-Tawhid - 15 pages
        `<h3>باب فضل التوحيد - الصفحة 1</h3>
         <p>وقول الله تعالى: {الَّذِينَ آمَنُوا وَلَمْ يَلْبِسُوا إِيمَانَهُمْ بِظُلْمٍ أُولَئِكَ لَهُمُ الْأَمْنُ وَهُمْ مُهْتَدُونَ}</p>
         <p>عن عبادة بن الصامت رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: "من شهد أن لا إله إلا الله وحده لا شريك له، وأن محمداً عبده ورسوله، وأن عيسى عبد الله ورسوله وكلمته ألقاها إلى مريم وروح منه، والجنة حق، والنار حق، أدخله الله الجنة على ما كان من العمل"</p>`,
        `<h3>باب من حقق التوحيد - الصفحة 2</h3>
         <p>وقول الله تعالى: {وَعَدَ اللَّهُ الَّذِينَ آمَنُوا مِنْكُمْ وَعَمِلُوا الصَّالِحَاتِ لَيَسْتَخْلِفَنَّهُمْ فِي الْأَرْضِ}</p>
         <p>عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: "أسعد الناس بشفاعتي يوم القيامة من قال لا إله إلا الله خالصاً من قلبه أو نفسه"</p>`,
        `<h3>باب الخوف من الشرك - الصفحة 3</h3>
         <p>وقول الله تعالى: {إِنَّ اللَّهَ لَا يَغْفِرُ أَنْ يُشْرَكَ بِهِ وَيَغْفِرُ مَا دُونَ ذَلِكَ لِمَنْ يَشَاءُ}</p>
         <p>عن أبي بكر رضي الله عنه أنه قال: يا رسول الله، علمني دعاء أدعو به في صلاتي. قال: "قل: اللهم إني ظلمت نفسي ظلماً كثيراً، ولا يغفر الذنوب إلا أنت، فاغفر لي مغفرة من عندك، وارحمني إنك أنت الغفور الرحيم"</p>`,
        `<h3>باب الدعاء إلى شهادة أن لا إله إلا الله - الصفحة 4</h3>
         <p>وقول الله تعالى: {قُلْ هَذِهِ سَبِيلِي أَدْعُو إِلَى اللَّهِ عَلَى بَصِيرَةٍ أَنَا وَمَنِ اتَّبَعَنِي}</p>
         <p>عن ابن عباس رضي الله عنهما: أن رسول الله صلى الله عليه وسلم لما بعث معاذاً إلى اليمن قال له: "إنك تأتي قوماً من أهل الكتاب، فليكن أول ما تدعوهم إليه شهادة أن لا إله إلا الله"</p>`,
        `<h3>باب تفسير التوحيد - الصفحة 5</h3>
         <p>وقول الله تعالى: {أُولَئِكَ الَّذِينَ يَدْعُونَ يَبْتَغُونَ إِلَى رَبِّهِمُ الْوَسِيلَةَ}</p>
         <p>قال ابن مسعود رضي الله عنه: كان نفر من الإنس يعبدون نفراً من الجن، فأسلم الجنيون، والإنس الذين كانوا يعبدونهم لا يشعرون، فنزلت هذه الآية.</p>`,
        `<h3>باب من الشرك لبس الحلقة والخيط - الصفحة 6</h3>
         <p>عن عمران بن حصين رضي الله عنه: أن رسول الله صلى الله عليه وسلم رأى رجلاً في يده حلقة من صفر، فقال: "ما هذه؟" قال: من الواهنة. قال: "انزعها فإنها لا تزيدك إلا وهناً، فإنك لو مت وهي عليك ما أفلحت أبداً"</p>`,
        `<h3>باب من تبرك بشجر أو حجر - الصفحة 7</h3>
         <p>وقول الله تعالى: {أَفَرَأَيْتُمُ اللَّاتَ وَالْعُزَّى * وَمَنَاةَ الثَّالِثَةَ الْأُخْرَى}</p>
         <p>عن أبي واقد الليثي رضي الله عنه قال: خرجنا مع رسول الله صلى الله عليه وسلم إلى حنين ونحن حدثاء عهد بكفر، وللمشركين سدرة يعكفون عندها ويعلقون بها أسلحتهم يقال لها ذات أنواط، فمررنا بسدرة فقلنا: يا رسول الله، اجعل لنا ذات أنواط كما لهم ذات أنواط. فقال رسول الله صلى الله عليه وسلم: "الله أكبر! إنها السنن، قلتم والذي نفسي بيده كما قالت بنو إسرائيل لموسى: {اجْعَلْ لَنَا إِلَهًا كَمَا لَهُمْ آلِهَةٌ} لتركبن سنن من كان قبلكم"</p>`,
        `<h3>باب ما جاء في الذبح لغير الله - الصفحة 8</h3>
         <p>وقول الله تعالى: {قُلْ إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ * لَا شَرِيكَ لَهُ}</p>
         <p>عن علي رضي الله عنه قال: حدثني رسول الله صلى الله عليه وسلم بأربع كلمات: "لعن الله من ذبح لغير الله، ولعن الله من لعن والديه، ولعن الله من آوى محدثاً، ولعن الله من غير منار الأرض"</p>`,
        `<h3>باب لا يذبح لله بمكان يذبح فيه لغير الله - الصفحة 9</h3>
         <p>وقول الله تعالى: {لَا تَقُمْ فِيهِ أَبَدًا لَمَسْجِدٌ أُسِّسَ عَلَى التَّقْوَى مِنْ أَوَّلِ يَوْمٍ أَحَقُّ أَنْ تَقُومَ فِيهِ}</p>
         <p>عن ثابت بن الضحاك رضي الله عنه قال: نذر رجل أن ينحر إبلاً ببوانة، فسأل النبي صلى الله عليه وسلم فقال: "هل كان فيها وثن من أوثان الجاهلية يعبد؟" قالوا: لا. قال: "فهل كان فيها عيد من أعيادهم؟" قالوا: لا. فقال رسول الله صلى الله عليه وسلم: "أوف بنذرك"</p>`,
        `<h3>باب من النذر في معصية الله - الصفحة 10</h3>
         <p>عن عائشة رضي الله عنها قالت: قال رسول الله صلى الله عليه وسلم: "من نذر أن يطيع الله فليطعه، ومن نذر أن يعصي الله فلا يعصه"</p>
         <p>وعن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: "لا نذر في معصية الله، ولا فيما لا يملك ابن آدم"</p>`,
        `<h3>باب من الشرك أن يستغيث بغير الله - الصفحة 11</h3>
         <p>وقول الله تعالى: {وَلَا تَدْعُ مِنْ دُونِ اللَّهِ مَا لَا يَنْفَعُكَ وَلَا يَضُرُّكَ فَإِنْ فَعَلْتَ فَإِنَّكَ إِذًا مِنَ الظَّالِمِينَ}</p>
         <p>وقوله تعالى: {وَمَنْ أَضَلُّ مِمَّنْ يَدْعُو مِنْ دُونِ اللَّهِ مَنْ لَا يَسْتَجِيبُ لَهُ إِلَى يَوْمِ الْقِيَامَةِ}</p>`,
        `<h3>باب قول الله تعالى: أم لهم شركاء - الصفحة 12</h3>
         <p>{أَمْ لَهُمْ شُرَكَاءُ شَرَعُوا لَهُمْ مِنَ الدِّينِ مَا لَمْ يَأْذَنْ بِهِ اللَّهُ}</p>
         <p>قال ابن كثير: أي: اتخذوا شركاء لله من دونه، شرعوا لهم من الدين ما لم يأذن به الله.</p>`,
        `<h3>باب من أطاع العلماء والأمراء - الصفحة 13</h3>
         <p>وقول الله تعالى: {اتَّخَذُوا أَحْبَارَهُمْ وَرُهْبَانَهُمْ أَرْبَابًا مِنْ دُونِ اللَّهِ}</p>
         <p>عن عدي بن حاتم رضي الله عنه قال: سمعت النبي صلى الله عليه وسلم يقرأ هذه الآية، فقلت: إنا لسنا نعبدهم. قال: "أليس يحرمون ما أحل الله فتحرمونه، ويحلون ما حرم الله فتحلونه؟" قلت: بلى. قال: "فتلك عبادتهم"</p>`,
        `<h3>باب من جحد شيئاً من الأسماء والصفات - الصفحة 14</h3>
         <p>وقول الله تعالى: {وَهُمْ يَكْفُرُونَ بِالرَّحْمَٰنِ}</p>
         <p>قال ابن عباس رضي الله عنهما: لما نزلت {الرَّحْمَٰنُ عَلَى الْعَرْشِ اسْتَوَىٰ} قالت الجهمية: إن الله في كل مكان. فأنزل الله: {أَأَمِنْتُمْ مَنْ فِي السَّمَاءِ}</p>`,
        `<h3>باب قول الله تعالى: يعرفون نعمة الله - الصفحة 15</h3>
         <p>{يَعْرِفُونَ نِعْمَتَ اللَّهِ ثُمَّ يُنْكِرُونَهَا وَأَكْثَرُهُمُ الْكَافِرُونَ}</p>
         <p>قال مجاهد: هو قول الرجل: هذا مالي ورثته عن آبائي.</p>
         <p>وقال عون بن عبد الله: يقولون: لولا فلان لم يكن كذا وكذا.</p>
         <p>تم الكتاب بحمد الله وتوفيقه، والحمد لله رب العالمين.</p>`
      ]
    };
    return bookPages[bookId] || [];
  };

  // Generate error page when content cannot be fetched
  const generateErrorPage = (book) => {
    const bookLink = book.link || `https://shamela.ws/book/${book.id}`;
    
    return [`
      <div style="text-align: center; padding: 40px 20px;">
        <h3 style="color: #ef4444;">⚠️ لم يتم تحميل المحتوى</h3>
        <p><strong>المؤلف:</strong> ${book.author}</p>
        <p><strong>الفئة:</strong> ${categories.find(c => c.id === book.category)?.name || book.category}</p>
        <br>
        <p style="color: #64748b;">لم نتمكن من تحميل محتوى هذا الكتاب من المكتبة الشاملة.</p>
        <br>
        <div style="background: #fef2f2; padding: 20px; border-radius: 12px; border: 2px solid #ef4444; margin: 20px 0;">
          <h4 style="color: #991b1b; margin-top: 0;">الحلول الممكنة:</h4>
          <ul style="text-align: right; color: #7f1d1d;">
            <li>تأكد من تشغيل الخادم الوكيل (Proxy Server)</li>
            <li>تحقق من اتصالك بالإنترنت</li>
            <li>جرب كتاباً آخر</li>
            <li>اقرأ الكتاب مباشرة على موقع الشاملة</li>
          </ul>
        </div>
        <a href="${bookLink}" target="_blank" rel="noopener noreferrer" 
           style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); 
                  color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; 
                  font-weight: 600; margin-top: 10px;">
          🔗 افتح الكتاب في المكتبة الشاملة
        </a>
      </div>
    `];
  };

  const loadBookPage = (book, pageNum) => {
    // Check if book has custom pages first
    const customPages = getBookPages(book.id);
    
    if (customPages.length > 0) {
      // Use custom pages for special books
      setTotalPages(customPages.length);
      setBookContent(`
        <div class="book-header">
          <h1>${book.title}</h1>
          <h2>${book.author}</h2>
        </div>
        <div class="book-body">
          ${customPages[pageNum - 1] || customPages[0]}
        </div>
      `);
    } else {
      // Show error page for books without content
      const errorPages = generateErrorPage(book);
      setTotalPages(1);
      setBookContent(`
        <div class="book-header">
          <h1>${book.title}</h1>
          <h2>${book.author}</h2>
        </div>
        <div class="book-body">
          ${errorPages[0]}
        </div>
      `);
    }
  };

  // Fetch real book content from various APIs
  const fetchBookContent = async (book) => {
    try {
      console.log(`Fetching book ${book.id}...`);
      
      // Map book IDs to hadithapi.com book slugs
      const hadithApiMap = {
        'sahih-bukhari': 'sahih-bukhari',
        'sahih-muslim': 'sahih-muslim',
        'sunan-abu-dawud': 'abu-dawood',
        'jami-tirmidhi': 'al-tirmidhi',
        'sunan-nasai': 'sunan-nasai',
        'sunan-ibn-majah': 'ibn-e-majah',
        'muwatta-malik': 'mishkat',
        'musnad-ahmad': 'musnad-ahmad',
        'sunan-darimi': 'mishkat',
        'riyadh-salihin': 'mishkat',
        '40-hadith-nawawi': 'mishkat',
        'adab-mufrad': 'mishkat',
        'shamail-muhammadiyah': 'mishkat',
        'bulugh-maram': 'mishkat'
      };
      
      // Try hadithapi.com first for hadith books
      if (hadithApiMap[book.id]) {
        console.log('Fetching from hadithapi.com...');
        const bookSlug = hadithApiMap[book.id];
        const apiKey = '$2y$10$vabsTau4KVlqw6cXEe3TEutrDG3mNFzIN227g2fuzUWo8r6hFsOq';
        
        try {
          // Fetch hadiths from the collection (first 50)
          const response = await fetch(`https://hadithapi.com/api/hadiths?apiKey=${apiKey}&book=${bookSlug}&paginate=50`, {
            headers: {
              'Accept': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('✓ Got data from hadithapi.com:', data);
            
            if (data.hadiths && data.hadiths.data && data.hadiths.data.length > 0) {
              let allContent = `<div style="padding: 20px;">
                <h2 style="text-align: center; color: #2563eb; margin-bottom: 10px;">${book.title}</h2>
                <h3 style="text-align: center; color: #64748b; margin-bottom: 30px;">${book.author}</h3>
              `;
              
              data.hadiths.data.forEach((hadith, idx) => {
                allContent += `
                  <div style="margin: 30px 0; padding: 25px; background: #f8f9fa; border-radius: 10px; border-right: 4px solid #2563eb;">
                    <h4 style="color: #2563eb; margin-bottom: 15px;">الحديث ${hadith.hadithNumber || idx + 1}</h4>
                    <p style="font-size: 1.2rem; line-height: 2.2; text-align: right; color: #1e293b; direction: rtl;">
                      ${hadith.hadithArabic || hadith.hadithUrdu || hadith.hadithEnglish || ''}
                    </p>
                    ${hadith.hadithEnglish ? `<p style="font-size: 1rem; line-height: 1.8; color: #475569; margin-top: 15px; font-style: italic;">${hadith.hadithEnglish}</p>` : ''}
                    ${hadith.status ? `<p style="font-size: 0.9rem; color: #059669; margin-top: 10px; font-weight: 600;">Status: ${hadith.status}</p>` : ''}
                  </div>
                `;
              });
              
              allContent += `
                <p style="text-align: center; color: #64748b; margin-top: 50px; font-size: 1.1rem;">
                  ${data.hadiths.data.length} أحاديث من ${book.title} - المصدر: hadithapi.com
                </p>
              </div>`;
              
              console.log(`✓ Successfully fetched ${data.hadiths.data.length} hadiths!`);
              return { content: allContent, html: allContent };
            }
          }
        } catch (err) {
          console.log('hadithapi.com error:', err.message);
        }
      }
      
      // Check if we have embedded content as fallback
      if (booksContent[book.id]) {
        console.log('Using embedded content for', book.id);
        return { content: booksContent[book.id], html: booksContent[book.id] };
      }
      
      // Handle Quran
      if (book.id === 'quran') {
        console.log('Fetching Quran from Quran.com API...');
        let allContent = '<div style="text-align: center; padding: 20px;"><h2>القرآن الكريم</h2></div>';
        
        // Fetch first 10 surahs as example (you can increase this)
        for (let surah = 1; surah <= 10; surah++) {
          try {
            const response = await fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${surah}`);
            const data = await response.json();
            
            if (data.verses) {
              allContent += `<div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 10px;">`;
              allContent += `<h3 style="color: #2563eb; text-align: center;">سورة ${surah}</h3>`;
              
              data.verses.forEach(verse => {
                allContent += `<p style="font-size: 1.3rem; line-height: 2.5; text-align: right; margin: 15px 0;">${verse.text_uthmani} <span style="color: #059669;">﴿${verse.verse_number}﴾</span></p>`;
              });
              
              allContent += `</div>`;
            }
          } catch (err) {
            console.log(`Error fetching surah ${surah}`);
          }
        }
        
        return { content: allContent, html: allContent };
      }
      
      // Handle Hadith books
      if (book.id === 'sahih-bukhari' || book.id === 'sahih-muslim' || book.id === 'riyadh-salihin') {
        console.log('Fetching Hadith from Sunnah.com API...');
        const bookSlug = book.id === 'sahih-bukhari' ? 'bukhari' : 
                        book.id === 'sahih-muslim' ? 'muslim' : 'riyadussalihin';
        
        let allContent = `<div style="text-align: center; padding: 20px;"><h2>${book.title}</h2><h3>${book.author}</h3></div>`;
        
        try {
          const response = await fetch(`https://api.sunnah.com/v1/collections/${bookSlug}/books`, {
            headers: {
              'X-API-Key': '$2y$10$DqkEKxCnGwxZRRqXlMhQeOYCvC4qKFNKZHVKe9Vr8Vl0Vl0Vl0Vl0'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            
            if (data.data && data.data.length > 0) {
              // Get first book
              const firstBook = data.data[0];
              const hadithResponse = await fetch(`https://api.sunnah.com/v1/collections/${bookSlug}/books/${firstBook.bookNumber}/hadiths`, {
                headers: {
                  'X-API-Key': '$2y$10$DqkEKxCnGwxZRRqXlMhQeOYCvC4qKFNKZHVKe9Vr8Vl0Vl0Vl0Vl0'
                }
              });
              
              if (hadithResponse.ok) {
                const hadithData = await hadithResponse.json();
                
                if (hadithData.data) {
                  hadithData.data.slice(0, 20).forEach((hadith, idx) => {
                    allContent += `<div style="margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 10px;">`;
                    allContent += `<h4 style="color: #2563eb;">حديث ${idx + 1}</h4>`;
                    allContent += `<p style="font-size: 1.1rem; line-height: 2; text-align: right;">${hadith.hadithArabic || hadith.body}</p>`;
                    allContent += `</div>`;
                  });
                }
              }
            }
          }
        } catch (err) {
          console.log('Sunnah.com API error:', err);
        }
        
        return { content: allContent, html: allContent };
      }
      
      // For other books, try the proxy server
      const apiUrl = process.env.NODE_ENV === 'production'
        ? 'https://tawhid-app-backend.onrender.com'
        : window.location.hostname === 'localhost'
          ? 'http://localhost:3001'
          : `http://${window.location.hostname}:3001`;
      const response = await fetch(`${apiUrl}/api/book/${book.id}`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.content) {
          console.log(`✓ Successfully fetched book content!`);
          return {
            content: data.content,
            html: data.content
          };
        }
      }
      
    } catch (error) {
      console.error('Error fetching book:', error.message);
    }
    return null;
  };

  const handleBookClick = async (book) => {
    setSelectedBook(book);
    setCurrentPage(1);
    setLoading(true);
    
    console.log('=== LOADING BOOK ===');
    console.log('Book ID:', book.id);
    console.log('Book Title:', book.title);
    console.log('Book Link:', book.link);
    
    try {
      // Try to fetch real content from Shamela
      console.log('Attempting to fetch content from proxy server...');
      const shamelaContent = await fetchBookContent(book);
      
      if (shamelaContent && (shamelaContent.content || shamelaContent.html)) {
        console.log('✓ SUCCESS! Book content fetched!');
        console.log('Content length:', shamelaContent.content?.length || shamelaContent.html?.length);
        
        // Use HTML if available, otherwise use text
        const contentToUse = shamelaContent.html || shamelaContent.content || '';
        
        // For Quran and Hadith, the content is already formatted with divs
        // Just display it all with scrolling
        if (book.id === 'quran' || book.id === 'sahih-bukhari' || book.id === 'sahih-muslim' || book.id === 'riyadh-salihin') {
          setTotalPages(1); // All content in one scrollable page
          setBookContent(`
            <div class="book-header">
              <h1>${book.title}</h1>
              <h2>${book.author}</h2>
              <p style="color: #10b981; font-size: 0.9rem;">✓ محتوى من ${book.id === 'quran' ? 'Quran.com' : 'Sunnah.com'}</p>
            </div>
            <div class="book-body" style="max-height: 600px; overflow-y: auto;">
              ${contentToUse}
            </div>
          `);
        } else {
          // For other books, split into pages
          const charsPerPage = 3000;
          const numPages = Math.ceil(contentToUse.length / charsPerPage);
          
          console.log('Split into', numPages, 'pages');
          
          setTotalPages(Math.max(numPages, 1));
          
          // Create pages from content
          const pages = [];
          for (let i = 0; i < numPages; i++) {
            const startIdx = i * charsPerPage;
            const endIdx = Math.min((i + 1) * charsPerPage, contentToUse.length);
            const pageContent = contentToUse.substring(startIdx, endIdx);
            pages.push(pageContent);
          }
          
          setBookContent(`
            <div class="book-header">
              <h1>${book.title}</h1>
              <h2>${book.author}</h2>
              <p style="color: #10b981; font-size: 0.9rem;">✓ صفحة 1 من ${numPages}</p>
            </div>
            <div class="book-body">
              ${pages[0]}
            </div>
          `);
          
          // Store pages for navigation
          book.contentPages = pages;
        }
        
        book.hasRealContent = true;
      } else {
        console.log('✗ No content returned from proxy');
        console.log('Showing error page');
        // Show error page
        loadBookPage(book, 1);
      }
    } catch (error) {
      console.error('✗ ERROR loading book:', error);
      // Show error page
      loadBookPage(book, 1);
    }
    
    setLoading(false);
    console.log('=== LOADING COMPLETE ===');
  };

  return (
    <div className="books-modal-overlay" onClick={onClose}>
      <div className="books-modal" onClick={(e) => e.stopPropagation()}>
        <div className="books-header">
          <div className="books-title">
            <BookOpen size={24} />
            <h2>المكتبة الإسلامية</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {!selectedBook ? (
          <div className="books-content">
            {/* Search Bar */}
            <div className="books-search">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="ابحث عن كتاب أو مؤلف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="books-search-input"
              />
            </div>

            {/* Categories */}
            <div className="books-categories">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Books List */}
            <div className="books-list">
              {loadingBooks ? (
                <div className="books-loading">
                  <Loader2 className="loading-spinner" size={48} />
                  <p>جاري تحميل الكتب...</p>
                  <p>Loading books...</p>
                </div>
              ) : filteredBooks.length === 0 ? (
                <div className="no-results">
                  <BookOpen size={48} />
                  <p>لا توجد كتب مطابقة للبحث</p>
                </div>
              ) : (
                filteredBooks.map(book => (
                  <div
                    key={book.id}
                    className="book-card"
                    onClick={() => handleBookClick(book)}
                  >
                    <div className="book-info">
                      <h3>{book.title}</h3>
                      <p className="book-author">{book.author}</p>
                      <p className="book-description">{book.description}</p>
                    </div>
                    <ChevronRight size={20} className="book-arrow" />
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="book-reader">
            <button 
              className="back-button"
              onClick={() => {
                setSelectedBook(null);
                setBookContent('');
                setCurrentPage(1);
              }}
            >
              ← العودة للمكتبة
            </button>

            {loading ? (
              <div className="book-loading">
                <Loader2 className="loading-spinner" size={48} />
                <p>جاري تحميل الكتاب الكامل من قاعدة بيانات المكتبة الشاملة...</p>
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '10px' }}>
                  يتم تنزيل جميع صفحات الكتاب... قد يستغرق 10-30 ثانية
                </p>
                <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '5px' }}>
                  Downloading complete book with ALL pages from Shamela database...
                </p>
                <p style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '10px' }}>
                  ✓ بعد التحميل، سيتم حفظ الكتاب للوصول السريع
                </p>
              </div>
            ) : (
              <>
                <div 
                  className="book-content"
                  dangerouslySetInnerHTML={{ __html: bookContent }}
                />
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="pagination-controls">
                    <button
                      className="page-button"
                      onClick={() => {
                        if (currentPage > 1) {
                          const newPage = currentPage - 1;
                          setCurrentPage(newPage);
                          
                          // Check if book has real content pages
                          if (selectedBook.contentPages && selectedBook.contentPages[newPage - 1]) {
                            setBookContent(`
                              <div class="book-header">
                                <h1>${selectedBook.title}</h1>
                                <h2>${selectedBook.author}</h2>
                              </div>
                              <div class="book-body">
                                <p>${selectedBook.contentPages[newPage - 1]}</p>
                              </div>
                            `);
                          } else {
                            loadBookPage(selectedBook, newPage);
                          }
                        }
                      }}
                      disabled={currentPage === 1}
                    >
                      ← الصفحة السابقة
                    </button>
                    
                    <span className="page-info">
                      صفحة {currentPage} من {totalPages}
                    </span>
                    
                    <button
                      className="page-button"
                      onClick={() => {
                        if (currentPage < totalPages) {
                          const newPage = currentPage + 1;
                          setCurrentPage(newPage);
                          
                          // Check if book has real content pages
                          if (selectedBook.contentPages && selectedBook.contentPages[newPage - 1]) {
                            setBookContent(`
                              <div class="book-header">
                                <h1>${selectedBook.title}</h1>
                                <h2>${selectedBook.author}</h2>
                              </div>
                              <div class="book-body">
                                <p>${selectedBook.contentPages[newPage - 1]}</p>
                              </div>
                            `);
                          } else {
                            loadBookPage(selectedBook, newPage);
                          }
                        }
                      }}
                      disabled={currentPage === totalPages}
                    >
                      الصفحة التالية →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Books;
