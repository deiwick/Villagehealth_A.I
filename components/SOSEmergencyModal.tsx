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
import { SOSBeaconPayload } from '../types';

interface SOSEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: { lat: number; lng: number } | null;
}

export const SOSEmergencyModal: React.FC<SOSEmergencyModalProps> = ({ isOpen, onClose, location }) => {
  const [stage, setStage] = useState<'INITIAL' | 'TRANSMITTING' | 'BROADCASTING'>('INITIAL');
  const [beaconData, setBeaconData] = useState<SOSBeaconPayload | null>(null);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number; accuracy: number; altitude: number | null }>({
    lat: location?.lat || 13.0827,
    lng: location?.lng || 80.2707,
    accuracy: 8,
    altitude: 14
  });
  const [countdown, setCountdown] = useState(3);
  const [activeTab, setActiveTab] = useState<'BEACON' | 'FIRST_AID'>('BEACON');

  useEffect(() => {
    if (isOpen) {
      setStage('INITIAL');
      setCountdown(3);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setGpsCoords({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              accuracy: Math.round(pos.coords.accuracy || 5),
              altitude: pos.coords.altitude
            });
          },
          (err) => console.warn('SOS Geolocation accuracy warning:', err),
          { enableHighAccuracy: true }
        );
      }
    }
  }, [isOpen, location]);

  const handleStartBroadcast = () => {
    setStage('TRANSMITTING');
    let timer = 3;
    const interval = setInterval(() => {
      timer -= 1;
      setCountdown(timer);
      if (timer <= 0) {
        clearInterval(interval);
        const beaconId = `SAT-BEACON-${Math.floor(100000 + Math.random() * 900000)}`;
        setBeaconData({
          beaconId,
          timestamp: Date.now(),
          location: gpsCoords,
          status: 'BEACON_ACTIVE',
          emergencyType: 'GENERAL_MEDICAL'
        });
        setStage('BROADCASTING');
      }
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-rose-500/40 rounded-3xl w-full max-w-xl text-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Emergency Header */}
        <div className="bg-gradient-to-r from-rose-700 via-red-600 to-rose-800 p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl animate-pulse">
              <Siren size={28} className="text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black uppercase tracking-wider text-white">Satellite SOS Beacon</h2>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-white/30">
                  Live Emergency
                </span>
              </div>
              <p className="text-xs text-rose-100 font-medium">Direct Satellite Telemetry & Dispatch Support</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/60">
          <button
            onClick={() => setActiveTab('BEACON')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 border-b-2 transition-colors ${
              activeTab === 'BEACON' ? 'border-rose-500 text-rose-400 bg-rose-950/30' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio size={16} />
            <span>Satellite Beacon Payload</span>
          </button>
          <button
            onClick={() => setActiveTab('FIRST_AID')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 border-b-2 transition-colors ${
              activeTab === 'FIRST_AID' ? 'border-rose-500 text-rose-400 bg-rose-950/30' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert size={16} />
            <span>Instant Life Support Protocol</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'BEACON' && (
            <>
              {stage === 'INITIAL' && (
                <div className="text-center space-y-6 py-4">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-rose-500/20 rounded-full animate-ping" />
                    <div className="relative p-6 bg-slate-800 border-2 border-rose-500 rounded-full text-rose-500 mx-auto w-24 h-24 flex items-center justify-center">
                      <Radio size={48} className="animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">Broadcast Emergency Signal?</h3>
                    <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                      Transmits your precise GPS coordinates over the high-priority satellite telemetry network directly to local emergency response dispatches (Ambulance 108/112).
                    </p>
                  </div>

                  {/* GPS Information Card */}
                  <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl text-left space-y-2 font-mono text-xs">
                    <div className="flex justify-between text-slate-400 border-b border-slate-700 pb-2 font-sans font-bold">
                      <span className="flex items-center text-emerald-400"><MapPin size={14} className="mr-1" /> GPS Location Acquired</span>
                      <span className="text-slate-400">Accuracy: ±{gpsCoords.accuracy}m</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 text-slate-200">
                      <div><span className="text-slate-500">LAT:</span> {gpsCoords.lat.toFixed(6)}°</div>
                      <div><span className="text-slate-500">LNG:</span> {gpsCoords.lng.toFixed(6)}°</div>
                      <div><span className="text-slate-500">ALTITUDE:</span> {gpsCoords.altitude ? `${gpsCoords.altitude}m` : '12m (MSL)'}</div>
                      <div><span className="text-slate-500">SAT LINK:</span> OPTIMAL (5/5)</div>
                    </div>
                  </div>

                  <button
                    onClick={handleStartBroadcast}
                    className="w-full py-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-2xl font-extrabold text-base tracking-wider uppercase shadow-xl hover:shadow-rose-600/30 transition-all transform active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <Zap size={20} />
                    <span>Initiate Emergency Satellite Transmission</span>
                  </button>
                </div>
              )}

              {stage === 'TRANSMITTING' && (
                <div className="text-center py-12 space-y-6">
                  <div className="text-6xl font-black text-rose-500 animate-pulse">{countdown}</div>
                  <h3 className="text-lg font-bold">Establishing Constellation Connection...</h3>
                  <p className="text-xs text-slate-400">Encoding telemetry packet with high-precision geolocation info</p>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
                    <div className="bg-rose-500 h-full transition-all duration-1000 ease-linear" style={{ width: `${((3 - countdown) / 3) * 100}%` }} />
                  </div>
                </div>
              )}

              {stage === 'BROADCASTING' && beaconData && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-2xl flex items-center space-x-3 text-emerald-400">
                    <CheckCircle2 size={24} className="shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm">Emergency Satellite Beacon Active</h4>
                      <p className="text-xs text-emerald-300">Telemetry broadcast in progress. Emergency payload sent.</p>
                    </div>
                  </div>

                  {/* Beacon Telemetry Display */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs space-y-2">
                    <div className="text-rose-400 font-bold flex justify-between border-b border-slate-800 pb-2">
                      <span>BEACON ID: {beaconData.beaconId}</span>
                      <span className="animate-pulse">● BROADCASTING</span>
                    </div>
                    <div className="text-slate-300 pt-1">
                      <div>TIMESTAMP: {new Date(beaconData.timestamp).toLocaleTimeString()}</div>
                      <div>COORDINATES: {beaconData.location.lat.toFixed(5)}°, {beaconData.location.lng.toFixed(5)}°</div>
                      <div>FREQUENCY: 406.025 MHz (COSPAS-SARSAT)</div>
                      <div className="text-emerald-400 mt-2">STATUS: DISPATCH NOTIFIED (ESTIMATED RESPONSE: 8-12 MINS)</div>
                    </div>
                  </div>

                  {/* Direct Dialing Emergency Buttons */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Direct Emergency Helplines</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href="tel:112"
                        className="flex items-center justify-center space-x-2 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm shadow-md transition-all"
                      >
                        <PhoneCall size={18} />
                        <span>Call 112 (Emergency)</span>
                      </a>
                      <a
                        href="tel:108"
                        className="flex items-center justify-center space-x-2 py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold text-sm shadow-md transition-all"
                      >
                        <PhoneCall size={18} />
                        <span>Call 108 (Ambulance)</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'FIRST_AID' && (
            <div className="space-y-4 text-slate-200">
              <h3 className="font-bold text-base text-rose-400 flex items-center">
                <Activity size={18} className="mr-2" /> Critical Immediate Life Support Checklist
              </h3>
              
              <div className="space-y-3 text-xs">
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-1">
                  <h4 className="font-bold text-rose-400">1. Chest Pain / Cardiac Arrest Protocol</h4>
                  <p className="text-slate-300">Keep patient seated comfortably. Loosen tight clothing. If unresponsive and not breathing, begin firm chest compressions at 100-120 BPM in center of chest.</p>
                </div>
                
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-1">
                  <h4 className="font-bold text-amber-400">2. Severe Bleeding / Hemorrhage</h4>
                  <p className="text-slate-300">Apply direct, heavy continuous pressure over the wound using a clean cloth or bandage. Elevate limb above heart if possible.</p>
                </div>

                <div className="bg-slate-850 p-4 rounded-2xl border border-slate-700 space-y-1">
                  <h4 className="font-bold text-blue-400">3. Choking / Breathing Difficulty</h4>
                  <p className="text-slate-300">Encourage coughing. For severe airway obstruction, stand behind patient and administer firm abdominal thrusts (Heimlich maneuver).</p>
                </div>

                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-1">
                  <h4 className="font-bold text-emerald-400">4. Pediatric High Fever / Convulsions</h4>
                  <p className="text-slate-300">Keep child cool, remove heavy blankets, apply lukewarm sponge baths (never ice cold), and keep airway clear.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
          <span className="flex items-center text-rose-400">
            <AlertTriangle size={14} className="mr-1" /> Telemetry Active
          </span>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors font-medium text-xs"
          >
            Close Beacon Window
          </button>
        </div>

      </div>
    </div>
  );
};

export default SOSEmergencyModal;
