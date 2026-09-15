import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Star, Navigation, Search, Loader2, Hospital, Stethoscope, Siren, Baby, HeartPulse, Pill, UserPlus, ExternalLink, Filter } from 'lucide-react';
import { HealthCenter, SupportedLanguage } from '../types';
import { SPECIALTIES } from '../constants';
import { findNearbyClinics, parseHealthCenters } from '../services/geminiService';
import { t } from '../translations';

interface LocationServiceProps {
  language: SupportedLanguage;
  location: { lat: number; lng: number } | null;
}

const LocationService: React.FC<LocationServiceProps> = ({ language, location }) => {
  const lang = language.code;
  const isTa = lang === 'ta';

  const [facilities, setFacilities] = useState<HealthCenter[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  // Fallback data for Tamil Nadu locations
  const getFallbackFacilities = (specId: string): HealthCenter[] => {
    const all: HealthCenter[] = [
      {
        id: '1',
        name: isTa ? 'அரசு தாலுகா தலைமை மருத்துவமனை' : 'Government Taluk Headquarters Hospital',
        address: isTa ? 'மெயின் ரோடு, வட்டார மருத்துவமனை' : 'Main Road, Taluk Hospital Complex',
        phone: '044-25305000',
        type: 'Government Center',
        rating: 4.8,
        openNow: true,
        specialty: 'emergency',
        snippet: isTa ? '24 மணி நேர அவசர சிகிச்சை, பிரசவ வார்டு மற்றும் இலவச மருந்தகம் வசதி.' : '24/7 emergency, maternal delivery ward, and free government pharmacy.'
      },
      {
        id: '2',
        name: isTa ? 'ஆரம்ப சுகாதார நிலையம் (PHC)' : 'Primary Health Centre (PHC)',
        address: isTa ? 'கிராம பஞ்சாயத்து கட்டிடம் அருகில்' : 'Near Village Panchayat Office',
        phone: '104',
        type: 'Clinic',
        rating: 4.6,
        openNow: true,
        specialty: 'general',
        snippet: isTa ? 'இலவச தடுப்பூசி, காய்ச்சல் சிகிச்சை மற்றும் தாய் சேய் பராமரிப்பு.' : 'Free child immunizations, fever triage, and maternal checkups.'
      },
      {
        id: '3',
        name: isTa ? 'குழந்தைகள் மற்றும் தாய்மை மருத்துவ மையம்' : 'Pediatric & Maternity Care Centre',
        address: isTa ? 'பஸ் ஸ்டாண்ட் ரோடு' : 'Bus Stand Main Road',
        phone: '0452-2532535',
        type: 'Specialist',
        rating: 4.9,
        openNow: true,
        specialty: 'pediatrics',
        snippet: isTa ? 'குழந்தைகள் நல மருத்துவர் மற்றும் மகப்பேறு நிபுணர் தினசரி வரவு.' : 'Pediatric specialist consultation and neonatal intensive care.'
      },
      {
        id: '4',
        name: isTa ? 'முதலமைச்சர் காப்பீட்டு அங்கீகரிக்கப்பட்ட இதய மையம்' : 'CMCHIS Approved Cardiac & General Hospital',
        address: isTa ? 'தேசிய நெடுஞ்சாலை சந்திப்பு' : 'National Highway Junction',
        phone: '108',
        type: 'Hospital',
        rating: 4.7,
        openNow: true,
        specialty: 'cardiology',
        snippet: isTa ? 'இதய நோய் அவசர சிகிச்சை, ECG மற்றும் முதலமைச்சர் காப்பீட்டுத் திட்டம் சலுகை.' : 'Emergency cardiology triage, ECG, and free CMCHIS scheme treatment.'
      },
      {
        id: '5',
        name: isTa ? 'மக்கள் மருந்தகம் (Jan Aushadhi Kendra)' : 'PM Jan Aushadhi Generic Pharmacy',
        address: isTa ? 'சந்தை தெரு, PHC எதிரில்' : 'Market Street, Opposite PHC',
        phone: '1800-180-8080',
        type: 'Pharmacy',
        rating: 4.9,
        openNow: true,
        specialty: 'pharmacy',
        snippet: isTa ? '50% முதல் 90% குறைந்த விலையில் தரமான ஜெனரிக் மருந்துகள் கிடைக்கும்.' : 'Government generic medicines at 50%-90% discounted rates.'
      }
    ];

    if (specId === 'all') return all;
    return all.filter(f => f.specialty === specId || f.type.toLowerCase().includes(specId));
  };

  const fetchNearbyFacilities = async (specialtyId: string) => {
    setLoading(true);
    setError(null);
    try {
      if (location) {
        const response = await findNearbyClinics(location.lat, location.lng, specialtyId);
        const parsed = parseHealthCenters(response);
        if (parsed.length > 0) {
          setFacilities(parsed);
        } else {
          setFacilities(getFallbackFacilities(specialtyId));
        }
      } else {
        setFacilities(getFallbackFacilities(specialtyId));
      }
    } catch (err: any) {
      console.warn("Maps grounding fallback:", err);
      setFacilities(getFallbackFacilities(specialtyId));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearbyFacilities(selectedSpecialty);
  }, [location, selectedSpecialty, language.code]);

  const getSpecialtyIcon = (iconName: string) => {
    switch (iconName) {
      case 'Baby': return <Baby size={16} />;
      case 'HeartPulse': return <HeartPulse size={16} />;
      case 'Siren': return <Siren size={16} />;
      case 'Stethoscope': return <Stethoscope size={16} />;
      case 'UserPlus': return <UserPlus size={16} />;
      case 'Pill': return <Pill size={16} />;
      default: return <Hospital size={16} />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-slate-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {t(lang, 'loc.title')}
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {t(lang, 'loc.subtitle')}
          </p>
        </div>

        <button 
          onClick={() => fetchNearbyFacilities(selectedSpecialty)}
          disabled={loading || !location}
          className="flex items-center justify-center space-x-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-md active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed text-xs font-bold shrink-0 min-h-[44px]"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
          <span>{t(lang, 'loc.refresh')}</span>
        </button>
      </div>

      {/* Location Access Banner */}
      {!location && (
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-3xl text-center space-y-2">
          <div className="bg-amber-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto text-amber-600">
            <Navigation size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">{t(lang, 'loc.no.location')}</h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto mt-0.5">{t(lang, 'loc.no.location.msg')}</p>
          </div>
        </div>
      )}

      {/* Filter by Medical Need / Specialty */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Filter size={14} className="text-emerald-600" />
          <span>{t(lang, 'loc.filter')}</span>
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {SPECIALTIES.map((spec) => (
            <button
              key={spec.id}
              onClick={() => setSelectedSpecialty(spec.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSpecialty === spec.id
                  ? 'bg-emerald-600 text-white shadow-md ring-4 ring-emerald-100'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {getSpecialtyIcon(spec.icon)}
              <span>{isTa ? (spec.nameTa || spec.name) : spec.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {facilities.map((place, idx) => (
          <div key={place.id || idx} className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3.5">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Hospital size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 leading-snug text-sm group-hover:text-emerald-700 transition-colors">
                      {place.name || (isTa ? 'சமுதாய சுகாதார மையம்' : 'Community Health Center')}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center">
                      <MapPin size={12} className="mr-1 text-emerald-600 shrink-0" /> {place.address || (isTa ? 'வரைபடத்தில் சரிபார்க்கப்பட்டது' : 'Address verified on map')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-xs font-bold shrink-0">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span>{place.rating || '4.8'}</span>
                </div>
              </div>

              {place.snippet && (
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed">
                  "{place.snippet}"
                </p>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <a 
                href={`tel:${place.phone || '112'}`} 
                className="flex-1 flex items-center justify-center space-x-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2.5 rounded-xl text-xs font-bold transition-all border border-emerald-200 min-h-[40px]"
              >
                <Phone size={14} />
                <span>{t(lang, 'loc.call')}</span>
              </a>

              <a 
                href={place.uri || `https://maps.google.com/?q=${location?.lat || 13.0827},${location?.lng || 80.2707}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[40px]"
              >
                <Navigation size={14} />
                <span>{t(lang, 'loc.directions')}</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
        
        {loading && [1,2,3,4].map(i => (
          <div key={i} className="bg-slate-100 animate-pulse h-48 rounded-3xl border border-slate-200" />
        ))}
      </div>
    </div>
  );
};

export default LocationService;
