import React, { useState } from 'react';
import { ShieldAlert, AlertOctagon, Heart, Droplets, Zap, Check, XCircle, AlertTriangle } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { t } from '../translations';

interface FirstAidGuideProps {
  language: SupportedLanguage;
}

export const FirstAidGuide: React.FC<FirstAidGuideProps> = ({ language }) => {
  const lang = language.code;
  const isTa = lang === 'ta';

  const [activeCategory, setActiveCategory] = useState<string>('snakebite');

  const categories = [
    { id: 'snakebite', titleEn: '🐍 Snakebite & Scorpion', titleTa: '🐍 பாம்பு கடி & தேள் கடி', color: 'bg-emerald-600' },
    { id: 'heatstroke', titleEn: '☀️ Heatstroke & ORS', titleTa: '☀️ வெப்பவாதம் & ORS', color: 'bg-amber-600' },
    { id: 'dogbite', titleEn: '🐕 Dog & Animal Bite', titleTa: '🐕 நாய் / விலங்கு கடி', color: 'bg-rose-600' },
    { id: 'burns', titleEn: '🔥 Burns & Scalds', titleTa: '🔥 காயம் & சுட்ட நீர் காயம்', color: 'bg-orange-600' },
    { id: 'cpr', titleEn: '🫀 CPR & Choking', titleTa: '🫀 CPR & மூச்சுத்திணறல்', color: 'bg-blue-600' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-slate-50">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          {t(lang, 'fa.title')}
        </h2>
        <p className="text-slate-500 text-sm mt-0.5">
          {t(lang, 'fa.subtitle')}
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? `${cat.color} text-white shadow-md ring-4 ring-slate-200`
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {isTa ? cat.titleTa : cat.titleEn}
          </button>
        ))}
      </div>

      {/* ── Snakebite Protocol ── */}
      {activeCategory === 'snakebite' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-rose-50 border border-rose-200 p-5 rounded-3xl space-y-2">
            <div className="flex items-center space-x-2 text-rose-800 font-extrabold text-base">
              <ShieldAlert size={22} className="text-rose-600 shrink-0" />
              <span>{isTa ? 'பாம்பு கடி அவசர வழிமுறை (பதற்றாதீர்கள்!)' : 'Snakebite Emergency Protocol (DO NOT PANIC)'}</span>
            </div>
            <p className="text-xs text-rose-900 leading-relaxed font-medium">
              {isTa ? 'நோயாளியை அமைதியாக வைக்கவும். பெரும்பாலான பாம்பு கடிகள் விஷமற்றவை. உடனடியாக Anti-Snake Venom (ASV) உள்ள அரசு மருத்துவமனைக்கு கொண்டு செல்லவும்.' : 'Keep the patient calm and still. Most snakebites are non-venomous, but immediate transport to a hospital with Anti-Snake Venom (ASV) is essential.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-emerald-200 p-5 rounded-3xl space-y-3 shadow-sm">
              <h4 className="font-extrabold text-emerald-700 text-sm uppercase tracking-wider flex items-center">
                <Check size={18} className="mr-1.5" />
                {isTa ? 'உடனடியாக இதை செய்யுங்கள்' : 'DO THIS IMMEDIATELY'}
              </h4>
              <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
                <li>• {isTa ? 'கடிக்கப்பட்ட கை / காலை இதயத்திற்கு கீழே அமைதியாக வைக்கவும்.' : 'Immobilize the bitten limb below heart level.'}</li>
                <li>• {isTa ? 'மோதிரம், வளையல், இறுக்கமான காலணிகளை வீக்கம் வரும் முன் கழற்றவும்.' : 'Remove rings, bangles, and tight shoes before swelling starts.'}</li>
                <li>• {isTa ? 'நோயாளியை அசையாமல் வைத்து உடனடியாக ஆம்புலன்ஸில் கொண்டு செல்லவும்.' : 'Keep the patient completely still to slow venom spread.'}</li>
                <li>• {isTa ? 'பதற்றத்தை குறைக்கவும்—பயம் விஷம் பரவும் வேகத்தை அதிகரிக்கும்.' : 'Reassure the victim—anxiety speeds up heart rate and venom travel.'}</li>
              </ul>
            </div>

            <div className="bg-white border border-rose-200 p-5 rounded-3xl space-y-3 shadow-sm">
              <h4 className="font-extrabold text-rose-700 text-sm uppercase tracking-wider flex items-center">
                <XCircle size={18} className="mr-1.5" />
                {isTa ? 'இதை செய்யாதீர்கள் (ஆபத்தானது)' : 'DO NOT DO THIS (DANGEROUS)'}
              </h4>
              <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
                <li>❌ {isTa ? 'காயத்தை வெட்டாதீர்கள் அல்லது வாயால் விஷத்தை உறிஞ்ச முயற்சிக்காதீர்கள்.' : 'DO NOT cut the bite mark or try to suck venom out.'}</li>
                <li>❌ {isTa ? 'இறுக்கமான கட்டு (Tourniquet) கட்டாதீர்கள் (தசை அழுகலுக்கு காரணமாகும்).' : 'DO NOT apply a tight tourniquet (causes tissue necrosis).'}</li>
                <li>❌ {isTa ? 'பனிக்கட்டி, மூலிகை சாறு அல்லது இரசாயனங்களை போடாதீர்கள்.' : 'DO NOT apply ice, herbs, or chemicals to the wound.'}</li>
                <li>❌ {isTa ? 'காபி, மது அல்லது வலி நிவாரணி மாத்திரைகள் கொடுக்காதீர்கள்.' : 'DO NOT give caffeinated drinks, alcohol, or pain medications.'}</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── Heatstroke / ORS Recipe ── */}
      {activeCategory === 'heatstroke' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl space-y-3">
            <h3 className="font-extrabold text-amber-900 text-base">
              {isTa ? 'வீட்டிலேயே ORS தயாரிக்கும் முறை (WHO சூத்திரம்)' : 'Home ORS (Oral Rehydration Solution) Recipe'}
            </h3>
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              {isTa ? 'வயிற்றுப்போக்கு, வாந்தி அல்லது வெப்ப சோர்வின் போது ORS பாக்கெட் கிடைக்கவில்லை எனில், இந்த WHO சூத்திரத்தை கலக்கவும்:' : 'For diarrhea, vomiting, or heat exhaustion when ORS packets are unavailable, mix this WHO formula:'}
            </p>

            <div className="bg-white p-4 rounded-2xl border border-amber-200 space-y-2 font-mono text-xs text-slate-800">
              <p>💧 <strong>1 லிட்டர்</strong> சுத்தமான குடிநீர் (1 Liter Clean Water)</p>
              <p>🍬 <strong>+ 6 சமதள டீஸ்பூன்</strong> சர்க்கரை (6 Level Teaspoons Sugar - 30g)</p>
              <p>🧂 <strong>+ ½ சமதள டீஸ்பூன்</strong> உப்பு (½ Level Teaspoon Salt - 2.5g)</p>
            </div>
            <p className="text-[11px] text-amber-900 font-bold">
              {isTa ? 'நன்றாக கலக்கவும். நாள் முழுவதும் மெதுவாக பருகவும்.' : 'Stir well until dissolved. Drink slowly throughout the day.'}
            </p>
          </div>
        </div>
      )}

      {/* ── Dog Bite Protocol ── */}
      {activeCategory === 'dogbite' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-rose-50 border border-rose-200 p-5 rounded-3xl space-y-3">
            <h3 className="font-extrabold text-rose-900 text-base">
              {isTa ? 'நாய் / விலங்கு கடி - வெறிநோய் (Rabies) தடுப்பு வழிமுறை' : 'Dog & Animal Bite — Rabies Prevention Protocol'}
            </h3>
            <div className="space-y-2 text-xs text-rose-900 font-medium">
              <p>1. <strong>{isTa ? 'உடனடி காயம் கழுவுதல்:' : '1. Immediate Washing:'}</strong> {isTa ? 'கடியை சோப்புடன் ஓடும் நீரில் குறைந்தது 15 நிமிடங்கள் கழுவவும்.' : 'Wash wound thoroughly with running water and soap for at least 15 minutes.'}</p>
              <p>2. <strong>{isTa ? 'கிருமி நாசினி:' : '2. Antiseptic Application:'}</strong> {isTa ? 'போவிடோன்-அயோடின் (Betadine) அல்லது ஆல்காஹால் தடவவும்.' : 'Apply Povidone-Iodine or alcohol antiseptic.'}</p>
              <p>3. <strong>{isTa ? 'வெறிநோய் தடுப்பூசி (ARV):' : '3. Anti-Rabies Vaccine:'}</strong> {isTa ? 'அருகிலுள்ள PHC/அரசு மருத்துவமனைக்கு செல்லவும். தடுப்பூசி போட்டால் 100% தற்காப்பு.' : 'Visit PHC/hospital immediately for ARV schedule (Days 0, 3, 7, 14, 28).'}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Burns & Scalds ── */}
      {activeCategory === 'burns' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-orange-50 border border-orange-200 p-5 rounded-3xl space-y-2">
            <h3 className="font-extrabold text-orange-900 text-base">
              {isTa ? 'காயம் & சுட்ட நீர் காயம் - உடனடி சிகிச்சை' : 'Burns & Scalds Emergency Care'}
            </h3>
            <ul className="text-xs text-orange-900 space-y-2 leading-relaxed font-medium">
              <li>• <strong>{isTa ? 'குளிர்ந்த நீர்:' : 'Cool Water:'}</strong> {isTa ? 'காயப்பட்ட பகுதியை 10-20 நிமிடங்கள் ஓடும் குளிர்ந்த நீரில் வைக்கவும். பனிக்கட்டி/வெண்ணெய் போடாதீர்கள்.' : 'Run cool water over the burn for 10-20 minutes. Never use ice or butter.'}</li>
              <li>• <strong>{isTa ? 'சுத்தமாக மூடு:' : 'Sterile Covering:'}</strong> {isTa ? 'சுத்தமான துணி / பேன்டேஜ் மூலம் தளர்வாக மூடவும்.' : 'Cover loosely with a clean, dry, non-stick bandage.'}</li>
              <li>• <strong>{isTa ? 'மருத்துவ உதவி:' : 'Seek Help:'}</strong> {isTa ? 'காயம் உள்ளங்கை அளவிற்கு மேல் அல்லது முகம்/கைகளில் இருந்தால், உடனடி மருத்துவ உதவி நாடவும்.' : 'If burn is larger than victim’s palm or on face/hands, seek emergency care.'}</li>
            </ul>
          </div>
        </div>
      )}

      {/* ── CPR Protocol ── */}
      {activeCategory === 'cpr' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-blue-50 border border-blue-200 p-5 rounded-3xl space-y-3">
            <h3 className="font-extrabold text-blue-900 text-base">
              {isTa ? 'கைகளால் மட்டும் CPR (பதிலளிக்காத பெரியவர்களுக்கு)' : 'Hands-Only CPR Protocol'}
            </h3>
            <div className="space-y-2 text-xs text-blue-900 font-medium">
              <p>1. <strong>{isTa ? '112 / 108 அழைக்கவும்:' : '1. Call Helpline:'}</strong> {isTa ? 'உடனடியாக அவசர எண்ணை அழைத்து ஸ்பீக்கரில் வைக்கவும்.' : 'Call 112 / 108 immediately and put phone on speaker.'}</p>
              <p>2. <strong>{isTa ? 'நெஞ்சின் மையத்தில் அழுத்தவும்:' : '2. Chest Compressions:'}</strong> {isTa ? 'நெஞ்சின் மையத்தில் நிமிடம் 100-120 வேகத்தில் 2 அங்குலம் ஆழமாக அழுத்தவும்.' : 'Push hard and fast in the center of the chest at 100–120 BPM.'}</p>
              <p>3. <strong>{isTa ? 'தொடர்ந்து அழுத்தவும்:' : '3. Continue:'}</strong> {isTa ? 'மருத்துவ உதவி வரும் வரை அல்லது நபர் அசையும் வரை தொடருங்கள்.' : 'Continue until emergency medical help arrives.'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirstAidGuide;
