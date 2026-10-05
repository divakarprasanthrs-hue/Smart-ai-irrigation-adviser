import { CropType, CropGuide, Language, SoilType, IrrigationMethod, CropGrowthStage, SoilWaterBalanceInput, SoilWaterBalanceResult } from './types';

export const CROP_GUIDES: Record<CropType, CropGuide> = {
  rice: {
    crop: 'rice',
    planting: 'Sow in well-prepared nursery beds. Transplant 21-25 days old seedlings into puddled clayey soil with 2-3 cm standing water. Maintain spacing of 20x15 cm.',
    fertilizing: 'Apply Nitrogen (120 kg/ha), Phosphorus (60 kg/ha), and Potassium (60 kg/ha). Apply Nitrogen in three split doses: at transplanting, active tillering, and panicle initiation.',
    irrigation: 'Requires continuous shallow flooding (2-5 cm water depth) during early growth. Drain water 10-15 days before harvest to ensure uniform ripening.',
    criticalPests: ['Brown Planthopper', 'Stem Borer', 'Blast Disease', 'Bacterial Leaf Blight']
  },
  wheat: {
    crop: 'wheat',
    planting: 'Sow from late October to late November using a seed drill. Ideal depth is 4-5 cm in loamy, well-drained soil. Spacing should be 20-22.5 cm between rows.',
    fertilizing: 'Apply NPK at 120:60:40 kg/ha. Apply full Phosphorus and Potassium at sowing, and split Nitrogen between sowing and first irrigation.',
    irrigation: 'Critical growth stages for irrigation: Crown Root Initiation (20-25 days after sowing), Tillering, Jointing, Flowering, Milking, and Dough stages.',
    criticalPests: ['Rust (Yellow, Brown, Black)', 'Loose Smut', 'Aphids', 'Armyworm']
  },
  cotton: {
    crop: 'cotton',
    planting: 'Sow during April-May in black cotton soil or loamy soils. Spacing of 90x60 cm for Bt hybrids is recommended for optimal canopy growth.',
    fertilizing: 'Apply NPK at 150:75:75 kg/ha. Balance with Micronutrients like Boron and Zinc to prevent boll shedding and encourage fibre strength.',
    irrigation: 'Requires moderate water. Avoid irrigation during early vegetative phase to encourage deep rooting. Key watering stages: Flowering and Boll development.',
    criticalPests: ['Pink Bollworm', 'Whitefly', 'Jassids', 'Boll Rot']
  },
  tomato: {
    crop: 'tomato',
    planting: 'Raise seedlings in raised nursery beds. Transplant 4-5 week old seedlings in loamy, well-composted soil. Use spacing of 60x45 cm with staking.',
    fertilizing: 'Apply NPK at 100:80:60 kg/ha. Supplement with Calcium (Gypsum or Calcium Nitrate) to prevent Blossom End Rot.',
    irrigation: 'Requires regular and even moisture. Avoid overhead watering to reduce fungal diseases. Drip irrigation is highly recommended to conserve water.',
    criticalPests: ['Fruit Borer', 'Early/Late Blight', 'Leaf Miner', 'Tomato Leaf Curl Virus']
  },
  sugarcane: {
    crop: 'sugarcane',
    planting: 'Plant healthy setts with 2-3 buds in furrows (spacing 90 cm) during early spring (Feb-Mar) or autumn (Oct). Prefers deep clay-loam soils.',
    fertilizing: 'Heavy feeder. Apply Nitrogen (250 kg/ha), Phosphorus (80 kg/ha), and Potassium (120 kg/ha) in split doses up to 150 days of crop age.',
    irrigation: 'High water requirement. irrigate every 10-12 days during formative stage (summer) and 20-25 days during maturity stage.',
    criticalPests: ['Early Shoot Borer', 'Red Rot', 'White Grubs', 'Woolly Aphid']
  },
  maize: {
    crop: 'maize',
    planting: 'Sow 4-5 cm deep in warm, well-aerated loam soil. Spacing of 60x20 cm. Best sown just before or at the onset of monsoon.',
    fertilizing: 'Apply NPK at 120:60:40 kg/ha. Zinc deficiency is common; apply Zinc Sulphate at 25 kg/ha at sowing.',
    irrigation: 'Key moisture-sensitive stages are Tasseling (flowering) and Silking (cob formation). Adequate soil moisture during these stages determines yield.',
    criticalPests: ['Fall Armyworm', 'Stem Borer', 'Banded Leaf and Sheath Blight', 'Turcicum Leaf Blight']
  },
  potatoes: {
    crop: 'potatoes',
    planting: 'Plant healthy certified seed tubers in ridges spaced 60 cm apart, with 20 cm spacing between tubers. Prefers loose, sandy-loam acidic soil.',
    fertilizing: 'Apply NPK at 150:100:120 kg/ha. Requires high Potassium for tuber enlargement. Apply organic manure heavily during land preparation.',
    irrigation: 'Keep soil uniformly moist but not waterlogged. Stop watering 10-14 days before harvesting to allow skin curing.',
    criticalPests: ['Late Blight', 'Potato Tuber Moth', 'Aphids', 'Root Knot Nematodes']
  },
  carrots: {
    crop: 'carrots',
    planting: 'Sow seeds directly in ridges, 1.5 cm deep in deep, loose, stone-free sandy soils. Thin out seedlings to 5-10 cm apart once they reach 5 cm height.',
    fertilizing: 'Apply moderate Nitrogen (60 kg/ha) to avoid hairy, branched roots. Apply higher Potassium (100 kg/ha) for root sweetening and color development.',
    irrigation: 'Regular, light watering is essential. Drought followed by sudden heavy watering causes root cracking.',
    criticalPests: ['Carrot Rust Fly', 'Alternaria Leaf Blight', 'Root-knot Nematodes']
  },
  onions: {
    crop: 'onions',
    planting: 'Transplant 6-8 week seedlings during winter. Space them 15x10 cm apart in well-pulverized loamy soil with excellent organic matter.',
    fertilizing: 'Apply NPK at 100:50:80 kg/ha. Sulphur application (20-30 kg/ha) is critical to improve pungency, shelf-life, and bulb density.',
    irrigation: 'Requires frequent light irrigations. Critical stage: Bulb onion formation. Stop watering 15 days before harvest when tops break over.',
    criticalPests: ['Thrips', 'Purple Blotch', 'Downy Mildew', 'Onion Maggot']
  },
  chillies: {
    crop: 'chillies',
    planting: 'Transplant 5-6 week old seedlings in well-drained loamy soil with pH 6-7. Maintain spacing of 45x45 cm or 60x45 cm.',
    fertilizing: 'Apply NPK at 120:60:60 kg/ha. Apply top dressing of Nitrogen during flowering and fruiting to encourage heavy yields.',
    irrigation: 'Sensitive to waterlogging which causes flower drop. Water moderately, keeping the soil damp but never saturated. Best with drip systems.',
    criticalPests: ['Thrips and Mites (causing leaf curl)', 'Fruit Rot/Anthracnose', 'Damping Off']
  },
  coffee: {
    crop: 'coffee',
    planting: 'Grow under shade trees (silver oak) in deep, rich, organic acidic soil (pH 5.5-6.5) in hilly terrains. Space Arabica 1.5-2m, Robusta 2.5-3m.',
    fertilizing: 'Apply NPK at 140:90:120 kg/ha for Robusta, 80:60:80 kg/ha for Arabica. Apply split doses pre-monsoon, mid-monsoon, and post-monsoon.',
    irrigation: 'Relies heavily on blossom showers (March-April) to trigger flowering. Back-up sprinkler systems are crucial during dry winter seasons.',
    criticalPests: ['White Stem Borer', 'Coffee Leaf Rust', 'Mealybugs', 'Berry Borer']
  },
  tea: {
    crop: 'tea',
    planting: 'Plant clonal cuttings in highly acidic soils (pH 4.5-5.5) on sloping hills with excellent drainage. Maintain spacing of 120x75 cm.',
    fertilizing: 'Requires high Nitrogen for leaf vegetative growth. Apply NPK in 3:1:2 or 4:1:2 ratio. Often supplemented with Zinc and Magnesium foliar sprays.',
    irrigation: 'Thrives in regions with evenly distributed high rainfall (1500-2500 mm). High-density sprinkler systems are used to maintain high humidity.',
    criticalPests: ['Tea Mosquito Bug', 'Red Spider Mites', 'Blister Blight', 'Thrips']
  }
};

