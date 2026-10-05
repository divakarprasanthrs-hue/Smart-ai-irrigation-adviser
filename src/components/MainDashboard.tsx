import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Droplet,
  Leaf,
  CloudSun,
  Sun,
  CloudRain,
  Wind,
  Settings,
  HelpCircle,
  FileDown,
  RefreshCw,
  Bell,
  Cpu,
  Wifi,
  WifiOff,
  History,
  TrendingUp,
  AlertTriangle,
  LogOut,
  Sparkles,
  Accessibility,
  Globe,
  Calendar,
  Layers,
  Info
} from 'lucide-react';
import {
  UserProfile,
  SensorData,
  WeatherData,
  AIRecommendation,
  DailySchedule,
  WaterUsageRecord,
  AuditLogEntry,
  Language,
  UserRole,
  CropGrowthStage,
  SoilWaterBalanceResult
} from '../types';
import { TRANSLATIONS, checkAnomalies, AnomalyNotification, CROP_GUIDES, calculateSoilWaterBalance } from '../data';
import { exportIrrigationReportPDF } from './PDFExport';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';

import AIChatbotSection from './AIChatbotSection';
import CropGuidesSection from './CropGuidesSection';
import AuditLogsSection from './AuditLogsSection';

interface MainDashboardProps {
  profile: UserProfile;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onLogout: () => void;
  onUpdateProfile: (updated: UserProfile) => void;
}

const LANGUAGES = [
  { code: 'en', native: 'English' },
  { code: 'ta', native: 'தமிழ்' },
  { code: 'hi', native: 'हिन्दी' },
  { code: 'te', native: 'తెలుగు' },
  { code: 'kn', native: 'ಕನ್ನಡ' }
] as const;

// Initial Mock Schedule
const INITIAL_SCHEDULE: DailySchedule[] = [
  { day: 'Monday', status: 'No Irrigation', duration: 0, rainExpected: false },
  { day: 'Tuesday', status: 'Irrigate', duration: 20, rainExpected: false },
  { day: 'Wednesday', status: 'Delay (Rain)', duration: 0, rainExpected: true },
  { day: 'Thursday', status: 'Irrigate', duration: 15, rainExpected: false },
  { day: 'Friday', status: 'No Irrigation', duration: 0, rainExpected: false },
  { day: 'Saturday', status: 'Irrigate', duration: 25, rainExpected: false },
  { day: 'Sunday', status: 'No Irrigation', duration: 0, rainExpected: false }
];

// Initial Mock Water usage records
const INITIAL_WATER_USAGE: WaterUsageRecord[] = [
  { date: '07/02', waterUsed: 1200, waterSaved: 350, cropHealth: 88 },
  { date: '07/03', waterUsed: 1400, waterSaved: 420, cropHealth: 90 },
  { date: '07/04', waterUsed: 0, waterSaved: 800, cropHealth: 92 }, // Rain expected day
  { date: '07/05', waterUsed: 1100, waterSaved: 380, cropHealth: 94 },
  { date: '07/06', waterUsed: 1350, waterSaved: 410, cropHealth: 95 }
];

