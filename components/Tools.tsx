import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Zap, Radio, Play, Square, Timer as TimerIcon, RotateCcw, Compass, Move, Info } from 'lucide-react';

export const Tools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [bpm, setBpm] = useState(110);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  
  // Compass & Level State
  const [heading, setHeading] = useState<number>(0);
  const [tiltFB, setTiltFB] = useState<number>(0); // Front-Back
  const [tiltLR, setTiltLR] = useState<number>(0); // Left-Right
  const [sensorPermission, setSensorPermission] = useState<'unknown' | 'granted' | 'denied'>('unknown');

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const sosIntervalRef = useRef<number | null>(null);
  const metronomeIntervalRef = useRef<number | null>(null);

  // Initialize Audio Context
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playTone = (freq: number, type: OscillatorType = 'sine') => {
    initAudio();
    if (!audioCtxRef.current) return;
    
    const osc = audioCtxRef.current.createOscillator();
    const gainNode = audioCtxRef.current.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
    
    gainNode.gain.setValueAtTime(0.5, audioCtxRef.current.currentTime);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtxRef.current.destination);
    osc.start();
    return osc;
  };

  const stopAudio = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
  };

  // --- SOS Logic ---
  const toggleSOS = () => {
    if (activeTool === 'sos') {
      setActiveTool(null);
      if (sosIntervalRef.current) window.clearInterval(sosIntervalRef.current);
      document.body.style.backgroundColor = '';
      stopAudio();
    } else {
      setActiveTool('sos');
      sosIntervalRef.current = window.setInterval(() => {
        const isWhite = document.body.style.backgroundColor === 'white';
        document.body.style.backgroundColor = isWhite ? 'black' : 'white';
        
        initAudio();
        if(audioCtxRef.current) {
             const osc = audioCtxRef.current.createOscillator();
             const gain = audioCtxRef.current.createGain();
             osc.frequency.value = 880;
             gain.gain.value = 0.1;
             osc.connect(gain);
             gain.connect(audioCtxRef.current.destination);
             osc.start();
             osc.stop(audioCtxRef.current.currentTime + 0.1);
        }

      }, 500);
    }
  };

  // --- Whistle Logic ---
  const toggleWhistle = () => {
    if (activeTool === 'whistle') {
      setActiveTool(null);
      stopAudio();
    } else {
      setActiveTool('whistle');
      oscillatorRef.current = playTone(3000, 'triangle') || null;
    }
  };

  // --- Metronome Logic ---
  const toggleMetronome = () => {
    if (activeTool === 'metronome') {
      setActiveTool(null);
      if (metronomeIntervalRef.current) window.clearInterval(metronomeIntervalRef.current);
    } else {
      setActiveTool('metronome');
      const interval = 60000 / bpm;
      metronomeIntervalRef.current = window.setInterval(() => {
        initAudio();
         if(audioCtxRef.current) {
             const osc = audioCtxRef.current.createOscillator();
             const gain = audioCtxRef.current.createGain();
             osc.frequency.value = 1000;
             gain.gain.value = 0.3;
             osc.connect(gain);
             gain.connect(audioCtxRef.current.destination);
             osc.start();
             osc.stop(audioCtxRef.current.currentTime + 0.05);
        }
      }, interval);
    }
  };

  // --- Stopwatch Logic ---
  useEffect(() => {
    let interval: number;
    if (isStopwatchRunning) {
      interval = window.setInterval(() => {
        setStopwatchTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStopwatchRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Sensor Logic (Compass & Level) ---
  const requestSensorPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setSensorPermission('granted');
          window.addEventListener('deviceorientation', handleOrientation);
        } else {
          setSensorPermission('denied');
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      // Non-iOS 13+ devices typically don't need explicit permission
      setSensorPermission('granted');
      window.addEventListener('deviceorientation', handleOrientation);
    }
  };

  const handleOrientation = (e: DeviceOrientationEvent) => {
    // Compass Heading
    const event = e as any;
    if (event.webkitCompassHeading) {
      setHeading(event.webkitCompassHeading);
    } else if (e.alpha) {
      setHeading(360 - e.alpha);
    }

    // Level Tilt
    if (e.beta) setTiltFB(e.beta); // Front-Back (-180 to 180)
    if (e.gamma) setTiltLR(e.gamma); // Left-Right (-90 to 90)
  };

  useEffect(() => {
    return () => {
      document.body.style.backgroundColor = '';
      if (sosIntervalRef.current) window.clearInterval(sosIntervalRef.current);
      if (metronomeIntervalRef.current) window.clearInterval(metronomeIntervalRef.current);
      stopAudio();
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return (
    <div className="p-4 space-y-4 pb-24">
      <h2 className="text-2xl font-bold text-slate-800">生存工具箱</h2>
      <div className="grid grid-cols-2 gap-4">
        
        {/* Flashlight/SOS Card */}
        <button 
          onClick={toggleSOS}
          className={`p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${activeTool === 'sos' ? 'bg-red-600 text-white animate-pulse' : 'bg-white shadow-lg border border-slate-100'}`}
        >
          <Zap size={32} />
          <span className="font-semibold">SOS 频闪</span>
        </button>

        {/* Whistle Card */}
        <button 
           onClick={toggleWhistle}
           className={`p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${activeTool === 'whistle' ? 'bg-amber-500 text-white' : 'bg-white shadow-lg border border-slate-100'}`}
        >
          <Volume2 size={32} />
          <span className="font-semibold">高频哨音</span>
        </button>

         {/* Metronome Card */}
         <div className={`col-span-2 p-6 rounded-2xl flex flex-col gap-4 transition-all ${activeTool === 'metronome' ? 'bg-blue-600 text-white' : 'bg-white shadow-lg border border-slate-100'}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Radio size={28} />
                    <span className="font-semibold text-lg">CPR 节拍器</span>
                </div>
                <button onClick={toggleMetronome} className="px-4 py-2 rounded-full bg-black/10 font-bold backdrop-blur-sm">
                    {activeTool === 'metronome' ? '停止' : '开始'}
                </button>
            </div>
            
            <div className="flex items-center gap-4">
                <input 
                    type="range" 
                    min="60" 
                    max="140" 
                    value={bpm} 
                    onChange={(e) => setBpm(Number(e.target.value))}
                    className="w-full accent-current h-2 bg-gray-200/50 rounded-lg appearance-none cursor-pointer"
                />
                <span className="font-mono text-2xl font-bold w-16 text-center">{bpm}</span>
            </div>
        </div>

        {/* Stopwatch Card */}
        <div className="col-span-2 p-6 bg-white shadow-lg border border-slate-100 rounded-2xl flex flex-col gap-4">
           <div className="flex items-center gap-3 text-slate-800">
             <TimerIcon size={28} className="text-slate-600" />
             <span className="font-semibold text-lg">急救计时器</span>
           </div>
           
           <div className="flex items-center justify-between">
              <div className="font-mono text-5xl font-bold text-slate-800 tracking-wider">
                {formatTime(stopwatchTime)}
              </div>
              <div className="flex gap-2">
                 <button 
                   onClick={() => setIsStopwatchRunning(!isStopwatchRunning)}
                   className={`w-12 h-12 rounded-full flex items-center justify-center ${isStopwatchRunning ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}
                 >
                   {isStopwatchRunning ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                 </button>
                 <button 
                   onClick={() => { setIsStopwatchRunning(false); setStopwatchTime(0); }}
                   className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-100 text-slate-600"
                 >
                   <RotateCcw size={20} />
                 </button>
              </div>
           </div>
           <p className="text-xs text-slate-400">用于记录止血带时间、宫缩间隔或生命体征监测。</p>
        </div>

        {/* Compass & Level Card */}
        <div className="col-span-2 p-6 bg-slate-900 text-white rounded-2xl flex flex-col gap-4 relative overflow-hidden">
            <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <Compass size={28} className="text-emerald-400" />
                    <span className="font-semibold text-lg">指南针 & 水平仪</span>
                </div>
                {sensorPermission !== 'granted' && (
                    <button 
                        onClick={requestSensorPermission}
                        className="text-xs bg-slate-700 px-3 py-1 rounded-full hover:bg-slate-600"
                    >
                        开启传感器
                    </button>
                )}
            </div>

            {sensorPermission === 'granted' ? (
                <div className="flex justify-around items-center py-4">
                    {/* Compass UI */}
                    <div className="flex flex-col items-center gap-2">
                        <div 
                            className="w-24 h-24 rounded-full border-4 border-slate-700 flex items-center justify-center relative transition-transform duration-300 ease-out"
                            style={{ transform: `rotate(${-heading}deg)` }}
                        >
                            <div className="absolute top-0 w-2 h-4 bg-red-500 rounded-b-sm"></div>
                            <div className="text-xl font-bold">{Math.round(heading)}°</div>
                            <div className="absolute text-xs font-bold top-1">N</div>
                            <div className="absolute text-xs font-bold bottom-1 text-slate-500">S</div>
                            <div className="absolute text-xs font-bold left-2 text-slate-500">W</div>
                            <div className="absolute text-xs font-bold right-2 text-slate-500">E</div>
                        </div>
                        <span className="text-sm text-slate-400">方向</span>
                    </div>

                    {/* Level UI */}
                    <div className="flex flex-col items-center gap-2">
                         <div className="w-24 h-24 bg-slate-800 rounded-full relative flex items-center justify-center border border-slate-700">
                             {/* Crosshairs */}
                             <div className="absolute w-full h-[1px] bg-slate-600"></div>
                             <div className="absolute h-full w-[1px] bg-slate-600"></div>
                             
                             {/* Bubble */}
                             <div 
                                className="w-6 h-6 bg-emerald-400 rounded-full shadow-lg transition-transform duration-100 ease-linear"
                                style={{ 
                                    transform: `translate(${Math.max(-40, Math.min(40, tiltLR))}px, ${Math.max(-40, Math.min(40, tiltFB))}px)` 
                                }}
                             ></div>
                         </div>
                         <span className="text-sm text-slate-400">水平: {Math.round(tiltLR)}°, {Math.round(tiltFB)}°</span>
                    </div>
                </div>
            ) : (
                 <div className="flex flex-col items-center justify-center py-6 text-slate-500 text-sm gap-2">
                    <Info size={24} />
                    <p>点击上方按钮以启用设备传感器</p>
                 </div>
            )}
        </div>

      </div>
    </div>
  );
};