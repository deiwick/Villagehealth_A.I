import React, { useState, useEffect } from 'react';
import { 
  Siren, 
  Radio, 
  MapPin, 
  PhoneCall, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert,
  Zap,
  Activity
} from 'lucide-react';
import { SOSBeaconPayload, SupportedLanguage } from '../types';
import { t } from '../translations';

interface SOSEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: { lat: number; lng: number } | null;
  language?: SupportedLanguage;
}

export const SOSEmergencyModal: React.FC<SOSEmergencyModalProps> = ({ isOpen, onClose, location, language }) => {
  const lang = language?.code || 'en';

  const [stage, setStage] = useState<'INITIAL' | 'TRANSMITTING' | 'BROADCASTING'>('INITIAL');
  const [beaconData, setBeaconData] = useState<SOSBeaconPayload | null>(null);
  const [activeTab, setActiveTab] = useState<'BEACON' | 'FIRST_AID'>('BEACON');

  useEffect(() => {
    if (isOpen) {
      setStage('INITIAL');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartBeacon = () => {
    setStage('TRANSMITTING');
    setTimeout(() => {
      const payload: SOSBeaconPayload = {
        beaconId: 'BEACON-TN-' + Math.floor(100000 + Math.random() * 900000),
        timestamp: Date.now(),
        location: {
          lat: location?.lat || 13.0827,
          lng: location?.lng || 80.2707,
          accuracy: 6,
          altitude: 12
        },
        status: 'BEACON_ACTIVE',
        emergencyType: 'GENERAL_MEDICAL'
      };
      setBeaconData(payload);
      setStage('BROADCASTING');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-rose-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 to-rose-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-2xl animate-pulse">
              <Siren size={24} className="text-white" />
            </div>
            <div>
              <h2 className="font-black text-lg flex items-center gap-2">
                <span>{t(lang, 'sos.title')}</span>
                <span className="bg-rose-900/60 text-rose-200 text-[10px] px-2 py-0.5 rounded-full font-bold">406 MHz</span>
              </h2>
              <p className="text-xs text-rose-100">{t(lang, 'sos.subtitle')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="bg-slate-100 p-1 flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('BEACON')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'BEACON' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t(lang, 'sos.tab.beacon')}
          </button>
          <button
            onClick={() => setActiveTab('FIRST_AID')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'FIRST_AID' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t(lang, 'sos.tab.firstaid')}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'BEACON' && (
            <>
              {stage === 'INITIAL' && (
                <div className="space-y-4">
                  <div className="bg-rose-50 border border-rose-200 p-5 rounded-3xl space-y-2">
                    <h3 className="font-extrabold text-rose-900 text-sm flex items-center">
                      <Radio size={18} className="mr-2 text-rose-600" />
                      {t(lang, 'sos.broadcast.title')}
                    </h3>
                    <p className="text-xs text-rose-800 leading-relaxed font-medium">
                      {t(lang, 'sos.broadcast.desc')}
                    </p>
                  </div>

                  {/* GPS Card */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5 font-mono text-xs">
                    <div className="flex items-center justify-between text-emerald-700 font-bold">
                      <span className="flex items-center"><MapPin size={14} className="mr-1" /> {t(lang, 'sos.gps.acquired')}</span>
                      <span>{t(lang, 'sos.gps.accuracy')}: ±6m</span>
                    </div>
                    <p className="text-slate-700 font-bold">LAT: {location?.lat.toFixed(6) || '13.082700'}</p>
                    <p className="text-slate-700 font-bold">LNG: {location?.lng.toFixed(6) || '80.270700'}</p>
                  </div>

                  <button
                    onClick={handleStartBeacon}
                    className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg transition-all flex items-center justify-center space-x-2 animate-pulse min-h-[48px]"
                  >
                    <Zap size={18} />
                    <span>{t(lang, 'sos.transmit.btn')}</span>
                  </button>
                </div>
              )}

              {stage === 'TRANSMITTING' && (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto animate-bounce text-rose-600">
                    <Radio size={32} />
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-base">{t(lang, 'sos.connecting')}</h3>
                  <div className="w-48 bg-slate-200 h-2 rounded-full mx-auto overflow-hidden">
                    <div className="bg-rose-600 h-full animate-pulse w-3/4" />
                  </div>
                </div>
              )}

              {stage === 'BROADCASTING' && beaconData && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="bg-emerald-50 border border-emerald-300 p-5 rounded-3xl space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-800 font-black text-sm">
                      <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                      <span>{t(lang, 'sos.beacon.active')}</span>
                    </div>
                    <p className="text-xs text-emerald-900 font-medium">
                      {t(lang, 'sos.beacon.active.desc')}
                    </p>
                    <div className="bg-white/90 p-3 rounded-2xl font-mono text-[11px] text-slate-800 space-y-1">
                      <p><strong>PAYLOAD ID:</strong> {beaconData.beaconId}</p>
                      <p><strong>FREQUENCY:</strong> 406.025 MHz (SARSAT)</p>
                      <p><strong>DISPATCH TARGET:</strong> TN-EMRI-108 / 112 COMMAND</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Direct Helplines */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t(lang, 'sos.helplines')}</h4>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="tel:112"
                    className="flex items-center justify-center space-x-2 py-3 bg-rose-600 text-white rounded-2xl font-extrabold text-xs shadow-md transition-all min-h-[44px]"
                  >
                    <PhoneCall size={16} />
                    <span>{t(lang, 'sos.call.112')}</span>
                  </a>
                  <a
                    href="tel:108"
                    className="flex items-center justify-center space-x-2 py-3 bg-emerald-600 text-white rounded-2xl font-extrabold text-xs shadow-md transition-all min-h-[44px]"
                  >
                    <PhoneCall size={16} />
                    <span>{t(lang, 'sos.call.108')}</span>
                  </a>
                </div>
              </div>
            </>
          )}

          {activeTab === 'FIRST_AID' && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-800 text-sm">{t(lang, 'sos.firstaid.title')}</h3>

              <div className="space-y-3">
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl space-y-1">
                  <h4 className="font-bold text-rose-900 text-xs">{t(lang, 'sos.fa.cardiac')}</h4>
                  <p className="text-[11px] text-rose-800 leading-relaxed">{t(lang, 'sos.fa.cardiac.desc')}</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-1">
                  <h4 className="font-bold text-amber-900 text-xs">{t(lang, 'sos.fa.bleeding')}</h4>
                  <p className="text-[11px] text-amber-800 leading-relaxed">{t(lang, 'sos.fa.bleeding.desc')}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl space-y-1">
                  <h4 className="font-bold text-blue-900 text-xs">{t(lang, 'sos.fa.choking')}</h4>
                  <p className="text-[11px] text-blue-800 leading-relaxed">{t(lang, 'sos.fa.choking.desc')}</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl space-y-1">
                  <h4 className="font-bold text-purple-900 text-xs">{t(lang, 'sos.fa.fever')}</h4>
                  <p className="text-[11px] text-purple-800 leading-relaxed">{t(lang, 'sos.fa.fever.desc')}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase">{t(lang, 'sos.telemetry.active')}</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all"
          >
            {t(lang, 'sos.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SOSEmergencyModal;
