import React, { useState } from 'react';
import { Stethoscope, AlertTriangle, CheckCircle2, Siren, ArrowRight, RotateCcw, ShieldCheck, HeartPulse, Activity } from 'lucide-react';
import { SupportedLanguage } from '../types';

interface SymptomCheckerProps {
  language: SupportedLanguage;
}

export const SymptomChecker: React.FC<SymptomCheckerProps> = ({ language }) => {
  const [step, setStep] = useState(1);
  const [selectedBodyArea, setSelectedBodyArea] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState<string>('1-2 days');
  const [hasRedFlags, setHasRedFlags] = useState<boolean>(false);

  const bodyAreas = [
    { id: 'head', name: 'Head, Eyes & Throat', icon: '🧠' },
    { id: 'chest', name: 'Chest, Heart & Lungs', icon: '🫀' },
    { id: 'stomach', name: 'Stomach & Digestion', icon: '🩸' },
    { id: 'limbs', name: 'Arms, Legs & Joints', icon: '🦴' },
    { id: 'skin', name: 'Skin & Rash', icon: '🩹' },
    { id: 'general', name: 'Fever, Fatigue & Body Pain', icon: '🤒' },
  ];

  const symptomMap: Record<string, string[]> = {
    head: ['Severe Headache', 'Dizziness', 'Sore Throat', 'High Fever (>102°F)', 'Blurred Vision'],
    chest: ['Chest Pain or Pressure', 'Shortness of Breath', 'Palpitations', 'Persistent Cough', 'Wheezing'],
    stomach: ['Severe Abdominal Pain', 'Vomiting / Nausea', 'Diarrhea / Loose Stools', 'Acid Reflux', 'Blood in Stool'],
    limbs: ['Joint Swelling', 'Inability to Walk', 'Muscle Cramps', 'Numbness / Tingling', 'Bone Fracture Risk'],
    skin: ['Spreading Red Rash', 'Itching / Hives', 'Skin Blisters / Ulcers', 'Insect / Dog Bite', 'Wound Infection'],
    general: ['High Fever & Chills', 'Extreme Fatigue', 'Unexplained Weight Loss', 'Body Aches', 'Dehydration'],
  };

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]
    );
  };

  const calculateRiskLevel = () => {
    const isChestEmergency = selectedBodyArea === 'chest' && (selectedSymptoms.includes('Chest Pain or Pressure') || selectedSymptoms.includes('Shortness of Breath'));
    const isHighFever = selectedSymptoms.includes('High Fever (>102°F)') && selectedSymptoms.includes('Severe Abdominal Pain');
    
    if (isChestEmergency || hasRedFlags || selectedSymptoms.includes('Inability to Walk')) {
      return {
        level: 'HIGH_RISK_EMERGENCY',
        title: 'Urgent Emergency Triage Warning',
        color: 'bg-rose-50 border-rose-200 text-rose-900',
        badge: 'bg-rose-600 text-white',
        icon: <Siren size={28} className="text-rose-600 shrink-0 animate-pulse" />,
        action: 'Immediate action required. Please tap the SOS Satellite button or call emergency 112 / 108 immediately.'
      };
    }

    if (selectedSymptoms.length >= 2 || duration === 'More than 1 week') {
      return {
        level: 'MODERATE_RISK',
        title: 'Medical Consultation Recommended',
        color: 'bg-amber-50 border-amber-200 text-amber-900',
        badge: 'bg-amber-500 text-white',
        icon: <AlertTriangle size={28} className="text-amber-600 shrink-0" />,
        action: 'Visit a Primary Health Center (PHC) or consult a duty doctor via the Live Doctor hotline (104) within 24 hours.'
      };
    }

    return {
      level: 'LOW_RISK',
      title: 'Low Risk - Primary Home Care',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      badge: 'bg-emerald-600 text-white',
      icon: <CheckCircle2 size={28} className="text-emerald-600 shrink-0" />,
      action: 'Rest, maintain adequate hydration (ORS), monitor symptoms, and use mild supportive home care.'
    };
  };

  const resetAll = () => {
    setStep(1);
    setSelectedBodyArea(null);
    setSelectedSymptoms([]);
    setDuration('1-2 days');
    setHasRedFlags(false);
  };

  const risk = calculateRiskLevel();

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-slate-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {language.code === 'ta' ? 'அறிகுறி பரிசோதனை' : 'Interactive Symptom Triage'}
          </h2>
          <p className="text-slate-500 text-sm">
            {language.code === 'ta' ? 'உங்கள் உடல்நல அறிகுறிகளைத் தேர்ந்தெடுத்து உடனடி வழிகாட்டுதலைப் பெறுங்கள்.' : 'Select symptoms to calculate medical risk level and recommended next steps.'}
          </p>
        </div>
        <button
          onClick={resetAll}
          className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-3 py-2 rounded-xl transition-colors"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
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
          <h3 className="font-bold text-slate-800 text-base">Step 1: Select Affected Area</h3>
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
                <span className="font-bold text-sm text-slate-800 group-hover:text-emerald-700">{area.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Specific Symptoms & Duration */}
      {step === 2 && selectedBodyArea && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-base">Step 2: Check Specific Symptoms</h3>
            <button onClick={() => setStep(1)} className="text-xs text-emerald-700 font-bold hover:underline">
              ← Change Area
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(symptomMap[selectedBodyArea] || []).map((sym, idx) => (
              <button
                key={idx}
                onClick={() => toggleSymptom(sym)}
                className={`p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                  selectedSymptoms.includes(sym)
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="text-xs md:text-sm">{sym}</span>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${selectedSymptoms.includes(sym) ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'}`}>
                  {selectedSymptoms.includes(sym) && <CheckCircle2 size={14} />}
                </div>
              </button>
            ))}
          </div>

          {/* Duration Selector */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Symptom Duration:</label>
            <div className="flex space-x-2">
              {['Less than 24h', '1-2 days', '3-7 days', 'More than 1 week'].map((dur) => (
                <button
                  key={dur}
                  onClick={() => setDuration(dur)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                    duration === dur 
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {dur}
                </button>
              ))}
            </div>
          </div>

          {/* Red Flag Warning Toggle */}
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3 text-rose-900 text-xs">
              <AlertTriangle size={20} className="text-rose-600 shrink-0" />
              <div>
                <p className="font-bold">Any sudden severe red-flag symptoms?</p>
                <p className="text-[11px] opacity-90">Chest pain, sudden confusion, difficulty breathing, or severe fainting.</p>
              </div>
            </div>
            <button
              onClick={() => setHasRedFlags(!hasRedFlags)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                hasRedFlags ? 'bg-rose-600 text-white' : 'bg-white text-rose-700 border border-rose-300'
              }`}
            >
              {hasRedFlags ? 'YES (Critical)' : 'NO'}
            </button>
          </div>

          <button
            onClick={() => setStep(3)}
            disabled={selectedSymptoms.length === 0 && !hasRedFlags}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <span>View Clinical Risk Assessment</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Step 3: Triage Result */}
      {step === 3 && (
        <div className={`p-6 rounded-3xl border-2 space-y-6 animate-in fade-in ${risk.color}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              {risk.icon}
              <div>
                <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full ${risk.badge}`}>
                  {risk.level.replace('_', ' ')}
                </span>
                <h3 className="font-extrabold text-xl mt-2">{risk.title}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl space-y-2 text-slate-800 text-xs">
            <p className="font-bold text-slate-500 uppercase tracking-wider">Summary of Selected Parameters:</p>
            <p>● <b>Symptoms:</b> {selectedSymptoms.join(', ') || 'None selected'}</p>
            <p>● <b>Duration:</b> {duration}</p>
            <p>● <b>Emergency Flags:</b> {hasRedFlags ? 'YES' : 'None reported'}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl space-y-2 border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm flex items-center">
              <ShieldCheck size={18} className="text-emerald-600 mr-2" /> Recommended Clinical Action
            </h4>
            <p className="text-slate-700 text-xs leading-relaxed font-medium">
              {risk.action}
            </p>
          </div>

          <div className="flex space-x-3 pt-2">
            <a
              href="tel:104"
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs text-center shadow-md transition-all"
            >
              Call Live Health Line (104)
            </a>
            <button
              onClick={resetAll}
              className="py-3 px-6 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl font-bold text-xs transition-all"
            >
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
