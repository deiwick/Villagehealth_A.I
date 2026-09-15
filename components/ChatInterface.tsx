import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Info, ExternalLink, MapPin, Stethoscope, PhoneCall } from 'lucide-react';
import { Message, SupportedLanguage } from '../types';
import { chatWithHealthAssistant, parseGroundingSources } from '../services/geminiService';
import { t } from '../translations';

interface ChatInterfaceProps {
  language: SupportedLanguage;
  location: { lat: number; lng: number } | null;
  onOpenLiveDoctor?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ language, location, onOpenLiveDoctor }) => {
  const lang = language.code;
  const welcomeText = t(lang, 'chat.welcome');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: welcomeText,
      timestamp: Date.now(),
    }
  ]);

  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === 'welcome') {
        return [{
          id: 'welcome',
          role: 'assistant',
          text: welcomeText,
          timestamp: Date.now()
        }];
      }
      return prev;
    });
  }, [language]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const locationParams = location ? { latitude: location.lat, longitude: location.lng } : undefined;
      const response = await chatWithHealthAssistant(input, language.name, locationParams);
      
      const sources = parseGroundingSources(response);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: response.text || (lang === 'ta' ? 'மன்னிக்கவும், தகவலை செயலாக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.' : "I'm sorry, I couldn't process that. Please try again."),
        timestamp: Date.now(),
        groundingSources: sources,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Chat Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: t(lang, 'chat.error'),
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top Tele-Health Action Bar */}
      <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-900">
          <Stethoscope size={16} className="text-emerald-600" />
          <span>{t(lang, 'chat.advice')}</span>
        </div>
        {onOpenLiveDoctor && (
          <button 
            onClick={onOpenLiveDoctor}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 min-h-[36px]"
          >
            <PhoneCall size={13} />
            <span>{t(lang, 'chat.livedoctor')}</span>
          </button>
        )}
      </div>

      {/* Message List */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-none' 
                : 'bg-white border border-slate-100 rounded-tl-none text-slate-800'
            }`}>
              <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
                {msg.text}
              </div>
              
              {msg.groundingSources && msg.groundingSources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                    <Info size={12} className="mr-1" /> {t(lang, 'chat.sources')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {msg.groundingSources.map((source, idx) => (
                      <a
                        key={idx}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 transition-all"
                      >
                        <span className="truncate max-w-[120px]">{source.title || (lang === 'ta' ? 'ஆதாரம்' : 'View Resource')}</span>
                        <ExternalLink size={12} className="ml-1.5 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
              
              <div className={`text-[10px] mt-2 ${msg.role === 'user' ? 'text-emerald-200' : 'text-slate-400'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-4 shadow-sm">
              <Loader2 className="animate-spin text-emerald-600" size={20} />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto flex items-center space-x-2">
          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t(lang, 'chat.placeholder')}
              className="w-full bg-slate-100 border-none rounded-2xl py-3.5 pl-4 pr-12 focus:ring-2 focus:ring-emerald-500 transition-all text-slate-800 text-sm font-medium"
              disabled={isLoading}
            />
            {location && (
              <div className="absolute right-3 p-1.5 bg-emerald-50 text-emerald-600 rounded-lg" title="Location active">
                <MapPin size={16} />
              </div>
            )}
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-3.5 rounded-2xl transition-all shadow-md shrink-0 min-w-[48px] min-h-[48px] flex items-center justify-center ${
              !input.trim() || isLoading 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2">
          {t(lang, 'chat.footer')}
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
