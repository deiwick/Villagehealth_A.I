import React, { useState } from 'react';
import { 
  UserCheck, 
  PhoneCall, 
  Video, 
  X, 
  ShieldCheck, 
  Clock, 
  Stethoscope, 
  Sparkles,
  CheckCircle,
  Headphones
} from 'lucide-react';
import { SupportedLanguage } from '../types';

interface LiveDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
}

export const LiveDoctorModal: React.FC<LiveDoctorModalProps> = ({ isOpen, onClose, language }) => {
  const [connectingState, setConnectingState] = useState<'IDLE' | 'SEARCHING' | 'CONNECTED'>('IDLE');
  const [selectedConsultType, setSelectedConsultType] = useState<'AUDIO' | 'VIDEO'>('AUDIO');

  if (!isOpen) return null;

  const handleStartConsult = () => {
    setConnectingState('SEARCHING');
    setTimeout(() => {
      setConnectingState('CONNECTED');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col border border-emerald-100">
        
        {/* Header */}
        <div className="bg-emerald-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/20 rounded-2xl">
              <Stethoscope size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Live Doctor Consultation</h3>
              <p className="text-xs text-emerald-100 mt-0.5">Connect with certified duty medical officers</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {connectingState === 'IDLE' && (
            <>
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-start space-x-3">
                <ShieldCheck size={24} className="text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 leading-relaxed">
                  <p className="font-bold">24/7 Telemedicine Hotline & Live Duty Officer</p>
                  <p className="mt-1 opacity-90">
                    Free triage consultation provided in cooperation with National Tele-Health Services (104) and local community healthcare networks.
                  </p>
                </div>
              </div>

              {/* Consultation Type Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedConsultType('AUDIO')}
                    className={`p-4 rounded-2xl border-2 text-left flex flex-col items-start transition-all ${
                      selectedConsultType === 'AUDIO' 
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 shadow-sm' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Headphones size={24} className={selectedConsultType === 'AUDIO' ? 'text-emerald-600' : 'text-slate-400'} />
                    <span className="font-bold text-sm mt-2">Audio Call</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">Low bandwidth suitable</span>
                  </button>

                  <button
                    onClick={() => setSelectedConsultType('VIDEO')}
                    className={`p-4 rounded-2xl border-2 text-left flex flex-col items-start transition-all ${
                      selectedConsultType === 'VIDEO' 
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 shadow-sm' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Video size={24} className={selectedConsultType === 'VIDEO' ? 'text-emerald-600' : 'text-slate-400'} />
                    <span className="font-bold text-sm mt-2">Video Call</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">Visual symptom check</span>
                  </button>
                </div>
              </div>

              {/* Doctor Status Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      Dr
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Duty Medical Officer Available</p>
                    <p className="text-[10px] text-slate-500 flex items-center">
                      <Clock size={10} className="mr-1 text-emerald-600" /> Avg wait time: &lt; 1 min
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
                  Online
                </span>
              </div>

              <button
                onClick={handleStartConsult}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Sparkles size={18} />
                <span>Connect to Available Doctor Now</span>
              </button>

              <div className="text-center pt-2">
                <a
                  href="tel:104"
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center justify-center"
                >
                  <PhoneCall size={14} className="mr-1.5" />
                  Or direct dial 104 (National Health Helpline)
                </a>
              </div>
            </>
          )}

          {connectingState === 'SEARCHING' && (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <h4 className="font-bold text-slate-800">Assigning Duty Medical Officer...</h4>
              <p className="text-xs text-slate-500">Connecting via secure tele-health channel in {language.nativeName}</p>
            </div>
          )}

          {connectingState === 'CONNECTED' && (
            <div className="text-center py-6 space-y-6 animate-in fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={36} />
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-lg">Consultation Line Ready!</h4>
                <p className="text-xs text-slate-500">Dr. S. Ramesh (MBBS, General Medicine) is on standby.</p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-left text-xs text-emerald-900 space-y-2">
                <div className="flex justify-between font-bold">
                  <span>Hotline Number:</span>
                  <span>104 / +91-1800-425-3993</span>
                </div>
                <div className="flex justify-between">
                  <span>Language:</span>
                  <span>{language.name} ({language.nativeName})</span>
                </div>
              </div>

              <a
                href="tel:104"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <PhoneCall size={20} />
                <span>Tap to Call Duty Doctor (104)</span>
              </a>

              <button
                onClick={() => setConnectingState('IDLE')}
                className="text-xs text-slate-400 hover:text-slate-600 font-medium"
              >
                Back to options
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default LiveDoctorModal;
