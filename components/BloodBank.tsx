import React, { useState, useEffect, useCallback } from 'react';
import {
  Droplets, Search, Heart, Building2,
  AlertTriangle, CheckCircle2, Phone, Clock,
  ChevronDown, Loader2, RefreshCw, UserPlus,
  Siren, Activity, Info, MapPin, ShieldCheck
} from 'lucide-react';
import { SupportedLanguage, BloodType, BloodRequest, BloodDonor, BloodBank as IBloodBank, BloodBankStock } from '../types';
import {
  searchBloodAvailability, postBloodRequest, registerDonor, registerBloodBank,
  fulfillBloodRequest, subscribeToBloodRequests,
  ALL_BLOOD_TYPES, TN_DISTRICTS, formatTimeAgo, isFirebaseConfigured
} from '../services/bloodBankService';

interface BloodBankProps {
  language: SupportedLanguage;
}

type Tab = 'SEARCH' | 'REQUEST' | 'DONATE' | 'BANK_DASHBOARD' | 'LIVE_REQUESTS';

const URGENCY_CONFIG = {
  CRITICAL: { label: 'CRITICAL', labelTa: 'மிகவும் அவசரம்', color: 'bg-rose-600 text-white', border: 'border-rose-300 bg-rose-50', pulse: true },
  URGENT: { label: 'URGENT', labelTa: 'அவசரம்', color: 'bg-amber-500 text-white', border: 'border-amber-200 bg-amber-50', pulse: false },
  PLANNED: { label: 'PLANNED', labelTa: 'திட்டமிட்டது', color: 'bg-slate-500 text-white', border: 'border-slate-200 bg-slate-50', pulse: false },
};

const BLOOD_TYPE_COLORS: Record<BloodType, string> = {
  'O+': 'bg-rose-600', 'O-': 'bg-rose-800',
  'A+': 'bg-blue-600', 'A-': 'bg-blue-800',
  'B+': 'bg-emerald-600', 'B-': 'bg-emerald-800',
  'AB+': 'bg-purple-600', 'AB-': 'bg-purple-800',
};

// Medical Blood Group Compatibility Matrix
const COMPATIBLE_DONOR_TYPES: Record<BloodType, BloodType[]> = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'],
};

