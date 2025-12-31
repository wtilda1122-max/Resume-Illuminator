import React, { useState } from 'react';
import { AnalysisResult, MarketTrend } from '../types';
import { fetchTTSBase64 } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audioUtils';
import { Play, Square, Loader2, TrendingUp, Sparkles, Zap, Fingerprint, Lightbulb, MessageSquare, Copy, Check, Target, Compass } from 'lucide-react';

interface ResultsSectionProps {
  result: AnalysisResult | null;
  trends: MarketTrend[];
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ result, trends }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [sourceNode, setSourceNode] = useState<AudioBufferSourceNode | null>(null);
  const [copied, setCopied] = useState(false);

  if (!result) {
    return (
      <div className="bg-slate-900/10 backdrop-blur-md border-2 border-dashed border-white/5 rounded-[3rem] h-full flex items-center justify-center p-24 text-center group transition-all duration-700 hover:border-cyan-500/20 hover:bg-slate-900/20">
        <div className="max-w-xl">
          <div className="w-28 h-28 bg-slate-900/50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 group-hover:scale-110 transition-transform duration-700 border border-white/5 shadow-2xl">
            <Sparkles className="w-12 h-12 text-slate-600 group-hover:text-cyan-400 transition-colors" />
          </div>
          <h3 className="text-3xl font-black text-slate-300 mb-6 tracking-tight">Strategic Insight Pending</h3>
          <p className="text-slate-500 leading-relaxed font-medium text-lg">
            The architect is ready. Provide your professional data on the left to generate an illuminated career roadmap.
          </p>
        </div>
      </div>
    );
  }

  const positioning = result.suggestions?.positioning || "No positioning available";
  const improvements = result.suggestions?.improvements || [];
  const coreSkills = (result.extractedSkills?.core || []).slice(0, 5);
  const softSkills = (result.extractedSkills?.soft || []).slice(0, 5);
  const greeting = result.greeting || "No outreach message generated.";
  const workStyle = result.workStyle || "Professional and detail-oriented.";

  const handlePlayAudio = async () => {
    if (isPlaying && sourceNode) {
      sourceNode.stop();
      setIsPlaying(false);
      return;
    }

    setIsGeneratingAudio(true);
    try {
      const textToRead = `Here is my analysis. ${positioning}. To improve, consider these steps: ${improvements.join('. ')}`;
      const base64Data = await fetchTTSBase64(textToRead);
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      setAudioContext(ctx);
      const audioBuffer = await decodeAudioData(decode(base64Data), ctx, 24000, 1);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => setIsPlaying(false);
      source.start();
      setSourceNode(source);
      setIsPlaying(true);

    } catch (e) {
      console.error("Error playing audio", e);
      alert("Could not generate audio advice.");
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleCopyGreeting = () => {
    if (greeting) {
      navigator.clipboard.writeText(greeting);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in pb-32">
      
      {/* Header */}
      <div className="flex justify-between items-end px-4">
        <div>
          <div className="flex items-center text-[10px] font-black text-cyan-500 mb-2 tracking-[0.4em] uppercase">
            <span className="flex w-2 h-2 bg-cyan-500 rounded-full mr-3 shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-pulse"></span>
            Finalized
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter leading-none">Strategic Insight</h2>
        </div>
        <button
          onClick={handlePlayAudio}
          disabled={isGeneratingAudio}
          className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full transition-all duration-500 border
            ${isGeneratingAudio 
              ? 'bg-slate-900 text-slate-600 border-transparent' 
              : isPlaying 
                ? 'bg-rose-950/20 text-rose-400 border-rose-500/30 hover:bg-rose-900/30 shadow-2xl' 
                : 'bg-white/5 text-white border-white/10 hover:bg-white/10 shadow-2xl hover:-translate-y-1'}`}
        >
          {isGeneratingAudio ? <Loader2 className="w-3 h-3 animate-spin" /> : isPlaying ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
          {isGeneratingAudio ? 'SYNT...' : isPlaying ? 'Mute' : 'Audio Brief'}
        </button>
      </div>

      {/* 1. Core Positioning */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 p-12 rounded-[3rem] border border-indigo-500/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] group">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/10">
               <Lightbulb className="w-4 h-4 text-yellow-400/80 fill-yellow-400/10" />
            </div>
            <h3 className="font-black text-indigo-400/80 uppercase tracking-[0.3em] text-[9px]">Positioning</h3>
          </div>
          <p className="text-lg md:text-xl font-bold leading-relaxed text-slate-100 italic">
            "{positioning}"
          </p>
        </div>
      </div>

      {/* 2. Skills and Matrix */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-slate-900/20 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/5 shadow-xl">
          <h3 className="font-black text-white mb-8 flex items-center text-lg">
            <div className="p-2 bg-cyan-950/50 border border-cyan-500/10 text-cyan-400 rounded-xl mr-4">
               <Zap className="w-5 h-5" />
            </div>
            Core Matrix
          </h3>
          <div className="grid gap-3">
             {coreSkills.map((skill, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-xl border transition-all group/item ${i < 3 ? 'bg-cyan-900/10 border-cyan-500/20' : 'bg-white/5 border-white/5'}`}>
                   <div className="flex items-center">
                     <span className={`w-7 h-7 flex items-center justify-center text-[10px] font-black rounded-lg mr-4 shadow-inner ${i < 3 ? 'bg-cyan-500 text-slate-900' : 'bg-slate-800 text-slate-400'}`}>
                       {String(i + 1).padStart(2, '0')}
                     </span>
                     <span className="text-slate-300 text-md font-bold tracking-tight">{skill}</span>
                   </div>
                   {i < 3 && <Sparkles className="w-3 h-3 text-cyan-400/40" />}
                </div>
             ))}
          </div>
        </div>

        <div className="bg-slate-900/20 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/5 shadow-xl">
          <h3 className="font-black text-white mb-8 flex items-center text-lg">
            <div className="p-2 bg-indigo-950/50 border border-indigo-500/10 text-indigo-400 rounded-xl mr-4">
               <Compass className="w-5 h-5" />
            </div>
            Archetypes
          </h3>
           <div className="grid gap-3">
             {softSkills.map((skill, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${i < 3 ? 'bg-indigo-900/10 border-indigo-500/20' : 'bg-white/5 border-white/5'}`}>
                   <div className="flex items-center">
                     <span className={`w-7 h-7 flex items-center justify-center text-[10px] font-black rounded-lg mr-4 shadow-inner ${i < 3 ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                       {String(i + 1).padStart(2, '0')}
                     </span>
                     <span className="text-slate-300 text-md font-bold tracking-tight">{skill}</span>
                   </div>
                   {i < 3 && <div className="w-1 h-1 rounded-full bg-indigo-400/60"></div>}
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* 3. Refinement Protocol */}
      <div className="bg-slate-900/20 backdrop-blur-2xl p-12 rounded-[3rem] border border-white/5 shadow-2xl">
        <h3 className="font-black text-white mb-10 flex items-center text-xl">
          <div className="p-2 bg-emerald-950/50 border border-emerald-500/10 text-emerald-400 rounded-xl mr-5">
              <Target className="w-6 h-6" />
          </div>
          Refinement Protocol
        </h3>
        <div className="grid gap-4">
          {improvements.map((item, i) => (
            <div key={i} className="flex gap-6 items-start p-6 bg-black/30 rounded-2xl border border-white/5 group/action">
              <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 flex items-center justify-center text-sm font-black transition-transform group-hover/action:scale-110">
                {i + 1}
              </span>
              <p className="text-slate-300 text-lg leading-relaxed font-medium">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Secondary Matrix */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-slate-900/20 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/5 shadow-xl flex flex-col">
           <h3 className="font-black text-white mb-6 flex items-center text-lg">
            <div className="p-2 bg-purple-950/50 border border-purple-500/10 text-purple-400 rounded-xl mr-4">
               <Fingerprint className="w-4 h-4" />
            </div>
            Persona Profile
          </h3>
          <div className="relative flex-grow">
             <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-transparent opacity-10"></div>
             <p className="pl-8 text-slate-400 text-lg leading-relaxed italic font-serif">
               "{workStyle}"
             </p>
          </div>
        </div>

        {trends && trends.length > 0 && (
           <div className="bg-amber-950/10 p-10 rounded-[2.5rem] border border-amber-500/10 relative overflow-hidden flex flex-col">
              <h3 className="font-black text-amber-200/60 mb-6 flex items-center text-[10px] uppercase tracking-[0.3em] relative z-10">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Radar
              </h3>
              <div className="grid gap-3 relative z-10">
                  {trends.map((t, idx) => (
                      <div key={idx} className="flex items-center p-3 bg-black/20 rounded-xl border border-amber-500/5">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40 mr-4 flex-shrink-0"></div>
                          <span className="text-md text-slate-300 font-bold">{t.trend}</span>
                      </div>
                  ))}
              </div>
           </div>
        )}
      </div>

      {/* 5. Outreach Blueprint */}
      <div className="bg-slate-900/20 backdrop-blur-2xl p-12 rounded-[3rem] border border-white/5 shadow-2xl flex flex-col">
        <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-white flex items-center text-xl">
            <div className="p-2 bg-cyan-950/50 border border-cyan-500/10 text-cyan-400 rounded-xl mr-5">
                <MessageSquare className="w-6 h-6" />
            </div>
            Outreach Blueprint
          </h3>
          <button 
            onClick={handleCopyGreeting}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest text-slate-400"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Captured' : 'Copy'}</span>
          </button>
        </div>
        <div className="relative flex-grow bg-black/40 rounded-2xl p-10 border border-white/5 shadow-inner">
            <p className="text-slate-200 text-lg leading-relaxed font-bold whitespace-pre-line pl-6 font-serif">
              {greeting}
            </p>
        </div>
      </div>

    </div>
  );
};

export default ResultsSection;