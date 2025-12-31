import React, { useState, useEffect } from 'react';
import { Sparkles, Moon, Star } from 'lucide-react';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import { UserInput, AnalysisResult, AnalysisStatus, MarketTrend } from './types';
import { analyzeJobFit, getMarketTrends } from './services/geminiService';

// Real inspirational/healing quotes
const QUOTES = [
  { text: "There is a crack in everything, that's how the light gets in.", author: "Leonard Cohen" },
  { text: "In the midst of winter, I found there was, within me, an invincible summer.", author: "Albert Camus" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle Onassis" },
  { text: "Stars can't shine without darkness.", author: "D.H. Sidebottom" },
  { text: "The wound is the place where the Light enters you.", author: "Rumi" },
  { text: "Turn your face to the sun and the shadows fall behind you.", author: "Maori Proverb" },
  { text: "Hope is being able to see that there is light despite all of the darkness.", author: "Desmond Tutu" }
];

const App: React.FC = () => {
  const [input, setInput] = useState<UserInput>({
    experience: '',
    jobDescription: ''
  });
  
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [trends, setTrends] = useState<MarketTrend[]>([]);
  const [quote, setQuote] = useState(QUOTES[0]);

  // Set random quote on mount and rotate every 30 seconds
  useEffect(() => {
    const getRandomQuote = () => QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(getRandomQuote());
    const intervalId = setInterval(() => {
      setQuote(getRandomQuote());
    }, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const handleAnalyze = async () => {
    setStatus(AnalysisStatus.THINKING);
    setResult(null);
    setTrends([]);

    try {
      const analysisData = await analyzeJobFit(input.experience, input.jobDescription);
      setResult(analysisData);
      setStatus(AnalysisStatus.SEARCHING);
      const searchData = await getMarketTrends("Target Role from Job Description");
      setTrends(searchData);
      setStatus(AnalysisStatus.COMPLETE);
    } catch (error) {
      console.error(error);
      setStatus(AnalysisStatus.ERROR);
      alert("An error occurred during analysis. Please check your API Key and try again.");
    }
  };

  return (
    <div className="h-screen flex flex-col relative bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-100 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[5%] w-[1000px] h-[1000px] bg-cyan-900/10 rounded-full mix-blend-screen filter blur-[150px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[1200px] h-[1200px] bg-indigo-900/10 rounded-full mix-blend-screen filter blur-[180px] animate-blob"></div>
      </div>

      {/* Header */}
      <header className="flex-none sticky top-0 z-50 backdrop-blur-3xl bg-slate-950/40 border-b border-white/5 shadow-2xl">
        <div className="max-w-[1920px] mx-auto px-12 sm:px-16 lg:px-24 h-24 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full blur opacity-20 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-slate-900 p-2.5 rounded-full border border-white/10 shadow-2xl">
                <Moon className="w-6 h-6 text-cyan-400 fill-cyan-400/20" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white">
                Resume<span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400">Illuminator</span>
              </h1>
              <p className="text-[8px] text-slate-600 uppercase tracking-[0.5em] font-black mt-0.5">Professional Architecture Engine</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
             <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/30 border border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 shadow-inner">
               <Sparkles className="w-3 h-3 text-indigo-400" />
               <span>Gemini 3.0 Pro</span>
             </div>
             <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/30 border border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 shadow-inner">
               <Star className="w-3 h-3 text-cyan-400" />
               <span>Thinking Active</span>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow overflow-hidden relative">
        <div className="max-w-[1920px] mx-auto px-12 sm:px-16 lg:px-24 h-full py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 h-full">
            
            {/* Left Column: Input - Ensure padding at bottom for quote safety */}
            <div className="lg:col-span-5 h-full min-h-0 flex flex-col pb-20">
              <InputSection 
                input={input} 
                setInput={setInput} 
                onAnalyze={handleAnalyze}
                isLoading={status === AnalysisStatus.THINKING || status === AnalysisStatus.SEARCHING}
              />
            </div>

            {/* Right Column: Results - Ensure padding at bottom for quote safety */}
            <div className="lg:col-span-7 h-full flex flex-col overflow-hidden pb-20">
               {status === AnalysisStatus.THINKING && (
                 <div className="flex-grow flex flex-col items-center justify-center p-24 bg-slate-900/20 backdrop-blur-2xl rounded-[3.5rem] border border-white/5 shadow-2xl animate-fade-in relative overflow-hidden">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
                   <div className="relative w-32 h-32 mb-10">
                     <div className="absolute inset-0 border-[6px] border-slate-800/30 rounded-full"></div>
                     <div className="absolute inset-0 border-[6px] border-t-cyan-400 border-r-indigo-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                     <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-cyan-200/40" />
                   </div>
                   <h3 className="text-2xl font-black text-white mb-4 tracking-tight">Illuminating Architecture</h3>
                   <p className="text-slate-500 text-center max-w-sm text-lg leading-relaxed font-medium">
                     The neural architect is dissecting your professional journey.
                   </p>
                 </div>
               )}
               
               {status === AnalysisStatus.SEARCHING && (
                 <div className="flex-grow flex flex-col items-center justify-center p-24 bg-slate-900/20 backdrop-blur-2xl rounded-[3.5rem] border border-white/5 animate-fade-in relative overflow-hidden">
                   <div className="relative w-24 h-24 mb-10 flex items-center justify-center">
                      <div className="absolute inset-0 border-[2px] border-amber-500/20 rounded-full animate-ping"></div>
                      <div className="w-12 h-12 border-[2px] border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                   </div>
                   <h3 className="text-xl font-black text-amber-100/60 uppercase tracking-widest">Scanning Horizons</h3>
                 </div>
               )}

               {(status === AnalysisStatus.COMPLETE || status === AnalysisStatus.IDLE || status === AnalysisStatus.ERROR) && (
                  <div className="h-full overflow-y-auto pr-8 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                    <ResultsSection result={result} trends={trends} />
                  </div>
               )}
            </div>

          </div>
        </div>
      </main>

      {/* Inspirational Quote - Floating Delicate Bottom Center */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-2xl text-center opacity-40 hover:opacity-100 transition-all duration-1000 z-50 pointer-events-none select-none">
         <p className="text-base font-light italic text-slate-200 mb-1 leading-snug tracking-wide">
           "{quote.text}"
         </p>
         <div className="flex items-center justify-center gap-3">
           <div className="h-[1px] w-6 bg-gradient-to-r from-transparent to-cyan-500/30"></div>
           <span className="text-[8px] font-black tracking-[0.4em] text-cyan-500/80 uppercase">
             {quote.author}
           </span>
           <div className="h-[1px] w-6 bg-gradient-to-l from-transparent to-cyan-500/30"></div>
         </div>
      </div>
    </div>
  );
};

export default App;