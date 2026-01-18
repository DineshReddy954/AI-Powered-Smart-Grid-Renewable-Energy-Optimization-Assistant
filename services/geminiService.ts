
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis, HourlyData } from "../types";

export const analyzeSustainability = async (data: HourlyData[]): Promise<AIAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompt = `
    Analyze the following 24-hour energy data for a college campus. 
    Total Solar: ${data.reduce((acc, curr) => acc + curr.solarKW, 0)}kW
    Total Wind: ${data.reduce((acc, curr) => acc + curr.windKW, 0)}kW
    Total Demand: ${data.reduce((acc, curr) => acc + curr.demandKW, 0)}kW
    
    Data Details (Hourly): ${JSON.stringify(data)}

    Based on this, provide a sustainability analysis aligned with SDG 7.
    - Sustainability Score (0-100)
    - Renewable energy wastage (kW)
    - Grid dependency reduction (%)
    - 2-3 specific time windows for load shifting (e.g., "1:00 PM - 3:00 PM")
    - 3 specific daily AI recommendations for decision-makers (non-technical)
    - 2-3 ESG/Policy insights
    - A short summary
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sustainabilityScore: { type: Type.NUMBER },
          wastageDetected: { type: Type.NUMBER },
          gridReductionPercent: { type: Type.NUMBER },
          loadShiftWindows: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          esgInsights: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          summary: { type: Type.STRING }
        },
        required: ["sustainabilityScore", "wastageDetected", "gridReductionPercent", "loadShiftWindows", "recommendations", "esgInsights", "summary"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const getForecast = async (data: HourlyData[]): Promise<any[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const prompt = `Based on today's sunlight and wind speeds, forecast next-day hourly solar and wind generation. Data: ${JSON.stringify(data)}. Return an array of 24 objects with hour, solarForecast, windForecast.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            hour: { type: Type.NUMBER },
            solarForecast: { type: Type.NUMBER },
            windForecast: { type: Type.NUMBER }
          },
          required: ["hour", "solarForecast", "windForecast"]
        }
      }
    }
  });

  return JSON.parse(response.text);
};