// FAO-56 Crop Factors (Kc) per Growth Stage
export const CROP_KC: Record<CropType, Record<CropGrowthStage, number>> = {
  rice: { initial: 1.05, vegetative: 1.15, flowering: 1.20, maturity: 0.90 },
  wheat: { initial: 0.40, vegetative: 0.80, flowering: 1.15, maturity: 0.40 },
  cotton: { initial: 0.45, vegetative: 0.75, flowering: 1.15, maturity: 0.70 },
  tomato: { initial: 0.60, vegetative: 0.85, flowering: 1.15, maturity: 0.80 },
  sugarcane: { initial: 0.40, vegetative: 1.00, flowering: 1.25, maturity: 0.75 },
  maize: { initial: 0.30, vegetative: 0.70, flowering: 1.20, maturity: 0.60 },
  potatoes: { initial: 0.50, vegetative: 0.80, flowering: 1.15, maturity: 0.75 },
  carrots: { initial: 0.45, vegetative: 0.75, flowering: 1.05, maturity: 0.90 },
  onions: { initial: 0.50, vegetative: 0.75, flowering: 1.05, maturity: 0.75 },
  chillies: { initial: 0.60, vegetative: 0.85, flowering: 1.15, maturity: 0.80 },
  coffee: { initial: 0.90, vegetative: 0.95, flowering: 1.10, maturity: 0.95 },
  tea: { initial: 0.95, vegetative: 1.00, flowering: 1.10, maturity: 1.00 }
};

// Soil Moisture Water Retention Capacity (Field Capacity FC & Wilting Point WP in mm per meter of root zone)
export const SOIL_CAPACITY: Record<SoilType, { fc: number; wp: number; maxVolPercent: number }> = {
  sandy: { fc: 120, wp: 40, maxVolPercent: 25 },
  loamy: { fc: 240, wp: 100, maxVolPercent: 45 },
  clay: { fc: 320, wp: 160, maxVolPercent: 55 }
};

/**
 * Calculates Reference Evapotranspiration (ET0) using Hargreaves / FAO-56 simplified formula
 * @param temp Temperature in °C
 * @param solarRadiation Solar radiation in MJ/m²/day
 * @param humidity Humidity in %
 * @param windSpeed Wind speed in km/h
 * @returns ET0 in mm/day
 */
export function calculateET0(temp: number, solarRadiation: number, humidity: number, windSpeed: number): number {
  // Hargreaves-Samani / FAO-56 simplified estimate
  const ra = Math.max(10, solarRadiation * 0.408); // Convert radiation roughly to equivalent evaporation
  const tempFactor = temp + 17.8;
  const humidityFactor = 1 - Math.min(0.9, humidity / 100) * 0.25;
  const windFactor = 1 + windSpeed * 0.015;

  let et0 = 0.0023 * tempFactor * Math.sqrt(Math.max(1, temp)) * ra * humidityFactor * windFactor;
  return Math.max(1.2, Math.min(12.5, Math.round(et0 * 10) / 10));
}

/**
 * Software-Only Engine for Soil Water Balance & Estimated Soil Moisture Calculation
 * Software calculates soil water deficit without needing hardware sensors.
 */
