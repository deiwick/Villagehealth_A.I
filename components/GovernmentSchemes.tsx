import React, { useState } from 'react';
import { ShieldCheck, ExternalLink, Phone, FileText, CheckCircle2, Search, Heart, Sparkles, Building2, UserCheck, AlertCircle } from 'lucide-react';
import { SupportedLanguage } from '../types';

interface GovernmentSchemesProps {
  language: SupportedLanguage;
}

export const GovernmentSchemes: React.FC<GovernmentSchemesProps> = ({ language }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isTamil = language.code === 'ta';

  const schemes = [
    {
      id: 'cmchis',
      category: 'insurance',
      titleEn: "Chief Minister's Comprehensive Health Insurance Scheme (CMCHIS - Tamil Nadu)",
      titleTa: "முதலமைச்சரின் விரிவான மருத்துவக் காப்பீட்டுத் திட்டம் (CMCHIS)",
      coverageEn: "Free medical & surgical treatment up to ₹5,00,000 per family per year in empanelled hospitals.",
      coverageTa: "ஆண்டுக்கு குடும்பத்திற்கு ₹5,00,000 வரை இலவச மருத்துவ மற்றும் அறுவை சிகிச்சை சிகிச்சை.",
      eligibilityEn: "Families with annual income below ₹1,20,000 (Ration Card holders in Tamil Nadu).",
      eligibilityTa: "ஆண்டு வருமானம் ₹1,20,00,000 க்குள் உள்ள குடும்பங்கள் (ரேஷன் கார்டு வைத்திருப்பவர்கள்).",
      documentsEn: "Smart Ration Card, Income Certificate, Aadhar Card, Family Passport Photo.",
      documentsTa: "ஸ்மார்ட் ரேஷன் கார்டு, வருமானச் சான்றிதழ், ஆதார் கார்டு, குடும்பப் புகைப்படம்.",
      helpline: "1800 425 3993",
      applyUrl: "https://www.cmchistn.com/",
      badgeEn: "State Scheme (TN)",
      badgeTa: "மாநில அரசு திட்டம்",
    },
    {
      id: 'pmjay',
      category: 'insurance',
      titleEn: "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
      titleTa: "ஆயுஷ்மான் பாரத் - பிரதமர் ஜன் ஆரோக்கிய யோஜனா (PM-JAY)",
      coverageEn: "Free hospitalization coverage up to ₹5,00,000 per family per year for secondary & tertiary care.",
      coverageTa: "இரண்டாம் நிலை மற்றும் மூன்றாம் நிலை மருத்துவத்திற்கு ₹5,00,000 வரை இலவச மருத்துவமனை சிகிச்சை.",
      eligibilityEn: "Low-income rural families identified under SECC database & Ayushman card holders.",
      eligibilityTa: "SECC தரவுத்தளத்தின் கீழ் அடையாளம் காணப்பட்ட குறைந்த வருவாய் கொண்ட கிராமப்புற குடும்பங்கள்.",
      documentsEn: "Aadhar Card, SECC Name Verification, Ration Card.",
      documentsTa: "ஆதார் கார்டு, SECC பெயர் சரிபார்ப்பு, ரேஷன் கார்டு.",
      helpline: "14555 / 1800 111 565",
      applyUrl: "https://pmjay.gov.in/",
      badgeEn: "Central Scheme",
      badgeTa: "மத்திய அரசு திட்டம்",
    },
    {
      id: 'mtm',
      category: 'doorstep',
      titleEn: "Makkalai Thedi Maruthuvam (Healthcare at Your Doorstep - TN)",
      titleTa: "மக்களைத் தேடி மருத்துவம் (வீட்டு வாசலில் மருத்துவ சேவை)",
      coverageEn: "Doorstep delivery of hypertension/diabetes medicines, physiotherapy, palliative & kidney dialysis care.",
      coverageTa: "உயர் இரத்த அழுத்தம்/நீரிழிவு மருந்துகள், பிசியோதெரபி மற்றும் சிறுநீரக டயாலிசிஸ் சிகிச்சைகள் வீட்டு வாசலில் இலவசமாக வழங்கப்படும்.",
      eligibilityEn: "All residents of Tamil Nadu, especially elderly, disabled, and chronic illness patients.",
      eligibilityTa: "தமிழ்நாட்டின் அனைத்து குடியிருப்பாளர்கள், குறிப்பாக முதியவர்கள் மற்றும் மாற்றுத்திறனாளிகள்.",
      documentsEn: "Medical Prescription, Aadhar Card, Address Proof.",
      documentsTa: "மருத்துவச் சீட்டு, ஆதார் கார்டு, முகவரி சான்று.",
      helpline: "104",
      applyUrl: "https://tnhealth.tn.gov.in/",
      badgeEn: "Doorstep Care",
      badgeTa: "வீட்டு வாசல் சேவை",
    },
    {
      id: 'pmmvy',
      category: 'maternal',
      titleEn: "Pradhan Mantri Matru Vandana Yojana (PMMVY & Dr. Muthulakshmi Reddy Scheme)",
      titleTa: "டாக்டர் முத்துலட்சுமி ரெட்டி மகப்பேறு நிதி உதவித் திட்டம் & PMMVY",
      coverageEn: "Financial assistance up to ₹18,00,000 in installments + nutrition kits for pregnant & lactating mothers.",
      coverageTa: "கர்ப்பிணிப் பெண்களுக்கு ₹18,00,000 வரை தவணை முறையில் நிதி உதவி + ஊட்டச்சத்து பெட்டகம் வழங்கப்படும்.",
      eligibilityEn: "Pregnant women above 19 years registering at Primary Health Centers (PHC/HWC).",
      eligibilityTa: "கிராமப்புற ஆரம்ப சுகாதார நிலையங்களில் (PHC) பதிவு செய்யும் 19 வயதுக்கு மேற்பட்ட கர்ப்பிணிப் பெண்கள்.",
      documentsEn: "PICME Registration Number, Bank Passbook, Aadhar Card, Mother Child Protection (MCP) Card.",
      documentsTa: "PICME பதிவு எண், வங்கி கணக்கு புத்தகம், ஆதார் கார்டு, தாய் சேய் பாதுகாப்பு அட்டை.",
      helpline: "102 / 104",
      applyUrl: "https://pmmvy.wcd.gov.in/",
      badgeEn: "Maternal Aid",
      badgeTa: "மகப்பேறு உதவி",
    },
    {
      id: 'janaushadhi',
      category: 'medicines',
      titleEn: "Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)",
      titleTa: "பிரதமர் பாரதிய ஜனஒளஷதி திட்டம் (குறைந்த விலை பொது மருந்துகள்)",
      coverageEn: "Quality generic medicines and surgical items available at 50% to 90% lower prices than branded drugs.",
      coverageTa: "பிராண்டட் மருந்துகளை விட 50% முதல் 90% வரை குறைந்த விலையில் தரமான ஜெனரிக் மருந்துகள்.",
      eligibilityEn: "Open to all citizens across India at Jan Aushadhi Kendras.",
      eligibilityTa: "அனைத்து இந்திய குடிமக்களுக்கும் ஜனஒளஷதி மையங்களில் நேரடியாகக் கிடைக்கும்.",
      documentsEn: "Valid Doctor Prescription (optional for OTC items).",
      documentsTa: "மருத்துவரின் சீட்டு (OTC மருந்துகளுக்குத் தேவையில்லை).",
      helpline: "1800 180 8080",
      applyUrl: "https://janaushadhi.gov.in/",
      badgeEn: "Free/Discounted Meds",
      badgeTa: "குறைந்த விலை மருந்துகள்",
    },
    {
      id: 'rbsk',
      category: 'children',
      titleEn: "Rashtriya Bal Swasthya Karyakram (RBSK - Child Health Screening)",
      titleTa: "ராஷ்ட்ரிய பால ஸ்வாஸ்த்ய காரியக்ரம் (RBSK - குழந்தைகள் சுகாதாரத் திட்டம்)",
      coverageEn: "Free screening and early surgical/medical treatment for 4Ds (Defects at birth, Diseases, Deficiencies, Development delays) from 0 to 18 years.",
      coverageTa: "0 முதல் 18 வயது வரையிலான குழந்தைகளுக்கு பிறப்புக் குறைபாடுகள் மற்றும் நோய்களுக்கான இலவச அறுவை சிகிச்சை மற்றும் சிகிச்சை.",
      eligibilityEn: "All newborns, Anganwadi children, and government school students.",
      eligibilityTa: "அனைத்து புதிதாகப் பிறந்த குழந்தைகள், அங்கன்வாடி குழந்தைகள் மற்றும் அரசுப் பள்ளி மாணவர்கள்.",
      documentsEn: "Birth Certificate, School/Anganwadi ID, Aadhar Card.",
      documentsTa: "பிறப்புச் சான்றிதழ், பள்ளி/அங்கன்வாடி அடையாள அட்டை, ஆதார் கார்டு.",
      helpline: "104",
      applyUrl: "https://rbsk.gov.in/",
      badgeEn: "Child Welfare",
      badgeTa: "குழந்தைகள் நலன்",
    }
  ];

  const filteredSchemes = schemes.filter(s => {
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesQuery = searchQuery === '' || 
      s.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.titleTa.includes(searchQuery) ||
      s.coverageEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-slate-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <Building2 size={28} className="text-emerald-600 mr-2.5" />
            {isTamil ? 'அரசு நலத்திட்டங்கள் & மருத்துவக் காப்பீடு' : 'Government Health Schemes & Financial Aids'}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {isTamil ? 'மத்திய மற்றும் மாநில அரசின் இலவச மருத்துவக் காப்பீடு, நிதி உதவி மற்றும் விண்ணப்பிக்கும் முறைகள்.' : 'Explore central & state free health insurance, maternal aids, and enrollment guidelines.'}
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative flex items-center">
          <Search size={18} className="absolute left-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isTamil ? 'திட்டம் அல்லது காப்பீடு பெயர் தேடுக...' : 'Search scheme name or benefit (e.g. CMCHIS, PM-JAY)...'}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-xs md:text-sm font-medium focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', labelEn: 'All Schemes', labelTa: 'அனைத்து திட்டங்கள்' },
            { id: 'insurance', labelEn: 'Free Insurance', labelTa: 'இலவச காப்பீடு' },
            { id: 'maternal', labelEn: 'Maternal & Mother', labelTa: 'மகப்பேறு உதவி' },
            { id: 'doorstep', labelEn: 'Doorstep Care', labelTa: 'வீட்டு வாசல் சேவை' },
            { id: 'medicines', labelEn: 'Generic Meds', labelTa: 'குறைந்த விலை மருந்து' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {isTamil ? cat.labelTa : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSchemes.map((scheme) => (
          <div key={scheme.id} className="bg-white border border-slate-200 hover:border-emerald-300 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
                  {isTamil ? scheme.badgeTa : scheme.badgeEn}
                </span>
                <a
                  href={`tel:${scheme.helpline.split('/')[0].trim()}`}
                  className="flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full hover:bg-emerald-100 transition-colors"
                >
                  <Phone size={12} />
                  <span>{scheme.helpline}</span>
                </a>
              </div>

              <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                {isTamil ? scheme.titleTa : scheme.titleEn}
              </h3>

              {/* Coverage Highlight */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-1">
                <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center">
                  <Sparkles size={14} className="mr-1.5" />
                  {isTamil ? 'திட்டப் பயன்கள் / சலுகைகள்:' : 'Key Coverage & Benefit:'}
                </div>
                <p className="text-slate-800 text-xs font-semibold leading-relaxed">
                  {isTamil ? scheme.coverageTa : scheme.coverageEn}
                </p>
              </div>

              {/* Eligibility & Required Documents */}
              <div className="space-y-2 text-xs text-slate-600">
                <div>
                  <span className="font-bold text-slate-800">{isTamil ? 'தகுதி:' : 'Eligibility:'} </span>
                  {isTamil ? scheme.eligibilityTa : scheme.eligibilityEn}
                </div>
                <div>
                  <span className="font-bold text-slate-800">{isTamil ? 'தேவையான ஆவணங்கள்:' : 'Required Documents:'} </span>
                  {isTamil ? scheme.documentsTa : scheme.documentsEn}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <a
                href={`tel:${scheme.helpline.split('/')[0].trim()}`}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all"
              >
                <Phone size={14} />
                <span>{isTamil ? 'அழைக்கவும்' : 'Call Helpline'}</span>
              </a>

              <a
                href={scheme.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
              >
                <ExternalLink size={14} />
                <span>{isTamil ? 'விண்ணப்பிக்க Portal' : 'Official Portal'}</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredSchemes.length === 0 && (
        <div className="bg-white p-12 rounded-3xl text-center space-y-3 border border-slate-100">
          <AlertCircle size={32} className="mx-auto text-slate-400" />
          <p className="text-slate-500 text-sm font-medium">No matching health schemes found. Try a different search term.</p>
        </div>
      )}
    </div>
  );
};

export default GovernmentSchemes;
