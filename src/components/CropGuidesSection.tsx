import React, { useState } from 'react';
import { Sprout, BookOpen, ChevronRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { CropType, Language } from '../types';
import { CROP_GUIDES, TRANSLATIONS } from '../data';

interface CropGuidesSectionProps {
  currentLanguage: Language;
}

const CROP_LABELS: Record<CropType, string> = {
  rice: 'Rice / धान / நெல்',
  wheat: 'Wheat / गेहूं / கோதுமை',
  cotton: 'Cotton / कपास / பருத்தி',
  tomato: 'Tomato / टमाटर / தக்காளி',
  sugarcane: 'Sugarcane / गन्ना / கரும்பு',
  maize: 'Maize / मक्का / சோளம்',
  potatoes: 'Potatoes / आलू / உருளைக்கிழங்கு',
  carrots: 'Carrots / गाजर / கேரட்',
  onions: 'Onions / प्याज / வெங்காயம்',
  chillies: 'Chillies / मिर्च / மிளகாய்',
  coffee: 'Coffee / कॉफी / காபி',
  tea: 'Tea / चाय / தேயிலை'
};

export default function CropGuidesSection({ currentLanguage }: CropGuidesSectionProps) {
  const t = TRANSLATIONS[currentLanguage];
  const [selectedCrop, setSelectedCrop] = useState<CropType>('rice');

  const guide = CROP_GUIDES[selectedCrop];

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-150 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-50 rounded-[1.25rem] border border-emerald-100 text-emerald-600">
          <BookOpen className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-display">Crop Health & Variety Guides</h3>
          <p className="text-xs text-slate-500 font-medium">Planting, fertilization & watering protocols for diversified farming</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Variety Selection List */}
        <div className="lg:col-span-4 space-y-2 max-h-[440px] overflow-y-auto pr-2 custom-scrollbar">
          {(Object.keys(CROP_GUIDES) as CropType[]).map((crop) => {
            const isSelected = selectedCrop === crop;
            return (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left transition duration-200 cursor-pointer border text-sm font-bold font-sans ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-4 ring-emerald-500/10 font-extrabold'
                    : 'bg-[#fafaf9] hover:bg-slate-50 text-slate-700 border-slate-150 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sprout className={`w-4 h-4 ${isSelected ? 'text-emerald-600 animate-bounce' : 'text-slate-400'}`} />
                  <span className="font-display">{CROP_LABELS[crop]}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition ${isSelected ? 'text-emerald-600 translate-x-1' : 'text-slate-400'}`} />
              </button>
            );
          })}
        </div>

        {/* Detailed Agronomic Guide Details */}
        <div className="lg:col-span-8 bg-[#fafaf9] rounded-[1.75rem] p-6 border border-slate-150 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h4 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 font-display">
              <span className="capitalize text-emerald-700">{selectedCrop}</span> Guide
            </h4>
            <span className="text-[10px] px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full font-black border border-emerald-200 uppercase tracking-widest font-mono">
              Variety Guide
            </span>
          </div>

          <div className="space-y-4">
            {/* Planting Instructions */}
            <div className="bg-white p-4.5 rounded-[1.25rem] border border-slate-150 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md transition-all duration-300">
              <h5 className="text-xs font-black text-slate-800 flex items-center gap-2 mb-2 uppercase tracking-widest font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {t.plantingGuide}
              </h5>
              <p className="text-sm text-slate-600 leading-relaxed font-medium font-sans">
                {guide.planting}
              </p>
            </div>

            {/* Fertilizing Instructions */}
            <div className="bg-white p-4.5 rounded-[1.25rem] border border-slate-150 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md transition-all duration-300">
              <h5 className="text-xs font-black text-slate-800 flex items-center gap-2 mb-2 uppercase tracking-widest font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {t.fertilizerGuide}
              </h5>
              <p className="text-sm text-slate-600 leading-relaxed font-medium font-sans">
                {guide.fertilizing}
              </p>
            </div>

            {/* Irrigation Advice */}
            <div className="bg-white p-4.5 rounded-[1.25rem] border border-slate-150 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md transition-all duration-300">
              <h5 className="text-xs font-black text-slate-800 flex items-center gap-2 mb-2 uppercase tracking-widest font-mono">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                {t.irrigationGuide}
              </h5>
              <p className="text-sm text-slate-600 leading-relaxed font-medium font-sans">
                {guide.irrigation}
              </p>
            </div>

            {/* Critical Pests Alert and Pesticide Advisory */}
            <div className="p-4.5 bg-orange-50/50 rounded-[1.25rem] border border-orange-100">
              <h5 className="text-xs font-black text-orange-800 flex items-center gap-2 mb-2.5 uppercase tracking-widest font-mono">
                <ShieldAlert className="w-4 h-4 text-orange-600 animate-ping" />
                {t.criticalPests} & Real-Time Pest Alerts
              </h5>
              <div className="flex flex-wrap gap-2">
                {guide.criticalPests.map((pest, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-[11px] font-bold border border-orange-200"
                  >
                    ⚠️ {pest}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-orange-600 mt-2 font-semibold">
                * Note: Inspect leaves weekly. For active pest outbreaks, receive real-time push alerts and immediately trigger organic pest-repellent solutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