export default function MainDashboard({
  profile,
  currentLanguage,
  onLanguageChange,
  onLogout,
  onUpdateProfile
}: MainDashboardProps) {
  const t = TRANSLATIONS[currentLanguage];

  // UI Theme & Accessibility States
  const [highContrast, setHighContrast] = useState(false);
  const [offline, setOffline] = useState(false);
  const [syncState, setSyncState] = useState<'synced' | 'syncing'>('synced');

  // Farm Settings Overrides
  const [farmSize, setFarmSize] = useState(profile.farmSize);
  const [activeCrop, setActiveCrop] = useState(profile.cropType);
  const [activeSoil, setActiveSoil] = useState(profile.soilType);
  const [activeIrrigation, setActiveIrrigation] = useState(profile.irrigationMethod);

  // Software ET₀ Water Balance Engine States
  const [growthStage, setGrowthStage] = useState<CropGrowthStage>(profile.growthStage || 'vegetative');
  const [lastIrrigationDaysAgo, setLastIrrigationDaysAgo] = useState<number>(profile.lastIrrigationDaysAgo ?? 2);
  const [previousIrrigationAmount, setPreviousIrrigationAmount] = useState<number>(profile.previousIrrigationAmount ?? 1000);

  // Live Simulated Environmental Telemetry
  const [tempValue, setTempValue] = useState<number>(32);
  const [humidityValue, setHumidityValue] = useState<number>(65);

  // Interactive Weather Override Simulation
  const [weatherCondition, setWeatherCondition] = useState<'sunny' | 'cloudy' | 'rainy' | 'windy'>('sunny');
  const [weatherRainProb, setWeatherRainProb] = useState<number>(15);

  // Software Calculation Engine Output
  const waterBalance: SoilWaterBalanceResult = calculateSoilWaterBalance({
    cropType: activeCrop,
    soilType: activeSoil,
    farmSize,
    growthStage,
    lastIrrigationDaysAgo,
    previousIrrigationAmount,
    irrigationMethod: activeIrrigation,
    temp: tempValue,
    humidity: humidityValue,
    windSpeed: weatherCondition === 'windy' ? 22 : 10,
    solarRadiation: weatherCondition === 'sunny' ? 22 : 14,
    rainProb: weatherRainProb,
    rainfallMm: weatherCondition === 'rainy' ? 14 : 0
  });

  // AI Recommendation State
  const [aiRec, setAiRec] = useState<AIRecommendation | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Logs and Notifications States
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'log_init',
      timestamp: new Date().toLocaleTimeString(),
      userId: profile.id,
      userName: profile.name,
      role: profile.role,
      action: 'Software Engine Boot',
      details: `Initialized FAO-56 ET₀ Soil Water Balance Engine for ${profile.cropType} (${profile.soilType} soil). Estimated Soil Moisture: ${waterBalance.estimatedSoilMoisture}%.`,
      severity: 'info'
    }
  ]);

  const [notifications, setNotifications] = useState<string[]>([
    'Welcome to AI Smart Irrigation Advisor (Software-Only Mode).',
    'Calculates Estimated Soil Moisture using Weather, Soil, Crop, & Rainfall data.'
  ]);

  const [anomalies, setAnomalies] = useState<AnomalyNotification[]>([]);

  // Weekly Irrigation schedule and history logs
  const [schedule, setSchedule] = useState<DailySchedule[]>(INITIAL_SCHEDULE);
  const [waterUsage, setWaterUsage] = useState<WaterUsageRecord[]>(INITIAL_WATER_USAGE);
  const [irrigationHistory, setIrrigationHistory] = useState<{ date: string; action: string; water: number; saved: number }[]>([
    { date: '07/06', action: 'Sprinkler cycle for 20 mins', water: 1350, saved: 410 },
    { date: '07/05', action: 'Drip cycle for 15 mins', water: 1100, saved: 380 },
    { date: '07/03', action: 'Drip cycle for 25 mins', water: 1400, saved: 420 }
  ]);

  // Natural ambient fluctuations in temperature & humidity
  useEffect(() => {
    const timer = setInterval(() => {
      setTempValue((prev) => Math.max(15, Math.min(45, prev + (Math.floor(Math.random() * 3) - 1))));
      setHumidityValue((prev) => Math.max(20, Math.min(98, prev + (Math.floor(Math.random() * 5) - 2))));
    }, 12000);

    return () => clearInterval(timer);
  }, []);

  // Real-time anomalies detector based on estimated moisture
  useEffect(() => {
    const detected = checkAnomalies(waterBalance.estimatedSoilMoisture, tempValue, humidityValue, activeCrop);
    setAnomalies(detected);

    if (detected.length > 0) {
      detected.forEach((anom) => {
        setNotifications((prev) => {
          if (prev.includes(`⚠️ ALERT: ${anom.message}`)) return prev;
          return [`⚠️ ALERT: ${anom.message}`, ...prev];
        });

        setAuditLogs((prev) => {
          if (prev.some((p) => p.details.includes(anom.message))) return prev;
          return [
            {
              id: `log_anom_${Date.now()}`,
              timestamp: anom.timestamp,
              userId: 'ET0_ENGINE',
              userName: 'Software Moisture System',
              role: 'admin',
              action: 'Water Deficit Alert',
              details: anom.message,
              severity: anom.severity
            },
            ...prev
          ];
        });
      });
    }
  }, [waterBalance.estimatedSoilMoisture, tempValue, humidityValue, activeCrop]);

  // Sync animation simulation when toggled back online
  useEffect(() => {
    if (!offline) {
      setSyncState('syncing');
      const timer = setTimeout(() => {
        setSyncState('synced');
        addAuditLog('Cloud Sync', 'Local calculation states securely synced with server.', 'info');
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      addAuditLog('Offline Mode On', 'Advisor operating offline. Water balance metrics calculated locally.', 'warning');
    }
  }, [offline]);

  const addAuditLog = (action: string, details: string, severity: 'info' | 'warning' | 'critical' = 'info') => {
    setAuditLogs((prev) => [
      {
        id: `log_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        userId: profile.id,
        userName: profile.name,
        role: profile.role,
        action,
        details,
        severity
      },
      ...prev
    ]);
  };

  // Weather data object
  const weatherData: WeatherData = {
    temp: tempValue,
    humidity: humidityValue,
    rainProb: weatherRainProb,
    windSpeed: weatherCondition === 'windy' ? 24 : 12,
    solarRadiation: weatherCondition === 'sunny' ? 22 : 14,
    rainfallMm: weatherCondition === 'rainy' ? 14 : 0,
    status: weatherCondition,
    forecast: [
      { day: 'Mon', status: 'sunny', temp: 32, rainProb: 10, rainMm: 0 },
      { day: 'Tue', status: 'sunny', temp: 33, rainProb: 15, rainMm: 0 },
      { day: 'Wed', status: 'rainy', temp: 28, rainProb: 80, rainMm: 12 },
      { day: 'Thu', status: 'cloudy', temp: 30, rainProb: 40, rainMm: 2 },
      { day: 'Fri', status: 'sunny', temp: 31, rainProb: 20, rainMm: 0 }
    ]
  };

  // Recalculate Recommendation using Server-side Gemini API + ET₀ Water Balance Engine
  const handleRecalculate = async () => {
    setLoadingAi(true);
    addAuditLog('Trigger Recalculate', `Requested AI assessment for ${activeCrop} (${growthStage}) on ${farmSize} acres.`, 'info');

    try {
      const response = await fetch('/api/gemini/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: activeCrop,
          soil: activeSoil,
          irrigation: activeIrrigation,
          farmSize,
          growthStage,
          lastIrrigationDaysAgo,
          previousIrrigationAmount,
          temperature: tempValue,
          humidity: humidityValue,
          rainProb: weatherRainProb,
          language: currentLanguage
        })
      });

      const data = await response.json();
      setAiRec({
        id: `rec_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        recommendation: data.recommendation,
        waterRequired: data.waterRequired,
        bestTime: data.bestTime,
        nextIrrigation: data.nextIrrigation,
        waterSaving: data.waterSaving,
        suggestedDurationMins: data.suggestedDurationMins || data.suggestedDurationMinutes,
        estimatedSoilMoisture: data.estimatedSoilMoisture,
        waterDeficitLitres: data.waterDeficitLitres,
        rainExpected: data.rainExpected,
        et0: data.et0 || waterBalance.et0,
        etc: data.etc || waterBalance.etc,
        kc: data.kc || waterBalance.kc
      });

      // Update schedule based on duration
      const wateringMins = data.suggestedDurationMins || data.suggestedDurationMinutes || (data.waterRequired > 0 ? 20 : 0);
      setSchedule((prev) =>
        prev.map((s, idx) => (idx === 1 ? { ...s, duration: wateringMins, status: wateringMins > 0 ? 'Irrigate' : 'No Irrigation' } : s))
      );

      // Add to history list
      if (data.waterRequired > 0) {
        setIrrigationHistory((prev) => [
          {
            date: new Date().toLocaleDateString([], { month: '2-digit', day: '2-digit' }),
            action: `${activeIrrigation.toUpperCase()} cycle scheduled: ${wateringMins} mins`,
            water: data.waterRequired,
            saved: Math.round(data.waterRequired * (data.waterSaving / 100))
          },
          ...prev
        ]);
      }

      setNotifications((prev) => [
        `📊 SOFTWARE ENGINE PREDICTION: ${data.recommendation.substring(0, 45)}...`,
        ...prev
      ]);
    } catch (e) {
      console.error(e);
      addAuditLog('AI Generation Fail', 'Loaded local agronomic rule fallback based on ET₀ water balance calculation.', 'warning');
    } finally {
      setLoadingAi(false);
    }
  };

  // Run debounced recommendation update when farm parameters change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleRecalculate();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [activeCrop, activeSoil, activeIrrigation, farmSize, growthStage, lastIrrigationDaysAgo, previousIrrigationAmount, weatherCondition, weatherRainProb]);

  // Export PDF Report handler
  const handleExportPDF = () => {
    addAuditLog('PDF Report Export', `Downloaded ET₀ Software Report for ${profile.name}'s farm.`, 'info');
    exportIrrigationReportPDF(
      {
        ...profile,
        cropType: activeCrop,
        soilType: activeSoil,
        irrigationMethod: activeIrrigation,
        farmSize,
        growthStage,
        lastIrrigationDaysAgo,
        previousIrrigationAmount
      },
      {
        moisture: waterBalance.estimatedSoilMoisture,
        temperature: tempValue,
        humidity: humidityValue,
        timestamp: new Date().toLocaleTimeString()
      },
      weatherData,
      aiRec,
      schedule,
      waterUsage,
      waterBalance
    );
  };

  return (
    <div className={`min-h-screen bg-[#fafaf9] text-slate-800 ${highContrast ? 'contrast-125 font-semibold text-black bg-white' : ''}`}>
      {/* Dedicated Language Selection Bar */}
      <div className="bg-slate-100 border-b border-slate-200 py-2.5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            Language Selection • மொழித் தேர்வு • भाषा चयन
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onLanguageChange(lang.code as Language)}
                className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition-all duration-150 cursor-pointer ${
                  currentLanguage === lang.code
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/15'
                    : 'bg-white hover:bg-slate-50 border border-slate-150 text-slate-600 hover:text-slate-800'
                }`}
              >
                {lang.native}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Main Navigation Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-150 py-4.5 px-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Farm Identity */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[1.25rem] bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/10">
              <Droplet className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xl font-black text-slate-900 leading-tight tracking-tight font-display">
                  {t.appName}
                </h2>
                <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-black px-2 py-0.5 rounded-[6px] uppercase tracking-wider font-mono">
                  Software-Only ET₀
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold">
                {t.welcomeBack} <span className="font-extrabold text-slate-800">{profile.name}</span> • {profile.village}, {profile.state} <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-[4px]">({t[`role${profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}` as any] || profile.role})</span>
              </p>
            </div>
          </div>

          {/* Sync & Language controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Sync Status Badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs font-bold ${
              offline 
                ? 'bg-amber-50 text-amber-900 border-amber-200' 
                : syncState === 'syncing' 
                ? 'bg-blue-50 text-blue-900 border-blue-200 animate-pulse' 
                : 'bg-emerald-50 text-emerald-900 border-emerald-200'
            }`}>
              {offline ? <WifiOff className="w-3.5 h-3.5 text-amber-600" /> : <Wifi className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{offline ? t.offlineMode : syncState === 'syncing' ? t.syncStatusSyncing : t.syncStatusSynced}</span>
            </div>

            {/* Offline Simulator Switch */}
            <button
              onClick={() => setOffline(!offline)}
              className={`p-2.5 rounded-xl border cursor-pointer transition ${
                offline ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-[#fafaf9] border-slate-150 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
              }`}
              title="Simulate Offline Mode"
            >
              {offline ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
            </button>

            {/* Accessibility Toggle */}
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`p-2.5 rounded-xl border cursor-pointer transition ${
                highContrast ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-[#fafaf9] border-slate-150 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
              }`}
              title="Toggle High Contrast Mode"
            >
              <Accessibility className="w-5 h-5" />
            </button>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="p-2.5 bg-red-50 hover:bg-red-100 border border-red-100 hover:border-red-200 text-red-600 rounded-xl transition cursor-pointer"
              title="Log Out Profile"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Dashboard Grid */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Software-Only Mode Banner Explanation */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-2xl p-4 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-emerald-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-700/50 rounded-xl shrink-0">
              <Cpu className="w-6 h-6 text-emerald-300 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 font-mono">
                {t.softwareModeTitle}
              </span>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium">
                {t.softwareModeDesc}
              </p>
            </div>
          </div>
          <div className="text-[11px] bg-emerald-800/80 border border-emerald-600/50 px-3 py-1.5 rounded-xl font-mono text-emerald-200 shrink-0">
            ET₀ Calculation Engine Active
          </div>
        </div>

        {/* Offline Alarm Warning Banner */}
        {offline && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-800">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-bounce" />
            <div>
              <p className="font-bold">{t.offlineMode} Active</p>
              <p className="text-xs text-amber-700 mt-1">{t.offlineWarning}</p>
            </div>
          </div>
        )}

        {/* Real-Time Critical Anomalies Alarm Banners */}
        {anomalies.map((anom) => (
          <div
            key={anom.id}
            className={`border rounded-2xl p-4 flex items-start gap-3 shadow-md animate-pulse ${
              anom.severity === 'critical'
                ? 'bg-red-50 border-red-200 text-red-900'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${anom.severity === 'critical' ? 'text-red-600' : 'text-amber-600'}`} />
            <div className="flex-1">
              <span className="text-[10px] uppercase font-black tracking-widest block mb-0.5">
                REAL-TIME WATER DEFICIT ALARM: {anom.severity.toUpperCase()}
              </span>
              <p className="text-sm font-bold">{anom.message}</p>
            </div>
            <button
              onClick={() => {
                setAnomalies((prev) => prev.filter((p) => p.id !== anom.id));
                addAuditLog('Anomaly Dismissed', `Farmer acknowledged & cleared alert: ${anom.message}`, 'info');
              }}
              className="text-xs bg-black/5 hover:bg-black/10 px-2.5 py-1 rounded-lg transition font-extrabold cursor-pointer"
            >
              Acknowledge
            </button>
          </div>
        ))}

        {/* Core Layout: Inputs & AI Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Column 1: Software Water Balance Inputs & Weather Simulation (4 Cols) */}
          <section className="lg:col-span-4 space-y-6">
            
            {/* Interactive Farm & Growth Stage Inputs */}
            <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-150 space-y-4 hover:shadow-lg transition-all duration-300">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-3.5 font-mono">
                <Settings className="w-4 h-4 text-emerald-600" />
                {t.enterFarmDetails}
              </h3>

              <div className="space-y-4">
                {/* Crop Type Selection */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-1.5 tracking-widest font-mono">CROP TYPE</label>
                  <select
                    value={activeCrop}
                    onChange={(e) => {
                      setActiveCrop(e.target.value as any);
                      addAuditLog('Parameter Adjusted', `Changed crop type to ${e.target.value}`, 'info');
                    }}
                    className="w-full bg-[#fafaf9] border border-slate-150 rounded-xl p-3 text-xs font-bold text-slate-800 cursor-pointer transition focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
                  >
                    <option value="rice">Rice (ধান / चावल)</option>
                    <option value="wheat">Wheat (গম / गेहूं)</option>
                    <option value="cotton">Cotton (তুলা / कपास)</option>
                    <option value="tomato">Tomato (টমেটো / टमाटर)</option>
                    <option value="sugarcane">Sugarcane (আখ / गन्ना)</option>
                    <option value="maize">Maize (ভুট্টা / मक्का)</option>
                    <option value="potatoes">Potatoes (আলু / आलू)</option>
                    <option value="carrots">Carrots (গাজর / गाजर)</option>
                    <option value="onions">Onions (পেঁয়াজ / प्याज)</option>
                    <option value="chillies">Chillies (লঙ্কা / मिर्च)</option>
                    <option value="coffee">Coffee (কফি / कॉफी)</option>
                    <option value="tea">Tea (চা / चाय)</option>
                  </select>
                </div>

                {/* Crop Growth Stage */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-1.5 tracking-widest font-mono">{t.cropGrowthStage.toUpperCase()}</label>
                  <select
                    value={growthStage}
                    onChange={(e) => setGrowthStage(e.target.value as CropGrowthStage)}
                    className="w-full bg-[#fafaf9] border border-slate-150 rounded-xl p-3 text-xs font-bold text-slate-800 cursor-pointer transition focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
                  >
                    <option value="initial">{t.stageInitial}</option>
                    <option value="vegetative">{t.stageVegetative}</option>
                    <option value="flowering">{t.stageFlowering}</option>
                    <option value="maturity">{t.stageMaturity}</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* Soil Type */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-1.5 tracking-widest font-mono">SOIL TYPE</label>
                    <select
                      value={activeSoil}
                      onChange={(e) => setActiveSoil(e.target.value as any)}
                      className="w-full bg-[#fafaf9] border border-slate-150 rounded-xl p-3 text-xs font-bold text-slate-800 cursor-pointer transition focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
                    >
                      <option value="clay">Clay (चिकनी)</option>
                      <option value="loamy">Loamy (दुमट)</option>
                      <option value="sandy">Sandy (बलुआ)</option>
                    </select>
                  </div>

                  {/* Irrigation Method */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-1.5 tracking-widest font-mono">IRRIGATION METHOD</label>
                    <select
                      value={activeIrrigation}
                      onChange={(e) => setActiveIrrigation(e.target.value as any)}
                      className="w-full bg-[#fafaf9] border border-slate-150 rounded-xl p-3 text-xs font-bold text-slate-800 cursor-pointer transition focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
                    >
                      <option value="drip">Drip (टपक)</option>
                      <option value="sprinkler">Sprinkler (छिड़काव)</option>
                      <option value="flood">Flood (बहाव)</option>
                    </select>
                  </div>
                </div>

                {/* Farm size slider */}
                <div className="pt-2">
                  <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 tracking-widest font-mono">
                    <span>FARM AREA (ACRES)</span>
                    <span className="text-emerald-700 font-black">{farmSize} Acres</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="20"
                    step="0.5"
                    value={farmSize}
                    onChange={(e) => setFarmSize(Number(e.target.value))}
                    className="w-full accent-emerald-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Historical Irrigation Inputs for Software ET₀ Engine */}
            <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-150 space-y-4 hover:shadow-lg transition-all duration-300">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-3.5 font-mono">
                <Cpu className="w-4 h-4 text-emerald-600 animate-pulse" />
                Soil Water Balance Inputs
              </h3>

              <div className="space-y-4 text-xs font-bold text-slate-600">
                
                {/* Last Irrigation Date */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-400 tracking-widest font-mono">{t.lastIrrigation.toUpperCase()}</label>
                  <select
                    value={lastIrrigationDaysAgo}
                    onChange={(e) => setLastIrrigationDaysAgo(Number(e.target.value))}
                    className="w-full bg-[#fafaf9] border border-slate-150 rounded-xl p-3 text-xs font-bold text-slate-800 cursor-pointer transition focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
                  >
                    <option value={0}>Today (0 days ago)</option>
                    <option value={1}>Yesterday (1 day ago)</option>
                    <option value={2}>2 Days Ago</option>
                    <option value={3}>3 Days Ago</option>
                    <option value={5}>5 Days Ago</option>
                    <option value={7}>7+ Days Ago</option>
                  </select>
                </div>

                {/* Previous Irrigation Amount */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[10px] font-black text-slate-400 tracking-widest font-mono">{t.previousIrrigationAmount.toUpperCase()}</span>
                    <span className="text-emerald-700 font-black font-mono">{previousIrrigationAmount.toLocaleString()} Litres</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="200"
                    value={previousIrrigationAmount}
                    onChange={(e) => setPreviousIrrigationAmount(Number(e.target.value))}
                    className="w-full accent-emerald-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                  />
                </div>

                {/* ET₀ Engine Calculation Badge */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
                  <div className="flex justify-between font-mono font-bold text-slate-700">
                    <span>Reference ET₀:</span>
                    <span>{waterBalance.et0} mm/day</span>
                  </div>
                  <div className="flex justify-between font-mono font-bold text-slate-700">
                    <span>Crop ETc (Kc={waterBalance.kc}):</span>
                    <span>{waterBalance.etc} mm/day</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Weather Engine Overrides */}
            <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-150 space-y-4 hover:shadow-lg transition-all duration-300">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-3.5 font-mono">
                <CloudSun className="w-4 h-4 text-emerald-600" />
                Weather & Rainfall Forecast
              </h3>

              <div className="grid grid-cols-2 gap-2">
                {(['sunny', 'cloudy', 'rainy', 'windy'] as const).map((cond) => {
                  const isSel = weatherCondition === cond;
                  return (
                    <button
                      key={cond}
                      onClick={() => {
                        setWeatherCondition(cond);
                        if (cond === 'rainy') {
                          setWeatherRainProb(85);
                        } else {
                          setWeatherRainProb(15);
                        }
                        addAuditLog('Simulate Weather', `Changed weather condition simulation to: ${cond}`, 'info');
                      }}
                      className={`py-2.5 px-2 border rounded-xl font-bold text-xs transition cursor-pointer text-center capitalize flex items-center justify-center gap-1.5 ${
                        isSel
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-extrabold shadow-sm'
                          : 'bg-[#fafaf9] border-slate-150 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {cond === 'sunny' && <Sun className="w-3.5 h-3.5 text-amber-500" />}
                      {cond === 'cloudy' && <CloudSun className="w-3.5 h-3.5 text-slate-400" />}
                      {cond === 'rainy' && <CloudRain className="w-3.5 h-3.5 text-blue-500 animate-bounce" />}
                      {cond === 'windy' && <Wind className="w-3.5 h-3.5 text-blue-300 animate-spin" />}
                      <span className="font-sans">{cond}</span>
                    </button>
                  );
                })}
              </div>

              {/* Rain probability slider */}
              <div className="pt-2">
                <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 tracking-widest font-mono">
                  <span>RAIN PROBABILITY</span>
                  <span className="text-blue-600 font-black font-mono">{weatherRainProb}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={weatherRainProb}
                  onChange={(e) => {
                    setWeatherRainProb(Number(e.target.value));
                    if (Number(e.target.value) > 60) setWeatherCondition('rainy');
                  }}
                  className="w-full accent-blue-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>
            </div>

          </section>

          {/* Column 2: Dashboard Content & Analytics (8 Cols) */}
          <section className="lg:col-span-8 space-y-6">
            
            {/* Today's Estimated Soil Moisture & Weather Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Today's Weather Status Card */}
              <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-150 flex items-center justify-between hover:shadow-md transition-all duration-300">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">{t.weather}</p>
                  <p className="text-2xl font-black text-slate-900 font-display">{tempValue}°C</p>
                  <p className="text-xs font-bold text-slate-500 flex items-center gap-1 capitalize font-sans">
                    {weatherCondition} • Hum: {humidityValue}%
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-600">
                  {weatherCondition === 'sunny' && <Sun className="w-8 h-8 text-amber-500 animate-spin" style={{ animationDuration: '40s' }} />}
                  {weatherCondition === 'cloudy' && <CloudSun className="w-8 h-8 text-slate-400" />}
                  {weatherCondition === 'rainy' && <CloudRain className="w-8 h-8 text-blue-500 animate-bounce" />}
                  {weatherCondition === 'windy' && <Wind className="w-8 h-8 text-slate-300" />}
                </div>
              </div>

              {/* Estimated Soil Moisture Status Card */}
              <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-150 flex items-center justify-between hover:shadow-md transition-all duration-300">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">{t.estimatedSoilMoisture}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-2xl font-black text-slate-900 font-display">{waterBalance.estimatedSoilMoisture}%</p>
                    <span className={`text-[9px] font-black px-2 py-0.5 border rounded-full uppercase tracking-wider font-mono self-start ${
                      waterBalance.estimatedSoilMoisture > 60 
                        ? 'bg-blue-50 border-blue-200 text-blue-800' 
                        : waterBalance.estimatedSoilMoisture > 35 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                        : 'bg-red-50 border-red-200 text-red-800 animate-pulse'
                    }`}>
                      {waterBalance.estimatedSoilMoisture > 60 ? t.moistureGood : waterBalance.estimatedSoilMoisture > 35 ? t.moistureModerate : t.moistureDry}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 font-sans pt-1">
                    Deficit: {waterBalance.waterDeficitLitres.toLocaleString()} L
                  </p>
                </div>
                <div className="relative flex items-center justify-center w-14 h-14">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                  <div className={`absolute inset-0 rounded-full border-4 ${
                    waterBalance.estimatedSoilMoisture > 70 ? 'border-blue-500' : waterBalance.estimatedSoilMoisture > 35 ? 'border-emerald-500' : 'border-red-500'
                  } border-t-transparent border-r-transparent transform -rotate-45`} style={{ transform: `rotate(${(waterBalance.estimatedSoilMoisture / 100) * 360}deg)` }}></div>
                  <Droplet className={`w-5 h-5 ${waterBalance.estimatedSoilMoisture > 70 ? 'text-blue-500' : waterBalance.estimatedSoilMoisture > 35 ? 'text-emerald-500' : 'text-red-500 animate-ping'}`} />
                </div>
              </div>

              {/* Water Saved statistics card */}
              <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-150 flex items-center justify-between hover:shadow-md transition-all duration-300">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Water Saved (Month)</p>
                  <p className="text-2xl font-black text-emerald-700 font-display">35% Avg</p>
                  <p className="text-xs font-bold text-slate-500 font-sans">
                    Saved {waterUsage.reduce((sum, r) => sum + r.waterSaved, 0).toLocaleString()} Litres
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-600">
                  <TrendingUp className="w-8 h-8 text-emerald-600 animate-bounce" />
                </div>
              </div>

            </div>

            {/* AI Recommendation Core Panel */}
            <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-150 relative overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full translate-x-12 translate-y-[-12px] opacity-30 blur-2xl"></div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-blue-600 text-white flex items-center justify-center shadow-md">
                    <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '10s' }} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 font-display">{t.aiRecommendation}</h3>
                    <p className="text-[11px] text-slate-400 font-medium font-mono">Software-Only ET₀ Soil Water Engine</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* PDF Export Button */}
                  <button
                    onClick={handleExportPDF}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-[#fafaf9] border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer"
                  >
                    <FileDown className="w-4 h-4 text-slate-500" />
                    <span>{t.exportPDF}</span>
                  </button>

                  {/* Recalculate Recommendation Trigger */}
                  <button
                    onClick={handleRecalculate}
                    disabled={loadingAi}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-emerald-600/15 transition cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingAi ? 'animate-spin' : ''}`} />
                    <span>Recalculate</span>
                  </button>
                </div>
              </div>

              {/* Display AI Advice message */}
              <div className="bg-emerald-50/30 rounded-2xl p-5 border border-emerald-100 space-y-4">
                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-black text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-[4px] font-mono border border-emerald-200 tracking-wider">
                    Siri-Mitra AI Advisor:
                  </span>
                  <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed font-sans">
                    {loadingAi ? 'AI Engine is computing ET₀ soil water balance and weather forecasts...' : aiRec?.recommendation}
                  </p>
                </div>

                {/* Software Output Key Metrics Banner */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3.5 border-t border-emerald-100/60">
                  <div className="p-3 bg-white/80 rounded-xl border border-emerald-100 space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">🌱 EST. MOISTURE</p>
                    <p className="text-base font-extrabold text-slate-800 font-display">
                      {waterBalance.estimatedSoilMoisture}%
                    </p>
                  </div>

                  <div className="p-3 bg-white/80 rounded-xl border border-emerald-100 space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">💧 WATER DEFICIT</p>
                    <p className="text-base font-extrabold text-slate-800 font-display">
                      {waterBalance.waterDeficitLitres.toLocaleString()} L
                    </p>
                  </div>

                  <div className="p-3 bg-white/80 rounded-xl border border-emerald-100 space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">🌧️ RAIN EXPECTED</p>
                    <p className="text-base font-extrabold text-slate-800 font-display">
                      {waterBalance.rainExpected ? 'Yes (Rain)' : 'No'}
                    </p>
                  </div>

                  <div className="p-3 bg-white/80 rounded-xl border border-emerald-100 space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">🚿 RECOMMENDATION</p>
                    <p className={`text-sm font-extrabold font-display ${waterBalance.recommendationDecision === 'irrigate' ? 'text-blue-600' : 'text-emerald-700'}`}>
                      {waterBalance.recommendationDecision === 'irrigate' ? 'Irrigate' : waterBalance.recommendationDecision === 'delay_rain' ? 'Delay (Rain)' : 'Don\'t Irrigate'}
                    </p>
                  </div>

                  <div className="p-3 bg-white/80 rounded-xl border border-emerald-100 space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">⏱️ SUGGESTED DURATION</p>
                    <p className="text-base font-extrabold text-emerald-700 font-display">
                      {waterBalance.suggestedDurationMins} Mins
                    </p>
                  </div>
                </div>

                {/* Secondary Attributes */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 text-xs font-bold text-slate-600 font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px] block">WATER VOLUME:</span>
                    <span>{aiRec?.waterRequired?.toLocaleString() || waterBalance.waterDeficitLitres.toLocaleString()} Litres</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">OPTIMAL TIME:</span>
                    <span>{aiRec?.bestTime || 'Early Morning (6:00 AM)'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">NEXT IRRIGATION:</span>
                    <span>{aiRec?.nextIrrigation || 'In 2 Days'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">WATER SAVED:</span>
                    <span className="text-emerald-700">🟢 {aiRec?.waterSaving || 30}% Saved</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Smart Irrigation Schedule Calendar */}
            <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-150 space-y-4 hover:shadow-lg transition-all duration-300">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-3.5 font-mono">
                <CloudSun className="w-4 h-4 text-emerald-600 animate-pulse" />
                {t.schedule}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-7 gap-2.5">
                {schedule.map((day) => {
                  const isWatered = day.duration > 0;
                  return (
                    <div
                      key={day.day}
                      className={`rounded-2xl p-3 border text-center space-y-1.5 ${
                        day.rainExpected
                          ? 'bg-amber-50/50 border-amber-200 text-amber-950 shadow-sm'
                          : isWatered
                          ? 'bg-blue-50/50 border-blue-200 text-blue-900 shadow-sm'
                          : 'bg-[#fafaf9] border-slate-150 text-slate-600'
                      }`}
                    >
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">{day.day.substring(0, 3)}</p>
                      
                      <div className="flex justify-center py-1">
                        {day.rainExpected ? (
                          <CloudRain className="w-5 h-5 text-blue-500" />
                        ) : isWatered ? (
                          <Droplet className="w-5 h-5 text-blue-500 animate-bounce" />
                        ) : (
                          <Sun className="w-5 h-5 text-amber-500" />
                        )}
                      </div>

                      <p className="text-xs font-extrabold truncate font-sans">{day.status}</p>
                      <p className="text-[10px] text-slate-400 font-bold font-mono">
                        {day.rainExpected ? 'Rain' : isWatered ? `${day.duration} Mins` : '0 Mins'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recharts Analytics Water Usage Dashboard */}
            <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-150 space-y-4 hover:shadow-lg transition-all duration-300">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-3.5 font-mono">
                <TrendingUp className="w-4 h-4 text-emerald-600 animate-bounce" />
                {t.waterUsage} Analytics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Chart 1: Daily Water Usage */}
                <div className="bg-[#fafaf9] p-4.5 rounded-2xl border border-slate-150">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-3">Daily Water Allocation (Litres)</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <AreaChart data={waterUsage}>
                      <defs>
                        <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                      <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                      <Tooltip />
                      <Area type="monotone" dataKey="waterUsed" stroke="#3b82f6" fillOpacity={1} fill="url(#colorWater)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Chart 2: Weekly Water Savings */}
                <div className="bg-[#fafaf9] p-4.5 rounded-2xl border border-slate-150">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-3">Weekly Conservation Savings (Litres)</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={waterUsage}>
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                      <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                      <Tooltip />
                      <Bar dataKey="waterSaved" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* History & Notification Stream */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Notifications stream */}
              <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-150 space-y-3 hover:shadow-lg transition-all duration-300">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                  <Bell className="w-4 h-4 text-emerald-600 animate-ping" />
                  Real-Time Notification stream
                </h4>
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {notifications.map((notif, index) => (
                    <div
                      key={index}
                      className={`p-2.5 rounded-xl text-xs font-semibold leading-relaxed border ${
                        notif.includes('⚠️ ALERT:')
                          ? 'bg-red-50/50 border-red-100 text-red-800'
                          : 'bg-[#fafaf9] border-slate-150 text-slate-700'
                      }`}
                    >
                      {notif}
                    </div>
                  ))}
                </div>
              </div>

              {/* Historical Action reports */}
              <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-150 space-y-3 hover:shadow-lg transition-all duration-300">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                  <History className="w-4 h-4 text-emerald-600" />
                  {t.history} Logs
                </h4>
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 text-xs font-bold text-slate-600">
                  {irrigationHistory.map((hist, i) => (
                    <div key={i} className="flex justify-between items-center p-2.5 bg-[#fafaf9] rounded-xl border border-slate-150">
                      <div>
                        <p className="text-slate-800 font-extrabold">{hist.action}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{hist.date} • Spent: {hist.water.toLocaleString()} L</p>
                      </div>
                      <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-black px-2 py-0.5 rounded-[4px] uppercase font-mono">
                        Saved: {hist.saved} L
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </section>

        </div>

        {/* AI Siri-Mitra Assistant Chatbot Section */}
        <AIChatbotSection currentLanguage={currentLanguage} crop={activeCrop} soil={activeSoil} />

        {/* Agronomic Crop Guides */}
        <CropGuidesSection currentLanguage={currentLanguage} />

        {/* Operational logs & Tiered RBAC Management */}
        <AuditLogsSection
          currentLanguage={currentLanguage}
          currentRole={profile.role}
          onRoleChange={(newRole) => {
            onUpdateProfile({ ...profile, role: newRole });
            addAuditLog('Role Changed', `Active simulated role updated to ${newRole.toUpperCase()}.`, 'warning');
          }}
          logs={auditLogs}
          onClearLogs={() => setAuditLogs([])}
        />

      </main>
    </div>
  );
}