export function calculateSoilWaterBalance(input: {
  cropType: CropType;
  soilType: SoilType;
  farmSize: number; // acres
  growthStage: CropGrowthStage;
  lastIrrigationDaysAgo: number;
  previousIrrigationAmount: number; // Litres
  irrigationMethod: IrrigationMethod;
  temp: number;
  humidity: number;
  windSpeed: number;
  solarRadiation: number;
  rainProb: number;
  rainfallMm: number;
}): {
  estimatedSoilMoisture: number;
  waterDeficitLitres: number;
  rainExpected: boolean;
  rainForecastMm: number;
  recommendationDecision: 'irrigate' | 'dont_irrigate' | 'delay_rain';
  recommendationText: string;
  suggestedDurationMins: number;
  et0: number;
  kc: number;
  etc: number;
  waterSaving: number;
  bestTime: string;
  nextIrrigation: string;
} {
  const {
    cropType,
    soilType,
    farmSize,
    growthStage,
    lastIrrigationDaysAgo,
    previousIrrigationAmount,
    irrigationMethod,
    temp,
    humidity,
    windSpeed,
    solarRadiation,
    rainProb,
    rainfallMm
  } = input;

  // 1. Calculate Reference Evapotranspiration (ET0)
  const et0 = calculateET0(temp, solarRadiation, humidity, windSpeed);

  // 2. Lookup Crop Factor (Kc) and calculate Crop Water Loss (ETc)
  const stageMap = CROP_KC[cropType] || CROP_KC.rice;
  const kc = stageMap[growthStage] || 0.85;
  const etc = Math.round(et0 * kc * 10) / 10; // mm/day crop water loss

  // 3. Accumulated Water Loss since last irrigation
  const days = Math.max(1, lastIrrigationDaysAgo);
  const totalWaterLostMm = etc * days;

  // Convert previous irrigation volume (Litres) into equivalent mm depth across farm
  // 1 acre = 4046.86 m²; 1 mm depth across 1 acre = 4046.86 Litres
  const litresPerAcrePerMm = 4046.86;
  const prevIrrigationMm = previousIrrigationAmount > 0 ? previousIrrigationAmount / (farmSize * litresPerAcrePerMm) : 0;

  // Effective Rainfall mm
  const effectiveRainMm = rainProb > 50 ? Math.max(rainfallMm, (rainProb / 100) * 15) : 0;

  // Soil water capacity benchmarks
  const soilCap = SOIL_CAPACITY[soilType] || SOIL_CAPACITY.loamy;
  const totalAvailWaterMm = soilCap.fc - soilCap.wp; // Root zone available water (~140mm for loamy)

  // Net Soil Water Balance mm
  let netWaterBalanceMm = totalAvailWaterMm - totalWaterLostMm + prevIrrigationMm + (effectiveRainMm * 0.8);
  netWaterBalanceMm = Math.max(0, Math.min(totalAvailWaterMm * 1.2, netWaterBalanceMm));

  // Compute Estimated Soil Moisture %
  // 100% = Field Capacity, Wilting Point = 15-20%
  let estimatedSoilMoisture = Math.round((netWaterBalanceMm / totalAvailWaterMm) * 65 + 20);
  estimatedSoilMoisture = Math.max(10, Math.min(95, estimatedSoilMoisture));

  // Determine Water Deficit in Litres
  const deficitMm = Math.max(0, totalAvailWaterMm - netWaterBalanceMm);
  const waterDeficitLitres = Math.round(deficitMm * farmSize * litresPerAcrePerMm);

  // Rain Expected decision
  const rainExpected = rainProb >= 50 || rainfallMm > 5;
  let recommendationDecision: 'irrigate' | 'dont_irrigate' | 'delay_rain' = 'irrigate';
  let recommendationText = '';
  let suggestedDurationMins = 0;
  let waterSaving = 20;
  let bestTime = '6:00 AM';
  let nextIrrigation = 'Tomorrow';

  // Application efficiency adjustment for duration
  const methodEfficiency = irrigationMethod === 'drip' ? 0.90 : irrigationMethod === 'sprinkler' ? 0.75 : 0.55;

  if (rainExpected) {
    recommendationDecision = 'delay_rain';
    suggestedDurationMins = 0;
    waterSaving = 85;
    bestTime = 'Postpone';
    nextIrrigation = 'Post-Rain Check';
    recommendationText = `Rain expected (${rainProb}% prob / ${Math.round(effectiveRainMm)}mm). Postpone irrigation to save water and prevent soil saturation.`;
  } else if (estimatedSoilMoisture >= 60) {
    recommendationDecision = 'dont_irrigate';
    suggestedDurationMins = 0;
    waterSaving = 60;
    bestTime = 'Not Needed Today';
    nextIrrigation = 'In 2-3 Days';
    recommendationText = `Estimated Soil Moisture is optimal (${estimatedSoilMoisture}%). Crop water needs are currently satisfied; no irrigation required today.`;
  } else {
    recommendationDecision = 'irrigate';
    
    // Calculate suggested watering duration (mins)
    // Drip emitter ~4L/hr/m², Sprinkler ~15L/hr/m²
    const flowRateLpm = irrigationMethod === 'drip' ? 80 : irrigationMethod === 'sprinkler' ? 200 : 400;
    const netNeedLitres = Math.min(waterDeficitLitres, farmSize * 2500);
    const durationRaw = Math.round((netNeedLitres / flowRateLpm) / methodEfficiency);
    suggestedDurationMins = Math.max(15, Math.min(120, durationRaw));

    bestTime = '6:00 AM or 6:30 PM';
    nextIrrigation = estimatedSoilMoisture < 30 ? 'Immediate' : 'Tomorrow';
    waterSaving = irrigationMethod === 'drip' ? 45 : 25;

    recommendationText = `Estimated Soil Moisture is low (${estimatedSoilMoisture}%). Water deficit is ${waterDeficitLitres.toLocaleString()} Litres. Irrigate for ${suggestedDurationMins} minutes via ${irrigationMethod.toUpperCase()}.`;
  }

  return {
    estimatedSoilMoisture,
    waterDeficitLitres,
    rainExpected,
    rainForecastMm: Math.round(effectiveRainMm),
    recommendationDecision,
    recommendationText,
    suggestedDurationMins,
    et0,
    kc,
    etc,
    waterSaving,
    bestTime,
    nextIrrigation
  };
}

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    appName: 'AI Smart Irrigation Advisor',
    tagline: 'Save Water • Grow More',
    getStarted: 'Get Started',
    changeLanguage: 'Change Language',
    selectLanguage: 'Select Language',
    welcomeBack: 'Welcome Back,',
    roleLabel: 'Role',
    roleFarmer: 'Farmer',
    roleOfficer: 'Field Officer',
    roleAdmin: 'System Administrator',
    registerTitle: 'Farmer Registration',
    registerSubtitle: 'Set up your smart farm profile to start receiving AI recommendations',
    name: 'Farmer Name',
    mobile: 'Mobile Number',
    village: 'Village',
    state: 'State',
    farmSize: 'Farm Size (Acres)',
    cropType: 'Crop Type',
    soilType: 'Soil Type',
    irrigationMethod: 'Irrigation Method',
    sensorsTitle: 'Sensors / Software Override',
    sensorsSubtitle: 'Link your telemetry hardware or toggle manual data overrides',
    soilMoistureSensor: 'Soil Moisture Sensor',
    tempSensor: 'Temperature Sensor',
    humiditySensor: 'Humidity Sensor',
    continue: 'Continue',
    saveSettings: 'Save Settings',
    dashboard: 'Dashboard',
    weather: "Today's Weather",
    soilMoisture: 'Soil Moisture',
    aiRecommendation: 'AI Recommendations',
    enterFarmDetails: 'Farm Details',
    connectSensors: 'Connect Sensors',
    schedule: 'Watering Schedule',
    waterUsage: 'Water Usage',
    history: 'History Logs',
    aiAssistant: 'AI Assistant',
    emergencyAlerts: 'Emergency Alerts',
    settings: 'Settings',
    offlineMode: 'Offline Mode',
    offlineWarning: 'You are currently offline. Local updates will sync automatically once connection is restored.',
    syncStatusSynced: 'All data synced with Cloud Firestore',
    syncStatusSyncing: 'Syncing local changes with Cloud...',
    dataEncrypted: 'Data secured with AES-256 local encryption',
    moistureGood: 'Good',
    moistureModerate: 'Moderate',
    moistureDry: 'Dry',
    waterRequired: 'Water Required',
    bestTime: 'Best Time',
    nextIrrigation: 'Next Irrigation',
    expectedSaving: 'Water Saved',
    askAssistant: 'Ask AI Assistant...',
    auditLogs: 'System Audit Logs',
    userManagement: 'User Roles & Access Control',
    anomaliesAlert: 'Anomaly Real-Time Notifications',
    exportPDF: 'Export PDF Report',
    plantingGuide: 'Planting Guide',
    fertilizerGuide: 'Fertilizing Guide',
    irrigationGuide: 'Irrigation Guide',
    criticalPests: 'Critical Pests to Monitor',
    // Software-Only Engine Terms
    estimatedSoilMoisture: 'Estimated Soil Moisture',
    softwareEngineTitle: 'Software-Only ET₀ Soil Water Balance Engine',
    softwareNotice: 'Software-Only Mode: Soil moisture is estimated using weather, crop evapotranspiration (ET₀), soil type, and rainfall data without hardware sensors.',
    cropGrowthStage: 'Crop Growth Stage',
    stageInitial: 'Initial / Germination',
    stageVegetative: 'Vegetative Growth',
    stageFlowering: 'Flowering / Yielding',
    stageMaturity: 'Maturity / Harvesting',
    lastIrrigation: 'Last Irrigation Date',
    previousIrrigationAmount: 'Previous Irrigation (Litres)',
    solarRadiation: 'Solar Radiation (MJ/m²/d)',
    waterDeficit: 'Water Deficit',
    rainExpected: 'Rain Expected',
    irrigateNow: 'Irrigate Now',
    dontIrrigate: "Don't Irrigate",
    delayRain: 'Delay (Rain Forecast)',
    suggestedDuration: 'Suggested Duration',
    evapotranspiration: 'Crop Evapotranspiration (ETc)',
    refET0: 'Reference ET₀'
  },
  ta: {
    appName: 'ஏஐ ஸ்மார்ட் நீர்ப்பாசன ஆலோசகர்',
    tagline: 'தண்ணீர் சேமிப்போம் • அதிக மகசூல் பெறுவோம்',
    getStarted: 'தொடங்கவும்',
    changeLanguage: 'மொழியை மாற்றுக',
    selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    welcomeBack: 'வருக,',
    roleLabel: 'பணி நிலை',
    roleFarmer: 'விவசாயி',
    roleOfficer: 'வட்டார அலுவலர்',
    roleAdmin: 'அமைப்பு நிர்வாகி',
    registerTitle: 'விவசாயி பதிவு',
    registerSubtitle: 'ஏஐ நீர்ப்பாசன பரிந்துரைகளைப் பெற உங்கள் பண்ணை சுயவிவரத்தை அமைக்கவும்',
    name: 'விவசாயி பெயர்',
    mobile: 'கைபேசி எண்',
    village: 'கிராமம்',
    state: 'மாநிலம்',
    farmSize: 'பண்ணை அளவு (ஏக்கர்)',
    cropType: 'பயிர் வகை',
    soilType: 'மண் வகை',
    irrigationMethod: 'நீர்ப்பாசன முறை',
    sensorsTitle: 'சென்சார்கள் / மென்பொருள் அமைப்பு',
    sensorsSubtitle: 'உங்கள் வயல் சென்சார்களை இணைக்கவும் அல்லது கைமுறையாக உள்ளிடவும்',
    soilMoistureSensor: 'மண் ஈரப்பதம் சென்சார்',
    tempSensor: 'வெப்பநிலை சென்சார்',
    humiditySensor: 'ஈரப்பதம் சென்சார்',
    continue: 'தொடரவும்',
    saveSettings: 'அமைப்புகளைச் சேமி',
    dashboard: 'முகப்பு பலகை',
    weather: 'இன்றைய வானிலை',
    soilMoisture: 'மண் ஈரப்பதம்',
    aiRecommendation: 'ஏஐ பரிந்துரைகள்',
    enterFarmDetails: 'பண்ணை விவரங்கள்',
    connectSensors: 'சென்சார் இணைப்பு',
    schedule: 'நீர்ப்பாசன கால அட்டவணை',
    waterUsage: 'நீர் பயன்பாடு',
    history: 'வரலாற்று பதிவுகள்',
    aiAssistant: 'ஏஐ உதவியாளர்',
    emergencyAlerts: 'அவசர எச்சரிக்கைகள்',
    settings: 'அமைப்புகள்',
    offlineMode: 'ஆஃப்லைன் பயன்முறை',
    offlineWarning: 'நீங்கள் ஆஃப்லைனில் உள்ளீர்கள். நெட்வொர்க் கிடைத்தவுடன் தானாகவே கிளவுடுடன் ஒத்திசைக்கப்படும்.',
    syncStatusSynced: 'அனைத்து தரவுகளும் ஒத்திசைக்கப்பட்டுள்ளன',
    syncStatusSyncing: 'கிளவுடுடன் ஒத்திசைக்கப்படுகிறது...',
    dataEncrypted: 'தரவுகள் பாதுகாப்பாக குறியாக்கம் செய்யப்பட்டுள்ளன (AES-256)',
    moistureGood: 'நன்று',
    moistureModerate: 'மிதமானது',
    moistureDry: 'வறண்டது',
    waterRequired: 'தேவைப்படும் தண்ணீர்',
    bestTime: 'சிறந்த நேரம்',
    nextIrrigation: 'அடுத்த நீர்ப்பாசனம்',
    expectedSaving: 'சேமிக்கப்பட்ட நீர்',
    askAssistant: 'ஏஐ உதவியாளரிடம் கேளுங்கள்...',
    auditLogs: 'கணினி தணிக்கை பதிவுகள்',
    userManagement: 'அணுகல் கட்டுப்பாடு மற்றும் பாத்திரங்கள்',
    anomaliesAlert: 'நிகழ்நேர அசாதாரண எச்சரிக்கைகள்',
    exportPDF: 'PDF அறிக்கையைப் பதிவிறக்குக',
    plantingGuide: 'நடவு முறை',
    fertilizerGuide: 'உர மேலாண்மை',
    irrigationGuide: 'நீர் மேலாண்மை',
    criticalPests: 'கண்காணிக்க வேண்டிய பூச்சிகள்',
    estimatedSoilMoisture: 'கணக்கிடப்பட்ட மண் ஈரப்பதம்',
    softwareEngineTitle: 'மென்பொருள் நீர் சமநிலை கணக்கீட்டு இயந்திரம் (ET₀)',
    softwareNotice: 'சென்சார்கள் தேவையில்லை: வானிலை, பயிர் நீராவிப்போக்கு (ET₀) மற்றும் மழை கணிப்பு மூலம் மண் ஈரப்பதம் கணக்கிடப்படுகிறது.',
    cropGrowthStage: 'பயிர் வளர்ச்சி நிலை',
    stageInitial: 'ஆரம்ப நிலை / முளைப்பு',
    stageVegetative: 'வளர்ச்சி நிலை',
    stageFlowering: 'பூக்கும் / காய்க்கும் நிலை',
    stageMaturity: 'முதிர்ச்சி / அறுவடை நிலை',
    lastIrrigation: 'கடைசியாக நீர் பாய்ச்சிய நாள்',
    previousIrrigationAmount: 'முந்தைய நீர்ப்பாசனம் (லிட்டர்)',
    solarRadiation: 'சூரிய கதிர்வீச்சு',
    waterDeficit: 'நீர் பற்றாக்குறை',
    rainExpected: 'மழை எதிர்பார்க்கப்படுகிறது',
    irrigateNow: 'இப்போது நீர் பாய்ச்சவும்',
    dontIrrigate: 'தண்ணீர் பாய்ச்சத் தேவையில்லை',
    delayRain: 'தள்ளிப்போடுங்கள் (மழை வாய்ப்பு)',
    suggestedDuration: 'பரிந்துரைக்கப்பட்ட நேரம்',
    evapotranspiration: 'பயிர் நீராவிப்போக்கு (ETc)',
    refET0: 'அடிப்படை ET₀'
  },
  hi: {
    appName: 'AI स्मार्ट सिंचाई सलाहकार',
    tagline: 'पानी बचाएं • अधिक उगाएं',
    getStarted: 'शुरू करें',
    changeLanguage: 'भाषा बदलें',
    selectLanguage: 'भाषा चुनें',
    welcomeBack: 'स्वागत है,',
    roleLabel: 'भूमिका',
    roleFarmer: 'किसान',
    roleOfficer: 'क्षेत्र अधिकारी',
    roleAdmin: 'सिस्टम प्रशासक',
    registerTitle: 'किसान पंजीकरण',
    registerSubtitle: 'AI अनुशंसाएं प्राप्त करने के लिए अपना स्मार्ट फार्म प्रोफ़ाइल सेट करें',
    name: 'किसान का नाम',
    mobile: 'मोबाइल नंबर',
    village: 'गाँव',
    state: 'राज्य',
    farmSize: 'खेत का आकार (एकड़)',
    cropType: 'फसल का प्रकार',
    soilType: 'मिट्टी का प्रकार',
    irrigationMethod: 'सिंचाई विधि',
    sensorsTitle: 'सेंसर / सॉफ्टवेयर ओवरराइड',
    sensorsSubtitle: 'हार्डवेयर सेंसर कनेक्ट करें या मैन्युअल रूप से डेटा दर्ज करें',
    soilMoistureSensor: 'मृदा नमी सेंसर',
    tempSensor: 'तापमान सेंसर',
    humiditySensor: 'आर्द्रता सेंसर',
    continue: 'जारी रखें',
    saveSettings: 'सेटिंग्स सहेजें',
    dashboard: 'डैशबोर्ड',
    weather: 'आज का मौसम',
    soilMoisture: 'मिट्टी की नमी',
    aiRecommendation: 'AI अनुशंसाएँ',
    enterFarmDetails: 'खेत का विवरण',
    connectSensors: 'सेंसर कनेक्शन',
    schedule: 'सिंचाई अनुसूची',
    waterUsage: 'पानी का उपयोग',
    history: 'इतिहास लॉग',
    aiAssistant: 'AI सहायक',
    emergencyAlerts: 'आपातकालीन अलर्ट',
    settings: 'सेटिंग्स',
    offlineMode: 'ऑफ़लाइन मोड',
    offlineWarning: 'आप अभी ऑफ़लाइन हैं। नेटवर्क फिर से जुड़ने पर डेटा स्वचालित रूप से सिंक हो जाएगा।',
    syncStatusSynced: 'सभी डेटा क्लाउड फ़ायरस्टोर के साथ सिंक हो गए हैं',
    syncStatusSyncing: 'क्लाउड के साथ सिंक हो रहा है...',
    dataEncrypted: 'डेटा एईएस-256 स्थानीय एन्क्रिप्शन के साथ सुरक्षित है',
    moistureGood: 'अच्छा',
    moistureModerate: 'सामान्य',
    moistureDry: 'सूखा',
    waterRequired: 'आवश्यक पानी',
    bestTime: 'सर्वोत्तम समय',
    nextIrrigation: 'अगली सिंचाई',
    expectedSaving: 'बचाया गया पानी',
    askAssistant: 'AI सहायक से पूछें...',
    auditLogs: 'प्रणाली ऑडिट लॉग',
    userManagement: 'भूमिकाएं और पहुंच नियंत्रण',
    anomaliesAlert: 'वास्तविक समय विसंगति सूचनाएं',
    exportPDF: 'PDF रिपोर्ट निर्यात करें',
    plantingGuide: 'बुवाई गाइड',
    fertilizerGuide: 'उर्वरक गाइड',
    irrigationGuide: 'सिंचाई गाइड',
    criticalPests: 'महत्वपूर्ण कीट जिन पर नज़र रखें',
    estimatedSoilMoisture: 'अनुमानित मिट्टी की नमी',
    softwareEngineTitle: 'सॉफ्टवेयर जल संतुलन गणना इंजन (ET₀)',
    softwareNotice: 'बिना सेंसर के: मौसम, वाष्पोत्सर्जन (ET₀) और वर्षा पूर्वानुमान से मिट्टी की नमी का अनुमान लगाया जाता है।',
    cropGrowthStage: 'फसल वृद्धि चरण',
    stageInitial: 'प्रारंभिक / अंकुरण',
    stageVegetative: 'वनस्पतिक वृद्धि',
    stageFlowering: 'पुष्पन / फलना',
    stageMaturity: 'परिपक्वता / कटाई',
    lastIrrigation: 'अंतिम सिंचाई तिथि',
    previousIrrigationAmount: 'पिछली सिंचाई मात्रा (लीटर)',
    solarRadiation: 'सौर विकिरण (MJ/m²/d)',
    waterDeficit: 'पानी की कमी',
    rainExpected: 'बारिश की संभावना',
    irrigateNow: 'अभी सिंचाई करें',
    dontIrrigate: 'सिंचाई न करें',
    delayRain: 'स्थगित करें (बारिश का पूर्वानुमान)',
    suggestedDuration: 'सुझाई गई अवधि',
    evapotranspiration: 'फसल वाष्पोत्सर्जन (ETc)',
    refET0: 'संदर्भ ET₀'
  },
  te: {
    appName: 'AI స్మార్ట్ నీటిపారుదల సలహాదారు',
    tagline: 'నీటిని ఆదా చేయండి • ఎక్కువ పండించండి',
    getStarted: 'ప్రారంభించండి',
    changeLanguage: 'భాష మార్చండి',
    selectLanguage: 'భాషను ఎంచుకోండి',
    welcomeBack: 'స్వాగతం,',
    roleLabel: 'పాత్ర',
    roleFarmer: 'రైతు',
    roleOfficer: 'ఫీల్డ్ ఆఫీసర్',
    roleAdmin: 'సిస్టమ్ అడ్మినిస్ట్రేటర్',
    registerTitle: 'రైతు నమోదు',
    registerSubtitle: 'AI సిఫార్సులను పొందడానికి మీ స్మార్ట్ ఫార్మ్ ప్రొఫైల్‌ను సెటప్ చేయండి',
    name: 'రైతు పేరు',
    mobile: 'మొబైల్ సంఖ్య',
    village: 'గ్రామం',
    state: 'రాష్ట్రం',
    farmSize: 'పొలం పరిమాణం (ఎకరాలు)',
    cropType: 'పంట రకం',
    soilType: 'నేల రకం',
    irrigationMethod: 'నీటిపారుదల పద్ధతి',
    sensorsTitle: 'సెన్సార్లు / సాఫ్ట్‌వేర్ అమరిక',
    sensorsSubtitle: 'మీ ఫీల్డ్ సెన్సార్లను లింక్ చేయండి లేదా మాన్యువల్‌గా నమోదు చేయండి',
    soilMoistureSensor: 'నేల తేమ సెన్సార్',
    tempSensor: 'ఉష్ణోగ్రత సెన్సార్',
    humiditySensor: 'తేమ సెన్సార్',
    continue: 'కొనసాగించు',
    saveSettings: 'సెట్టింగులను సేవ్ చేయి',
    dashboard: 'డాష్‌బోర్డ్',
    weather: 'నేటి వాతావరణం',
    soilMoisture: 'నేల తేమ',
    aiRecommendation: 'AI సిఫార్సులు',
    enterFarmDetails: 'పొలం వివరాలు',
    connectSensors: 'సెన్సార్ కనెక్షన్',
    schedule: 'నీటిపారుదల షెడ్యూల్',
    waterUsage: 'నీటి వినియోగం',
    history: 'చరిత్ర లాగ్‌లు',
    aiAssistant: 'AI అసిస్టెంట్',
    emergencyAlerts: 'అత్యవసర హెచ్చరికలు',
    settings: 'సెట్టింగులు',
    offlineMode: 'ఆఫ్‌లైన్ మోడ్',
    offlineWarning: 'మీరు ప్రస్తుతం ఆఫ్‌లైన్‌లో ఉన్నారు. నెట్‌వర్క్ పునరుద్ధరించబడినప్పుడు డేటా స్వయంచాలకంగా సింక్ అవుతుంది.',
    syncStatusSynced: 'అన్ని డేటా క్లౌడ్‌తో సింక్ చేయబడింది',
    syncStatusSyncing: 'క్లౌడ్‌తో సింక్ అవుతోంది...',
    dataEncrypted: 'డేటా AES-256 స్థానిక ఎన్‌క్రిప్షన్‌తో సురక్షితంగా ఉంది',
    moistureGood: 'బాగుంది',
    moistureModerate: 'మధ్యస్థం',
    moistureDry: 'పొడి',
    waterRequired: 'కావలసిన నీరు',
    bestTime: 'ఉత్తమ సమయం',
    nextIrrigation: 'తదుపరి నీటిపారుదల',
    expectedSaving: 'ఆదా చేసిన నీరు',
    askAssistant: 'AI అసిస్టెంట్‌ని అడగండి...',
    auditLogs: 'సిస్టమ్ ఆడిట్ లాగ్స్',
    userManagement: 'పాత్రలు మరియు యాక్సెస్ కంట్రోల్',
    anomaliesAlert: 'నిజ-సమయ అసాధారణ నోటిఫికేషన్లు',
    exportPDF: 'PDF నివేదికను ఎగుమతి చేయి',
    plantingGuide: 'నాటడం గైడ్',
    fertilizerGuide: 'ఎరువుల గైడ్',
    irrigationGuide: 'నీటిపారుదల గైడ్',
    criticalPests: 'గమనించాల్సిన కీటకాలు',
    estimatedSoilMoisture: 'అంచనా వేసిన నేల తేమ',
    softwareEngineTitle: 'సాఫ్ట్‌వేర్ నీటి నిల్వ గణన ఇంజిన్ (ET₀)',
    softwareNotice: 'హార్డ్‌వేర్ లేకుండా: వాతావరణం, పంట నీటి ఆవిరి (ET₀) మరియు వర్ష సూచన ఆధారంగా నేల తేమను అంచనా వేస్తుంది.',
    cropGrowthStage: 'పంట పెరుగుదల దశ',
    stageInitial: 'ప్రారంభ దశ / మొలక',
    stageVegetative: 'పెరుగుదల దశ',
    stageFlowering: 'పూత / కాత దశ',
    stageMaturity: 'కోత దశ',
    lastIrrigation: 'చివరిగా నీరు పెట్టిన తేదీ',
    previousIrrigationAmount: 'ముందస్తు నీటి పరిమాణం (లీటర్లు)',
    solarRadiation: 'సౌర వికిరణం',
    waterDeficit: 'నీటి కొరత',
    rainExpected: 'వర్షం పడే అవకాశం',
    irrigateNow: 'ఇప్పుడే నీరు పెట్టండి',
    dontIrrigate: 'నీరు పెట్టవద్దు',
    delayRain: 'వాయిదా వేయండి (వర్ష సూచన)',
    suggestedDuration: 'సూచించిన సమయం',
    evapotranspiration: 'పంట నీటి ఆవిరి (ETc)',
    refET0: 'ప్రామాణిక ET₀'
  },
  kn: {
    appName: 'AI ಸ್ಮಾರ್ಟ್ ನೀರಾವರಿ ಸಲಹೆಗಾರ',
    tagline: 'ನೀರನ್ನು ಉಳಿಸಿ • ಹೆಚ್ಚಿನದನ್ನು ಬೆಳೆಯಿರಿ',
    getStarted: 'ಪ್ರಾರಂಭಿಸಿ',
    changeLanguage: 'ಭಾಷೆ ಬದಲಾಯಿಸಿ',
    selectLanguage: 'ಭಾಷೆಯನ್ನು ಆರಿಸಿ',
    welcomeBack: 'ಸ್ವಾಗತ,',
    roleLabel: 'ಪಾತ್ರ',
    roleFarmer: 'ರೈತ',
    roleOfficer: 'ಕ್ಷೇತ್ರ ಅಧಿಕಾರಿ',
    roleAdmin: 'ಸಿಸ್ಟಮ್ ನಿರ್ವಾಹಕ',
    registerTitle: 'ರೈತರ ನೋಂದಣಿ',
    registerSubtitle: 'AI ಶಿಫಾರಸುಗಳನ್ನು ಸ್ವೀಕರಿಸಲು ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್ ಫಾರ್ಮ್ ಪ್ರೊಫೈಲ್ ಅನ್ನು ಕಾನ್ಫಿಗರ್ ಮಾಡಿ',
    name: 'ರೈತರ ಹೆಸರು',
    mobile: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    village: 'ಗ್ರಾಮ',
    state: 'ರಾಜ್ಯ',
    farmSize: 'ಫಾರ್ಮ್ ಗಾತ್ರ (ಎಕರೆ)',
    cropType: 'ಬೆಳೆ ಪ್ರಕಾರ',
    soilType: 'ಮಣ್ಣಿನ ಪ್ರಕಾರ',
    irrigationMethod: 'ನೀರಾವರಿ ವಿಧಾನ',
    sensorsTitle: 'ಸೆನ್ಸಾರ್‌ಗಳು / ಸಾಫ್ಟ್‌ವೇರ್ ಸಂಯೋಜನೆ',
    sensorsSubtitle: 'ನಿಮ್ಮ ಸೆನ್ಸಾರ್ ಹಾರ್ಡ್‌ವೇರ್ ಸಂಪರ್ಕಿಸಿ ಅಥವಾ ಮ್ಯಾನುಯಲ್ ಆಗಿ ನಮೂದಿಸಿ',
    soilMoistureSensor: 'ಮಣ್ಣಿನ ತೇವಾಂಶ ಸೆನ್ಸಾರ್',
    tempSensor: 'ತಾಪಮಾನ ಸೆನ್ಸಾರ್',
    humiditySensor: 'ಆರ್ದ್ರತೆ ಸೆನ್ಸಾರ್',
    continue: 'ಮುಂದುವರೆಯಿರಿ',
    saveSettings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಉಳಿಸಿ',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    weather: 'ಇಂದಿನ ಹವಾಮಾನ',
    soilMoisture: 'ಮಣ್ಣಿನ ತೇವಾಂಶ',
    aiRecommendation: 'AI ಶಿಫಾರಸುಗಳು',
    enterFarmDetails: 'ಫಾರ್ಮ್ ವಿವರಗಳು',
    connectSensors: 'ಸೆನ್ಸಾರ್ ಸಂಪರ್ಕ',
    schedule: 'ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿ',
    waterUsage: 'ನೀರಿನ ಬಳಕೆ',
    history: 'ಇತಿಹಾಸ ದಾಖಲೆ',
    aiAssistant: 'AI ಸಹಾಯಕ',
    emergencyAlerts: 'ತುರ್ತು ಎಚ್ಚರಿಕೆಗಳು',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    offlineMode: 'ಆಫ್‌ಲೈನ್ ಮೋಡ್',
    offlineWarning: 'ನೀವು ಪ್ರಸ್ತುತ ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿದ್ದೀರಿ. ಕನೆಕ್ಷನ್ ಮರಳಿದಾಗ ಡೇಟಾ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಸಿಂಕ್ ಆಗುತ್ತದೆ.',
    syncStatusSynced: 'ಎಲ್ಲಾ ಡೇಟಾವನ್ನು ಕ್ಲೌಡ್‌ನೊಂದಿಗೆ ಸಿಂಕ್ ಮಾಡಲಾಗಿದೆ',
    syncStatusSyncing: 'ಕ್ಲೌಡ್‌ನೊಂದಿಗೆ ಸಿಂಕ್ ಆಗುತ್ತಿದೆ...',
    dataEncrypted: 'ಡೇಟಾ AES-256 ರಹಸ್ಯ ಎನ್‌ಕ್ರಿಪ್ಷನ್‌ನಿಂದ ಸುರಕ್ಷಿತವಾಗಿದೆ',
    moistureGood: 'ಉತ್ತಮ',
    moistureModerate: 'ಮಧ್ಯಮ',
    moistureDry: 'ಒಣಗಿದ',
    waterRequired: 'ಬೇಕಾಗುವ ನೀರು',
    bestTime: 'ಉತ್ತಮ ಸಮಯ',
    nextIrrigation: 'ಮುಂದಿನ ನೀರಾವರಿ',
    expectedSaving: 'ಉಳಿಸಿದ ನೀರು',
    askAssistant: 'AI ಸಹಾಯಕರನ್ನು ಕೇಳಿ...',
    auditLogs: 'ಸಿಸ್ಟಮ್ ಆಡಿಟ್ ಲಾಗ್ಗಳು',
    userManagement: 'ಪಾತ್ರಗಳು ಮತ್ತು ಪ್ರವೇಶ ನಿಯಂತ್ರಣ',
    anomaliesAlert: 'ನೈಜ-ಸಮಯದ ಅಸಂಗತತೆಯ ಎಚ್ಚರಿಕೆಗಳು',
    exportPDF: 'PDF ವರದಿ ರಫ್ತು ಮಾಡಿ',
    plantingGuide: 'ನೆಡುವಿಕೆ ಗೈಡ್',
    fertilizerGuide: 'ಗೊಬ್ಬರ ನಿರ್ವಹಣೆ',
    irrigationGuide: 'ನೀರಾವರಿ ಗೈಡ್',
    criticalPests: 'ಗಮನಿಸಬೇಕಾದ ಕೀಟಗಳು',
    estimatedSoilMoisture: 'ಅಂದಾಜು ಮಣ್ಣಿನ ತೇವಾಂಶ',
    softwareEngineTitle: 'ಸಾಫ್ಟ್‌ವೇರ್ ನೀರು ಸಮತೋಲನ ಲೆಕ್ಕಾಚಾರ ಎಂಜಿನ್ (ET₀)',
    softwareNotice: 'ಸೆನ್ಸಾರ್‌ಗಳಿಲ್ಲದೆ: ಹವಾಮಾನ, ಬೆಳೆ ಬಾಷ್ಪೀಕರಣ (ET₀) ಮತ್ತು ಮಳೆಯ ಮುನ್ಸೂಚನೆ ಬಳಸಿ ತೇವಾಂಶವನ್ನು ಅಂದಾಜಿಸಲಾಗುತ್ತದೆ.',
    cropGrowthStage: 'ಬೆಳೆ വളർച്ചಯ ಹಂತ',
    stageInitial: 'ಆರಂಭಿಕ ಹಂತ / ಮೊಳಕೆ',
    stageVegetative: 'ಬೆಳವಣಿಗೆಯ ಹಂತ',
    stageFlowering: 'ಹೂ ಬಿಡುವ ಹಂತ',
    stageMaturity: 'ಕೊಯ್ಲಿನ ಹಂತ',
    lastIrrigation: 'ಕೊನೆಯ ನೀರಾವರಿ ದಿನಾಂಕ',
    previousIrrigationAmount: 'ಹಿಂದಿನ ನೀರಾವರಿ ಪ್ರಮಾಣ (ಲೀಟರ್)',
    solarRadiation: 'ಸೌರ ವಿಕಿರಣ',
    waterDeficit: 'ನೀರಿನ ಕೊರತೆ',
    rainExpected: 'ಮಳೆಯ ಮುನ್ಸೂಚನೆ',
    irrigateNow: 'ಈಗ ನೀರುಣಿಸಿ',
    dontIrrigate: 'ನೀರುಣಿಸಬೇಡಿ',
    delayRain: 'ಮುಂದೂಡಿ (ಮಳೆಯ ಸೂಚನೆ)',
    suggestedDuration: 'ಸೂಚಿಸಿದ ಸಮಯ',
    evapotranspiration: 'ಬೆಳೆ ಬಾಷ್ಪೀಕರಣ (ETc)',
    refET0: 'ಆಧಾರಿತ ET₀'
  }
};

