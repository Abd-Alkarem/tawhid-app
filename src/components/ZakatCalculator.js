import React, { useState } from 'react';
import { Calculator, DollarSign, TrendingUp, Heart, X, Info } from 'lucide-react';
import './ZakatCalculator.css';

// Nisab values (approximate - should be updated regularly)
const NISAB_GOLD = 85; // grams
const NISAB_SILVER = 595; // grams
const ZAKAT_RATE = 0.025; // 2.5%

function ZakatCalculator({ onClose }) {
  const [activeTab, setActiveTab] = useState('zakat');
  
  // Zakat state
  const [zakatInputs, setZakatInputs] = useState({
    cash: '',
    bankBalance: '',
    gold: '',
    silver: '',
    investments: '',
    businessAssets: '',
    debtsOwed: '',
    debtsPayable: ''
  });
  
  // Sadaqah state
  const [sadaqahAmount, setSadaqahAmount] = useState('');
  const [sadaqahPurpose, setSadaqahPurpose] = useState('general');
  
  const [goldPrice, setGoldPrice] = useState('60'); // per gram in USD
  const [silverPrice, setSilverPrice] = useState('0.75'); // per gram in USD

  // Calculate total wealth
  const calculateTotalWealth = () => {
    const cash = parseFloat(zakatInputs.cash) || 0;
    const bank = parseFloat(zakatInputs.bankBalance) || 0;
    const gold = parseFloat(zakatInputs.gold) || 0;
    const silver = parseFloat(zakatInputs.silver) || 0;
    const investments = parseFloat(zakatInputs.investments) || 0;
    const business = parseFloat(zakatInputs.businessAssets) || 0;
    const debtsOwed = parseFloat(zakatInputs.debtsOwed) || 0;
    const debtsPayable = parseFloat(zakatInputs.debtsPayable) || 0;

    const totalAssets = cash + bank + gold + silver + investments + business + debtsOwed;
    const netWealth = totalAssets - debtsPayable;
    
    return { totalAssets, netWealth };
  };

  // Calculate Nisab threshold
  const calculateNisab = () => {
    const goldNisab = NISAB_GOLD * parseFloat(goldPrice);
    const silverNisab = NISAB_SILVER * parseFloat(silverPrice);
    return Math.min(goldNisab, silverNisab); // Use lower value (more beneficial)
  };

  // Calculate Zakat amount
  const calculateZakat = () => {
    const { netWealth } = calculateTotalWealth();
    const nisab = calculateNisab();
    
    if (netWealth >= nisab) {
      return netWealth * ZAKAT_RATE;
    }
    return 0;
  };

  const handleZakatInputChange = (field, value) => {
    setZakatInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetZakat = () => {
    setZakatInputs({
      cash: '',
      bankBalance: '',
      gold: '',
      silver: '',
      investments: '',
      businessAssets: '',
      debtsOwed: '',
      debtsPayable: ''
    });
  };

  const { totalAssets, netWealth } = calculateTotalWealth();
  const nisabThreshold = calculateNisab();
  const zakatDue = calculateZakat();
  const isZakatApplicable = netWealth >= nisabThreshold;

  return (
    <div className="calculator-overlay">
      <div className="calculator-container">
        {/* Header */}
        <div className="calculator-header">
          <div className="header-content">
            <Calculator size={28} />
            <h2>حاسبة الزكاة والصدقة</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="calculator-tabs">
          <button
            className={`tab-btn ${activeTab === 'zakat' ? 'active' : ''}`}
            onClick={() => setActiveTab('zakat')}
          >
            <DollarSign size={20} />
            <span>حاسبة الزكاة</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'sadaqah' ? 'active' : ''}`}
            onClick={() => setActiveTab('sadaqah')}
          >
            <Heart size={20} />
            <span>حاسبة الصدقة</span>
          </button>
        </div>

        <div className="calculator-content">
          {activeTab === 'zakat' ? (
            <>
              {/* Zakat Calculator */}
              <div className="info-box">
                <Info size={20} />
                <p>الزكاة واجبة على كل مسلم بالغ عاقل يملك النصاب لمدة عام هجري كامل</p>
              </div>

              {/* Nisab Reference */}
              <div className="nisab-section">
                <h3>أسعار المعادن الحالية</h3>
                <div className="price-inputs">
                  <div className="price-input-group">
                    <label>سعر الذهب (للجرام)</label>
                    <input
                      type="number"
                      value={goldPrice}
                      onChange={(e) => setGoldPrice(e.target.value)}
                      placeholder="60"
                    />
                    <span className="currency">$</span>
                  </div>
                  <div className="price-input-group">
                    <label>سعر الفضة (للجرام)</label>
                    <input
                      type="number"
                      value={silverPrice}
                      onChange={(e) => setSilverPrice(e.target.value)}
                      placeholder="0.75"
                    />
                    <span className="currency">$</span>
                  </div>
                </div>
                <div className="nisab-info">
                  <p><strong>النصاب الحالي:</strong> ${nisabThreshold.toFixed(2)}</p>
                  <p className="nisab-note">(85 جرام ذهب أو 595 جرام فضة - يُؤخذ الأقل)</p>
                </div>
              </div>

              {/* Assets Input */}
              <div className="input-section">
                <h3>الأصول والممتلكات</h3>
                <div className="input-grid">
                  <div className="input-group">
                    <label>النقد (كاش)</label>
                    <input
                      type="number"
                      value={zakatInputs.cash}
                      onChange={(e) => handleZakatInputChange('cash', e.target.value)}
                      placeholder="0"
                    />
                    <span className="currency">$</span>
                  </div>

                  <div className="input-group">
                    <label>الرصيد البنكي</label>
                    <input
                      type="number"
                      value={zakatInputs.bankBalance}
                      onChange={(e) => handleZakatInputChange('bankBalance', e.target.value)}
                      placeholder="0"
                    />
                    <span className="currency">$</span>
                  </div>

                  <div className="input-group">
                    <label>قيمة الذهب</label>
                    <input
                      type="number"
                      value={zakatInputs.gold}
                      onChange={(e) => handleZakatInputChange('gold', e.target.value)}
                      placeholder="0"
                    />
                    <span className="currency">$</span>
                  </div>

                  <div className="input-group">
                    <label>قيمة الفضة</label>
                    <input
                      type="number"
                      value={zakatInputs.silver}
                      onChange={(e) => handleZakatInputChange('silver', e.target.value)}
                      placeholder="0"
                    />
                    <span className="currency">$</span>
                  </div>

                  <div className="input-group">
                    <label>الاستثمارات</label>
                    <input
                      type="number"
                      value={zakatInputs.investments}
                      onChange={(e) => handleZakatInputChange('investments', e.target.value)}
                      placeholder="0"
                    />
                    <span className="currency">$</span>
                  </div>

                  <div className="input-group">
                    <label>أصول تجارية</label>
                    <input
                      type="number"
                      value={zakatInputs.businessAssets}
                      onChange={(e) => handleZakatInputChange('businessAssets', e.target.value)}
                      placeholder="0"
                    />
                    <span className="currency">$</span>
                  </div>

                  <div className="input-group">
                    <label>ديون لك على الآخرين</label>
                    <input
                      type="number"
                      value={zakatInputs.debtsOwed}
                      onChange={(e) => handleZakatInputChange('debtsOwed', e.target.value)}
                      placeholder="0"
                    />
                    <span className="currency">$</span>
                  </div>

                  <div className="input-group negative">
                    <label>ديون عليك للآخرين</label>
                    <input
                      type="number"
                      value={zakatInputs.debtsPayable}
                      onChange={(e) => handleZakatInputChange('debtsPayable', e.target.value)}
                      placeholder="0"
                    />
                    <span className="currency">$</span>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="results-section">
                <div className="result-card">
                  <TrendingUp size={24} />
                  <div className="result-info">
                    <span className="result-label">إجمالي الأصول</span>
                    <span className="result-value">${totalAssets.toFixed(2)}</span>
                  </div>
                </div>

                <div className="result-card">
                  <DollarSign size={24} />
                  <div className="result-info">
                    <span className="result-label">صافي الثروة</span>
                    <span className="result-value">${netWealth.toFixed(2)}</span>
                  </div>
                </div>

                <div className={`result-card zakat ${isZakatApplicable ? 'applicable' : 'not-applicable'}`}>
                  <Calculator size={24} />
                  <div className="result-info">
                    <span className="result-label">الزكاة المستحقة (2.5%)</span>
                    <span className="result-value">${zakatDue.toFixed(2)}</span>
                  </div>
                </div>

                {!isZakatApplicable && netWealth > 0 && (
                  <div className="info-message">
                    <Info size={18} />
                    <p>ثروتك أقل من النصاب، الزكاة غير واجبة عليك حالياً</p>
                  </div>
                )}

                {isZakatApplicable && (
                  <div className="success-message">
                    <Info size={18} />
                    <p>بارك الله في مالك! الزكاة واجبة عليك</p>
                  </div>
                )}
              </div>

              <div className="action-buttons">
                <button className="reset-btn" onClick={resetZakat}>
                  إعادة تعيين
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Sadaqah Calculator */}
              <div className="info-box">
                <Heart size={20} />
                <p>الصدقة تطفئ الخطيئة كما يطفئ الماء النار</p>
              </div>

              <div className="sadaqah-section">
                <h3>حاسبة الصدقة</h3>
                
                <div className="sadaqah-purpose">
                  <label>الغرض من الصدقة</label>
                  <select 
                    value={sadaqahPurpose} 
                    onChange={(e) => setSadaqahPurpose(e.target.value)}
                  >
                    <option value="general">صدقة عامة</option>
                    <option value="poor">إطعام المساكين</option>
                    <option value="orphan">كفالة يتيم</option>
                    <option value="education">التعليم</option>
                    <option value="medical">العلاج الطبي</option>
                    <option value="mosque">بناء مسجد</option>
                    <option value="water">مشروع ماء</option>
                  </select>
                </div>

                <div className="sadaqah-suggestions">
                  <h4>اقتراحات للصدقة</h4>
                  <div className="suggestion-buttons">
                    <button onClick={() => setSadaqahAmount('10')}>$10</button>
                    <button onClick={() => setSadaqahAmount('25')}>$25</button>
                    <button onClick={() => setSadaqahAmount('50')}>$50</button>
                    <button onClick={() => setSadaqahAmount('100')}>$100</button>
                    <button onClick={() => setSadaqahAmount('500')}>$500</button>
                  </div>
                </div>

                <div className="input-group large">
                  <label>مبلغ الصدقة</label>
                  <input
                    type="number"
                    value={sadaqahAmount}
                    onChange={(e) => setSadaqahAmount(e.target.value)}
                    placeholder="أدخل المبلغ"
                  />
                  <span className="currency">$</span>
                </div>

                {sadaqahAmount && parseFloat(sadaqahAmount) > 0 && (
                  <div className="sadaqah-result">
                    <div className="result-card success">
                      <Heart size={32} />
                      <div className="result-info">
                        <span className="result-label">مبلغ الصدقة</span>
                        <span className="result-value large">${parseFloat(sadaqahAmount).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="hadith-box">
                      <p className="hadith-text">
                        "مَن تصدَّق بعدل تمرة من كسب طيب، ولا يقبل الله إلا الطيب، فإن الله يتقبلها بيمينه، ثم يربيها لصاحبها كما يربي أحدكم فَلُوَّه، حتى تكون مثل الجبل"
                      </p>
                      <p className="hadith-source">- صحيح البخاري</p>
                    </div>
                  </div>
                )}

                <div className="sadaqah-benefits">
                  <h4>فضل الصدقة</h4>
                  <ul>
                    <li>تطفئ الخطيئة وتكفر الذنوب</li>
                    <li>تزيد البركة في المال</li>
                    <li>تدفع البلاء والمصائب</li>
                    <li>تظل صاحبها يوم القيامة</li>
                    <li>تطهر النفس من البخل</li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ZakatCalculator;
