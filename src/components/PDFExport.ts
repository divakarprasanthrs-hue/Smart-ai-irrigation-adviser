import { jsPDF } from 'jspdf';
import { UserProfile, SensorData, WeatherData, AIRecommendation, DailySchedule, WaterUsageRecord, SoilWaterBalanceResult } from '../types';
import { TRANSLATIONS } from '../data';

export const exportIrrigationReportPDF = (
  profile: UserProfile,
  sensors: SensorData,
  weather: WeatherData,
  recommendation: AIRecommendation | null,
  schedule: DailySchedule[],
  waterUsage: WaterUsageRecord[],
  waterBalance?: SoilWaterBalanceResult
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const t = TRANSLATIONS.en; // Default formatting labels

  // Colors
  const emerald = '#059669';
  const slate = '#1e293b';
  const gray = '#64748b';

  // 1. Header Banner
  doc.setFillColor(5, 150, 105); // Emerald Green
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('AI SMART IRRIGATION ADVISOR', 15, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text('Software-Only ET₀ Soil Water Balance Engine (FAO-56 Standard)', 15, 24);
  doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 15, 32);

  // 2. Profile Details Block
  doc.setTextColor(slate);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('1. Farm Profile Summary', 15, 48);
  
  // Divider line
  doc.setDrawColor(226, 232, 240);
  doc.line(15, 51, 195, 51);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(slate);

  // Columns for info
  doc.text(`Farmer Name: ${profile.name}`, 15, 58);
  doc.text(`Mobile: ${profile.mobile}`, 15, 64);
  doc.text(`Location: ${profile.village}, ${profile.state}`, 15, 70);
  doc.text(`Access Role: ${profile.role.toUpperCase()}`, 15, 76);

  doc.text(`Crop Type: ${profile.cropType.toUpperCase()} (${profile.growthStage || 'Vegetative'})`, 110, 58);
  doc.text(`Soil Type: ${profile.soilType.toUpperCase()}`, 110, 64);
  doc.text(`Irrigation: ${profile.irrigationMethod.toUpperCase()}`, 110, 70);
  doc.text(`Farm Area: ${profile.farmSize} Acres`, 110, 76);

  // 3. Software Estimated Soil Moisture & Water Balance Engine Status
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('2. Software-Estimated Soil Water Balance & Weather', 15, 88);
  doc.line(15, 91, 195, 91);

  const estimatedMoisture = waterBalance?.estimatedSoilMoisture ?? sensors.moisture;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(`Estimated Soil Moisture: ${estimatedMoisture}% (${estimatedMoisture > 60 ? 'Good / Optimal' : estimatedMoisture > 35 ? 'Moderate' : 'Water Deficit'})`, 15, 98);
  doc.text(`Evapotranspiration (ET₀): ${waterBalance?.et0 ?? '4.2'} mm/day`, 15, 104);
  doc.text(`Crop Water Demand (ETc): ${waterBalance?.etc ?? '4.8'} mm/day`, 15, 110);
  doc.text(`Water Deficit: ${waterBalance?.waterDeficitLitres?.toLocaleString() ?? '1,200'} Litres`, 15, 116);

  doc.text(`Weather Status: ${weather.status.toUpperCase()}`, 110, 98);
  doc.text(`Temperature: ${sensors.temperature}°C | Humidity: ${sensors.humidity}%`, 110, 104);
  doc.text(`Rain Probability: ${weather.rainProb}%`, 110, 110);
  doc.text(`Rain Expected: ${waterBalance?.rainExpected ? 'YES (Postpone)' : 'NO'}`, 110, 116);

  // 4. AI Recommendation Section
  doc.setFillColor(240, 253, 250); // Very light mint
  doc.rect(15, 122, 180, 32, 'F');
  
  doc.setDrawColor(5, 150, 105);
  doc.setLineWidth(0.5);
  doc.rect(15, 122, 180, 32, 'D');

  doc.setTextColor(5, 150, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('PRECISION AI RECOMMENDATION', 20, 128);

  doc.setTextColor(slate);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const splitRec = doc.splitTextToSize(recommendation?.recommendation || 'No recommendation calculated yet. Monitor soil water balance actively.', 170);
  doc.text(splitRec, 20, 134);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(`Water Required: ${recommendation?.waterRequired?.toLocaleString() || 0} Litres`, 20, 148);
  doc.text(`Suggested Duration: ${recommendation?.suggestedDurationMins || 20} Mins`, 85, 148);
  doc.text(`Water Saving: ${recommendation?.waterSaving || 0}%`, 145, 148);

  // 5. Weekly Schedule Table
  doc.setTextColor(slate);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('3. Weekly Irrigation Calendar', 15, 164);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.1);
  doc.line(15, 167, 195, 167);

  // Table header
  doc.setFillColor(248, 250, 252);
  doc.rect(15, 170, 180, 7, 'F');
  doc.setFontSize(9);
  doc.setTextColor(slate);
  doc.text('Day', 20, 175);
  doc.text('Watering Duration', 65, 175);
  doc.text('Rain Forecast Status', 115, 175);
  doc.text('Irrigation Decision', 160, 175);

  doc.line(15, 178, 195, 178);

  doc.setFont('helvetica', 'normal');
  let currentY = 183;
  schedule.forEach((sch) => {
    doc.text(sch.day, 20, currentY);
    doc.text(`${sch.duration} Minutes`, 65, currentY);
    doc.text(sch.rainExpected ? 'Rain Expected (Postpone)' : 'Clear Sky', 115, currentY);
    doc.setTextColor(sch.duration > 0 ? emerald : '#94a3b8');
    doc.setFont('helvetica', 'bold');
    doc.text(sch.status, 160, currentY);
    doc.setTextColor(slate);
    doc.setFont('helvetica', 'normal');
    doc.line(15, currentY + 2.5, 195, currentY + 2.5);
    currentY += 7;
  });

  // 6. Water Savings summary
  const totalWaterUsed = waterUsage.reduce((sum, r) => sum + r.waterUsed, 0);
  const totalWaterSaved = waterUsage.reduce((sum, r) => sum + r.waterSaved, 0);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('4. Historical Conservation Impact', 15, 236);
  doc.line(15, 239, 195, 239);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(`Total Water Logged (Past 5 Days): ${totalWaterUsed.toLocaleString()} Litres`, 15, 245);
  doc.text(`Cumulative Irrigation Water Saved: ${totalWaterSaved.toLocaleString()} Litres`, 15, 251);
  
  // Highlight box for environmental impact
  doc.setFillColor(239, 246, 255); // light blue
  doc.rect(15, 256, 180, 13, 'F');
  doc.setDrawColor(59, 130, 246);
  doc.rect(15, 256, 180, 13, 'D');

  doc.setTextColor(29, 78, 216);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Software-Engine Eco-Impact Certificate:', 20, 264);
  doc.setFont('helvetica', 'normal');
  doc.text(`By software moisture balance optimization, saved ~${Math.round(totalWaterSaved * 0.15)} kWh of energy!`, 85, 264);

  // Page numbering and security stamp
  doc.setTextColor(gray);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.text('Software-Only Smart Irrigation Report • Estimated Soil Moisture Engine • Powered by Siri-Mitra AI', 15, 287);
  doc.text('Page 1 of 1', 185, 287);

  doc.save(`Smart_Irrigation_Report_${profile.name.replace(/\s+/g, '_')}.pdf`);
};
