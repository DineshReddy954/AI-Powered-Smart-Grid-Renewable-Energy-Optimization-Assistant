
import React, { useState, useEffect, useCallback } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, BarChart, Bar 
} from 'recharts';
import { 
  Leaf, Zap, Wind, Sun, AlertTriangle, TrendingDown, 
  ShieldCheck, ArrowRight, RefreshCw, Info 
} from 'lucide-react';
import { generateMockData } from './constants';
import { AIAnalysis, HourlyData, ForecastData } from './types';
import { analyzeSustainability, getForecast } from './services/geminiService';

const App: React.FC = () => {
  const [currentData, setCurrentData] = useState<HourlyData[]>(generateMockData());
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = generateMockData();
      setCurrentData(data);
      
      const [aiResult, forecastResult] = await Promise.all([
        analyzeSustainability(data),
        getForecast(data)
      ]);
      
      setAnalysis(aiResult);
      setForecast(forecastResult);
    } catch (err) {
      console.error(err);
      setError("Failed to generate AI insights. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalSupply = currentData.map(d => ({
    hour: `${d.hour}:00`,
    renewables: d.solarKW + d.windKW,
    demand: d.demandKW,
    solar: d.solarKW,
    wind: d.windKW
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="relative w-20 h-20 mb-4">
          <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-slate-600 font-medium animate-pulse">Running AI Sustainability Models...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 px-6 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Leaf className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">EcoPulse</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">AI Sustainability Analyst</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchData}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 transition-colors rounded-full text-sm font-semibold text-slate-700"
            >
              <RefreshCw className="w-4 h-4" />
              Recalculate Data
            </button>
            <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
              Campus Mode: Active
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Key Metrics */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-sm font-medium">Sustainability Score</span>
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{analysis?.sustainabilityScore}</span>
              <span className="text-slate-400 text-sm">/100</span>
            </div>
            <div className="mt-2 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-1000" 
                style={{ width: `${analysis?.sustainabilityScore}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-sm font-medium">Wastage Detected</span>
              <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{analysis?.wastageDetected}</span>
              <span className="text-slate-400 text-sm">kW</span>
            </div>
            <p className="text-xs text-amber-600 mt-2 flex items-center gap-1 font-medium">
              <TrendingDown className="w-3 h-3" /> Potentially optimizable
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-sm font-medium">Grid Reduction</span>
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{analysis?.gridReductionPercent}%</span>
              <span className="text-slate-400 text-sm">Target: 35%</span>
            </div>
            <p className="text-xs text-blue-600 mt-2 font-medium">Lower grid strain today</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-sm font-medium">Current Status</span>
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600 animate-pulse">
                <Leaf className="w-5 h-5" />
              </div>
            </div>
            <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100 uppercase">
              Optimizing
            </span>
            <p className="text-xs text-slate-500 mt-3 italic leading-relaxed line-clamp-2">
              "{analysis?.summary}"
            </p>
          </div>
        </div>

        {/* Energy Balance Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Energy Consumption vs Generation</h2>
              <p className="text-sm text-slate-500">Hourly balance for the next 24 hours</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-xs font-semibold text-slate-600 uppercase">Renewables</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                <span className="text-xs font-semibold text-slate-600 uppercase">Demand</span>
              </div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={totalSupply}>
                <defs>
                  <linearGradient id="colorRenew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="renewables" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRenew)" name="Renewable Gen (kW)" />
                <Area type="monotone" dataKey="demand" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" fill="none" name="Demand (kW)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Panels - Recommendations */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-emerald-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -m-4 opacity-10">
              <Zap className="w-32 h-32" />
            </div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              Daily AI Recommendations
            </h2>
            <ul className="space-y-4">
              {analysis?.recommendations.map((rec, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed">
                  <div className="mt-1">
                    <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0" />
                  </div>
                  <span className="text-emerald-50">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              Optimal Load Shifting
            </h2>
            <p className="text-sm text-slate-500 mb-4">Transfer heavy electricity usage to these windows to minimize wastage:</p>
            <div className="space-y-3">
              {analysis?.loadShiftWindows.map((window, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <span className="text-blue-700 font-bold text-sm uppercase">{window}</span>
                  <div className="px-2 py-1 bg-white text-blue-600 rounded text-[10px] font-bold border border-blue-200 uppercase">
                    High Solar
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ESG & Policy Section */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            ESG & Policy Insights
          </h2>
          <div className="space-y-4">
            {analysis?.esgInsights.map((insight, i) => (
              <div key={i} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="bg-white p-1 rounded-md shadow-sm h-fit">
                  <Leaf className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {insight}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Forecast Section */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Next-Day Forecast</h2>
              <p className="text-sm text-slate-500">Predicted wind and solar generation</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-slate-600 uppercase">Solar</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-slate-600 uppercase">Wind</span>
              </div>
            </div>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} axisLine={false} tickLine={false} tick={{fontSize: 11}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="solarForecast" fill="#fbbf24" radius={[4, 4, 0, 0]} name="Solar (Forecast)" />
                <Bar dataKey="windForecast" fill="#60a5fa" radius={[4, 4, 0, 0]} name="Wind (Forecast)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>

      {/* Footer / Meta info */}
      <footer className="max-w-7xl mx-auto px-6 mt-12 text-center text-slate-400 text-sm">
        <p>© 2024 EcoPulse AI Sustainability. Supporting SDG 7: Affordable and Clean Energy.</p>
        <p className="mt-1 text-xs">Analysis generated via Gemini 3 Flash Preview Models.</p>
      </footer>
      
      {error && (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 bg-red-50 border border-red-200 p-4 rounded-xl shadow-xl flex items-start gap-3">
          <AlertTriangle className="text-red-500 w-5 h-5 shrink-0" />
          <div>
            <h4 className="text-red-800 font-bold text-sm">Error Detected</h4>
            <p className="text-red-700 text-xs mt-1">{error}</p>
            <button 
              onClick={fetchData} 
              className="mt-2 text-xs font-bold text-red-800 underline underline-offset-2"
            >
              Try Reconnecting
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
