
import { HourlyData } from './types';

export const generateMockData = (): HourlyData[] => {
  const data: HourlyData[] = [];
  for (let i = 0; i < 24; i++) {
    const isDaylight = i >= 6 && i <= 18;
    const solarKW = isDaylight ? Math.floor(Math.random() * 500 + 200 * Math.sin((i - 6) * Math.PI / 12)) : 0;
    const windKW = Math.floor(Math.random() * 300 + 100);
    const demandKW = Math.floor(Math.random() * 400 + 400 + 200 * Math.sin((i - 12) * Math.PI / 12));
    
    data.push({
      hour: i,
      solarKW,
      windKW,
      demandKW,
      sunlightHours: isDaylight ? 1 : 0,
      windSpeed: Math.floor(Math.random() * 20 + 5),
    });
  }
  return data;
};

export const ESG_POLICIES = [
  "SDG 7.2: Increase substantially the share of renewable energy in the global energy mix.",
  "SDG 7.3: Double the global rate of improvement in energy efficiency.",
  "ESG Reporting: Carbon Disclosure Project (CDP) alignment.",
  "ISO 50001: Energy Management Systems standards."
];
