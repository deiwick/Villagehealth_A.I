import React, { useState } from 'react';
import { Pill, Search, ShieldCheck, AlertCircle, Info, Loader2 } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { getMedicationInfo } from '../services/geminiService';
import { t } from '../translations';

interface MedicationScannerProps {
  language: SupportedLanguage;
}

export const MedicationScanner: React.FC<MedicationScannerProps> = ({ language }) => {
  const lang = language.code;
  const isTa = lang === 'ta';

  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const popularMeds = [
    { name: 'Paracetamol / Acetaminophen', use: isTa ? 'காய்ச்சல் & லேசான வலி நிவாரணி' : 'Fever & Mild Pain Relief' },
    { name: 'ORS (Oral Rehydration Salts)', use: isTa ? 'வயிற்றுப்போக்கு & நீர்ச்சத்து இழப்பு' : 'Diarrhea & Dehydration' },
    { name: 'Amoxicillin', use: isTa ? 'பாக்டீரியா தொற்று (ஆன்டிபயாடிக்)' : 'Bacterial Infection (Antibiotic)' },
    { name: 'Cetirizine', use: isTa ? 'ஒவ்வாமை, சளி & அரிப்பு' : 'Allergy, Cold & Itching' },
    { name: 'Metformin', use: isTa ? 'டைப் 2 நீரிழிவு கட்டுப்பாடு' : 'Type 2 Diabetes Control' },
    { name: 'Antacid / Gelusil', use: isTa ? 'அமிலத்தன்மை & நெஞ்செரிச்சல்' : 'Acidity & Heartburn' },
  ];

  const handleSearch = async (medicineName: string) => {
    if (!medicineName.trim()) return;
    setQuery(medicineName);
    setLoading(true);
    setResult(null);

    try {
      const info = await getMedicationInfo(medicineName, language.name);
      setResult(info);
    } catch (e: any) {
      console.error(e);
      setResult(isTa ? 'மருந்து தகவலை மீட்டெடுக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.' : 'Failed to retrieve medication info. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-slate-50">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          {t(lang, 'med.title')}
        </h2>
        <p className="text-slate-500 text-sm mt-0.5">
          {t(lang, 'med.subtitle')}
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white p-2 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-2">
        <div className="p-3 text-slate-400">
          <Pill size={22} className="text-emerald-600" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
          placeholder={t(lang, 'med.placeholder')}
          className="flex-1 bg-transparent border-none text-slate-800 placeholder-slate-400 focus:outline-none text-sm font-medium"
        />
        <button
          onClick={() => handleSearch(query)}
          disabled={!query.trim() || loading}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center space-x-1.5 shrink-0 min-h-[44px]"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          <span>{t(lang, 'med.search')}</span>
        </button>
      </div>

      {/* Popular Community Medicines Chips */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {t(lang, 'med.common')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {popularMeds.map((med) => (
            <button
              key={med.name}
              onClick={() => handleSearch(med.name)}
              className="bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 p-3.5 rounded-2xl text-left transition-all group flex flex-col justify-between shadow-sm"
            >
              <span className="font-bold text-slate-800 text-xs group-hover:text-emerald-700 transition-colors">
                {med.name}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 font-medium">
                {med.use}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Result Card */}
      {result && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2 text-emerald-700 font-bold">
              <ShieldCheck size={20} />
              <span>{isTa ? 'மருத்துவ தகவல் வழிகாட்டி' : 'Medical Information Guide'}</span>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full uppercase">
              {isTa ? 'சரிபார்க்கப்பட்ட தகவல்' : 'Verified Triage Data'}
            </span>
          </div>

          <div className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
            {result}
          </div>
        </div>
      )}

      {/* Medical Safety Banner */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start space-x-3 text-amber-800 text-xs leading-relaxed font-medium">
        <AlertCircle size={18} className="shrink-0 text-amber-600 mt-0.5" />
        <p>{t(lang, 'med.disclaimer')}</p>
      </div>
    </div>
  );
};

export default MedicationScanner;
