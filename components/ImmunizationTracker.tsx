import React, { useState } from 'react';
import { Baby, Calendar, CheckCircle2, Circle, ShieldCheck, Info } from 'lucide-react';
import { SupportedLanguage } from '../types';

interface ImmunizationTrackerProps {
  language: SupportedLanguage;
}

export const ImmunizationTracker: React.FC<ImmunizationTrackerProps> = ({ language }) => {
  const [completedVaccines, setCompletedVaccines] = useState<string[]>(['bcg', 'opv-0', 'hepb-0']);

  const vaccineSchedule = [
    {
      ageGroup: 'At Birth',
      vaccines: [
        { id: 'bcg', name: 'BCG', protects: 'Tuberculosis (TB)', dose: 'Single dose' },
        { id: 'opv-0', name: 'OPV 0', protects: 'Polio', dose: 'Oral drops' },
        { id: 'hepb-0', name: 'Hepatitis B Birth Dose', protects: 'Hepatitis B Liver Infection', dose: 'Injection' },
      ]
    },
    {
      ageGroup: '6 Weeks (1.5 Months)',
      vaccines: [
        { id: 'opv-1', name: 'OPV 1 & Pentavalent 1', protects: 'Diphtheria, Pertussis, Tetanus, Hep B, Hib', dose: 'Drops & Inj' },
        { id: 'rota-1', name: 'Rotavirus 1', protects: 'Rotavirus Diarrhea', dose: 'Oral drops' },
        { id: 'fipv-1', name: 'fIPV 1', protects: 'Inactivated Polio', dose: 'Intradermal' },
      ]
    },
    {
      ageGroup: '10 Weeks (2.5 Months)',
      vaccines: [
        { id: 'opv-2', name: 'OPV 2 & Pentavalent 2', protects: 'DPT, Hep B, Hib Booster', dose: 'Drops & Inj' },
        { id: 'rota-2', name: 'Rotavirus 2', protects: 'Severe Diarrhea', dose: 'Oral drops' },
      ]
    },
    {
      ageGroup: '14 Weeks (3.5 Months)',
      vaccines: [
        { id: 'opv-3', name: 'OPV 3 & Pentavalent 3', protects: '5-in-1 Protection', dose: 'Drops & Inj' },
        { id: 'fipv-2', name: 'fIPV 2 & Rota 3', protects: 'Polio & Rotavirus Complete', dose: 'Drops & Inj' },
      ]
    },
    {
      ageGroup: '9 Months Completed',
      vaccines: [
        { id: 'mr-1', name: 'MR 1st Dose', protects: 'Measles & Rubella', dose: 'Subcutaneous Inj' },
        { id: 'je-1', name: 'JE 1st Dose', protects: 'Japanese Encephalitis (Brain Fever)', dose: 'Selective Districts' },
        { id: 'vita-1', name: 'Vitamin A (1st Dose)', protects: 'Night Blindness & Immunity', dose: 'Oral Liquid' },
      ]
    },
    {
      ageGroup: '16-24 Months',
      vaccines: [
        { id: 'mr-2', name: 'MR 2nd Dose & DPT Booster 1', protects: 'Measles, Rubella, DPT Booster', dose: 'Injection' },
        { id: 'opv-b', name: 'OPV Booster', protects: 'Polio Lifetime Protection', dose: 'Oral Drops' },
      ]
    }
  ];

  const toggleVaccine = (id: string) => {
    setCompletedVaccines(prev => 
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const totalVaccines = vaccineSchedule.reduce((acc, curr) => acc + curr.vaccines.length, 0);
  const progressPct = Math.round((completedVaccines.length / totalVaccines) * 100);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-slate-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <Baby size={28} className="text-emerald-600 mr-2" />
            {language.code === 'ta' ? 'குழந்தை தடுப்பூசி அட்டவணை' : 'Child Immunization & Vaccine Tracker'}
          </h2>
          <p className="text-slate-500 text-sm">
            {language.code === 'ta' ? 'தேசிய தடுப்பூசி அட்டவணையைக் கண்காணித்து குழந்தையைப் பாதுகாக்கவும்.' : 'Track national Essential Immunization Schedule from birth through 2 years.'}
          </p>
        </div>

        {/* Progress Badge */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-400 uppercase">Protection Level</div>
            <div className="text-xl font-extrabold text-emerald-600">{completedVaccines.length} / {totalVaccines} Done ({progressPct}%)</div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-emerald-600 flex items-center justify-center font-bold text-xs text-emerald-700 bg-emerald-50">
            {progressPct}%
          </div>
        </div>
      </div>

      {/* Vaccine Timeline Schedule */}
      <div className="space-y-6">
        {vaccineSchedule.map((group, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-emerald-800 font-extrabold text-sm border-b border-slate-100 pb-2">
              <Calendar size={18} className="text-emerald-600" />
              <span>{group.ageGroup}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {group.vaccines.map((vac) => {
                const isDone = completedVaccines.includes(vac.id);
                return (
                  <button
                    key={vac.id}
                    onClick={() => toggleVaccine(vac.id)}
                    className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all ${
                      isDone
                        ? 'border-emerald-600 bg-emerald-50/60 shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-xs text-slate-800">{vac.name}</span>
                      {isDone ? (
                        <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                      ) : (
                        <Circle size={18} className="text-slate-300 shrink-0" />
                      )}
                    </div>
                    
                    <div className="mt-2 text-[11px] text-slate-500">
                      <p><b>Protects against:</b> {vac.protects}</p>
                      <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">{vac.dose}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImmunizationTracker;
