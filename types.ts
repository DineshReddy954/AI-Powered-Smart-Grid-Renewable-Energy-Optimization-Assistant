
export interface HourlyData {
  hour: number;
  solarKW: number;
  windKW: number;
  demandKW: number;
  sunlightHours: number;
  windSpeed: number;
}

export interface AIAnalysis {
  sustainabilityScore: number;
  wastageDetected: number;
  gridReductionPercent: number;
  loadShiftWindows: string[];
  recommendations: string[];
  esgInsights: string[];
  summary: string;
}

export interface ForecastData {
  hour: number;
  solarForecast: number;
  windForecast: number;
}
