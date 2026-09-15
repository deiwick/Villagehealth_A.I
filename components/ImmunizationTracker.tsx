import React, { useState } from 'react';
import { Baby, CheckCircle2, Circle, ShieldCheck, AlertCircle } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { t } from '../translations';

interface ImmunizationTrackerProps {
  language: SupportedLanguage;
}

interface VaccineItem {
  id: string;
  ageGroupEn: string;
  ageGroupTa: string;
  name: string;
  protectsEn: string;
  protectsTa: string;
  doseEn: string;
  doseTa: string;
}

export const ImmunizationTracker: React.FC<ImmunizationTrackerProps> = ({ language }) => {
  const lang = language.code;
  const isTa = lang === 'ta';

  const schedule: VaccineItem[] = [
    {
      id: 'v1',
      ageGroupEn: 'At Birth',
      ageGroupTa: 'பிறந்தவுடன்',
      name: 'BCG, OPV-0, Hepatitis B',
      protectsEn: 'Tuberculosis (TB), Polio & Liver Infection',
      protectsTa: 'காச நோய் (TB), போலியோ & கல்லீரல் தொற்று',
      doseEn: 'Single dose & oral drops',
      doseTa: 'ஒற்றை அளவு & சொட்டு மருந்து',
    },
    {
      id: 'v2',
      ageGroupEn: '6 Weeks (1.5 Months)',
      ageGroupTa: '6 வாரங்கள் (1.5 மாதங்கள்)',
      name: 'Pentavalent-1, OPV-1, RVV-1, fIPV-1',
      protectsEn: 'Diphtheria, Pertussis, Tetanus, Hep B, Hib, Polio & Diarrhea',
      protectsTa: 'டிப்தீரியா, கக்குவான் இருமல், டெட்டனஸ், Hep B, Hib, போலியோ & ரோட்டாவைரஸ்',
      doseEn: 'Injection & drops',
      doseTa: 'ஊசி & சொட்டு மருந்து',
    },
    {
      id: 'v3',
      ageGroupEn: '10 Weeks (2.5 Months)',
      ageGroupTa: '10 வாரங்கள் (2.5 மாதங்கள்)',
      name: 'Pentavalent-2, OPV-2, RVV-2',
      protectsEn: 'Diphtheria, Tetanus, Hep B, Hib & Rotavirus Diarrhea',
      protectsTa: 'டிப்தீரியா, டெட்டனஸ், Hep B, Hib & ரோட்டாவைரஸ் வயிற்றுப்போக்கு',
      doseEn: 'Injection & drops',
      doseTa: 'ஊசி & சொட்டு மருந்து',
    },
    {
      id: 'v4',
      ageGroupEn: '14 Weeks (3.5 Months)',
      ageGroupTa: '14 வாரங்கள் (3.5 மாதங்கள்)',
      name: 'Pentavalent-3, OPV-3, RVV-3, fIPV-2',
      protectsEn: 'Complete 5-in-1 Primary Protection & Polio Booster',
      protectsTa: 'முழுமையான 5-இன்-1 பாதுகாப்பு & போலியோ பூஸ்டர்',
      doseEn: 'Injection & drops',
      doseTa: 'ஊசி & சொட்டு மருந்து',
    },
    {
      id: 'v5',
      ageGroupEn: '9 Months Completed',
      ageGroupTa: '9 மாதங்கள் பூர்த்தியானது',
      name: 'MR-1 (Measles & Rubella), JE-1, Vitamin A (Dose 1)',
      protectsEn: 'Measles, Rubella, Brain Fever & Night Blindness',
      protectsTa: 'தட்டம்மை, ருபெல்லா, மூளை காய்ச்சல் & மாலைக்கண் நோய்',
      doseEn: 'Injection & oral liquid',
      doseTa: 'ஊசி & வாய்வழி திரவம்',
    },
    {
      id: 'v6',
      ageGroupEn: '16-24 Months',
      ageGroupTa: '16-24 மாதங்கள்',
      name: 'MR-2, DPT Booster-1, OPV Booster, JE-2',
      protectsEn: 'Long-term immunity for Measles, Rubella & Diphtheria',
      protectsTa: 'தட்டம்மை, ருபெல்லா & டிப்தீரியா நீண்டகால நோயெதிர்ப்பு சக்தி',
      doseEn: 'Booster injections',
      doseTa: 'பூஸ்டர் ஊசிகள்',
    },
  ];

  const [completed, setCompleted] = useState<Record<string, boolean>>({
    v1: true,
    v2: true,
  });

  const toggleComplete = (id: string) => {
    setCompleted(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const total = schedule.length;
  const doneCount = Object.values(completed).filter(Boolean).length;
  const progressPercent = Math.round((doneCount / total) * 100);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-slate-50">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          {t(lang, 'vac.title')}
        </h2>
        <p className="text-slate-500 text-sm mt-0.5">
          {t(lang, 'vac.subtitle')}
        </p>
      </div>

      {/* Progress Ring Card */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white p-6 rounded-3xl shadow-md flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-emerald-100 text-xs font-bold uppercase tracking-wider">{t(lang, 'vac.protection')}</span>
          <h3 className="text-3xl font-black">{progressPercent}%</h3>
          <p className="text-emerald-100 text-xs font-medium">
            {doneCount} / {total} {t(lang, 'vac.done')}
          </p>
        </div>
        <div className="w-16 h-16 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center font-black text-lg shadow-inner">
          <Baby size={32} />
        </div>
      </div>

      {/* Vaccine Checklist */}
      <div className="space-y-3">
        {schedule.map((item) => {
          const isDone = !!completed[item.id];
          return (
            <div
              key={item.id}
              onClick={() => toggleComplete(item.id)}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex items-start justify-between group ${
                isDone
                  ? 'border-emerald-200 bg-emerald-50/60 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-emerald-300'
              }`}
            >
              <div className="space-y-1 pr-4">
                <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full uppercase inline-block">
                  {isTa ? item.ageGroupTa : item.ageGroupEn}
                </span>
                <h4 className="font-extrabold text-slate-800 text-sm">{item.name}</h4>
                <p className="text-xs text-slate-600 font-medium">
                  <strong>{isTa ? 'பாதுகாப்பு:' : 'Protects against:'}</strong> {isTa ? item.protectsTa : item.protectsEn}
                </p>
                <p className="text-[11px] text-slate-400">
                  {isTa ? item.doseTa : item.doseEn}
                </p>
              </div>

              <button className={`p-2 rounded-2xl transition-colors shrink-0 mt-1 ${isDone ? 'text-emerald-600' : 'text-slate-300 group-hover:text-emerald-500'}`}>
                {isDone ? <CheckCircle2 size={26} className="fill-emerald-100" /> : <Circle size={26} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImmunizationTracker;
