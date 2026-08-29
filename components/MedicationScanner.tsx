import React, { useState } from 'react';
import { Pill, Search, ShieldAlert, CheckCircle2, Info, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { chatWithHealthAssistant } from '../services/geminiService';

interface MedicationScannerProps {
  language: SupportedLanguage;
}

export const MedicationScanner: React.FC<MedicationScannerProps> = ({ language }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [medData, setMedData] = useState<string | null>(null);

  const popularMeds = [
    { name: 'Paracetamol / Acetaminophen', use: 'Fever & Mild Pain Relief' },
    { name: 'ORS (Oral Rehydration Salts)', use: 'Diarrhea & Dehydration' },
    { name: 'Amoxicillin', use: 'Bacterial Infection (Antibiotic)' },
    { name: 'Cetirizine', use: 'Allergy, Cold & Itching' },
    { name: 'Metformin', use: 'Type 2 Diabetes Control' },
    { name: 'Antacid / Gelusil', use: 'Acidity & Heartburn' },
  ];

  const handleSearch = async (medName: string = query) => {
    if (!medName.trim() || loading) return;

    setLoading(true);
    setMedData(null);

    const prompt = `Provide plain-language medical information for the medication: "${medName}". 
    Please format clearly into 4 simple sections in ${language.name} (${language.nativeName}):
    1. Primary Uses (What is it for?)
    2. Typical Dosage & How to Take (Before/after food)
    3. Important Precautions & Side Effects
    4. Low-Cost Generic Alternatives / Government Scheme availability.`;

    try {
      const response = await chatWithHealthAssistant(prompt, language.name);
      setMedData(response.text || "Information unavailable.");
    } catch (err) {
      setMedData("Unable to retrieve medicine information right now. Please consult a pharmacist or doctor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-slate-50">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {language.code === 'ta' ? 'மருந்து வழிகாட்டி' : 'Pill & Medication Guide'}
          </h2>
          <p className="text-slate-500 text-sm">
            {language.code === 'ta' ? 'மருந்துகளின் பயன்பாடு, பக்க விளைவுகள் மற்றும் எடுத்துக்கொள்ளும் முறைகளை அறியவும்.' : 'Search any medicine name to get clear, easy-to-understand usage & safety instructions.'}
          </p>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 max-w-3xl">
        <div className="flex items-center space-x-2">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Pill size={24} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={language.code === 'ta' ? 'மருந்தின் பெயரை உள்ளிடவும் (எ.கா. Paracetamol)...' : 'Type medicine name (e.g. Paracetamol, Amoxicillin)...'}
            className="flex-1 border-none bg-transparent focus:ring-0 text-slate-800 font-medium placeholder:text-slate-400 text-sm md:text-base"
          />
          <button
            onClick={() => handleSearch()}
            disabled={!query.trim() || loading}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
            <span>{language.code === 'ta' ? 'தேடு' : 'Search Info'}</span>
          </button>
        </div>
      </div>

      {/* Quick Select Popular Medicines */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {language.code === 'ta' ? 'அடிக்கடி பயன்படுத்தப்படும் மருந்துகள்:' : 'Common Community Medicines:'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {popularMeds.map((med, idx) => (
            <button
              key={idx}
              onClick={() => { setQuery(med.name); handleSearch(med.name); }}
              className="bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 p-3 rounded-2xl text-left transition-all group"
            >
              <div className="font-bold text-xs text-slate-800 group-hover:text-emerald-700 truncate">{med.name}</div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">{med.use}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Results Display */}
      {medData && (
        <div className="bg-white border border-emerald-100 p-6 rounded-3xl shadow-md space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2 text-emerald-700 font-bold text-base">
              <Sparkles size={20} className="text-emerald-600" />
              <span>Medical Information Guide</span>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
              Verified Triage Data
            </span>
          </div>

          <div className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-medium">
            {medData}
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start space-x-3 text-amber-900 text-xs">
            <AlertCircle size={18} className="shrink-0 text-amber-600 mt-0.5" />
            <p>
              Always verify dosages with a qualified doctor or pharmacist. Never double dose or take unprescribed antibiotics.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationScanner;
