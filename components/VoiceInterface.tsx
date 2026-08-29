import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Info, Loader2, Radio, Sparkles, VolumeX, ShieldAlert, Play, Send } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { chatWithHealthAssistant } from '../services/geminiService';

interface VoiceInterfaceProps {
  language: SupportedLanguage;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ language }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING'>('IDLE');
  const [transcript, setTranscript] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isMountedRef = useRef(true);

  // Map app language code to BCP 47 speech locale
  const getSpeechLocale = (langCode: string) => {
    switch (langCode) {
      case 'ta': return 'ta-IN';
      case 'hi': return 'hi-IN';
      case 'es': return 'es-ES';
      case 'sw': return 'sw-KE';
      case 'bn': return 'bn-IN';
      case 'vi': return 'vi-VN';
      case 'pt': return 'pt-BR';
      default: return 'en-US';
    }
  };

  useEffect(() => {
    isMountedRef.current = true;

    // Pre-warm speech synthesis voices
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.getVoices();
    }

    // Check SpeechRecognition browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = getSpeechLocale(language.code);

      recognition.onstart = () => {
        if (!isMountedRef.current) return;
        setStatus('LISTENING');
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        const currentText = final || interim;
        if (currentText) {
          setTranscript(currentText);
        }

        if (final && final.trim().length > 1) {
          handleUserSpeech(final.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech Recognition Event Error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage("Microphone access denied. You can still use the text input below to test voice output.");
          setIsActive(false);
          setStatus('IDLE');
        }
      };

      recognition.onend = () => {
        if (isActive && status === 'LISTENING') {
          // Restart if still active
          try { recognition.start(); } catch (e) {}
        }
      };

      recognitionRef.current = recognition;
    } else {
      setErrorMessage("Microphone voice recognition is not supported in this browser. You can use the voice synthesis prompt box below.");
    }

    return () => {
      isMountedRef.current = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [language]);

  const handleUserSpeech = async (userText: string) => {
    if (!isMountedRef.current || !userText.trim()) return;

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    setStatus('THINKING');

    try {
      const response = await chatWithHealthAssistant(userText, language.name);
      const replyText = response.text || "I understand. Please consult a doctor for further evaluation.";

      if (!isMountedRef.current) return;

      setLastResponse(replyText);
      speakResponse(replyText);
    } catch (err) {
      console.error("Voice processing error:", err);
      const fallbackReply = language.code === 'ta'
        ? 'மன்னிக்கவும், மருத்துவ உதவியை அணுக முடிந்தது. உடனடியாக 112 அல்லது 104 ஐ தொடர்பு கொள்ளவும்.'
        : 'I am here to assist you. If you have an urgent medical concern, please dial emergency 112.';
      
      setLastResponse(fallbackReply);
      speakResponse(fallbackReply);
    }
  };

  const speakResponse = (text: string) => {
    if (!('speechSynthesis' in window)) {
      setStatus('IDLE');
      return;
    }

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume(); // Unblock Chrome Web Audio context

      setStatus('SPEAKING');

      // Clean markdown symbols for natural speech synthesis
      const cleanText = text.replace(/[*_#`~-]/g, ' ').replace(/\s+/g, ' ').slice(0, 350);

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const targetLocale = getSpeechLocale(language.code);
      utterance.lang = targetLocale;
      utterance.rate = 0.92;
      utterance.pitch = 1.0;

      // Match best native voice for language if available
      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find(v => v.lang.startsWith(targetLocale) || v.lang.startsWith(language.code));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onend = () => {
        if (!isMountedRef.current) return;
        setStatus('IDLE');
        if (isActive && recognitionRef.current) {
          try { recognitionRef.current.start(); } catch (e) {}
        }
      };

      utterance.onerror = (e) => {
        console.warn("Speech Synthesis Error:", e);
        if (!isMountedRef.current) return;
        setStatus('IDLE');
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Speech synthesis failed:", err);
      setStatus('IDLE');
    }
  };

  const toggleSession = () => {
    if (isActive) {
      setIsActive(false);
      setStatus('IDLE');
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      setIsActive(true);
      setTranscript('');
      setLastResponse('');
      setErrorMessage(null);

      if (recognitionRef.current) {
        try {
          recognitionRef.current.lang = getSpeechLocale(language.code);
          recognitionRef.current.start();
        } catch (e) {
          console.warn("Error starting speech recognition:", e);
        }
      }
    }
  };

  const samplePrompts = language.code === 'ta' ? [
    'காய்ச்சல் இருந்தால் என்ன செய்வது?',
    'பாம்பு கடித்தால் முதலுதவி என்ன?',
    'குழந்தைகளுக்கான தடுப்பூசி என்ன?',
  ] : [
    'What should I do for a high fever?',
    'What is the first aid for a snakebite?',
    'How do I find a nearby children clinic?',
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 bg-slate-50 relative overflow-hidden">
      
      {/* Background Pulse Rings */}
      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`w-72 h-72 rounded-full ${status === 'SPEAKING' ? 'bg-blue-400/20' : 'bg-emerald-400/20'} animate-ping duration-1000`} />
          <div className={`w-56 h-56 rounded-full ${status === 'THINKING' ? 'bg-amber-400/30 animate-pulse' : 'bg-emerald-400/30'} transition-transform duration-300`} />
        </div>
      )}

      <div className="max-w-md w-full text-center space-y-6 relative z-10">
        
        {/* Main Microphone Button */}
        <div className="relative inline-block">
          <button
            onClick={toggleSession}
            className={`relative z-10 w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl ${
              isActive 
                ? status === 'SPEAKING'
                  ? 'bg-blue-600 hover:bg-blue-700 ring-8 ring-blue-100'
                  : status === 'THINKING'
                    ? 'bg-amber-500 hover:bg-amber-600 ring-8 ring-amber-100'
                    : 'bg-rose-500 hover:bg-rose-600 ring-8 ring-rose-100' 
                : 'bg-emerald-600 hover:bg-emerald-700 ring-8 ring-emerald-100 active:scale-95'
            }`}
          >
            {status === 'THINKING' ? (
              <Loader2 className="animate-spin text-white" size={44} />
            ) : status === 'SPEAKING' ? (
              <Volume2 className="text-white animate-bounce" size={44} />
            ) : isActive ? (
              <MicOff className="text-white" size={44} />
            ) : (
              <Mic className="text-white" size={44} />
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider text-white mt-1">
              {status === 'THINKING' ? 'Processing...' : status === 'SPEAKING' ? 'Speaking...' : isActive ? 'Tap to Stop' : 'Tap to Speak'}
            </span>
          </button>
        </div>

        {/* Status Heading */}
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-800">
            {status === 'SPEAKING' ? (language.code === 'ta' ? 'பதிலளிக்கிறது...' : 'AI Responding Out Loud...') :
             status === 'THINKING' ? (language.code === 'ta' ? 'சிந்திக்கிறது...' : 'Analyzing Medical Info...') :
             status === 'LISTENING' ? (language.code === 'ta' ? 'கேட்கிறேன்...' : "I'm Listening...") :
             (language.code === 'ta' ? 'பேசி மருத்துவ உதவி பெறுக' : 'Live Voice Assistant')}
          </h2>
          <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
            {isActive 
              ? `Speaking in ${language.nativeName} (${language.name}). Audio output is active.` 
              : `Tap the microphone or use the voice box below.`}
          </p>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-800 text-xs font-semibold flex items-center space-x-2 text-left">
            <ShieldAlert size={18} className="shrink-0 text-amber-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Live Transcription Box */}
        {transcript && (
          <div className="bg-white p-4 rounded-3xl shadow-md border border-slate-100 text-left animate-in fade-in space-y-1">
            <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Radio size={12} className="text-emerald-500 animate-pulse" />
              <span>Transcribed Speech:</span>
            </div>
            <p className="text-slate-800 text-sm font-medium italic">
              "{transcript}"
            </p>
          </div>
        )}

        {/* AI Response Display with Manual Replay Button */}
        {lastResponse && (
          <div className="bg-emerald-50/90 border border-emerald-200 p-5 rounded-3xl text-left space-y-3 animate-in fade-in shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-[10px] font-bold text-emerald-800 uppercase tracking-widest">
                <Sparkles size={14} className="text-emerald-600" />
                <span>AI Audio Response</span>
              </div>
              <button
                onClick={() => speakResponse(lastResponse)}
                className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                <Volume2 size={14} />
                <span>Replay Audio</span>
              </button>
            </div>
            <p className="text-slate-800 text-xs md:text-sm leading-relaxed font-semibold">
              {lastResponse}
            </p>
          </div>
        )}

        {/* Text Input & Quick Sample Voice Prompts */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center space-x-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && manualInput.trim()) {
                  handleUserSpeech(manualInput.trim());
                  setManualInput('');
                }
              }}
              placeholder={language.code === 'ta' ? 'கேள்வி தட்டச்சு செய்க...' : 'Type or ask a voice question...'}
              className="flex-1 border-none focus:ring-0 text-xs text-slate-800 font-medium px-2"
            />
            <button
              onClick={() => {
                if (manualInput.trim()) {
                  handleUserSpeech(manualInput.trim());
                  setManualInput('');
                }
              }}
              className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 justify-center">
            {samplePrompts.map((promptText, idx) => (
              <button
                key={idx}
                onClick={() => handleUserSpeech(promptText)}
                className="bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all"
              >
                "{promptText}"
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default VoiceInterface;