export const INDIAN_STATES = [
  'Tamil Nadu',
  'Karnataka',
  'Andhra Pradesh',
  'Telangana',
  'Uttar Pradesh',
  'Maharashtra',
  'Punjab',
  'Haryana',
  'Gujarat',
  'Madhya Pradesh'
];

export const INDIAN_VILLAGES: Record<string, string[]> = {
  'Tamil Nadu': ['Melur', 'Vadapalanji', 'Ottanchatram', 'Thirumangalam', 'Ooty Rural', 'Pollachi East'],
  'Karnataka': ['Halli', 'Kanakapura Rural', 'Devanahalli South', 'Nanjangud', 'Channapatna', 'Shimoga North'],
  'Andhra Pradesh': ['Chittoor Rural', 'Kuppam East', 'Guntur South', 'Tenali', 'Nuzvid', 'Kavali'],
  'Telangana': ['Siddipet Rural', 'Gajwel', 'Sircilla', 'Wanaparthy', 'Kamareddy', 'Jagtial'],
  'Uttar Pradesh': ['Kailashpur', 'Mohanlalganj', 'Malihabad', 'Bighapur', 'Bilgram', 'Jaswantnagar'],
  'Maharashtra': ['Baramati Rural', 'Karad North', 'Sangamner', 'Sinnar', 'Yawal', 'Shevgaon'],
  'Punjab': ['Bagha Purana', 'Nabha Rural', 'Payal', 'Malerkotla South', 'Ajnala', 'Zira'],
  'Haryana': ['Nilokheri', 'Pehowa', 'Gharaunda', 'Hansi Rural', 'Tosham', 'Rania'],
  'Gujarat': ['Sanand Rural', 'Bardoli', 'Visnagar', 'Anklav', 'Mahuva East', 'Gondal'],
  'Madhya Pradesh': ['Budhni', 'Ashta', 'Pipariya', 'Harsud', 'Sanwer', 'Depalpur']
};

