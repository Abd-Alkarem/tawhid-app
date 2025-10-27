import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import './Settings.css';

const Toggle = ({ labelAr, subAr, value, onChange }) => (
  <div className="setting-row">
    <div className="setting-text">
      <div className="label-ar">{labelAr}</div>
      {subAr && <div className="sub-ar">{subAr}</div>}
    </div>
    <label className="switch">
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
      <span className="slider" />
    </label>
  </div>
);

const Settings = ({ onBack, onOpenCalendar, onOpenPrayer, onOpenAdhkar }) => {
  const [duaReminder, setDuaReminder] = useState(true);
  const [fridayReminder, setFridayReminder] = useState(true);
  const [appStats, setAppStats] = useState(false);
  const [prayerNotifications, setPrayerNotifications] = useState(true);

  return (
    <div className="settings-page">
      <div className="settings-header">
        <button className="back-btn" onClick={onBack} aria-label="back">
          <ChevronLeft size={24} />
        </button>
        <h2>الإعدادات</h2>
      </div>

      <div className="settings-section">
        <div className="section-title">الإشعارات</div>
        <div className="setting-row clickable" onClick={onOpenAdhkar}>
          <div className="setting-text">
            <div className="label-ar">تذكير دعاء من اليوم</div>
            <div className="sub-ar">يومياً في 10:13 ص</div>
          </div>
          <ChevronLeft size={20} />
        </div>
        <Toggle labelAr="جمعة تذكير" subAr="يوم الجمعة في 10:00 ص" value={fridayReminder} onChange={setFridayReminder} />
      </div>

      <div className="settings-section">
        <div className="section-title">الصلاة</div>
        <div className="setting-row clickable" onClick={onOpenPrayer}>
          <div className="setting-text">
            <div className="label-ar">إشعارات الصلاة</div>
            <div className="sub-ar">عرض أوقات الصلاة</div>
          </div>
          <ChevronLeft size={20} />
        </div>
      </div>

      <div className="settings-section">
        <div className="section-title">التقويم</div>
        <div className="setting-row clickable" onClick={onOpenCalendar}>
          <div className="setting-text">
            <div className="label-ar">التقويم الإسلامي</div>
            <div className="sub-ar">عرض المناسبات الإسلامية</div>
          </div>
          <ChevronLeft size={20} />
        </div>
      </div>

      <div className="settings-section">
        <div className="section-title">الملف الشخصي</div>
        <div className="setting-row clickable">
          <div className="setting-text">
            <div className="label-ar">تسجيل الدخول</div>
          </div>
          <ChevronLeft size={20} />
        </div>
        <Toggle labelAr="إحصائيات تطبيق الأذان" value={appStats} onChange={setAppStats} />
      </div>

      <div className="settings-section">
        <div className="setting-row">
          <div className="setting-text">
            <div className="label-ar">اللغة</div>
            <div className="sub-ar">العربية</div>
          </div>
          <ChevronLeft size={20} />
        </div>
      </div>
    </div>
  );
};

export default Settings;
