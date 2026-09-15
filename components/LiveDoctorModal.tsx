import React, { useState } from 'react';
import { Stethoscope, PhoneCall, Video, UserCheck, Clock, X, AlertCircle, Loader2 } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { t } from '../translations';

interface LiveDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
}

export const LiveDoctorModal: React.FC<LiveDoctorModalProps> = ({ isOpen, onClose, language }) => {
  const lang = language.code;
  const isTa = lang === 'ta';

  const [callMode, setCallMode] = useState<'AUDIO' | 'VIDEO'>('AUDIO');
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  if (!isOpen) return null;

  const handleStartConsultation = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
    }, 2000);
  };

  const handleReset = () => {
    setConnecting(false);
    setConnected(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-emerald-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-2xl">
              <Stethoscope size={24} className="text-white" />
            </div>
            <div>
              <h2 className="font-black text-lg">{t(lang, 'doc.title')}</h2>
              <p className="text-xs text-emerald-100">{t(lang, 'doc.subtitle')}</p>
            </div>
          </div>
          <button onClick={() => { handleReset(); onClose(); }} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {!connecting && !connected && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start space-x-3">
                <AlertCircle size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 space-y-1 font-medium">
                  <p className="font-bold">{t(lang, 'doc.notice')}</p>
                  <p>{t(lang, 'doc.notice.desc')}</p>
                </div>
              </div>

              {/* Mode Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{t(lang, 'doc.mode')}</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setCallMode('AUDIO')}
                    className={`p-4 rounded-2xl border-2 flex items-center space-x-3 transition-all ${
                      callMode === 'AUDIO' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm' : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <PhoneCall size={20} className={callMode === 'AUDIO' ? 'text-emerald-600' : 'text-slate-400'} />
                    <div className="text-left">
                      <p className="font-bold text-xs">{t(lang, 'doc.audio')}</p>
                      <p className="text-[10px] opacity-75">{t(lang, 'doc.audio.desc')}</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setCallMode('VIDEO')}
                    className={`p-4 rounded-2xl border-2 flex items-center space-x-3 transition-all ${
                      callMode === 'VIDEO' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm' : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <Video size={20} className={callMode === 'VIDEO' ? 'text-emerald-600' : 'text-slate-400'} />
                    <div className="text-left">
                      <p className="font-bold text-xs">{t(lang, 'doc.video')}</p>
                      <p className="text-[10px] opacity-75">{t(lang, 'doc.video.desc')}</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Duty Doctor Available Card */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-black">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-800">{t(lang, 'doc.available')}</p>
                    <p className="text-[10px] text-slate-500 flex items-center mt-0.5">
                      <Clock size={10} className="mr-1" /> {t(lang, 'doc.wait')}
                    </p>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">{t(lang, 'doc.online')}</span>
              </div>

              <button
                onClick={handleStartConsultation}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-sm shadow-lg transition-all flex items-center justify-center space-x-2 min-h-[48px]"
              >
                <PhoneCall size={18} />
                <span>{t(lang, 'doc.connect')}</span>
              </button>

              <div className="text-center">
                <a href="tel:104" className="text-xs text-emerald-600 font-bold hover:underline">
                  {t(lang, 'doc.dial')}
                </a>
              </div>
            </div>
          )}

          {connecting && (
            <div className="py-12 text-center space-y-4">
              <Loader2 size={40} className="animate-spin text-emerald-600 mx-auto" />
              <h3 className="font-extrabold text-slate-800 text-base">{t(lang, 'doc.searching')}</h3>
              <p className="text-xs text-slate-500">{t(lang, 'doc.searching.desc')}</p>
            </div>
          )}

          {connected && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-emerald-50 border border-emerald-300 p-5 rounded-3xl text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <UserCheck size={32} />
                </div>
                <div>
                  <h3 className="font-black text-emerald-900 text-base">{t(lang, 'doc.ready')}</h3>
                  <p className="text-xs text-emerald-800 mt-1 font-medium">{t(lang, 'doc.standby')}</p>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-emerald-200 text-xs font-semibold text-slate-800 space-y-1">
                  <p><strong>{t(lang, 'doc.hotline')}</strong> 104 (Toll-Free)</p>
                  <p><strong>{t(lang, 'doc.language')}</strong> {language.nativeName} ({language.name})</p>
                </div>
              </div>

              <a
                href="tel:104"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-sm shadow-lg transition-all flex items-center justify-center space-x-2 min-h-[48px]"
              >
                <PhoneCall size={18} />
                <span>{t(lang, 'doc.call.btn')}</span>
              </a>

              <button
                onClick={handleReset}
                className="w-full py-2.5 text-xs text-slate-500 font-bold hover:underline"
              >
                {t(lang, 'doc.back')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveDoctorModal;
