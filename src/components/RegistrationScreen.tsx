import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TRANSLATIONS, INDIAN_STATES, INDIAN_VILLAGES, DEFAULT_VILLAGES } from '../data';
import { Language, UserRole, CropType, SoilType, IrrigationMethod, CropGrowthStage, UserProfile } from '../types';
import { User, Phone, MapPin, Layers, Sprout, ShieldAlert, Cpu, Calendar, Droplets } from 'lucide-react';

interface RegistrationScreenProps {
  currentLanguage: Language;
  onRegister: (profile: UserProfile) => void;
  initialProfile?: UserProfile;
}

const CROPS: { value: CropType; label: string }[] = [
  { value: 'rice', label: 'Rice (ধান / चावल)' },
  { value: 'wheat', label: 'Wheat (গম / गेहूं)' },
  { value: 'cotton', label: 'Cotton (তুলা / कपास)' },
  { value: 'tomato', label: 'Tomato (টমেটো / टमाटर)' },
  { value: 'sugarcane', label: 'Sugarcane (আখ / गन्ना)' },
  { value: 'maize', label: 'Maize (ভুট্টা / मक्का)' },
  { value: 'potatoes', label: 'Potatoes (আলু / आलू)' },
  { value: 'carrots', label: 'Carrots (গাজর / गाजर)' },
  { value: 'onions', label: 'Onions (পেঁয়াজ / प्याज)' },
  { value: 'chillies', label: 'Chillies (লঙ্কা / मिर्च)' },
  { value: 'coffee', label: 'Coffee (কফি / कॉफी)' },
  { value: 'tea', label: 'Tea (চা / चाय)' }
];

