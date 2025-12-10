import React, { useState, useEffect } from 'react';
import { EmergencyGuide, GuideStep } from '../types';
import { ChevronLeft, ChevronRight, Clock, Activity, AlertTriangle, ArrowLeft } from 'lucide-react';

interface Props {
  guide: EmergencyGuide;
  onBack: () => void;
}

export const GuideDetail: React.FC<Props> = ({ guide, onBack }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [mode, setMode] = useState<'quick' | 'detail'>('quick');
  const [timer, setTimer] = useState<number | null>(null);

  const step = guide.steps[currentStepIndex];

  // Reset when switching guides
  useEffect(() => {
    setCurrentStepIndex(0);
    setTimer(null);
  }, [guide.id]);

  const toggleTimer = (duration: number) => {
    if (timer !== null) {
      setTimer(null);
    } else {
      setTimer(duration);
    }
  };

  useEffect(() => {
    if (timer === null || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((t) => (t && t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  if (mode === 'quick') {
    return (
      <div className="flex flex-col h-full bg-slate-50">
        <div className="p-4 bg-white border-b sticky top-0 z-10 flex items-center gap-3">
           <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full">
            <ArrowLeft />
           </button>
           <h2 className="text-xl font-bold text-rose-600">{guide.title}</h2>
        </div>
        
        <div className="p-6 space-y-8 flex-1 overflow-y-auto">
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl text-rose-800 flex items-start gap-3">
             <AlertTriangle className="shrink-0 mt-1" size={20} />
             <p className="font-medium">{guide.summary}</p>
          </div>

          <div className="space-y-4">
             <h3 className="text-lg font-bold text-slate-900">快速处置流程</h3>
             {guide.quickSteps.map((s, idx) => (
               <div key={idx} className="flex gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                  <span className="w-8 h-8 flex items-center justify-center bg-slate-900 text-white font-bold rounded-full shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-lg font-medium text-slate-800">{s}</p>
               </div>
             ))}
          </div>
        </div>

        <div className="p-4 bg-white border-t safe-area-bottom">
           <button 
             onClick={() => setMode('detail')}
             className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform"
           >
             进入详细图解模式
           </button>
        </div>
      </div>
    );
  }

  // Detail Mode
  return (
    <div className="flex flex-col h-full bg-black text-white">
       {/* Top Bar */}
       <div className="p-4 flex justify-between items-center z-10">
          <button onClick={() => setMode('quick')} className="text-slate-300 flex items-center gap-1">
             <ChevronLeft size={20} /> 返回摘要
          </button>
          <div className="text-slate-400 font-mono">
            步骤 {currentStepIndex + 1} / {guide.steps.length}
          </div>
       </div>

       {/* Content */}
       <div className="flex-1 flex flex-col relative overflow-hidden">
          {step.imagePlaceholder && (
             <div className="h-1/2 w-full bg-slate-800 relative">
               <img src={step.imagePlaceholder} alt={step.title} className="w-full h-full object-cover opacity-80" />
               <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
             </div>
          )}
          
          <div className="flex-1 p-6 flex flex-col justify-center space-y-4">
             {step.isCritical && (
                <span className="self-start px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-full uppercase tracking-wider animate-pulse">
                  关键步骤
                </span>
             )}
             <h2 className="text-3xl font-bold">{step.title}</h2>
             <p className="text-xl text-slate-300 leading-relaxed">{step.description}</p>
             
             {/* Interactive Elements for Step */}
             <div className="flex gap-3 mt-4">
                {step.durationSeconds && (
                  <button 
                    onClick={() => toggleTimer(step.durationSeconds!)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition"
                  >
                    <Clock size={20} className={timer ? "text-green-400" : "text-white"} />
                    <span>{timer !== null ? `${timer}s` : `${step.durationSeconds}s 计时`}</span>
                  </button>
                )}
                {step.bpm && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg text-rose-400">
                    <Activity size={20} />
                    <span>{step.bpm} BPM</span>
                  </div>
                )}
             </div>
          </div>
       </div>

       {/* Navigation Buttons */}
       <div className="p-6 grid grid-cols-2 gap-4">
          <button 
             onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
             disabled={currentStepIndex === 0}
             className="bg-slate-800 text-white py-4 rounded-xl font-bold disabled:opacity-30"
          >
            上一步
          </button>
          <button 
             onClick={() => setCurrentStepIndex(Math.min(guide.steps.length - 1, currentStepIndex + 1))}
             disabled={currentStepIndex === guide.steps.length - 1}
             className="bg-rose-600 text-white py-4 rounded-xl font-bold disabled:opacity-30 disabled:bg-slate-800"
          >
            {currentStepIndex === guide.steps.length - 1 ? '完成' : '下一步'}
          </button>
       </div>
    </div>
  );
};
