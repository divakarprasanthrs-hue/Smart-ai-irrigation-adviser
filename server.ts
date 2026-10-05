import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

type Language = 'en' | 'ta' | 'hi' | 'te' | 'kn';

dotenv.config();

// Lazy initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
      try {
        aiClient = new GoogleGenAI({
          apiKey: apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });
        console.log("Gemini client successfully initialized.");
      } catch (e) {
        console.error("Failed to initialize Gemini Client:", e);
      }
    } else {
      console.warn("GEMINI_API_KEY is not defined or is a placeholder. Using intelligent local fallback engine.");
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV || "development" });
  });

  // API Route: Generate Smart Recommendation
  app.post("/api/gemini/recommend", async (req, res) => {
    const {
      crop = "rice",
      soil = "loamy",
      irrigation = "drip",
      farmSize = 1,
      moisture,
      temperature = 28,
      humidity = 65,
      windSpeed = 12,
      solarRadiation = 18,
      rainProb = 20,
      rainfallMm = 0,
      growthStage = "vegetative",
      lastIrrigationDaysAgo = 2,
      previousIrrigationAmount = 1000,
      language = "en",
    } = req.body;

    // Software Water Balance calculation engine
    const et0 = Math.max(1.5, Math.round((0.0023 * (temperature + 17.8) * Math.sqrt(temperature) * (solarRadiation * 0.408) * (1 - humidity * 0.002)) * 10) / 10);
    const kcMap: Record<string, Record<string, number>> = {
      rice: { initial: 1.05, vegetative: 1.15, flowering: 1.20, maturity: 0.90 },
      wheat: { initial: 0.40, vegetative: 0.80, flowering: 1.15, maturity: 0.40 },
      cotton: { initial: 0.45, vegetative: 0.75, flowering: 1.15, maturity: 0.70 },
      tomato: { initial: 0.60, vegetative: 0.85, flowering: 1.15, maturity: 0.80 },
      sugarcane: { initial: 0.40, vegetative: 1.00, flowering: 1.25, maturity: 0.75 },
      maize: { initial: 0.30, vegetative: 0.70, flowering: 1.20, maturity: 0.60 },
    };
    const kc = kcMap[crop]?.[growthStage] || 0.85;
    const etc = Math.round(et0 * kc * 10) / 10;
    
    // Software Estimated Soil Moisture
    const totalAvailWater = soil === "sandy" ? 80 : soil === "clay" ? 160 : 120;
    const waterLost = etc * Math.max(1, lastIrrigationDaysAgo);
    const prevIrrigMm = previousIrrigationAmount / (farmSize * 4046.86);
    const rainMm = rainProb > 50 ? Math.max(rainfallMm, 12) : 0;

    let balanceMm = totalAvailWater - waterLost + prevIrrigMm + (rainMm * 0.8);
    balanceMm = Math.max(0, Math.min(totalAvailWater * 1.2, balanceMm));

    let calculatedMoisture = Math.round((balanceMm / totalAvailWater) * 65 + 20);
    calculatedMoisture = Math.max(12, Math.min(95, calculatedMoisture));
    const effectiveMoisture = moisture !== undefined ? moisture : calculatedMoisture;

    const waterDeficitLitres = Math.round(Math.max(0, totalAvailWater - balanceMm) * farmSize * 4046.86);

    const ai = getGeminiClient();

    if (ai) {
      try {
        const prompt = `
          You are the AI engine for a Software-Only AI Smart Irrigation Advisor.
          Analyze the following farm parameters and calculate an estimated soil moisture water balance recommendation in language: ${language}.
          
          Inputs:
          - Crop Type: ${crop}
          - Soil Type: ${soil}
          - Irrigation Method: ${irrigation}
          - Farm Size: ${farmSize} acres
          - Crop Growth Stage: ${growthStage}
          - Days Since Last Irrigation: ${lastIrrigationDaysAgo} days
          - Previous Irrigation Volume: ${previousIrrigationAmount} Litres
          - Calculated Reference Evapotranspiration (ET₀): ${et0} mm/day
          - Crop Factor (Kc): ${kc}
          - Actual Crop Water Requirement (ETc): ${etc} mm/day
          - Estimated Soil Moisture: ${effectiveMoisture}%
          - Estimated Water Deficit: ${waterDeficitLitres} Litres
          - Temperature: ${temperature}°C
          - Air Humidity: ${humidity}%
          - Solar Radiation: ${solarRadiation} MJ/m²/day
          - Wind Speed: ${windSpeed} km/h
          - Rain Prediction: ${rainProb}% (Forecast Rain: ${rainfallMm} mm)

          Guidelines:
          - State clearly that moisture is an "Estimated Soil Moisture" calculated via FAO-56 evapotranspiration & soil water balance.
          - If rain probability is high (>=50%), advise postponing irrigation.
          - If soil moisture is dry (<35%), recommend immediate watering with duration in minutes and exact water required in Litres.
          - Keep recommendation direct, farmer-friendly, and actionable in ${language}. Max 3 sentences.
        `;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                recommendation: {
                  type: Type.STRING,
                  description: "The direct irrigation advice in the requested language.",
                },
                waterRequired: {
                  type: Type.INTEGER,
                  description: "Estimated total water required in Litres.",
                },
                waterDeficitLitres: {
                  type: Type.INTEGER,
                  description: "Calculated soil water deficit in Litres.",
                },
                estimatedSoilMoisture: {
                  type: Type.INTEGER,
                  description: "Estimated soil moisture percentage.",
                },
                rainExpected: {
                  type: Type.BOOLEAN,
                  description: "Whether significant rain is expected.",
                },
                suggestedDurationMins: {
                  type: Type.INTEGER,
                  description: "Suggested irrigation duration in minutes.",
                },
                bestTime: {
                  type: Type.STRING,
                  description: "Recommended hour/time of day to irrigate.",
                },
                nextIrrigation: {
                  type: Type.STRING,
                  description: "Relative day for next irrigation.",
                },
                waterSaving: {
                  type: Type.INTEGER,
                  description: "Expected percentage of water saved.",
                },
              },
              required: ["recommendation", "waterRequired", "waterDeficitLitres", "estimatedSoilMoisture", "rainExpected", "suggestedDurationMins", "bestTime", "nextIrrigation", "waterSaving"],
            },
          },
        });

        const textResult = response.text;
        if (textResult) {
          const parsedResult = JSON.parse(textResult);
          return res.json({
            ...parsedResult,
            et0,
            etc,
            kc
          });
        }
      } catch (error) {
        console.error("Gemini recommendation request failed, invoking fallback engine:", error);
      }
    }

    // Rule-Based Local Intelligent Software Engine Fallback
    const rainExpected = rainProb >= 50 || rainfallMm > 5;
    let recommendation = "";
    let bestTime = "6:00 AM";
    let nextIrrigation = "Tomorrow";
    let waterSaving = 25;
    let suggestedDurationMins = 0;

    if (rainExpected) {
      waterSaving = 85;
      nextIrrigation = "After Rain Check";
      bestTime = "Postpone";
      suggestedDurationMins = 0;
      if (language === "ta") {
        recommendation = `மழை பெய்ய வாய்ப்புள்ளது (${rainProb}%). நீர்ப்பாசனத்தைத் தள்ளிவைத்து தண்ணீரை சேமிக்கவும். கணக்கிடப்பட்ட மண் ஈரப்பதம்: ${effectiveMoisture}%.`;
      } else if (language === "hi") {
        recommendation = `बारिश की संभावना है (${rainProb}%)। कृपया सिंचाई स्थगित करें। अनुमानित मिट्टी की नमी: ${effectiveMoisture}%।`;
      } else if (language === "te") {
        recommendation = `వర్ష సూచన ఉనికిలో ఉంది (${rainProb}%). నీటిపారుదలని వాయిదా వేయండి. అంచనా వేసిన నేల తేమ: ${effectiveMoisture}%.`;
      } else if (language === "kn") {
        recommendation = `ಮಳೆಯ ಮುನ್ಸೂಚನೆಯಿದೆ (${rainProb}%). ದಯವಿಟ್ಟು ನೀರಾವರಿಯನ್ನು ಮುಂದೂಡಿ. ಅಂದಾಜು ಮಣ್ಣಿನ ತೇವಾಂಶ: ${effectiveMoisture}%.`;
      } else {
        recommendation = `Rain predicted (${rainProb}% probability / ${rainfallMm}mm). Delay irrigation to save water. Estimated Soil Moisture is ${effectiveMoisture}%.`;
      }
    } else if (effectiveMoisture >= 60) {
      waterSaving = 60;
      nextIrrigation = "In 2-3 Days";
      bestTime = "Not Needed Today";
      suggestedDurationMins = 0;
      if (language === "ta") {
        recommendation = `கணக்கிடப்பட்ட மண் ஈரப்பதம் போதுமானதாக உள்ளது (${effectiveMoisture}%). இன்று தண்ணீர் பாய்ச்சத் தேவையில்லை.`;
      } else if (language === "hi") {
        recommendation = `अनुमानित मिट्टी की नमी पर्याप्त है (${effectiveMoisture}%)। आज सिंचाई की आवश्यकता नहीं है।`;
      } else if (language === "te") {
        recommendation = `అంచనా వేసిన నేల తేమ ఉత్తమంగా ఉంది (${effectiveMoisture}%). ఈ రోజు నీటిపారుదల అవసరం లేదు.`;
      } else if (language === "kn") {
        recommendation = `ಅಂದಾಜು ಮಣ್ಣಿನ ತೇವಾಂಶವು ಉತ್ತಮವಾಗಿದೆ (${effectiveMoisture}%). ಇಂದು ನೀರುಣಿಸುವ ಅಗತ್ಯವಿಲ್ಲ.`;
      } else {
        recommendation = `Estimated Soil Moisture is optimal (${effectiveMoisture}%). Crop water demand is satisfied; no irrigation needed today.`;
      }
    } else {
      suggestedDurationMins = Math.max(20, Math.round(waterDeficitLitres / (irrigation === "drip" ? 80 : 200)));
      bestTime = "6:00 AM or 6:30 PM";
      nextIrrigation = effectiveMoisture < 30 ? "Immediate" : "Tomorrow";
      waterSaving = irrigation === "drip" ? 45 : 30;

      if (language === "ta") {
        recommendation = `கணக்கிடப்பட்ட மண் ஈரப்பதம் ${effectiveMoisture}%. நீர் பற்றாக்குறை: ${waterDeficitLitres.toLocaleString()} லிட்டர். ${suggestedDurationMins} நிமிடங்கள் நீர் பாய்ச்சவும்.`;
      } else if (language === "hi") {
        recommendation = `अनुमानित मिट्टी की नमी ${effectiveMoisture}% है। जल की कमी: ${waterDeficitLitres.toLocaleString()} लीटर। ${suggestedDurationMins} मिनट के लिए सिंचाई करें।`;
      } else if (language === "te") {
        recommendation = `అంచనా వేసిన నేల తేమ ${effectiveMoisture}%. నీటి కొరత: ${waterDeficitLitres.toLocaleString()} లీటర్లు. ${suggestedDurationMins} నిమిషాల పాటు నీరు పెట్టండి.`;
      } else if (language === "kn") {
        recommendation = `ಅಂದಾಜು ಮಣ್ಣಿನ ತೇವಾಂಶ ${effectiveMoisture}%. ನೀರಿನ ಕೊರತೆ: ${waterDeficitLitres.toLocaleString()} ಲೀಟರ್. ${suggestedDurationMins} ನಿಮಿಷಗಳ ಕಾಲ ನೀರುಣಿಸಿ.`;
      } else {
        recommendation = `Estimated Soil Moisture is ${effectiveMoisture}%. Water deficit is ${waterDeficitLitres.toLocaleString()} Litres. Irrigate for ${suggestedDurationMins} minutes via ${irrigation.toUpperCase()}.`;
      }
    }

    res.json({
      recommendation,
      waterRequired: Math.min(waterDeficitLitres, farmSize * 2500),
      waterDeficitLitres,
      estimatedSoilMoisture: effectiveMoisture,
      rainExpected,
      suggestedDurationMins,
      bestTime,
      nextIrrigation,
      waterSaving,
      et0,
      etc,
      kc
    });
  });

  // API Route: AI Chatbot Assistant
  app.post("/api/gemini/chat", async (req, res) => {
    const { message, history = [], language = "en", crop = "rice", soil = "loamy" } = req.body;

    const ai = getGeminiClient();

    if (ai) {
      try {
        const systemInstruction = `
          You are "Siri-Mitra", a friendly, knowledgeable agricultural expert AI Chatbot for the "AI Smart Irrigation Advisor" app.
          Your goal is to help farmers reduce water wastage, understand irrigation schedules, solve pest issues, and optimize crop yields.
          
          Guidelines:
          - Respond in a simple, clear, practical, and highly empathetic manner in the selected language: ${language}.
          - Avoid overly complex scientific terms; translate them into actionable, step-by-step guidance for rural farmers.
          - Address the current crop is: ${crop} and soil is: ${soil} where relevant.
          - If the farmer asks about rain or weather, reassure them and encourage water conservation.
          - Keep answers relatively short (1-2 short paragraphs) for easy reading on mobile screens.
        `;

        // Map client history format to Gemini parts format
        const contents = history.map((h: any) => ({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }],
        }));

        contents.push({
          role: "user",
          parts: [{ text: message }],
        });

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
          },
        });

        const reply = response.text;
        if (reply) {
          return res.json({ reply });
        }
      } catch (error) {
        console.error("Gemini chat failed, using smart local fallback expert:", error);
      }
    }

    // Expert Fallback Agricultural Knowledge Base
    const msgLower = message.toLowerCase();
    let reply = "";

    const localAnswers: Record<Language, {
      water: string;
      rain: string;
      pest: string;
      generic: string;
    }> = {
      en: {
        water: `For your ${crop} crop in ${soil} soil, irrigation depends heavily on current soil moisture. Ensure you only water when moisture drops below 35% to promote deep roots and save electricity!`,
        rain: `If rain is forecasted, always turn off automatic pumps and postpone irrigation. This allows your field to naturally capture rainwater and prevents waterlogging.`,
        pest: `To manage pests in ${crop} crops, check leaf undersides. Maintain clean weeding, avoid water pooling, and spray diluted organic Neem oil (5ml per Litre of water) early in the morning.`,
        generic: `Greetings! I am Siri-Mitra, your agricultural advisor. I can help you with watering schedules, fertilizing guides, weather impacts, and pest controls for ${crop} crop.`
      },
      ta: {
        water: `${soil} மண்ணில் உள்ள உங்கள் ${crop} பயிருக்கு, மண் ஈரப்பதம் 35% க்கும் கீழே குறையும் போது மட்டும் நீர் பாய்ச்சுங்கள். இது வேர்களை பலப்படுத்தி மின்சாரத்தையும் தண்ணீயையும் சேமிக்கும்!`,
        rain: `மழை பெய்யும் வாய்ப்பு இருந்தால், தயவுசெய்து மின் மோட்டார்களை நிறுத்தி நீர்ப்பாசனத்தைத் தள்ளி வையுங்கள். இது இயற்கையான மழையைப் பயன்படுத்தி நீர் தேங்குவதைத் தடுக்கும்.`,
        pest: `${crop} பயிரில் பூச்சிகளைக் கட்டுப்படுத்த, இலைகளின் அடிப்பகுதியைச் சோதிக்கவும். இயற்கை வேப்ப எண்ணெய் கரைசலை (ஒரு லிட்டர் தண்ணீருக்கு 5 மி.லி) காலையில் தெளிக்கவும்.`,
        generic: `வணக்கம்! நான் சிரி-மித்ரா, உங்கள் விவசாய ஆலோசகர். நீர்ப்பாசன முறைகள், பூச்சி கட்டுப்பாடு மற்றும் உங்கள் ${crop} பயிர் மேலாண்மை பற்றி என்னிடம் கேட்கலாம்.`
      },
      hi: {
        water: `${soil} मिट्टी में आपकी ${crop} फसल के लिए, सिंचाई तभी करें जब मिट्टी की नमी 35% से कम हो। इससे जड़ें गहरी होंगी और बिजली तथा पानी की बचत होगी!`,
        rain: `यदि बारिश की संभावना है, तो हमेशा पानी के पंप बंद रखें और सिंचाई टाल दें। इससे आपकी फसल प्राकृतिक वर्षा जल का लाभ उठा पाएगी।`,
        pest: `${crop} फसल में कीटों से बचने के लिए, नीम के तेल का घोल (5 मिली प्रति लीटर पानी) सुबह के समय छिड़कें और खेत को साफ रखें।`,
        generic: `नमस्कार! मैं सीरी-मित्र हूँ, आपका कृषि सलाहकार। मैं आपको सिंचाई, कीट नियंत्रण और आपकी ${crop} फसल के बेहतर स्वास्थ्य के बारे में सलाह दे सकता हूँ।`
      },
      te: {
        water: `${soil} నేలలోని మీ ${crop} పంటకు, మట్టి తేమ 35% కంటే తగ్గినప్పుడు మాత్రమే నీరు పెట్టండి. ఇది వేర్లను బలోపేతం చేస్తుంది మరియు నీటిని ఆదా చేస్తుంది!`,
        rain: `వర్షం పడే సూచన ఉంటే, ఎలక్ట్రిక్ మోటార్లను ఆపివేసి నీటిపారుదలని వాయిదా వేయండి. ఇది సహజ వర్షపు నీటిని పొలం గ్రహించేలా చేస్తుంది.`,
        pest: `${crop} పంటలో తెగుళ్ళను నివారించడానికి, వేప నూనె ద్రావణం (లీటరు నీటికి 5 మి.లీ) ఉదయాన్నే పిచికారీ చేయండి.`,
        generic: `నమస్కారం! నేను సిరి-మిత్ర, మీ వ్యవసాయ సలహాదారుని. నీటిపారుదల పద్ధతులు, తెగుళ్ళ నివారణ మరియు మీ ${crop} పంట గురించి ఏదైనా నన్ను అడగవచ్చు.`
      },
      kn: {
        water: `${soil} ಮಣ್ಣಿನಲ್ಲಿರುವ ನಿಮ್ಮ ${crop} ಬೆಳೆಗೆ ಮಣ್ಣಿನ ತೇವಾಂಶ 35% ಕ್ಕಿಂತ ಕಡಿಮೆಯಾದಾಗ ಮಾತ್ರ ನೀರುಣಿಸಿ. ಇದು ಬೇರುಗಳನ್ನು ಆಳಕ್ಕೆ ಹೋಗಲು ಪ್ರೇರೇಪಿಸುತ್ತದೆ ಮತ್ತು ನೀರನ್ನು ಉಳಿಸುತ್ತದೆ!`,
        rain: `ಮಳೆಯ ಮುನ್ಸೂಚನೆ ಇದ್ದರೆ, ಯಾವಾಗಲೂ ಪಂಪ್‌ಗಳನ್ನು ಆಫ್ ಮಾಡಿ ಮತ್ತು ನೀರಾವರಿಯನ್ನು ಮುಂದೂಡಿ. ಇದು ನೈಸರ್ಗಿಕ ಮಳೆನೀರನ್ನು ಬಳಸಿಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.`,
        pest: `${crop} ಬೆಳೆಯಲ್ಲಿ ಕೀಟಗಳನ್ನು ನಿಯಂತ್ರಿಸಲು, ಬೇವಿನ ಎಣ್ಣೆ ದ್ರಾವಣವನ್ನು (ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 5 ಮಿಲಿ) ಬೆಳಿಗ್ಗೆ ಸಿಂಪಡಿಸಿ ಮತ್ತು ಜಮೀನನ್ನು ಸ್ವಚ್ಛವಾಗಿಡಿ.`,
        generic: `ನಮಸ್ಕಾರ! ನಾನು ಸಿರಿ-ಮಿತ್ರ, ನಿಮ್ಮ ಕೃಷಿ ಸಲಹೆಗಾರ. ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿ, ಗೊಬ್ಬರ ಬಳಕೆ ಮತ್ತು ಕೀಟ ನಿಯಂತ್ರಣದ ಬಗ್ಗೆ ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ.`
      }
    };

    const dict = localAnswers[language as Language] || localAnswers.en;

    if (msgLower.includes("water") || msgLower.includes("irrigate") || msgLower.includes("தண்ணீர்") || msgLower.includes("पानी") || msgLower.includes("నీరు") || msgLower.includes("ನೀರ")) {
      reply = dict.water;
    } else if (msgLower.includes("rain") || msgLower.includes("weather") || msgLower.includes("மழை") || msgLower.includes("बारिश") || msgLower.includes("వర్షం") || msgLower.includes("ಮಳೆ")) {
      reply = dict.rain;
    } else if (msgLower.includes("pest") || msgLower.includes("disease") || msgLower.includes("பூச்சி") || msgLower.includes("कीट") || msgLower.includes("తెగులు") || msgLower.includes("ಕೀಟ")) {
      reply = dict.pest;
    } else {
      reply = dict.generic;
    }

    res.json({ reply });
  });

  // Vite Integration for Dev vs Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