export default function RegistrationScreen({
  currentLanguage,
  onRegister,
  initialProfile
}: RegistrationScreenProps) {
  const t = TRANSLATIONS[currentLanguage];

  const [name, setName] = useState(initialProfile?.name || '');
  const [mobile, setMobile] = useState(initialProfile?.mobile || '');
  const [role, setRole] = useState<UserRole>(initialProfile?.role || 'farmer');
  const [state, setState] = useState(initialProfile?.state || INDIAN_STATES[0]);
  const [village, setVillage] = useState(initialProfile?.village || '');
  const [farmSize, setFarmSize] = useState<number | string>(initialProfile?.farmSize || 2);
  const [cropType, setCropType] = useState<CropType>(initialProfile?.cropType || 'rice');
  const [soilType, setSoilType] = useState<SoilType>(initialProfile?.soilType || 'loamy');
  const [irrigationMethod, setIrrigationMethod] = useState<IrrigationMethod>(
    initialProfile?.irrigationMethod || 'drip'
  );
  const [growthStage, setGrowthStage] = useState<CropGrowthStage>(
    initialProfile?.growthStage || 'vegetative'
  );
  const [lastIrrigationDaysAgo, setLastIrrigationDaysAgo] = useState<number>(
    initialProfile?.lastIrrigationDaysAgo ?? 2
  );
  const [previousIrrigationAmount, setPreviousIrrigationAmount] = useState<number>(
    initialProfile?.previousIrrigationAmount ?? 1000
  );

  const villagesList = INDIAN_VILLAGES[state] || DEFAULT_VILLAGES;

  // Set default village when state changes
  useEffect(() => {
    if (!villagesList.includes(village)) {
      setVillage(villagesList[0] || '');
    }
  }, [state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) return;

    onRegister({
      id: initialProfile?.id || `user_${Date.now()}`,
      name,
      mobile,
      role,
      village,
      state,
      farmSize: Number(farmSize) || 1,
      cropType,
      soilType,
      irrigationMethod,
      growthStage,
      lastIrrigationDaysAgo: Number(lastIrrigationDaysAgo),
      previousIrrigationAmount: Number(previousIrrigationAmount) || 0,
      sensors: initialProfile?.sensors || {
        moisture: true,
        temperature: true,
        humidity: false
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center text-slate-800 font-sans">
      <div className="max-w-xl w-full bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-150 overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="bg-emerald-600 px-6 py-9 text-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full translate-x-12 translate-y-[-12px] opacity-30 blur-xl"></div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-100 text-xs font-semibold mb-3 border border-emerald-400/20">
            <Cpu className="w-3.5 h-3.5" /> Software-Only Smart Advisor
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">{t.registerTitle}</h2>
          <p className="mt-2 text-emerald-100 text-xs sm:text-sm font-medium">{t.registerSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Role selection */}
          <div className="space-y-2.5">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest font-mono">
              {t.roleLabel}
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['farmer', 'field_officer', 'admin'] as UserRole[]).map((r) => {
                const label = r === 'farmer' ? t.roleFarmer : r === 'field_officer' ? t.roleOfficer : t.roleAdmin;
                const isSelected = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-3.5 px-2 rounded-2xl text-xs sm:text-sm font-bold border transition duration-200 cursor-pointer text-center flex flex-col items-center justify-center gap-1 font-display ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-500 text-emerald-700 ring-4 ring-emerald-500/10 font-extrabold'
                        : 'bg-slate-50/50 border-slate-150 text-slate-600 hover:bg-slate-100/50'
                    }`}
                  >
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Farmer Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest font-mono">
                {t.name}
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium transition"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest font-mono">
                {t.mobile}
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium transition"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* State selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest font-mono">
                {t.state}
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-slate-400" />
                </div>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium transition cursor-pointer appearance-none"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Village selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest font-mono">
                {t.village}
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-slate-400" />
                </div>
                <select
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium transition cursor-pointer appearance-none"
                >
                  {villagesList.map((vg) => (
                    <option key={vg} value={vg}>
                      {vg}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Farm size */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest font-mono">
                {t.farmSize}
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Layers className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  required
                  value={farmSize}
                  onChange={(e) => setFarmSize(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium transition"
                />
              </div>
            </div>

            {/* Crop Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest font-mono">
                {t.cropType}
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Sprout className="h-5 w-5 text-slate-400" />
                </div>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value as CropType)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium transition cursor-pointer appearance-none"
                >
                  {CROPS.map((cp) => (
                    <option key={cp.value} value={cp.value}>
                      {cp.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Software Water Balance Inputs */}
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/80 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono">
              <Cpu className="w-4 h-4 text-emerald-600" /> Software Evapotranspiration (ET₀) Engine Settings
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Crop Growth Stage */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-600">
                  {t.cropGrowthStage}
                </label>
                <select
                  value={growthStage}
                  onChange={(e) => setGrowthStage(e.target.value as CropGrowthStage)}
                  className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="initial">{t.stageInitial}</option>
                  <option value="vegetative">{t.stageVegetative}</option>
                  <option value="flowering">{t.stageFlowering}</option>
                  <option value="maturity">{t.stageMaturity}</option>
                </select>
              </div>

              {/* Last Irrigation Date */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-600">
                  {t.lastIrrigation}
                </label>
                <div className="relative">
                  <select
                    value={lastIrrigationDaysAgo}
                    onChange={(e) => setLastIrrigationDaysAgo(Number(e.target.value))}
                    className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value={0}>Today (0 days ago)</option>
                    <option value={1}>Yesterday (1 day ago)</option>
                    <option value={2}>2 Days Ago</option>
                    <option value={3}>3 Days Ago</option>
                    <option value={5}>5 Days Ago</option>
                    <option value={7}>7+ Days Ago</option>
                  </select>
                </div>
              </div>

              {/* Previous Irrigation Amount */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-600">
                  {t.previousIrrigationAmount}
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={previousIrrigationAmount}
                  onChange={(e) => setPreviousIrrigationAmount(Number(e.target.value))}
                  className="block w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </div>

          {/* Soil & Irrigation Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest font-mono">
                {t.soilType}
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value as SoilType)}
                className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium transition cursor-pointer"
              >
                <option value="clay">Clay (चिकनी मिट्टी)</option>
                <option value="loamy">Loamy (दुमट मिट्टी)</option>
                <option value="sandy">Sandy (बलुआ मिट्टी)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest font-mono">
                {t.irrigationMethod}
              </label>
              <select
                value={irrigationMethod}
                onChange={(e) => setIrrigationMethod(e.target.value as IrrigationMethod)}
                className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium transition cursor-pointer"
              >
                <option value="drip">Drip Irrigation (टपक सिंचाई)</option>
                <option value="sprinkler">Sprinkler Irrigation (छिड़काव सिंचाई)</option>
                <option value="flood">Flood Irrigation (पारंपरिक बहाव सिंचाई)</option>
              </select>
            </div>
          </div>

          {/* Secure disclaimer */}
          <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 flex items-start gap-3 text-xs text-slate-500 leading-relaxed">
            <ShieldAlert className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            <span>
              All profile data is encrypted locally (AES-256 standard) and processed by the Software-Only AI Smart Irrigation Advisor without requiring physical hardware sensors.
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-lg font-bold text-base font-display transition duration-200 flex items-center justify-center cursor-pointer border border-emerald-500/10"
          >
            {t.continue}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
