import React from 'react';
import { UserInput } from '../types';
import { FileText, Briefcase, Zap } from 'lucide-react';

interface InputSectionProps {
  input: UserInput;
  setInput: React.Dispatch<React.SetStateAction<UserInput>>;
  onAnalyze: () => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ input, setInput, onAnalyze, isLoading }) => {
  return (
    <div className="bg-slate-900/20 backdrop-blur-xl p-10 lg:p-12 rounded-[3.5rem] shadow-2xl border border-white/5 h-full flex flex-col relative overflow-hidden group">
      {/* Subtle border glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>

      <div className="flex items-center mb-8 relative z-10 flex-none">
        <div className="flex items-center justify-center w-12 h-12 rounded-[1.25rem] bg-slate-900/80 border border-white/10 text-cyan-400 font-black text-xl mr-5 shadow-2xl">
          1
        </div>
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter">Signal Input</h2>
          <p className="text-sm text-slate-500 font-medium">Calibrate your professional coordinates</p>
        </div>
      </div>
      
      {/* Scrollable area for inputs - ensures button stays at bottom */}
      <div className="flex-grow flex flex-col gap-8 min-h-0 relative z-10">
        <div className="flex-1 flex flex-col min-h-0 group/field">
          <label className="flex items-center text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-3 transition-colors group-hover/field:text-cyan-400 flex-none">
            <FileText className="w-4 h-4 mr-3" />
            Resume / Experience
          </label>
          <div className="flex-1 min-h-0 relative">
            <textarea
              className="w-full h-full p-6 bg-black/30 border border-white/5 rounded-[2rem] focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/40 focus:bg-black/50 transition-all resize-none text-lg text-slate-300 placeholder-slate-800 leading-relaxed shadow-inner scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
              placeholder="Paste your professional narrative here..."
              value={input.experience}
              onChange={(e) => setInput({ ...input, experience: e.target.value })}
            />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col min-h-0 group/field">
          <label className="flex items-center text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-3 transition-colors group-hover/field:text-indigo-400 flex-none">
            <Briefcase className="w-4 h-4 mr-3" />
            Target Job Description
          </label>
          <div className="flex-1 min-h-0 relative">
            <textarea
              className="w-full h-full p-6 bg-black/30 border border-white/5 rounded-[2rem] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 focus:bg-black/50 transition-all resize-none text-lg text-slate-300 placeholder-slate-800 leading-relaxed shadow-inner scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
              placeholder="Paste the target JD to align with..."
              value={input.jobDescription}
              onChange={(e) => setInput({ ...input, jobDescription: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-white/5 relative z-10 flex-none">
        <button
          onClick={onAnalyze}
          disabled={isLoading || !input.experience || !input.jobDescription}
          className={`group w-full py-6 px-10 rounded-[2rem] font-black text-xl transition-all duration-500 transform flex justify-center items-center overflow-hidden relative border border-white/5
            ${isLoading || !input.experience || !input.jobDescription 
              ? 'bg-slate-900/50 text-slate-600 cursor-not-allowed' 
              : 'bg-gradient-to-r from-cyan-600/80 to-indigo-600/80 text-white shadow-[0_20px_40px_-15px_rgba(6,182,212,0.4)] hover:shadow-[0_30px_60px_-12px_rgba(6,182,212,0.6)] hover:-translate-y-1'}`}
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"></span>
            </div>
          ) : (
            <>
              <span className="mr-4 tracking-tighter">Initiate Synthesis</span>
              <Zap className="w-6 h-6 fill-current group-hover:text-yellow-300 transition-colors duration-500" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputSection;