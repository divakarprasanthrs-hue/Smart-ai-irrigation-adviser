import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Trash2, ArrowRight } from 'lucide-react';
import { Language, ChatMessage, CropType, SoilType } from '../types';
import { TRANSLATIONS } from '../data';

interface AIChatbotSectionProps {
  currentLanguage: Language;
  crop: CropType;
  soil: SoilType;
}

const SUGGESTIONS: Record<Language, string[]> = {
  en: [
    'Should I water today?',
    'Will it rain tomorrow?',
    'How much water does rice need?',
    'What is the best time of day to irrigate?'
  ],
  ta: [
    'நான் இன்று தண்ணீர் பாய்ச்ச வேண்டுமா?',
    'நாளை மழை பெய்யுமா?',
    'நெல்லுக்கு எவ்வளவு தண்ணீர் தேவை?',
    'நீர் பாய்ச்ச சிறந்த நேரம் எது?'
  ],
  hi: [
    'क्या मुझे आज पानी देना चाहिए?',
    'क्या कल बारिश होगी?',
    'चावल को कितने पानी की आवश्यकता होती है?',
    'सिंचाई के लिए दिन का सबसे अच्छा समय कौन सा है?'
  ],
  te: [
    'నేను ఈ రోజు నీరు పెట్టాలా?',
    'రేపు వర్షం పడుతుందా?',
    'వరి పంటకు ఎంత నీరు అవసరం?',
    'నీటిపారుదలకి ఉత్తమ సమయం ఏది?'
  ],
  kn: [
    'ನಾನು ಇಂದು ನೀರುಣಿಸಬೇಕೇ?',
    'ನಾಳೆ ಮಳೆ ಬರುತ್ತದೆಯೇ?',
    'ಭತ್ತಕ್ಕೆ ಎಷ್ಟು ನೀರಿನ ಅವಶ್ಯಕತೆಯಿದೆ?',
    'ನೀರಾವರಿ ಮಾಡಲು ದಿನದ ಉತ್ತಮ ಸಮಯ ಯಾವುದು?'
  ]
};

export default function AIChatbotSection({ currentLanguage, crop, soil }: AIChatbotSectionProps) {
  const t = TRANSLATIONS[currentLanguage];
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: currentLanguage === 'ta'
        ? `வணக்கம்! நான் சிரி-மித்ரா, உங்கள் ஏஐ விவசாய உதவியாளர். நீர்ப்பாசனம், வானிலை மற்றும் பயிர் பாதுகாப்பு பற்றி என்னிடம் கேளுங்கள்.`
        : currentLanguage === 'hi'
        ? `नमस्कार! मैं सीरी-मित्र हूँ, आपका एआई कृषि सहायक। सिंचाई, मौसम और कीट नियंत्रण के बारे में मुझसे कोई भी प्रश्न पूछें।`
        : currentLanguage === 'te'
        ? `నమస్కారం! నేను సిరి-మిత్ర, మీ వ్యవసాయ ఏఐ సహాయకుడిని. నీటిపారుదల, తెగుళ్ళు, మరియు వాతావరణం గురించి ఏదైనా అడగండి.`
        : currentLanguage === 'kn'
        ? `ನಮಸ್ಕಾರ! ನಾನು ಸಿರಿ-ಮಿತ್ರ, ನಿಮ್ಮ ಕೃಷಿ ಎಐ ಸಹಾಯಕ. ನೀರಾವರಿ, ಕೀಟ ನಿಯಂತ್ರಣ ಮತ್ತು ಹವಾಮಾನದ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ.`
        : `Hello! I am Siri-Mitra, your friendly AI Agriculture Assistant. Ask me anything about watering, crop health, weather forecasts, or pest controls.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages,
          language: currentLanguage,
          crop,
          soil
        })
      });

      const data = await response.json();
      const modelMsg: ChatMessage = {
        id: `model_${Date.now()}`,
        role: 'model',
        text: data.reply || 'Sorry, I encountered an issue. Let me try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, modelMsg]);
    } catch (e) {
      console.error(e);
      // Fallback
      const fallbackMsg: ChatMessage = {
        id: `model_${Date.now()}`,
        role: 'model',
        text: 'My connection seems slow. Please ensure you have configured your database sync settings, and try again!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: 'Chat history cleared. How can Siri-Mitra help you today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-150 flex flex-col h-[520px] hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-[1.25rem] border border-blue-100">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5 font-display">
              Siri-Mitra <span className="text-[9px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-[6px] border border-blue-200 font-bold uppercase font-mono">AI Expert</span>
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">Farmers Assistant • Multilingual Voice Guidance</p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="p-2.5 hover:bg-slate-50 border border-transparent hover:border-slate-150 rounded-xl text-slate-400 hover:text-red-500 transition-colors duration-200 cursor-pointer"
          title="Clear Chat History"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 scrollbar-thin">
        {messages.map((msg) => {
          const isModel = msg.role === 'model';
          return (
            <div key={msg.id} className={`flex ${isModel ? 'justify-start' : 'justify-end'} items-start gap-2.5`}>
              {isModel && (
                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-[1.25rem] p-4 shadow-sm ${
                  isModel
                    ? 'bg-slate-50 text-slate-800 border border-slate-150 rounded-tl-none'
                    : 'bg-emerald-600 text-white rounded-tr-none font-medium'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <span className={`block text-[10px] mt-2 ${isModel ? 'text-slate-400 font-mono' : 'text-emerald-200 font-mono'} text-right`}>
                  {msg.timestamp}
                </span>
              </div>
              {!isModel && (
                <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-slate-50 border border-slate-150 text-slate-500 text-sm rounded-[1.25rem] p-4 shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              <span className="font-mono text-xs">Siri-Mitra is thinking...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef}></div>
      </div>

      {/* Suggested prompts */}
      <div className="flex flex-wrap gap-1.5 mb-3 overflow-x-auto py-1 max-h-24">
        {(SUGGESTIONS[currentLanguage] || SUGGESTIONS.en).map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s)}
            className="text-[11px] bg-[#fafaf9] hover:bg-slate-50 text-slate-600 hover:text-emerald-700 font-bold px-3 py-1.5 rounded-xl border border-slate-150 hover:border-slate-300 transition-all duration-200 cursor-pointer shrink-0 flex items-center gap-1 font-sans"
          >
            <span>{s}</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="flex gap-2 bg-[#fafaf9] p-2 rounded-2xl border border-slate-150 focus-within:border-slate-300 transition-colors duration-200"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.askAssistant}
          className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-medium font-sans"
        />
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl transition duration-200 cursor-pointer flex items-center justify-center shadow-md shadow-emerald-600/10"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
