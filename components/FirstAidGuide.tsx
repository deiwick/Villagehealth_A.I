import React, { useState } from 'react';
import { ShieldAlert, AlertOctagon, Heart, Droplets, Zap, Check, XCircle, AlertTriangle } from 'lucide-react';
import { SupportedLanguage } from '../types';

interface FirstAidGuideProps {
  language: SupportedLanguage;
}

export const FirstAidGuide: React.FC<FirstAidGuideProps> = ({ language }) => {
  const [activeCategory, setActiveCategory] = useState<string>('snakebite');

  const categories = [
    { id: 'snakebite', title: '🐍 Snakebite & Scorpion', color: 'bg-emerald-600' },
    { id: 'heatstroke', title: '☀️ Heatstroke & ORS', color: 'bg-amber-600' },
    { id: 'dogbite', title: '🐕 Dog & Animal Bite', color: 'bg-rose-600' },
    { id: 'burns', title: '🔥 Burns & Scalds', color: 'bg-orange-600' },
    { id: 'cpr', title: '🫀 CPR & Choking', color: 'bg-blue-600' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-slate-50">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          {language.code === 'ta' ? 'அவசர முதலுதவி வழிகாட்டி' : 'Rural Emergency First-Aid Guide'}
        </h2>
        <p className="text-slate-500 text-sm">
          {language.code === 'ta' ? 'பாம்பு கடி, வெப்பவாதம் மற்றும் அவசரநிலைகளுக்கான முதலுதவி வழிகாட்டுதல்கள்.' : 'Instant, offline-accessible critical protocols for rural health crises.'}
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
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
            {cat.title}
          </button>
        ))}
      </div>

      {/* Content Cards */}
      {activeCategory === 'snakebite' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-rose-50 border border-rose-200 p-5 rounded-3xl space-y-2">
            <div className="flex items-center space-x-2 text-rose-800 font-extrabold text-base">
              <ShieldAlert size={22} className="text-rose-600" />
              <span>Snakebite Emergency Protocol (DO NOT PANIC)</span>
            </div>
            <p className="text-xs text-rose-900 leading-relaxed font-medium">
              Keep the patient calm and still. Most snakebites are non-venomous, but immediate transport to a hospital with Anti-Snake Venom (ASV) is essential.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-3xl space-y-3">
              <h4 className="font-bold text-emerald-900 text-sm flex items-center">
                <Check size={20} className="text-emerald-600 mr-2 shrink-0" /> DO THIS IMMEDIATELY
              </h4>
              <ul className="text-xs text-emerald-950 space-y-2 font-medium">
                <li>● Immobilize the bitten limb below heart level using a splint or cloth.</li>
                <li>● Remove rings, bangles, or tight footwear before swelling begins.</li>
                <li>● Keep patient strictly still and transport immediately to hospital.</li>
                <li>● Reassure the victim—anxiety increases venom circulation speed.</li>
              </ul>
            </div>

            <div className="bg-rose-50 border border-rose-200 p-5 rounded-3xl space-y-3">
              <h4 className="font-bold text-rose-900 text-sm flex items-center">
                <XCircle size={20} className="text-rose-600 mr-2 shrink-0" /> DO NOT DO THIS (DANGEROUS)
              </h4>
              <ul className="text-xs text-rose-950 space-y-2 font-medium">
                <li>❌ DO NOT cut the wound or try to suck out venom.</li>
                <li>❌ DO NOT apply tight tourniquets (causes limb tissue necrosis).</li>
                <li>❌ DO NOT apply ice, herbs, or electrical shocks to the bite.</li>
                <li>❌ DO NOT give coffee, alcohol, or painkiller medications.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeCategory === 'heatstroke' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-3xl space-y-2">
            <h3 className="font-bold text-amber-900 text-base flex items-center">
              <Droplets size={22} className="text-amber-600 mr-2" /> Home ORS (Oral Rehydration Solution) Recipe
            </h3>
            <p className="text-xs text-amber-950 leading-relaxed font-medium">
              If commercial ORS packets are unavailable during severe diarrhea or heat exhaustion, mix this exact WHO formula:
            </p>
            <div className="bg-white p-4 rounded-2xl border border-amber-300 font-mono text-xs text-slate-800 space-y-1">
              <div>1 Litre Clean Drinking Water</div>
              <div>+ 6 Level Teaspoons Sugar (30g)</div>
              <div>+ 1/2 Level Teaspoon Salt (2.5g)</div>
              <div className="text-emerald-700 font-sans font-bold pt-1">Stir until fully dissolved. Sip slowly throughout the day.</div>
            </div>
          </div>
        </div>
      )}

      {activeCategory === 'dogbite' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-rose-50 border border-rose-200 p-5 rounded-3xl space-y-3">
            <h3 className="font-bold text-rose-900 text-base flex items-center">
              <AlertOctagon size={22} className="text-rose-600 mr-2" /> Dog / Animal Bite Rabies Alert
            </h3>
            <div className="text-xs text-rose-950 space-y-2 font-medium">
              <p><b>1. Immediate Wound Washing:</b> Wash the bite thoroughly under running tap water with soap for at least 15 minutes immediately. Soap breaks down the rabies virus shell.</p>
              <p><b>2. Antiseptic:</b> Apply povidone-iodine or alcohol antiseptic after washing.</p>
              <p><b>3. Anti-Rabies Vaccine (ARV):</b> Rush to the nearest PHC/Hospital for Anti-Rabies Vaccine (Day 0, 3, 7, 14, 28 schedule). Rabies is 100% preventable with timely vaccination.</p>
            </div>
          </div>
        </div>
      )}

      {activeCategory === 'burns' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-orange-50 border border-orange-200 p-5 rounded-3xl space-y-3">
            <h3 className="font-bold text-orange-900 text-base">Burns & Scalds Immediate Care</h3>
            <div className="text-xs text-orange-950 space-y-2 font-medium">
              <p>● <b>Cool Water:</b> Hold the burned area under cool running water for 10-20 minutes. Never use ice or butter/toothpaste.</p>
              <p>● <b>Cover Cleanly:</b> Cover loosely with a clean, dry sterile bandage or cloth.</p>
              <p>● <b>Seek Help:</b> If burn area is larger than palm size or on face/hands, seek emergency medical care immediately.</p>
            </div>
          </div>
        </div>
      )}

      {activeCategory === 'cpr' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-blue-50 border border-blue-200 p-5 rounded-3xl space-y-3">
            <h3 className="font-bold text-blue-900 text-base flex items-center">
              <Heart size={22} className="text-blue-600 mr-2" /> Hands-Only CPR (For Unresponsive Adult)
            </h3>
            <div className="text-xs text-blue-950 space-y-2 font-medium">
              <p><b>1. Call 112 / 108 immediately.</b> Put phone on speaker mode.</p>
              <p><b>2. Push Hard & Fast:</b> Place heel of hand in center of chest. Interlock other hand. Push down 2 inches deep at rate of 100-120 beats per minute (to the beat of "Staying Alive").</p>
              <p><b>3. Continue compressions until medical help arrives.</b></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirstAidGuide;
