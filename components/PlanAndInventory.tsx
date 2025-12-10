
import React, { useState, useEffect, useRef } from 'react';
import { InventoryItem, DrillTask, FamilyMember, PlanData, MapMarker, MarkerType } from '../types';
import { DEFAULT_DRILLS } from '../constants';
import { 
  CheckSquare, Trash2, Plus, Map as MapIcon, RotateCcw, User, Phone, 
  BriefcaseMedical, LogOut, Flame, AlertTriangle, Flag, CircleDot, 
  Image as ImageIcon, PenTool, Play, CheckCircle2, Clock, Utensils, Wrench, FileText, Download,
  X, Trophy, Timer
} from 'lucide-react';

// --- Utils ---
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxSize = 1000;
        if (width > height && width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        } else if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.5));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

// --- Inventory Component ---
export const InventoryView: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [filter, setFilter] = useState<'all' | 'food' | 'medical' | 'tool'>('all');

  useEffect(() => {
    const saved = localStorage.getItem('guardian_inventory');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      setItems([
        { id: '1', name: '饮用水 (500ml)', quantity: 12, category: 'food', expiryDate: '2025-12-01' },
        { id: '2', name: '压缩饼干', quantity: 10, category: 'food', expiryDate: '2026-05-01' },
        { id: '3', name: '创可贴', quantity: 20, category: 'medical', expiryDate: '2027-01-01' },
        { id: '4', name: '碘伏棉签', quantity: 1, category: 'medical' },
        { id: '5', name: '手摇手电', quantity: 1, category: 'tool' },
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('guardian_inventory', JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (!newItemName.trim()) return;
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: newItemName,
      quantity: 1,
      category: filter === 'all' ? 'tool' : filter
    };
    setItems([...items, newItem]);
    setNewItemName('');
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const checkExpiry = (dateStr?: string) => {
    if (!dateStr) return 'normal';
    const date = new Date(dateStr);
    const now = new Date();
    const monthsDiff = (date.getFullYear() - now.getFullYear()) * 12 + (date.getMonth() - now.getMonth());
    if (monthsDiff < 0) return 'expired';
    if (monthsDiff < 3) return 'warning';
    return 'normal';
  };

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'food': return <Utensils size={16} className="text-orange-500" />;
      case 'medical': return <BriefcaseMedical size={16} className="text-rose-500" />;
      case 'tool': return <Wrench size={16} className="text-slate-500" />;
      default: return <FileText size={16} className="text-blue-500" />;
    }
  };

  const filteredItems = filter === 'all' ? items : items.filter(i => i.category === filter);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar">
         {['all', 'food', 'medical', 'tool'].map(f => (
           <button 
             key={f} 
             onClick={() => setFilter(f as any)}
             className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${filter === f ? 'bg-slate-900 text-white' : 'bg-white border text-slate-500'}`}
           >
             {f === 'all' ? '全部' : f === 'food' ? '食物水' : f === 'medical' ? '医疗' : '工具'}
           </button>
         ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden min-h-[300px]">
        {filteredItems.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-sm">
            暂无物品，请添加
          </div>
        )}
        {filteredItems.map(item => {
          const status = checkExpiry(item.expiryDate);
          return (
            <div key={item.id} className="p-4 border-b last:border-0 flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                   {getCategoryIcon(item.category)}
                </div>
                <div>
                  <div className="font-medium text-slate-900 flex items-center gap-2">
                    {item.name}
                    {status === 'expired' && <span className="text-[10px] text-red-500 font-bold bg-red-50 px-1 rounded border border-red-100">过期</span>}
                    {status === 'warning' && <span className="text-[10px] text-orange-500 font-bold bg-orange-50 px-1 rounded border border-orange-100">临期</span>}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                     数量: {item.quantity} {item.expiryDate && `| 有效期: ${item.expiryDate}`}
                  </div>
                </div>
              </div>
              <button onClick={() => deleteItem(item.id)} className="text-slate-300 hover:text-red-500 p-2 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>
      
      <div className="flex gap-2">
          <input 
            type="text" 
            placeholder={`添加${filter === 'all' ? '物品' : filter === 'food' ? '食物' : filter === 'medical' ? '药品' : '工具'}...`}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            value={newItemName}
            onChange={e => setNewItemName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addItem()}
          />
          <button onClick={addItem} className="bg-slate-900 text-white px-5 rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition">
            <Plus size={20} />
          </button>
      </div>
    </div>
  );
};

// --- Map Editor Component ---
export const MapEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [planData, setPlanData] = useState<PlanData>({ markers: [] });
  const [activeTool, setActiveTool] = useState<'pen' | MarkerType | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Load Plan Data
  useEffect(() => {
    const saved = localStorage.getItem('guardian_plan_data');
    if (saved) {
      try {
        setPlanData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load plan", e);
      }
    }
  }, []);

  // Auto-Save
  useEffect(() => {
    localStorage.setItem('guardian_plan_data', JSON.stringify(planData));
  }, [planData]);

  // Canvas Drawing Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    
    // Set canvas dimensions
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    if (!planData.backgroundImage) {
       drawGrid(ctx, canvas.width, canvas.height);
    }
  }, [planData.backgroundImage]);

  const drawGrid = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.clearRect(0, 0, w, h);
    
    // Draw Grid
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for(let i=0; i<w; i+=20) { ctx.moveTo(i,0); ctx.lineTo(i, h); }
    for(let i=0; i<h; i+=20) { ctx.moveTo(0,i); ctx.lineTo(w, i); }
    ctx.stroke();
  };

  const loadExamplePlan = () => {
     // Create a dummy floor plan on canvas and save as image
     const canvas = document.createElement('canvas');
     canvas.width = 800;
     canvas.height = 600;
     const ctx = canvas.getContext('2d');
     if(ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0,0,800,600);
        
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        
        // Draw House Outline
        ctx.beginPath();
        ctx.rect(100, 100, 600, 400);
        ctx.stroke();

        // Draw Rooms
        ctx.beginPath();
        ctx.moveTo(400, 100); ctx.lineTo(400, 500); // Vertical split
        ctx.moveTo(100, 300); ctx.lineTo(400, 300); // Left horz split
        ctx.moveTo(400, 250); ctx.lineTo(700, 250); // Right horz split
        ctx.stroke();

        // Draw Doors
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(150, 300); ctx.quadraticCurveTo(150, 340, 110, 340); // Door 1
        ctx.moveTo(400, 400); ctx.quadraticCurveTo(440, 400, 440, 440); // Door 2
        ctx.stroke();

        // Text
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText("主卧", 120, 200);
        ctx.fillText("客厅", 420, 400);
        ctx.fillText("厨房", 420, 200);
        
        setPlanData(prev => ({ ...prev, backgroundImage: canvas.toDataURL('image/jpeg', 0.6) }));
     }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
       const compressed = await compressImage(e.target.files[0]);
       setPlanData(prev => ({ ...prev, backgroundImage: compressed }));
    }
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (activeTool === 'pen') return;
    if (!activeTool) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    const newMarker: MapMarker = {
      id: Date.now().toString(),
      x, y,
      type: activeTool
    };

    setPlanData(prev => ({
      ...prev,
      markers: [...prev.markers, newMarker]
    }));
  };

  const removeMarker = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlanData(prev => ({
      ...prev,
      markers: prev.markers.filter(m => m.id !== id)
    }));
  };

  // Canvas Drawing Handlers
  const startDraw = (e: any) => {
    if (activeTool !== 'pen') return;
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#e11d48'; // Rose-600
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
  };

  const draw = (e: any) => {
    if(!isDrawing || activeTool !== 'pen') return;
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
     const canvas = canvasRef.current;
     if (canvas) {
       const ctx = canvas.getContext('2d');
       ctx?.clearRect(0, 0, canvas.width, canvas.height);
       if (!planData.backgroundImage) drawGrid(ctx!, canvas.width, canvas.height);
     }
  };

  const getMarkerIcon = (type: MarkerType) => {
    switch(type) {
      case 'exit': return <LogOut size={16} className="text-white" />;
      case 'extinguisher': return <Flame size={16} className="text-white" />;
      case 'kit': return <BriefcaseMedical size={16} className="text-white" />;
      case 'danger': return <AlertTriangle size={16} className="text-white" />;
      case 'assembly': return <Flag size={16} className="text-white" />;
      case 'valve': return <CircleDot size={16} className="text-white" />;
      default: return <div className="w-2 h-2 bg-white rounded-full" />;
    }
  };

  const getMarkerColor = (type: MarkerType) => {
    switch(type) {
      case 'exit': return 'bg-green-500';
      case 'extinguisher': return 'bg-red-500';
      case 'kit': return 'bg-blue-500';
      case 'danger': return 'bg-orange-500';
      case 'assembly': return 'bg-purple-500';
      case 'valve': return 'bg-slate-700';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4 select-none">
       {/* Toolbar */}
       <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-full">
            <label className="flex-shrink-0 flex items-center gap-1 px-3 py-2 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 active:scale-95 transition cursor-pointer whitespace-nowrap">
               <ImageIcon size={14} />
               <span>{planData.backgroundImage ? '换图' : '上传户型'}</span>
               <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            {!planData.backgroundImage && (
                <button onClick={loadExamplePlan} className="flex-shrink-0 px-3 py-2 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 active:scale-95 transition flex items-center gap-1 whitespace-nowrap">
                    <Download size={14} /> 示例
                </button>
            )}
            <button onClick={clearCanvas} className="flex-shrink-0 px-3 py-2 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 active:scale-95 transition flex items-center gap-1 whitespace-nowrap">
               <RotateCcw size={14} /> 重绘
            </button>
            <button onClick={() => setPlanData({...planData, markers: []})} className="flex-shrink-0 px-3 py-2 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 active:scale-95 transition flex items-center gap-1 whitespace-nowrap">
               <Trash2 size={14} /> 清除
            </button>
          </div>
       </div>

       {/* Tools Selection */}
       <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'pen', icon: PenTool, label: '画笔', color: 'bg-slate-800' },
            { id: 'exit', icon: LogOut, label: '出口', color: 'bg-green-500' },
            { id: 'extinguisher', icon: Flame, label: '灭火', color: 'bg-red-500' },
            { id: 'kit', icon: BriefcaseMedical, label: '急救包', color: 'bg-blue-500' },
            { id: 'valve', icon: CircleDot, label: '阀门', color: 'bg-slate-700' },
            { id: 'danger', icon: AlertTriangle, label: '危险', color: 'bg-orange-500' },
            { id: 'assembly', icon: Flag, label: '集合', color: 'bg-purple-500' },
          ].map((tool) => (
             <button
               key={tool.id}
               onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id as any)}
               className={`flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-full text-xs font-bold transition-all border shadow-sm ${activeTool === tool.id ? `${tool.color} text-white border-transparent ring-2 ring-offset-1 ring-slate-300` : 'bg-white text-slate-600 border-slate-200'}`}
             >
               <tool.icon size={14} />
               {tool.label}
             </button>
          ))}
       </div>

       {/* Canvas Area */}
       <div 
         className="relative w-full h-[350px] bg-white rounded-xl overflow-hidden border border-slate-200 touch-none shadow-inner"
         onClick={handleMapClick}
       >
          {planData.backgroundImage && (
            <img 
               src={planData.backgroundImage} 
               alt="Floor Plan" 
               className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-50 grayscale"
            />
          )}
          
          <canvas 
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-10"
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />

          {/* Markers Layer */}
          <div className="absolute inset-0 z-20 pointer-events-none">
             {planData.markers.map(m => (
                <div 
                  key={m.id}
                  className={`absolute w-8 h-8 rounded-full ${getMarkerColor(m.type)} flex items-center justify-center shadow-lg border-2 border-white pointer-events-auto active:scale-125 transition-transform`}
                  style={{ left: `${m.x}%`, top: `${m.y}%`, transform: 'translate(-50%, -50%)' }}
                  onClick={(e) => removeMarker(m.id, e)}
                >
                   {getMarkerIcon(m.type)}
                </div>
             ))}
          </div>

          {!planData.backgroundImage && planData.markers.length === 0 && !isDrawing && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 pointer-events-none gap-2">
                <MapIcon size={32} className="opacity-20" />
                <p className="text-sm">1. 上传户型图 或 加载示例</p>
                <p className="text-sm">2. 标注出口与设备</p>
             </div>
          )}
       </div>
    </div>
  );
};

// --- Active Drill Session ---
interface DrillSessionProps {
  drill: DrillTask;
  onComplete: () => void;
  onCancel: () => void;
}

const DrillSession: React.FC<DrillSessionProps> = ({ drill, onComplete, onCancel }) => {
   const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
   const [timeElapsed, setTimeElapsed] = useState(0);
   const [isActive, setIsActive] = useState(true);

   useEffect(() => {
     let interval: number;
     if (isActive) {
       interval = window.setInterval(() => setTimeElapsed(t => t + 1), 1000);
     }
     return () => clearInterval(interval);
   }, [isActive]);

   const toggleStep = (idx: number) => {
      if (checkedSteps.includes(idx)) {
         setCheckedSteps(checkedSteps.filter(i => i !== idx));
      } else {
         setCheckedSteps([...checkedSteps, idx]);
      }
   };

   const formatTime = (seconds: number) => {
     const m = Math.floor(seconds / 60);
     const s = seconds % 60;
     return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
   };

   const allChecked = drill.steps.length > 0 && checkedSteps.length === drill.steps.length;

   return (
     <div className="fixed inset-0 z-[60] bg-slate-50 flex flex-col max-w-md mx-auto h-full">
        {/* Top Navigation / Header */}
        <div className="bg-slate-900 text-white p-4 pt-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden shrink-0">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Play size={200} />
            </div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <button 
                        onClick={onCancel}
                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md"
                    >
                        <X size={20} />
                    </button>
                    <div className="flex items-center gap-2 bg-rose-600 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        进行中
                    </div>
                </div>

                <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold mb-1">{drill.title}</h2>
                    <p className="text-slate-400 text-xs uppercase tracking-widest">家庭应急演练</p>
                </div>

                <div className="flex justify-center mb-2">
                    <div className="font-mono text-5xl font-black text-emerald-400 tabular-nums tracking-wider drop-shadow-lg">
                        {formatTime(timeElapsed)}
                    </div>
                </div>
            </div>
        </div>

        {/* Progress Bar */}
        <div className="px-8 -mt-3 relative z-20">
            <div className="bg-white p-1 rounded-full shadow-sm border border-slate-100 flex items-center gap-2">
                 <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-emerald-500 transition-all duration-500 ease-out"
                        style={{ width: `${(checkedSteps.length / drill.steps.length) * 100}%` }}
                    />
                 </div>
                 <span className="text-xs font-bold text-slate-500 w-8 text-right">
                    {Math.round((checkedSteps.length / drill.steps.length) * 100)}%
                 </span>
            </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {drill.steps.map((step, idx) => {
                const isChecked = checkedSteps.includes(idx);
                return (
                    <button
                        key={idx}
                        onClick={() => toggleStep(idx)}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 group relative overflow-hidden ${isChecked ? 'bg-emerald-500 border-emerald-500 shadow-emerald-200' : 'bg-white border-slate-100 shadow-sm hover:border-slate-200'}`}
                    >
                        <div className="flex items-start gap-4 relative z-10">
                            <div className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isChecked ? 'bg-white border-white text-emerald-600' : 'border-slate-300 bg-slate-50 text-transparent'}`}>
                                <CheckCircle2 size={16} strokeWidth={3} />
                            </div>
                            <div className="flex-1">
                                <span className={`text-base font-bold transition-colors leading-snug ${isChecked ? 'text-white' : 'text-slate-700'}`}>
                                    {step}
                                </span>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>

        {/* Bottom Action */}
        <div className="p-6 bg-white border-t border-slate-100 safe-area-bottom">
            <button
                onClick={() => { setIsActive(false); onComplete(); }}
                disabled={!allChecked}
                className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all ${allChecked ? 'bg-slate-900 text-white active:scale-95 shadow-slate-300' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
            >
                {allChecked ? (
                    <>
                        <Trophy size={20} className="text-yellow-400" />
                        完成演练
                    </>
                ) : (
                    <>
                        <span className="text-sm">请完成所有步骤</span>
                    </>
                )}
            </button>
        </div>
     </div>
   );
};

// --- Drills List ---
const DrillsList: React.FC = () => {
   const [drills, setDrills] = useState<DrillTask[]>([]);
   const [activeDrillId, setActiveDrillId] = useState<string | null>(null);

   useEffect(() => {
     const saved = localStorage.getItem('guardian_drills');
     if (saved) {
       setDrills(JSON.parse(saved));
     } else {
       setDrills(DEFAULT_DRILLS);
     }
   }, []);

   const saveDrills = (newDrills: DrillTask[]) => {
      setDrills(newDrills);
      localStorage.setItem('guardian_drills', JSON.stringify(newDrills));
   };

   const handleCompleteDrill = () => {
      if (!activeDrillId) return;
      const today = new Date().toISOString().split('T')[0];
      const updated = drills.map(d => d.id === activeDrillId ? { ...d, lastPerformed: today } : d);
      saveDrills(updated);
      setActiveDrillId(null);
   };

   if (activeDrillId) {
      const drill = drills.find(d => d.id === activeDrillId);
      if (drill) return <DrillSession drill={drill} onComplete={handleCompleteDrill} onCancel={() => setActiveDrillId(null)} />;
   }

   return (
      <div className="space-y-4">
         {drills.map(drill => {
            const lastDate = drill.lastPerformed ? new Date(drill.lastPerformed) : null;
            let daysAgo = -1;
            let isDue = false;
            
            if (lastDate) {
               const diff = new Date().getTime() - lastDate.getTime();
               daysAgo = Math.floor(diff / (1000 * 3600 * 24));
               isDue = daysAgo >= drill.frequencyDays;
            } else {
               isDue = true;
            }

            return (
               <div key={drill.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 relative overflow-hidden group">
                  {isDue && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500"></div>}
                  
                  <div className="flex justify-between items-start mb-3 pl-2">
                     <div>
                        <h3 className="font-bold text-lg text-slate-900">{drill.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                           <Clock size={12} />
                           {drill.frequencyDays}天/次
                           <span className="text-slate-300">|</span>
                           上次: {drill.lastPerformed || '从未执行'}
                        </div>
                     </div>
                     {isDue && <span className="text-xs font-bold bg-rose-50 text-rose-600 px-2 py-1 rounded">应演练</span>}
                  </div>

                  <button 
                     onClick={() => setActiveDrillId(drill.id)}
                     className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                     <Play size={16} fill="currentColor" /> 开始演练
                  </button>
               </div>
            );
         })}
      </div>
   );
};

// --- Family Info Component ---
export const FamilyInfo: React.FC = () => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newMember, setNewMember] = useState<Partial<FamilyMember>>({});

  useEffect(() => {
    const saved = localStorage.getItem('guardian_family');
    if (saved) setMembers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('guardian_family', JSON.stringify(members));
  }, [members]);

  const handleAdd = () => {
    if(!newMember.name) return;
    const member: FamilyMember = {
       id: Date.now().toString(),
       name: newMember.name,
       role: newMember.role || '家庭成员',
       phone: newMember.phone || '',
       bloodType: newMember.bloodType || '',
       medicalNotes: newMember.medicalNotes || ''
    };
    setMembers([...members, member]);
    setIsAdding(false);
    setNewMember({});
  };

  const deleteMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  if (isAdding) {
    return (
       <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
          <h3 className="font-bold text-slate-800">添加家庭成员</h3>
          <input className="w-full border p-2 rounded" placeholder="姓名 *" value={newMember.name||''} onChange={e=>setNewMember({...newMember, name: e.target.value})} />
          <input className="w-full border p-2 rounded" placeholder="角色 (如: 爸爸, 钥匙保管人)" value={newMember.role||''} onChange={e=>setNewMember({...newMember, role: e.target.value})} />
          <input className="w-full border p-2 rounded" placeholder="电话" value={newMember.phone||''} onChange={e=>setNewMember({...newMember, phone: e.target.value})} />
          <input className="w-full border p-2 rounded" placeholder="血型" value={newMember.bloodType||''} onChange={e=>setNewMember({...newMember, bloodType: e.target.value})} />
          <textarea className="w-full border p-2 rounded" placeholder="医疗备注 (过敏史、用药)" value={newMember.medicalNotes||''} onChange={e=>setNewMember({...newMember, medicalNotes: e.target.value})} />
          <div className="flex gap-2">
             <button onClick={() => setIsAdding(false)} className="flex-1 py-2 bg-slate-100 rounded text-slate-600">取消</button>
             <button onClick={handleAdd} className="flex-1 py-2 bg-slate-900 text-white rounded">保存</button>
          </div>
       </div>
    );
  }

  return (
    <div className="space-y-3">
       {members.map(m => (
          <div key={m.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative group">
             <button onClick={()=>deleteMember(m.id)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
             <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                   <User size={20} />
                </div>
                <div>
                   <div className="font-bold text-slate-900">{m.name} <span className="text-xs font-normal text-slate-500 bg-slate-100 px-1 rounded ml-1">{m.role}</span></div>
                   <div className="text-xs text-slate-500 flex items-center gap-1"><Phone size={10} /> {m.phone || '无号码'}</div>
                </div>
             </div>
             {(m.bloodType || m.medicalNotes) && (
                <div className="bg-rose-50 p-2 rounded text-xs text-rose-800 space-y-1">
                   {m.bloodType && <div><strong>血型:</strong> {m.bloodType}</div>}
                   {m.medicalNotes && <div><strong>备注:</strong> {m.medicalNotes}</div>}
                </div>
             )}
          </div>
       ))}
       <button onClick={() => setIsAdding(true)} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-medium hover:border-slate-400 hover:text-slate-600 transition">
          + 添加家庭成员
       </button>
    </div>
  );
};

// --- Main Containers ---

export const PlanView: React.FC = () => {
  const [tab, setTab] = useState<'plan' | 'drills'>('plan');

  return (
     <div className="p-4 pb-24 space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">家庭逃生预案</h2>
        
        <div className="flex p-1 bg-slate-100 rounded-xl">
           <button onClick={() => setTab('plan')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${tab === 'plan' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>逃生图</button>
           <button onClick={() => setTab('drills')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${tab === 'drills' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>演练计划</button>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {tab === 'plan' && <MapEditor />}
          {tab === 'drills' && <DrillsList />}
        </div>
     </div>
  );
};

export const KitView: React.FC = () => {
  const [tab, setTab] = useState<'inventory' | 'family'>('inventory');

  return (
     <div className="p-4 pb-24 space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">物资与家庭</h2>
        
        <div className="flex p-1 bg-slate-100 rounded-xl">
           <button onClick={() => setTab('inventory')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${tab === 'inventory' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>物资包</button>
           <button onClick={() => setTab('family')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${tab === 'family' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>家庭成员</button>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
           {tab === 'inventory' && <InventoryView />}
           {tab === 'family' && <FamilyInfo />}
        </div>
     </div>
  );
};