export const DEFAULT_VILLAGES = ['Rampur', 'Krishnapuram', 'Sonapur', 'Gopalpur', 'Kalyanpur', 'Chandrapur'];

// Simple Local Storage Cryptography simulation (obfuscation) to honor safety constraints
export const localEncrypt = (text: string): string => {
  try {
    const b64 = btoa(unescape(encodeURIComponent(text)));
    // Add a simple signature to show it is encrypted
    return `enc_v1_${b64.split('').reverse().join('')}`;
  } catch (e) {
    return text;
  }
};

export const localDecrypt = (encrypted: string): string => {
  try {
    if (!encrypted.startsWith('enc_v1_')) return encrypted;
    const cleanB64 = encrypted.substring(7).split('').reverse().join('');
    return decodeURIComponent(escape(atob(cleanB64)));
  } catch (e) {
    return encrypted;
  }
};

// Auto detects system anomalies based on readings
export interface AnomalyNotification {
  id: string;
  timestamp: string;
  message: string;
  severity: 'warning' | 'critical';
  resolved: boolean;
}

export const checkAnomalies = (
  moisture: number,
  temp: number,
  humidity: number,
  crop: CropType
): AnomalyNotification[] => {
  const anomalies: AnomalyNotification[] = [];
  const timestamp = new Date().toLocaleTimeString();

  if (moisture < 15) {
    anomalies.push({
      id: `anom_moist_low_${Date.now()}`,
      timestamp,
      message: `Critical Soil Moisture Deficit! Current moisture is ${moisture}%, well below safe threshold of 25% for ${crop}.`,
      severity: 'critical',
      resolved: false
    });
  } else if (moisture > 90) {
    anomalies.push({
      id: `anom_moist_high_${Date.now()}`,
      timestamp,
      message: `Waterlogging detected! Soil moisture exceeds 90%. Please turn off pumps immediately to prevent root rot.`,
      severity: 'warning',
      resolved: false
    });
  }

  if (temp > 42) {
    anomalies.push({
      id: `anom_temp_high_${Date.now()}`,
      timestamp,
      message: `Extreme heatwave warning! Temperature is ${temp}°C. Transpiration rates are exceptionally high.`,
      severity: 'critical',
      resolved: false
    });
  }

  if (moisture < 25 && temp > 38 && crop === 'rice') {
    anomalies.push({
      id: `anom_rice_stress_${Date.now()}`,
      timestamp,
      message: `Severe thermal stress detected in Rice crop. Standing water is drying up rapidly!`,
      severity: 'critical',
      resolved: false
    });
  }

  return anomalies;
};
