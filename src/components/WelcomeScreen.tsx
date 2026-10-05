import React from 'react';
import { motion } from 'motion/react';
import { Droplet, Leaf, Globe, Check } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data';

interface WelcomeScreenProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onNext: () => void;
}

const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' }
];

export default function WelcomeScreen({
  currentLanguage,
  onLanguageChange,
  onNext
}: WelcomeScreenProps) {
  const t = TRANSLATIONS[currentLanguage];

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-between p-6 sm:p-12 text-slate-800 font-sans">
      {/* Top Language Bar - Separated & Prominent */}
      <div className="w-full max-w-md flex flex-col items-center gap-2">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          Select App Language • மொழித் தேர்வு • भाषा चयन
        </span>
        <div className="flex flex-wrap justify-center gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onLanguageChange(lang.code)}
              className={`px-3 py-2 text-xs font-black rounded-xl border transition-all duration-150 cursor-pointer ${
                currentLanguage === lang.code
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/15'
                  : 'bg-white border-slate-150 hover:bg-slate-50 text-slate-600 hover:text-slate-800'
              }`}
            >
              {lang.native}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md text-center">
        {/* Animated Icon Container */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="relative mb-8"
        >
          <div className="w-32 h-32 rounded-[2rem] bg-white flex items-center justify-center border border-slate-150 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative">
            <Droplet className="w-16 h-16 text-blue-500 absolute translate-y-[-10px] animate-bounce" />
            <Leaf className="w-12 h-12 text-emerald-600 absolute translate-x-[15px] translate-y-[15px] rotate-12" />
          </div>
          {/* Accent rings */}
          <div className="absolute inset-0 rounded-[2rem] border-2 border-dashed border-emerald-200 animate-spin" style={{ animationDuration: '30s' }}></div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3 font-display"
        >
          {t.appName}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-10 font-mono"
        >
          {t.tagline}
        </motion.p>

        {/* Interactive Dashboard Preview Illustration */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full bg-white p-6 rounded-[1.75rem] shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-lg hover:-translate-y-0.5 border border-slate-150 transition-all duration-300 text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full translate-x-12 translate-y-[-12px] opacity-50 blur-xl"></div>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2.5 font-mono">💡 Quick Overview</p>
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xl font-extrabold text-slate-900 font-display">35% Water Saved</p>
              <p className="text-xs text-slate-500 font-medium">This month across India</p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
              🟢 Live Sync
            </span>
          </div>
          {/* Mini Status Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100 text-center hover:bg-slate-50 hover:scale-102 transition duration-200">
              <span className="text-[10px] text-slate-400 font-black font-mono">WHEAT</span>
              <p className="text-xs font-extrabold text-slate-800 mt-0.5 font-display">🟢 Healthy</p>
            </div>
            <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100 text-center hover:bg-slate-50 hover:scale-102 transition duration-200">
              <span className="text-[10px] text-slate-400 font-black font-mono">RICE</span>
              <p className="text-xs font-extrabold text-slate-800 mt-0.5 font-display">🟢 Good</p>
            </div>
            <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100 text-center hover:bg-slate-50 hover:scale-102 transition duration-200">
              <span className="text-[10px] text-slate-400 font-black font-mono">TOMATO</span>
              <p className="text-xs font-extrabold text-slate-800 mt-0.5 font-display">🟡 Fair</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer / Buttons */}
      <div className="w-full max-w-md flex flex-col gap-4 mt-auto">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={onNext}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-lg shadow-emerald-600/10 font-bold text-base font-display transition duration-300 flex items-center justify-center gap-2 cursor-pointer border border-emerald-500/10"
        >
          <span>{t.getStarted}</span>
        </motion.button>

        <div className="flex justify-between w-full px-2 text-[10px] text-slate-400 font-bold font-mono">
          <span>v2.1.0 (Offline Enabled)</span>
          <span className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-slate-300" /> Multilingual Support
          </span>
        </div>
      </div>
    </div>
  );
}
