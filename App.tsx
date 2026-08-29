import React, { useState, useEffect } from 'react';
import { AppMode, SupportedLanguage } from './types';
import { LANGUAGES, APP_NAME } from './constants';
import { t } from './translations';
import ChatInterface from './components/ChatInterface';
import VoiceInterface from './components/VoiceInterface';
import LocationService from './components/LocationService';
import MedicationScanner from './components/MedicationScanner';
import SymptomChecker from './components/SymptomChecker';
import FirstAidGuide from './components/FirstAidGuide';
import ImmunizationTracker from './components/ImmunizationTracker';
import GovernmentSchemes from './components/GovernmentSchemes';
import BloodBank from './components/BloodBank';
import SOSEmergencyModal from './components/SOSEmergencyModal';
import LiveDoctorModal from './components/LiveDoctorModal';
import { 
  MessageSquare, Mic, MapPin, Globe, AlertCircle, Menu, X,
  HeartPulse, Siren, Stethoscope, Radio, Pill, ShieldAlert, Baby, Activity, Building2, Droplets
} from 'lucide-react';


const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.CHAT);
  const [language, setLanguage] = useState<SupportedLanguage>(LANGUAGES[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isLiveDoctorOpen, setIsLiveDoctorOpen] = useState(false);

  const lang = language.code;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn("Geolocation warning:", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-emerald-700 text-white shadow-md z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={toggleSidebar} className="md:hidden p-2 hover:bg-emerald-800 rounded-full transition-colors">
              <Menu size={24} />
            </button>
            <div className="bg-white p-1.5 rounded-xl shadow-inner">
              <HeartPulse className="text-emerald-600" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">{APP_NAME}</h1>
              <p className="text-[10px] opacity-90 mt-0.5 uppercase tracking-wider font-semibold">{t(lang, 'header.subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsSosOpen(true)}
              className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white px-3.5 py-1.5 rounded-xl text-xs font-black shadow-lg transition-all animate-pulse border border-rose-400/40"
            >
              <Siren size={16} className="text-white shrink-0" />
              <span className="uppercase tracking-wider">SOS</span>
            </button>

            <button
              onClick={() => setIsLiveDoctorOpen(true)}
              className="hidden sm:flex items-center space-x-1 px-3 py-1.5 bg-emerald-800/60 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold border border-emerald-500/40 transition-colors"
            >
              <Stethoscope size={15} />
              <span>{t(lang, 'header.doctor')}</span>
            </button>

            <div className="relative group">
              <button className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-800/60 rounded-xl hover:bg-emerald-800 transition-colors text-xs font-medium border border-emerald-500/30">
                <Globe size={15} />
                <span>{language.nativeName}</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-52 bg-white text-slate-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-slate-100 py-2">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l)}
                    className={`w-full text-left px-4 py-2 hover:bg-emerald-50 flex items-center justify-between text-xs ${language.code === l.code ? 'text-emerald-600 font-bold bg-emerald-50/50' : ''}`}
                  >
                    <span>{l.nativeName} ({l.name})</span>
                    <span className="text-[10px] text-slate-400 uppercase">{l.code}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Navigation */}
        <nav className={`fixed md:relative inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}>
          <div className="p-4 space-y-1.5 overflow-y-auto flex-1">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">{t(lang, 'nav.services')}</h2>
            <NavButton active={mode === AppMode.CHAT} onClick={() => { setMode(AppMode.CHAT); setIsSidebarOpen(false); }} icon={<MessageSquare size={18} />} label={t(lang, 'nav.chat')} description={t(lang, 'nav.chat.desc')} />
            <NavButton active={mode === AppMode.VOICE} onClick={() => { setMode(AppMode.VOICE); setIsSidebarOpen(false); }} icon={<Mic size={18} />} label={t(lang, 'nav.voice')} description={t(lang, 'nav.voice.desc')} />
            <NavButton active={mode === AppMode.LOCATOR} onClick={() => { setMode(AppMode.LOCATOR); setIsSidebarOpen(false); }} icon={<MapPin size={18} />} label={t(lang, 'nav.locator')} description={t(lang, 'nav.locator.desc')} />
            <NavButton active={mode === AppMode.MEDICINE} onClick={() => { setMode(AppMode.MEDICINE); setIsSidebarOpen(false); }} icon={<Pill size={18} />} label={t(lang, 'nav.medicine')} description={t(lang, 'nav.medicine.desc')} />
            <NavButton active={mode === AppMode.SYMPTOMS} onClick={() => { setMode(AppMode.SYMPTOMS); setIsSidebarOpen(false); }} icon={<Activity size={18} />} label={t(lang, 'nav.symptoms')} description={t(lang, 'nav.symptoms.desc')} />
            <NavButton active={mode === AppMode.FIRST_AID} onClick={() => { setMode(AppMode.FIRST_AID); setIsSidebarOpen(false); }} icon={<ShieldAlert size={18} />} label={t(lang, 'nav.firstaid')} description={t(lang, 'nav.firstaid.desc')} />
            <NavButton active={mode === AppMode.VACCINES} onClick={() => { setMode(AppMode.VACCINES); setIsSidebarOpen(false); }} icon={<Baby size={18} />} label={t(lang, 'nav.vaccines')} description={t(lang, 'nav.vaccines.desc')} />
            <NavButton active={mode === AppMode.GOVT_SCHEMES} onClick={() => { setMode(AppMode.GOVT_SCHEMES); setIsSidebarOpen(false); }} icon={<Building2 size={18} />} label={t(lang, 'nav.schemes')} description={t(lang, 'nav.schemes.desc')} />
            <NavButton active={mode === AppMode.BLOOD_BANK} onClick={() => { setMode(AppMode.BLOOD_BANK); setIsSidebarOpen(false); }} icon={<Droplets size={18} />} label={lang === 'ta' ? 'இரத்த வங்கி போர்டல்' : 'Blood Bank Portal'} description={lang === 'ta' ? 'நேரடி இரத்த கையிருப்பு' : 'Live stock & donor alerts'} />
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2">
            <button
              onClick={() => { setIsSosOpen(true); setIsSidebarOpen(false); }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-md transition-all"
            >
              <Radio size={15} />
              <span>{t(lang, 'nav.sos')}</span>
            </button>
            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
              <p className="text-[10px] text-emerald-800 font-medium leading-relaxed flex items-start space-x-1.5">
                <AlertCircle size={13} className="shrink-0 mt-0.5" />
                <span>{t(lang, 'nav.emergency.msg')}</span>
              </p>
            </div>
          </div>
        </nav>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden" onClick={toggleSidebar} />
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto relative bg-slate-50 flex flex-col">
          {showDisclaimer && (
            <div className="m-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-3 text-amber-800 animate-in fade-in slide-in-from-top-4 duration-500">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-amber-600" />
              <p className="flex-1 text-xs font-medium leading-relaxed">{t(lang, 'disclaimer')}</p>
              <button onClick={() => setShowDisclaimer(false)} className="p-1 hover:bg-amber-100 rounded-lg">
                <X size={14} />
              </button>
            </div>
          )}

          <div className="flex-1 flex flex-col min-h-0">
            {mode === AppMode.CHAT && <ChatInterface language={language} location={location} onOpenLiveDoctor={() => setIsLiveDoctorOpen(true)} />}
            {mode === AppMode.VOICE && <VoiceInterface language={language} />}
            {mode === AppMode.LOCATOR && <LocationService language={language} location={location} />}
            {mode === AppMode.MEDICINE && <MedicationScanner language={language} />}
            {mode === AppMode.SYMPTOMS && <SymptomChecker language={language} />}
            {mode === AppMode.FIRST_AID && <FirstAidGuide language={language} />}
            {mode === AppMode.VACCINES && <ImmunizationTracker language={language} />}
            {mode === AppMode.GOVT_SCHEMES && <GovernmentSchemes language={language} />}
            {mode === AppMode.BLOOD_BANK && <BloodBank language={language} />}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden bg-white border-t border-slate-200 flex items-center justify-around py-2.5 px-3 shadow-lg">
        <MobileNavButton active={mode === AppMode.CHAT} onClick={() => setMode(AppMode.CHAT)} icon={<MessageSquare size={19} />} />
        <MobileNavButton active={mode === AppMode.VOICE} onClick={() => setMode(AppMode.VOICE)} icon={<Mic size={19} />} />
        <MobileNavButton active={mode === AppMode.LOCATOR} onClick={() => setMode(AppMode.LOCATOR)} icon={<MapPin size={19} />} />
        <MobileNavButton active={mode === AppMode.MEDICINE} onClick={() => setMode(AppMode.MEDICINE)} icon={<Pill size={19} />} />
        <MobileNavButton active={mode === AppMode.SYMPTOMS} onClick={() => setMode(AppMode.SYMPTOMS)} icon={<Activity size={19} />} />
        <MobileNavButton active={mode === AppMode.BLOOD_BANK} onClick={() => setMode(AppMode.BLOOD_BANK)} icon={<Droplets size={19} />} />
        <button onClick={() => setIsSosOpen(true)} className="p-2.5 rounded-2xl bg-rose-600 text-white shadow-md">
          <Siren size={19} />
        </button>
      </div>

      {/* Global Modals */}
      <SOSEmergencyModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} location={location} language={language} />
      <LiveDoctorModal isOpen={isLiveDoctorOpen} onClose={() => setIsLiveDoctorOpen(false)} language={language} />
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  description: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label, description }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 p-3 rounded-2xl transition-all duration-200 group text-left ${
      active ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-50' : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    <div className={`p-2 rounded-xl transition-colors ${active ? 'bg-emerald-500' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
      {icon}
    </div>
    <div className="truncate">
      <div className="font-bold text-xs leading-tight truncate">{label}</div>
      <div className={`text-[10px] leading-tight mt-0.5 truncate ${active ? 'text-emerald-100' : 'text-slate-400'}`}>{description}</div>
    </div>
  </button>
);

const MobileNavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode }> = ({ active, onClick, icon }) => (
  <button onClick={onClick} className={`p-2.5 rounded-2xl transition-all ${active ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400'}`}>
    {icon}
  </button>
);

export default App;