const EMPTY_STOCK: BloodBankStock = { 'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0, 'O+': 0, 'O-': 0, 'AB+': 0, 'AB-': 0 };

export const BloodBank: React.FC<BloodBankProps> = ({ language }) => {
  const isTa = language.code === 'ta';
  const [activeTab, setActiveTab] = useState<Tab>('SEARCH');

  // Search state
  const [searchBloodType, setSearchBloodType] = useState<BloodType | ''>('');
  const [searchDistrict, setSearchDistrict] = useState('');
  const [searchResults, setSearchResults] = useState<{ banks: IBloodBank[]; donors: BloodDonor[] } | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [lastSearched, setLastSearched] = useState(0);

  // Live requests state
  const [liveRequests, setLiveRequests] = useState<BloodRequest[]>([]);
  const [fulfillLoading, setFulfillLoading] = useState<string | null>(null);

  // Request form state
  const [reqForm, setReqForm] = useState({
    patientName: '', bloodType: '' as BloodType | '', hospital: '',
    district: '', units: 1, urgency: 'URGENT' as 'CRITICAL' | 'URGENT' | 'PLANNED',
    contactPhone: '', notes: '',
  });
  const [reqLoading, setReqLoading] = useState(false);
  const [reqSuccess, setReqSuccess] = useState('');

  // Donor form state
  const [donorForm, setDonorForm] = useState({
    name: '', bloodType: '' as BloodType | '', district: '', phone: '', available: true,
  });
  const [donorLoading, setDonorLoading] = useState(false);
  const [donorSuccess, setDonorSuccess] = useState('');

  // Bank dashboard state
  const [bankForm, setBankForm] = useState({
    name: '', address: '', district: '', phone: '', type: 'Government' as IBloodBank['type'],
    operatingHours: '24/7',
  });
  const [bankStock, setBankStock] = useState<BloodBankStock>({ ...EMPTY_STOCK });
  const [bankLoading, setBankLoading] = useState(false);
  const [bankSuccess, setBankSuccess] = useState('');

  // Subscribe to live blood requests
  useEffect(() => {
    const unsub = subscribeToBloodRequests((requests) => {
      setLiveRequests(requests);
    });
    return unsub;
  }, []);

  const handleSearch = useCallback(async () => {
    if (!searchBloodType || !searchDistrict) return;
    setSearchLoading(true);
    setSearchResults(null);
    try {
      const results = await searchBloodAvailability(searchBloodType as BloodType, searchDistrict);
      setSearchResults(results);
      setLastSearched(Date.now());
    } catch (e) {
      console.error(e);
    } finally {
      setSearchLoading(false);
    }
  }, [searchBloodType, searchDistrict]);

  const handleSubmitRequest = async () => {
    if (!reqForm.patientName || !reqForm.bloodType || !reqForm.hospital || !reqForm.district || !reqForm.contactPhone) return;
    setReqLoading(true);
    setReqSuccess('');
    try {
      await postBloodRequest({
        patientName: reqForm.patientName,
        bloodType: reqForm.bloodType as BloodType,
        hospital: reqForm.hospital,
        district: reqForm.district,
        units: reqForm.units,
        urgency: reqForm.urgency,
        contactPhone: reqForm.contactPhone,
        notes: reqForm.notes,
        fulfilledBy: null,
      });
      setReqSuccess(isTa ? 'உங்கள் இரத்தக் கோரிக்கை வெற்றிகரமாக அனுப்பப்பட்டது! அருகிலுள்ள தானியாளர்கள் மற்றும் இரத்த வங்கிகளுக்கு அறிவிப்பு அனுப்பப்பட்டது.' : 'Blood request posted! Nearby donors and blood banks have been alerted.');
      setReqForm({ patientName: '', bloodType: '', hospital: '', district: '', units: 1, urgency: 'URGENT', contactPhone: '', notes: '' });
    } catch (e) {
      console.error(e);
    } finally {
      setReqLoading(false);
    }
  };

  const handleRegisterDonor = async () => {
    if (!donorForm.name || !donorForm.bloodType || !donorForm.district || !donorForm.phone) return;
    setDonorLoading(true);
    setDonorSuccess('');
    try {
      await registerDonor({
        name: donorForm.name,
        bloodType: donorForm.bloodType as BloodType,
        district: donorForm.district,
        phone: donorForm.phone,
        available: donorForm.available,
        totalDonations: 0,
        lastDonated: null,
      });
      setDonorSuccess(isTa ? 'நன்றி! நீங்கள் தானியாளராக பதிவு செய்யப்பட்டீர்கள். உங்கள் இரத்த வகை தேவைப்படும்போது நாங்கள் தொடர்பு கொள்வோம்.' : "Thank you! You're registered as a donor. We'll alert you when your blood group is needed.");
      setDonorForm({ name: '', bloodType: '', district: '', phone: '', available: true });
    } catch (e) {
      console.error(e);
    } finally {
      setDonorLoading(false);
    }
  };

  const handleRegisterBank = async () => {
    if (!bankForm.name || !bankForm.address || !bankForm.district || !bankForm.phone) return;
    setBankLoading(true);
    setBankSuccess('');
    try {
      await registerBloodBank({
        name: bankForm.name,
        address: bankForm.address,
        district: bankForm.district,
        phone: bankForm.phone,
        type: bankForm.type,
        operatingHours: bankForm.operatingHours,
        stock: bankStock,
      });
      setBankSuccess(isTa ? 'இரத்த வங்கி வெற்றிகரமாக பதிவு செய்யப்பட்டது! கையிருப்பு நேரடியாக புதுப்பிக்கப்படும்.' : 'Blood bank registered! Stock levels will now sync in real-time.');
      setBankForm({ name: '', address: '', district: '', phone: '', type: 'Government', operatingHours: '24/7' });
      setBankStock({ ...EMPTY_STOCK });
    } catch (e) {
      console.error(e);
    } finally {
      setBankLoading(false);
    }
  };

  const handleFulfill = async (requestId: string) => {
    setFulfillLoading(requestId);
    try {
      await fulfillBloodRequest(requestId, 'manual_response');
    } catch (e) {
      console.error(e);
    } finally {
      setFulfillLoading(null);
    }
  };

  const tabs: { id: Tab; label: string; labelTa: string; icon: React.ReactNode }[] = [
    { id: 'SEARCH', label: 'Search', labelTa: 'தேடு', icon: <Search size={16} /> },
    { id: 'LIVE_REQUESTS', label: 'Live Requests', labelTa: 'நேரடி கோரிக்கைகள்', icon: <Activity size={16} /> },
    { id: 'REQUEST', label: 'Request Blood', labelTa: 'இரத்தம் கோரு', icon: <Siren size={16} /> },
    { id: 'DONATE', label: 'Become Donor', labelTa: 'தானியாளர் ஆகுக', icon: <Heart size={16} /> },
    { id: 'BANK_DASHBOARD', label: 'Bank Portal', labelTa: 'வங்கி போர்டல்', icon: <Building2 size={16} /> },
  ];

  const compatibleGroups = searchBloodType ? COMPATIBLE_DONOR_TYPES[searchBloodType as BloodType] : [];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-700 to-rose-600 text-white px-4 md:px-6 py-5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/20 rounded-2xl shrink-0">
              <Droplets size={26} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black">
                {isTa ? 'இரத்த வங்கி உதவி போர்டல்' : 'Blood Bank Availability Portal'}
              </h2>
              <p className="text-rose-100 text-xs mt-0.5 font-medium">
                {isTa ? 'நேரடி கையிருப்பு • தானியாளர் பதிவு • அவசர கோரிக்கைகள்' : 'Live Stock • Donor Registry • Urgent Requests'}
              </p>
            </div>
          </div>

          {/* Firebase status badge */}
          <div className={`mt-3 inline-flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${isFirebaseConfigured ? 'bg-emerald-500/30 text-emerald-100 border border-emerald-400/30' : 'bg-white/20 text-rose-100 border border-white/20'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isFirebaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-yellow-400'}`} />
            <span>{isFirebaseConfigured ? (isTa ? 'நேரடி ஒத்திசைவு செயல்படுகிறது (Firebase)' : 'Live sync active (Firebase)') : (isTa ? 'டெமோ பயன்முறை — Firebase கட்டமைக்கவில்லை' : 'Demo mode — Firebase not configured')}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 overflow-x-auto scrollbar-none">
        <div className="flex max-w-4xl mx-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1.5 px-4 py-3.5 text-xs font-bold whitespace-nowrap border-b-2 transition-colors min-h-[44px] ${
                activeTab === tab.id
                  ? 'border-rose-600 text-rose-700 bg-rose-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              <span>{isTa ? tab.labelTa : tab.label}</span>
              {tab.id === 'LIVE_REQUESTS' && liveRequests.length > 0 && (
                <span className="bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full ml-1">
                  {liveRequests.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {/* ── SEARCH TAB ── */}
        {activeTab === 'SEARCH' && (
          <div className="space-y-5">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 md:p-6 space-y-5">
              <h3 className="font-extrabold text-slate-800 text-base flex items-center">
                <Search size={20} className="text-rose-600 mr-2" />
                {isTa ? 'இரத்த கையிருப்பு தேடுக' : 'Search Blood Availability'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Blood Type */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    {isTa ? 'இரத்த வகை' : 'Blood Group'}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {ALL_BLOOD_TYPES.map(bt => (
                      <button
                        key={bt}
                        onClick={() => setSearchBloodType(bt)}
                        className={`py-2.5 rounded-xl font-black text-sm transition-all min-h-[40px] ${
                          searchBloodType === bt
                            ? `${BLOOD_TYPE_COLORS[bt]} text-white shadow-md ring-2 ring-offset-1 ring-rose-400`
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {bt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* District Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    {isTa ? 'மாவட்டம்' : 'District'}
                  </label>
                  <div className="relative">
                    <select
                      value={searchDistrict}
                      onChange={e => setSearchDistrict(e.target.value)}
                      className="w-full bg-slate-100 border-none rounded-2xl py-3.5 pl-4 pr-10 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-rose-500 appearance-none min-h-[44px]"
                    >
                      <option value="">{isTa ? 'மாவட்டத்தை தேர்ந்தெடு...' : 'Select district...'}</option>
                      {TN_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSearch}
                disabled={!searchBloodType || !searchDistrict || searchLoading}
                className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 min-h-[48px]"
              >
                {searchLoading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                <span>{searchLoading ? (isTa ? 'தேடுகிறது...' : 'Searching...') : (isTa ? 'இப்போது தேடு' : 'Search Now')}</span>
              </button>
            </div>

            {/* Medical Compatibility Banner */}
            {searchBloodType && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start space-x-3">
                <ShieldCheck size={20} className="text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-900 space-y-1 font-medium">
                  <p className="font-bold">
                    {isTa ? `மருத்துவ இரத்த இணக்கத்தன்மை (${searchBloodType}):` : `Medical Compatibility (${searchBloodType}):`}
                  </p>
                  <p>
                    {isTa 
                      ? `${searchBloodType} நோயாளிக்கு ஏற்புடைய தானியாளர் குழுக்கள்: ${compatibleGroups.join(', ')}.` 
                      : `A patient with ${searchBloodType} can safely receive blood from: ${compatibleGroups.join(', ')}.`}
                  </p>
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchResults && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-700 text-sm">
                    {isTa ? `${searchDistrict} மாவட்டத்தில் ${searchBloodType} கையிருப்பு:` : `${searchBloodType} availability in ${searchDistrict}:`}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-slate-400">{isTa ? 'புதுப்பிக்கப்பட்டது' : 'Updated'} {formatTimeAgo(lastSearched)}</span>
                    <button onClick={handleSearch} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                      <RefreshCw size={14} className="text-slate-500" />
                    </button>
                  </div>
                </div>

                {/* Blood Banks */}
                {searchResults.banks.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                      <Building2 size={13} className="mr-1.5 text-rose-500" />
                      {isTa ? 'இரத்த வங்கிகள்' : 'Blood Banks'} ({searchResults.banks.length})
                    </h4>
                    {searchResults.banks.map(bank => (
                      <div key={bank.id} className="bg-white border border-emerald-200 rounded-3xl p-5 shadow-sm space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">{bank.name}</h4>
                            <p className="text-xs text-slate-500 flex items-center mt-0.5">
                              <MapPin size={11} className="mr-1 text-rose-500 shrink-0" />{bank.address}
                            </p>
                          </div>
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-full uppercase shrink-0">{bank.type}</span>
                        </div>

                        {/* Stock breakdown */}
                        <div className="bg-slate-50 rounded-2xl p-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{isTa ? 'தற்போதைய கையிருப்பு:' : 'Current Stock:'}</p>
                          <div className="flex flex-wrap gap-2">
                            {ALL_BLOOD_TYPES.map(bt => {
                              const count = bank.stock[bt] ?? 0;
                              const isTarget = bt === searchBloodType;
                              const isCompatible = compatibleGroups.includes(bt);
                              return (
                                <div key={bt} className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-bold ${
                                  isTarget ? (count > 0 ? 'bg-emerald-600 text-white ring-2 ring-emerald-200' : 'bg-rose-600 text-white') : isCompatible && count > 0 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-white border border-slate-200 text-slate-600'
                                }`}>
                                  <span>{bt}</span>
                                  <span className="opacity-80">×{count}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <p className="text-[10px] text-slate-400 flex items-center">
                            <Clock size={11} className="mr-1" />
                            {bank.operatingHours} · {isTa ? 'புதுப்பிக்கப்பட்டது' : 'Updated'} {formatTimeAgo(bank.updatedAt)}
                          </p>
                          <a href={`tel:${bank.phone}`} className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[38px]">
                            <Phone size={14} />
                            <span>{bank.phone}</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Donors */}
                {searchResults.donors.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                      <Heart size={13} className="mr-1.5 text-rose-500" />
                      {isTa ? 'கிடைக்கும் தானியாளர்கள்' : 'Available Donors'} ({searchResults.donors.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {searchResults.donors.map(donor => (
                        <div key={donor.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-sm shrink-0 ${BLOOD_TYPE_COLORS[donor.bloodType]}`}>
                              {donor.bloodType}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-sm">{donor.name}</p>
                              <p className="text-[10px] text-slate-400">{donor.totalDonations || 0} {isTa ? 'தானங்கள்' : 'donations'}</p>
                            </div>
                          </div>
                          <a href={`tel:${donor.phone}`} className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors border border-rose-200 min-h-[38px] flex items-center">
                            <Phone size={16} />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No results banner */}
                {searchResults.banks.length === 0 && searchResults.donors.length === 0 && (
                  <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center space-y-3">
                    <AlertTriangle size={36} className="mx-auto text-rose-400" />
                    <p className="font-bold text-rose-800 text-sm">
                      {isTa ? `${searchDistrict} மாவட்டத்தில் ${searchBloodType} இரத்தம் இப்போது கிடைக்கவில்லை` : `No ${searchBloodType} blood available in ${searchDistrict} right now`}
                    </p>
                    <p className="text-xs text-rose-600">
                      {isTa ? 'உடனடியாக கோரிக்கை அனுப்ப "இரத்தம் கோரு" தாவலை சொடுக்கவும்.' : 'Post an urgent request to broadcast alerts to nearby donors.'}
                    </p>
                    <button
                      onClick={() => setActiveTab('REQUEST')}
                      className="mt-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all min-h-[40px]"
                    >
                      {isTa ? 'அவசர கோரிக்கை அனுப்பு' : 'Post Urgent Request'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── LIVE REQUESTS TAB ── */}
        {activeTab === 'LIVE_REQUESTS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-800 text-base flex items-center">
                <Activity size={20} className="text-rose-600 mr-2" />
                {isTa ? 'நேரடி அவசர இரத்தக் கோரிக்கைகள்' : 'Live Urgent Blood Requests'}
              </h3>
              <div className="flex items-center space-x-1.5 text-[10px] text-rose-600 font-bold">
                <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                <span>{isTa ? 'நேரடி புதுப்பிப்பு' : 'Live updates'}</span>
              </div>
            </div>

            {liveRequests.length === 0 ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-10 text-center space-y-2">
                <CheckCircle2 size={36} className="mx-auto text-emerald-500" />
                <p className="font-bold text-emerald-800">{isTa ? 'தற்போது அவசர கோரிக்கைகள் இல்லை' : 'No active urgent requests right now'}</p>
                <p className="text-xs text-emerald-600">{isTa ? 'அனைத்து கோரிக்கைகளும் நிறைவேற்றப்பட்டுள்ளன' : 'All requests have been fulfilled'}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {liveRequests.map(req => {
                  const urg = URGENCY_CONFIG[req.urgency];
                  return (
                    <div key={req.id} className={`border-2 rounded-3xl p-5 space-y-3 ${urg.border}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-base shrink-0 ${BLOOD_TYPE_COLORS[req.bloodType]} ${urg.pulse ? 'animate-pulse' : ''}`}>
                            {req.bloodType}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-extrabold text-slate-800 text-sm">{req.patientName}</span>
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${urg.color}`}>
                                {isTa ? urg.labelTa : urg.label}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 flex items-center">
                              <Building2 size={11} className="mr-1 shrink-0" />{req.hospital}, {req.district}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-black text-rose-700">{req.units} {isTa ? 'அலகு' : 'unit(s)'}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{formatTimeAgo(req.createdAt)}</p>
                        </div>
                      </div>

                      {req.notes && (
                        <p className="text-xs text-slate-600 italic bg-white/70 px-3 py-2 rounded-xl">"{req.notes}"</p>
                      )}

                      <div className="flex items-center space-x-2 pt-1">
                        <a
                          href={`tel:${req.contactPhone}`}
                          className="flex-1 flex items-center justify-center space-x-2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all min-h-[40px]"
                        >
                          <Phone size={14} />
                          <span>{isTa ? 'தொடர்பு கொள்ளவும்' : 'Contact'} {req.contactPhone}</span>
                        </a>
                        <button
                          onClick={() => req.id && handleFulfill(req.id)}
                          disabled={fulfillLoading === req.id}
                          className="flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all disabled:bg-slate-300 min-h-[40px]"
                        >
                          {fulfillLoading === req.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                          <span>{isTa ? 'நிறைவேற்றப்பட்டது' : 'Fulfilled'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── REQUEST BLOOD TAB ── */}
        {activeTab === 'REQUEST' && (
          <div className="space-y-5">
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start space-x-3">
              <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-800 font-semibold leading-relaxed">
                {isTa ? 'இந்த படிவம் அவசர இரத்தத் தேவைக்காக மட்டுமே. உங்கள் கோரிக்கை உடனடியாக அருகிலுள்ள இரத்த வங்கிகள் மற்றும் தானியாளர்களுக்கு அனுப்பப்படும்.' : 'This form is for urgent blood needs only. Your request will be immediately broadcast to nearby blood banks and registered donors.'}
              </p>
            </div>

            {reqSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-3 animate-in fade-in">
                <CheckCircle2 size={42} className="mx-auto text-emerald-500" />
                <p className="font-bold text-emerald-800 text-sm">{reqSuccess}</p>
                <button onClick={() => setReqSuccess('')} className="text-xs text-emerald-600 hover:underline">
                  {isTa ? 'மற்றொரு கோரிக்கை அனுப்பு' : 'Post another request'}
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <h3 className="font-extrabold text-slate-800 text-base">{isTa ? 'அவசர இரத்தக் கோரிக்கை படிவம்' : 'Urgent Blood Request Form'}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label={isTa ? 'நோயாளியின் பெயர்' : 'Patient Name'} required>
                    <input type="text" value={reqForm.patientName} onChange={e => setReqForm(f => ({ ...f, patientName: e.target.value }))} placeholder={isTa ? 'முழு பெயர்' : 'Full name'} className="form-input" />
                  </FormField>
                  <FormField label={isTa ? 'தொடர்பு எண்' : 'Contact Phone'} required>
                    <input type="tel" value={reqForm.contactPhone} onChange={e => setReqForm(f => ({ ...f, contactPhone: e.target.value }))} placeholder="98765 43210" className="form-input" />
                  </FormField>
                </div>

                <FormField label={isTa ? 'இரத்த வகை' : 'Blood Group Required'} required>
                  <div className="grid grid-cols-8 gap-1.5">
                    {ALL_BLOOD_TYPES.map(bt => (
                      <button key={bt} onClick={() => setReqForm(f => ({ ...f, bloodType: bt }))}
                        className={`py-2.5 rounded-xl font-black text-sm transition-all min-h-[40px] ${reqForm.bloodType === bt ? `${BLOOD_TYPE_COLORS[bt]} text-white shadow-md` : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                        {bt}
                      </button>
                    ))}
                  </div>
                </FormField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label={isTa ? 'மருத்துவமனை பெயர்' : 'Hospital Name'} required>
                    <input type="text" value={reqForm.hospital} onChange={e => setReqForm(f => ({ ...f, hospital: e.target.value }))} placeholder={isTa ? 'மருத்துவமனை பெயர்' : 'Hospital name'} className="form-input" />
                  </FormField>
                  <FormField label={isTa ? 'மாவட்டம்' : 'District'} required>
                    <div className="relative">
                      <select value={reqForm.district} onChange={e => setReqForm(f => ({ ...f, district: e.target.value }))} className="form-select">
                        <option value="">{isTa ? 'மாவட்டம் தேர்வு' : 'Select district'}</option>
                        {TN_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </FormField>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label={isTa ? 'அலகுகள் தேவை' : 'Units Needed'}>
                    <input type="number" min="1" max="10" value={reqForm.units} onChange={e => setReqForm(f => ({ ...f, units: parseInt(e.target.value) || 1 }))} className="form-input" />
                  </FormField>
                  <FormField label={isTa ? 'அவசர நிலை' : 'Urgency Level'}>
                    <div className="relative">
                      <select value={reqForm.urgency} onChange={e => setReqForm(f => ({ ...f, urgency: e.target.value as any }))} className="form-select">
                        <option value="PLANNED">{isTa ? 'திட்டமிட்டது (24-48 மணி)' : 'Planned (24-48 hrs)'}</option>
                        <option value="URGENT">{isTa ? 'அவசரம் (6-12 மணி)' : 'Urgent (6-12 hrs)'}</option>
                        <option value="CRITICAL">{isTa ? 'மிகவும் அவசரம் (உடனடி)' : 'Critical (Immediate)'}</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </FormField>
                </div>

                <FormField label={isTa ? 'கூடுதல் குறிப்புகள் (விரும்பினால்)' : 'Additional Notes (optional)'}>
                  <textarea value={reqForm.notes} onChange={e => setReqForm(f => ({ ...f, notes: e.target.value }))} rows={2}
                    placeholder={isTa ? 'நோயாளியின் நிலை, அறுவை சிகிச்சை தகவல் போன்றவை...' : 'Patient condition, surgery info, etc...'}
                    className="form-input resize-none" />
                </FormField>

                <button
                  onClick={handleSubmitRequest}
                  disabled={reqLoading || !reqForm.patientName || !reqForm.bloodType || !reqForm.hospital || !reqForm.district || !reqForm.contactPhone}
                  className="w-full py-4 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-extrabold text-sm shadow-lg transition-all flex items-center justify-center space-x-2 min-h-[48px]"
                >
                  {reqLoading ? <Loader2 size={18} className="animate-spin" /> : <Siren size={18} />}
                  <span>{reqLoading ? (isTa ? 'அனுப்புகிறது...' : 'Posting...') : (isTa ? 'அவசர கோரிக்கை அனுப்பு' : 'Post Urgent Request')}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── DONATE TAB ── */}
        {activeTab === 'DONATE' && (
          <div className="space-y-5">
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-start space-x-3">
              <Heart size={20} className="text-rose-500 shrink-0 mt-0.5 fill-rose-200" />
              <div className="text-xs text-rose-800 space-y-1">
                <p className="font-bold text-sm">{isTa ? 'ஒரு உயிரை காப்பாற்றுங்கள் — இரத்தம் தானம் செய்யுங்கள்' : 'Save a life — Register as a Blood Donor'}</p>
                <p>{isTa ? '18-65 வயதுடைய ஆரோக்கியமான நபர்கள் 3 மாதத்திற்கு ஒருமுறை (90 நாட்கள் இடைவெளி) இரத்தம் தானம் செய்யலாம்.' : 'Healthy individuals aged 18–65 can donate blood every 3 months (90 days interval).'}</p>
              </div>
            </div>

            {donorSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-3 animate-in fade-in">
                <Heart size={42} className="mx-auto text-rose-500 fill-rose-200" />
                <p className="font-bold text-emerald-800 text-sm">{donorSuccess}</p>
                <button onClick={() => setDonorSuccess('')} className="text-xs text-emerald-600 hover:underline">
                  {isTa ? 'வேறொருவரை பதிவு செய்க' : 'Register another donor'}
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <h3 className="font-extrabold text-slate-800 text-base">{isTa ? 'தானியாளர் பதிவு படிவம்' : 'Donor Registration Form'}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label={isTa ? 'உங்கள் பெயர்' : 'Your Name'} required>
                    <input type="text" value={donorForm.name} onChange={e => setDonorForm(f => ({ ...f, name: e.target.value }))} placeholder={isTa ? 'முழு பெயர்' : 'Full name'} className="form-input" />
                  </FormField>
                  <FormField label={isTa ? 'தொலைபேசி எண்' : 'Phone Number'} required>
                    <input type="tel" value={donorForm.phone} onChange={e => setDonorForm(f => ({ ...f, phone: e.target.value }))} placeholder="98765 43210" className="form-input" />
                  </FormField>
                </div>

                <FormField label={isTa ? 'உங்கள் இரத்த வகை' : 'Your Blood Group'} required>
                  <div className="grid grid-cols-8 gap-1.5">
                    {ALL_BLOOD_TYPES.map(bt => (
                      <button key={bt} onClick={() => setDonorForm(f => ({ ...f, bloodType: bt }))}
                        className={`py-2.5 rounded-xl font-black text-sm transition-all min-h-[40px] ${donorForm.bloodType === bt ? `${BLOOD_TYPE_COLORS[bt]} text-white shadow-md` : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                        {bt}
                      </button>
                    ))}
                  </div>
                </FormField>

                <FormField label={isTa ? 'மாவட்டம்' : 'Your District'} required>
                  <div className="relative">
                    <select value={donorForm.district} onChange={e => setDonorForm(f => ({ ...f, district: e.target.value }))} className="form-select">
                      <option value="">{isTa ? 'மாவட்டம் தேர்வு' : 'Select district'}</option>
                      {TN_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </FormField>

                <div className="flex items-center space-x-3 bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
                  <button
                    onClick={() => setDonorForm(f => ({ ...f, available: !f.available }))}
                    className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${donorForm.available ? 'bg-emerald-600' : 'bg-slate-300'}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${donorForm.available ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{isTa ? 'இப்போது தானம் செய்ய தயாராக இருக்கிறேன்' : 'I am available to donate now'}</p>
                    <p className="text-[10px] text-slate-500">{isTa ? 'இதை மாற்ற நீங்கள் எப்போது வேண்டுமானாலும் உங்கள் விருப்பத்தை புதுப்பிக்கலாம்' : 'You can update your availability status anytime'}</p>
                  </div>
                </div>

                <button
                  onClick={handleRegisterDonor}
                  disabled={donorLoading || !donorForm.name || !donorForm.bloodType || !donorForm.district || !donorForm.phone}
                  className="w-full py-4 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-extrabold text-sm shadow-lg transition-all flex items-center justify-center space-x-2 min-h-[48px]"
                >
                  {donorLoading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
                  <span>{donorLoading ? (isTa ? 'பதிவு செய்கிறது...' : 'Registering...') : (isTa ? 'தானியாளராக பதிவு செய்' : 'Register as Donor')}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── BANK DASHBOARD TAB ── */}
        {activeTab === 'BANK_DASHBOARD' && (
          <div className="space-y-5">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start space-x-3">
              <Building2 size={18} className="text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 font-semibold leading-relaxed">
                {isTa ? 'இரத்த வங்கி / மருத்துவமனைகளுக்கு மட்டும். உங்கள் நிறுவனத்தை பதிவு செய்து இரத்த கையிருப்பை நேரடியாக புதுப்பிக்கவும்.' : 'For blood banks & hospitals only. Register your institution and update stock levels in real-time.'}
              </p>
            </div>

            {bankSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-3 animate-in fade-in">
                <Building2 size={42} className="mx-auto text-emerald-500" />
                <p className="font-bold text-emerald-800 text-sm">{bankSuccess}</p>
                <button onClick={() => setBankSuccess('')} className="text-xs text-emerald-600 hover:underline">
                  {isTa ? 'மற்றொரு வங்கி பதிவு செய்க' : 'Register another bank'}
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
                <h3 className="font-extrabold text-slate-800 text-base">{isTa ? 'இரத்த வங்கி பதிவு படிவம்' : 'Blood Bank Registration'}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label={isTa ? 'வங்கி / மருத்துவமனை பெயர்' : 'Bank / Hospital Name'} required>
                    <input type="text" value={bankForm.name} onChange={e => setBankForm(f => ({ ...f, name: e.target.value }))} placeholder={isTa ? 'நிறுவன பெயர்' : 'Institution name'} className="form-input" />
                  </FormField>
                  <FormField label={isTa ? 'தொலைபேசி எண்' : 'Contact Phone'} required>
                    <input type="tel" value={bankForm.phone} onChange={e => setBankForm(f => ({ ...f, phone: e.target.value }))} placeholder="044-XXXXXXXX" className="form-input" />
                  </FormField>
                  <FormField label={isTa ? 'முழு முகவரி' : 'Full Address'} required>
                    <input type="text" value={bankForm.address} onChange={e => setBankForm(f => ({ ...f, address: e.target.value }))} placeholder={isTa ? 'தெரு, நகர்' : 'Street, City'} className="form-input" />
                  </FormField>
                  <FormField label={isTa ? 'மாவட்டம்' : 'District'} required>
                    <div className="relative">
                      <select value={bankForm.district} onChange={e => setBankForm(f => ({ ...f, district: e.target.value }))} className="form-select">
                        <option value="">{isTa ? 'மாவட்டம் தேர்வு' : 'Select district'}</option>
                        {TN_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </FormField>
                  <FormField label={isTa ? 'வகை' : 'Type'}>
                    <div className="relative">
                      <select value={bankForm.type} onChange={e => setBankForm(f => ({ ...f, type: e.target.value as any }))} className="form-select">
                        <option value="Government">{isTa ? 'அரசு' : 'Government'}</option>
                        <option value="Hospital">{isTa ? 'மருத்துவமனை' : 'Hospital'}</option>
                        <option value="Private">{isTa ? 'தனியார்' : 'Private'}</option>
                        <option value="NGO">NGO</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </FormField>
                  <FormField label={isTa ? 'இயக்க நேரம்' : 'Operating Hours'}>
                    <input type="text" value={bankForm.operatingHours} onChange={e => setBankForm(f => ({ ...f, operatingHours: e.target.value }))} placeholder="24/7 or 8AM–8PM" className="form-input" />
                  </FormField>
                </div>

                {/* Stock Input */}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{isTa ? 'தற்போதைய இரத்த கையிருப்பு (அலகுகள்):' : 'Current Blood Stock (units):'}</p>
                  <div className="grid grid-cols-4 gap-3">
                    {ALL_BLOOD_TYPES.map(bt => (
                      <div key={bt} className="space-y-1">
                        <div className={`text-center py-1 rounded-lg text-white text-xs font-black ${BLOOD_TYPE_COLORS[bt]}`}>{bt}</div>
                        <input
                          type="number" min="0" max="99"
                          value={bankStock[bt]}
                          onChange={e => setBankStock(s => ({ ...s, [bt]: parseInt(e.target.value) || 0 }))}
                          className="w-full text-center bg-slate-100 border-none rounded-xl py-2 text-sm font-bold focus:ring-2 focus:ring-rose-500"
                        />
                        {bankStock[bt] <= 2 && bankStock[bt] > 0 && (
                          <p className="text-[9px] text-rose-600 text-center font-bold">⚠ {isTa ? 'குறைவு' : 'Low'}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleRegisterBank}
                  disabled={bankLoading || !bankForm.name || !bankForm.address || !bankForm.district || !bankForm.phone}
                  className="w-full py-4 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-extrabold text-sm shadow-lg transition-all flex items-center justify-center space-x-2 min-h-[48px]"
                >
                  {bankLoading ? <Loader2 size={18} className="animate-spin" /> : <Building2 size={18} />}
                  <span>{bankLoading ? (isTa ? 'பதிவு செய்கிறது...' : 'Registering...') : (isTa ? 'வங்கியை பதிவு செய்து கையிருப்பை புதுப்பிக்கவும்' : 'Register Bank & Update Stock')}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Helper components ──
const FormField: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-600">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    {children}
  </div>
);

export default BloodBank;
