export type Language = 'en' | 'ta' | 'hi' | 'te' | 'kn';

export type UserRole = 'admin' | 'field_officer' | 'farmer';

export type CropType =
  | 'rice'
  | 'wheat'
  | 'cotton'
  | 'tomato'
  | 'sugarcane'
  | 'maize'
  | 'potatoes'
  | 'carrots'
  | 'onions'
  | 'chillies'
  | 'coffee'
  | 'tea';

export type SoilType = 'sandy' | 'clay' | 'loamy';

export type IrrigationMethod = 'drip' | 'sprinkler' | 'flood';

export type CropGrowthStage = 'initial' | 'vegetative' | 'flowering' | 'maturity';

export interface UserProfile {
  id: string;
  name: string;
  mobile: string;
  role: UserRole;
  village: string;
  state: string;
  farmSize: number; // in acres
  cropType: CropType;
  soilType: SoilType;
  irrigationMethod: IrrigationMethod;
  growthStage: CropGrowthStage;
  lastIrrigationDaysAgo: number;
  previousIrrigationAmount: number; // in litres
  sensors: {
    moisture: boolean;
    temperature: boolean;
    humidity: boolean;
  };
}

export interface SensorData {
  moisture: number; // 0 - 100% (Estimated or Sensor)
  temperature: number; // °C
  humidity: number; // %
  timestamp: string;
}

export interface WeatherData {
  temp: number;
  humidity: number;
  rainProb: number; // 0 - 100%
  windSpeed: number; // km/h
  solarRadiation: number; // MJ/m²/day
  rainfallMm: number; // forecast mm
  status: 'sunny' | 'cloudy' | 'rainy' | 'windy';
  forecast: { day: string; status: 'sunny' | 'cloudy' | 'rainy'; temp: number; rainProb: number; rainMm: number }[];
}

export interface SoilWaterBalanceInput {
  cropType: CropType;
  soilType: SoilType;
  farmSize: number; // acres
  growthStage: CropGrowthStage;
  lastIrrigationDaysAgo: number;
  previousIrrigationAmount: number; // Litres
  irrigationMethod: IrrigationMethod;
  temp: number; // °C
  humidity: number; // %
  windSpeed: number; // km/h
  solarRadiation: number; // MJ/m²/day
  rainProb: number; // %
  rainfallMm: number; // mm
}

export interface SoilWaterBalanceResult {
  estimatedSoilMoisture: number; // %
  waterDeficitLitres: number; // Litres
  rainExpected: boolean;
  rainForecastMm: number;
  recommendationDecision: 'irrigate' | 'dont_irrigate' | 'delay_rain';
  recommendationText: string;
  suggestedDurationMins: number; // Minutes
  et0: number; // Reference evapotranspiration in mm/day
  kc: number; // Crop coefficient factor
  etc: number; // Crop evapotranspiration in mm/day
  waterSaving: number; // %
  bestTime: string;
  nextIrrigation: string;
}

export interface AIRecommendation {
  id: string;
  timestamp: string;
  recommendation: string;
  waterRequired: number; // Litres per acre / farm
  waterDeficitLitres: number; // Total Litres needed to reach field capacity
  estimatedSoilMoisture: number; // %
  rainExpected: boolean;
  suggestedDurationMins: number;
  et0: number; // mm/day
  etc: number; // mm/day
  kc: number;
  bestTime: string;
  nextIrrigation: string;
  waterSaving: number; // percentage
}

export interface DailySchedule {
  day: string;
  status: string;
  duration: number; // minutes, 0 means no watering
  rainExpected: boolean;
}

export interface WaterUsageRecord {
  date: string;
  waterUsed: number; // Litres
  waterSaved: number; // Litres
  cropHealth: number; // 0 - 100%
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface EmergencyAlert {
  id: string;
  type: 'heavy_rain' | 'heat_wave' | 'drought' | 'water_scarcity' | 'pest_alert';
  title: string;
  message: string;
  timestamp: string;
  active: boolean;
}

export interface CropGuide {
  crop: CropType;
  planting: string;
  fertilizing: string;
  irrigation: string;
  criticalPests: string[];
}
