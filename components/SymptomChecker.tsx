import React, { useState } from 'react';
import { Activity, ShieldAlert, AlertTriangle, CheckCircle2, RotateCcw, ChevronRight, Phone, Stethoscope } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { t } from '../translations';

interface SymptomCheckerProps {
  language: SupportedLanguage;
}

export const SymptomChecker: React.FC<SymptomCheckerProps> = ({ language }) => {
  const lang = language.code;
  const isTa = lang === 'ta';

  const [step, setStep] = useState<number>(1);
  const [selectedBodyArea, setSelectedBodyArea] = useState<string>('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState<string>('Less than 24h');
  const [hasRedFlags, setHasRedFlags] = useState<boolean | null>(null);
  const [result, setResult] = useState<{
    riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
    title: string;
    action: string;
    color: string;
  } | null>(null);

  const bodyAreas = [
    { id: 'head', nameEn: 'Head, Eyes & Throat', nameTa: 'தலை, கண் & தொண்டை', icon: '🧠' },
    { id: 'chest', nameEn: 'Chest, Heart & Lungs', nameTa: 'நெஞ்சு, இதயம் & நுரையீரல்', icon: '🫀' },
    { id: 'stomach', nameEn: 'Stomach & Abdomen', nameTa: 'வயிறு & சீரணம்', icon: '🫁' },
    { id: 'limbs', nameEn: 'Limbs, Arms & Legs', nameTa: 'கைகள், கால்கள் & மூட்டுகள்', icon: '🦴' },
    { id: 'skin', nameEn: 'Skin & Rashes', nameTa: 'தோல் & தடிப்பு', icon: '🩹' },
    { id: 'general', nameEn: 'Fever, Body Pain & Fatigue', nameTa: 'காய்ச்சல், சோர்வு & உடல் வலி', icon: '🌡️' },
  ];

  const symptomMap: Record<string, { en: string; ta: string }[]> = {
    head: [
      { en: 'Severe Headache', ta: 'கடுமையான தலைவலி' },
      { en: 'Dizziness / Vertigo', ta: 'தலைச்சுற்றல்' },
      { en: 'Sore Throat', ta: 'தொண்டை வலி' },
      { en: 'High Fever (>102°F)', ta: 'அதிக காய்ச்சல் (>102°F)' },
      { en: 'Blurred Vision', ta: 'மங்கலான பார்வை' },
    ],
    chest: [
      { en: 'Chest Pain / Tightness', ta: 'நெஞ்சு வலி / அழுத்தம்' },
      { en: 'Shortness of Breath', ta: 'மூச்சுத்திணறல்' },
      { en: 'Heart Palpitations', ta: 'நெஞ்சு படபடப்பு' },
      { en: 'Persistent Cough', ta: 'தொடர் இருமல்' },
      { en: 'Wheezing', ta: 'மூச்சு இரைச்சல்' },
    ],
    stomach: [
      { en: 'Severe Abdominal Pain', ta: 'கடுமையான வயிற்று வலி' },
      { en: 'Vomiting / Nausea', ta: 'வாந்தி / குமட்டல்' },
      { en: 'Diarrhea / Loose Stools', ta: 'வயிற்றுப்போக்கு' },
      { en: 'Acidity / Heartburn', ta: 'நெஞ்செரிச்சல்' },
      { en: 'Blood in Stool', ta: 'மலத்தில் இரத்தம்' },
    ],
    limbs: [
      { en: 'Joint Swelling & Pain', ta: 'மூட்டு வீக்கம்' },
      { en: 'Inability to Walk', ta: 'நடக்க இயலாமை' },
      { en: 'Muscle Cramps', ta: 'தசை பிடிப்பு' },
      { en: 'Numbness / Tingling', ta: 'மரத்துப்போதல்' },
      { en: 'Possible Bone Fracture', ta: 'எலும்பு முறிவு அபாயம்' },
    ],
    skin: [
      { en: 'Spreading Red Rash', ta: 'பரவும் சிவப்பு தடிப்பு' },
      { en: 'Itching / Hives', ta: 'அரிப்பு / சொறி' },
      { en: 'Blisters / Boils', ta: 'தோல் கொப்பளம் / புண்' },
      { en: 'Insect or Dog Bite', ta: 'பூச்சி / நாய் கடி' },
      { en: 'Infected Wound', ta: 'காயம் தொற்று' },
    ],
    general: [
      { en: 'High Fever & Chills', ta: 'அதிக காய்ச்சல் & குளிர்' },
      { en: 'Extreme Fatigue / Weakness', ta: 'கடுமையான சோர்வு' },
      { en: 'Unexplained Weight Loss', ta: 'காரணமில்லாத எடை இழப்பு' },
      { en: 'Body Aches', ta: 'உடல் வலிகள்' },
      { en: 'Severe Dehydration', ta: 'நீர்ச்சத்து இழப்பு' },
    ],
  };

  const durations = [
    { en: 'Less than 24h', ta: '24 மணி நேரத்திற்குள்' },
    { en: '1-2 days', ta: '1-2 நாட்கள்' },
    { en: '3-7 days', ta: '3-7 நாட்கள்' },
    { en: 'More than 1 week', ta: '1 வாரத்திற்கு மேல்' },
  ];

  const toggleSymptom = (symEn: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symEn) ? prev.filter(s => s !== symEn) : [...prev, symEn]
    );
  };

  const calculateRiskLevel = () => {
    let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' = 'LOW';
    let title = isTa ? 'குறைந்த அபாயம் - வீட்டு பராமரிப்பு' : 'Low Risk Triage — Home Care Suitable';
    let action = isTa ? 'ஓய்வு, போதுமான நீர்ச்சத்து (ORS), அறிகுறிகளை கண்காணிக்கவும். 48 மணி நேரத்தில் சரியாகவில்லை என்றால் PHC செல்லவும்.' : 'Rest, adequate hydration (ORS), and monitor symptoms. If symptoms persist for >48h, visit your local PHC.';
    let color = 'bg-emerald-50 border-emerald-300 text-emerald-900';

    const highRiskKeywords = ['Chest Pain', 'Shortness of Breath', 'Blood in Stool', 'Possible Bone Fracture', 'High Fever (>102°F)'];
    const hasHighRiskSymptom = selectedSymptoms.some(s => highRiskKeywords.some(k => s.includes(k)));

    if (hasRedFlags === true || hasHighRiskSymptom) {
      riskLevel = 'HIGH';
      title = isTa ? 'அவசர மருத்துவ எச்சரிக்கை (உடனடி நடவடிக்கை)' : 'Urgent Emergency Triage Warning';
      action = isTa ? 'உடனடி மருத்துவ உதவி தேவை. SOS பொத்தானை அழுத்தவும் அல்லது 112 / 108 ஆம்புலன்ஸை உடனடியாக அழைக்கவும்.' : 'Immediate clinical evaluation required. Press the SOS button or call 112 / 108 emergency ambulance immediately.';
      color = 'bg-rose-50 border-rose-300 text-rose-900';
    } else if (selectedSymptoms.length >= 3 || duration === 'More than 1 week') {
      riskLevel = 'MODERATE';
      title = isTa ? 'மருத்துவ ஆலோசனை பரிந்துரைக்கப்படுகிறது' : 'Moderate Clinical Risk — Physician Consultation Advised';
      action = isTa ? 'ஆரம்ப சுகாதார நிலையத்திற்கு (PHC) செல்லவும் அல்லது 24 மணி நேரத்திற்குள் நேரடி மருத்துவரை அழைக்கவும் (104).' : 'Visit your nearest Primary Health Centre (PHC) or connect with a duty doctor via 104 helpline within 24 hours.';
      color = 'bg-amber-50 border-amber-300 text-amber-900';
    }

    setResult({ riskLevel, title, action, color });
    setStep(3);
  };

  const resetAll = () => {
    setStep(1);
    setSelectedBodyArea('');
    setSelectedSymptoms([]);
    setDuration('Less than 24h');
    setHasRedFlags(null);
    setResult(null);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-slate-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {t(lang, 'sym.title')}
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {t(lang, 'sym.subtitle')}
          </p>
        </div>
        <button
          onClick={resetAll}
          className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-3 py-2 rounded-xl transition-colors min-h-[38px]"
        >
          <RotateCcw size={14} />
          <span>{t(lang, 'sym.reset')}</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-emerald-600 h-full transition-all duration-300"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      {/* Step 1: Body Area */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in">
          <h3 className="font-bold text-slate-800 text-base">{t(lang, 'sym.step1')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {bodyAreas.map((area) => (
              <button
                key={area.id}
                onClick={() => { setSelectedBodyArea(area.id); setStep(2); }}
                className={`p-5 rounded-3xl border-2 text-left flex flex-col justify-between transition-all group ${
                  selectedBodyArea === area.id 
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-md' 
                    : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50'
                }`}
              >
                <span className="text-3xl mb-3">{area.icon}</span>
                <div>
                  <span className="font-bold text-slate-800 text-sm group-hover:text-emerald-700 transition-colors block">
                    {isTa ? area.nameTa : area.nameEn}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Specific Symptoms & Red Flags */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-base">{t(lang, 'sym.step2.title')}</h3>
            <button onClick={() => setStep(1)} className="text-xs font-bold text-emerald-600 hover:underline">
              {t(lang, 'sym.step2.change')}
            </button>
          </div>

          {/* Symptom list checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(symptomMap[selectedBodyArea] || []).map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom.en);
              return (
                <button
                  key={symptom.en}
                  onClick={() => toggleSymptom(symptom.en)}
                  className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    isSelected 
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-sm' 
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs font-semibold">{isTa ? symptom.ta : symptom.en}</span>
                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'}`}>
                    {isSelected && <CheckCircle2 size={14} />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Duration Selector */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              {t(lang, 'sym.duration')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {durations.map((dur) => (
                <button
                  key={dur.en}
                  onClick={() => setDuration(dur.en)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    duration === dur.en
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {isTa ? dur.ta : dur.en}
                </button>
              ))}
            </div>
          </div>

          {/* Red Flag Warning Prompt */}
          <div className="bg-rose-50 border border-rose-200 p-5 rounded-3xl space-y-3">
            <div className="flex items-center space-x-2 text-rose-800 font-bold text-sm">
              <AlertTriangle size={18} className="text-rose-600 shrink-0" />
              <span>{t(lang, 'sym.redflag')}</span>
            </div>
            <p className="text-xs text-rose-700 leading-relaxed font-medium">
              {t(lang, 'sym.redflag.desc')}
            </p>
            <div className="flex space-x-3 pt-1">
              <button
                onClick={() => setHasRedFlags(true)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${
                  hasRedFlags === true ? 'bg-rose-600 text-white ring-4 ring-rose-200 shadow-md' : 'bg-white text-rose-700 border border-rose-300'
                }`}
              >
                {t(lang, 'sym.redflag.yes')}
              </button>
              <button
                onClick={() => setHasRedFlags(false)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${
                  hasRedFlags === false ? 'bg-slate-700 text-white ring-4 ring-slate-200 shadow-md' : 'bg-white text-slate-700 border border-slate-300'
                }`}
              >
                {t(lang, 'sym.redflag.no')}
              </button>
            </div>
          </div>

          <button
            onClick={calculateRiskLevel}
            disabled={selectedSymptoms.length === 0 && hasRedFlags === null}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-extrabold text-sm shadow-lg transition-all flex items-center justify-center space-x-2 min-h-[48px]"
          >
            <span>{t(lang, 'sym.view.result')}</span>
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Step 3: Result Card */}
      {step === 3 && result && (
        <div className="space-y-6 animate-in fade-in">
          <div className={`p-6 rounded-3xl border-2 space-y-4 shadow-md ${result.color}`}>
            <div className="flex items-center space-x-3">
              {result.riskLevel === 'HIGH' ? <ShieldAlert size={32} className="text-rose-600 shrink-0" /> : <Activity size={32} className="text-emerald-600 shrink-0" />}
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider opacity-75">{isTa ? 'மருத்துவ பரிசோதனை மதிப்பீடு' : 'Triage Assessment'}</span>
                <h3 className="text-lg font-black leading-tight">{result.title}</h3>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl space-y-2 border border-black/5">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">{t(lang, 'sym.action.label')}</h4>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">{result.action}</p>
            </div>

            {/* Summary */}
            <div className="text-xs space-y-1 opacity-90 pt-1">
              <p><strong>{t(lang, 'sym.summary.symptoms')}</strong> {selectedSymptoms.length > 0 ? selectedSymptoms.join(', ') : t(lang, 'common.no.none')}</p>
              <p><strong>{t(lang, 'sym.summary.duration')}</strong> {duration}</p>
              <p><strong>{t(lang, 'sym.summary.flags')}</strong> {hasRedFlags ? t(lang, 'common.yes') : 'NO'}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="tel:104"
              className="flex-1 flex items-center justify-center space-x-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-md transition-all min-h-[44px]"
            >
              <Phone size={16} />
              <span>{t(lang, 'sym.call')}</span>
            </a>
            <button
              onClick={resetAll}
              className="flex-1 py-3.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-2xl text-xs font-bold transition-all min-h-[44px]"
            >
              {t(lang, 'sym.startover')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
