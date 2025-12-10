
import React, { useState } from 'react';
import { ViewState, EmergencyGuide, EmergencyCategory } from './types';
import { EMERGENCY_GUIDES } from './constants';
import { GuideDetail } from './components/GuideDetail';
import { Tools } from './components/Tools';
import { PlanView, KitView } from './components/PlanAndInventory';
import { 
  Home, 
  BookOpen, 
  Hammer, 
  BriefcaseMedical,
  Users,
  HeartPulse, 
  AlertOctagon,
  ChevronRight,
  WifiOff,
  Search,
  ThermometerSun,
  Flame,
  Droplet,
  Bone,
  Brain,
  Activity,
  Waves,
  Snail,
  Compass,
  Map,
  Package
} from 'lucide-react';

// --- Icon Mapping Helper ---
const getIcon = (name: string, size = 24) => {
  switch (name) {
    case 'HeartPulse': return <HeartPulse size={size} />;
    case 'Activity': return <Activity size={size} />;
    case 'Droplet': return <Droplet size={size} />;
    case 'Flame': return <Flame size={size} />;
    case 'ThermometerSun': return <ThermometerSun size={size} />;
    case 'Bone': return <Bone size={size} />;
    case 'Brain': return <Brain size={size} />;
    case 'Waves': return <Waves size={size} />;
    case 'Snail': return <Snail size={size} />;
    default: return <HeartPulse size={size} />;
  }
};

// --- Sub Components for Dashboard ---

const EmergencyCard: React.FC<{ guide: EmergencyGuide; onClick: () => void }> = ({ guide, onClick }) => (
  <button 
    onClick={onClick}
    className="relative overflow-hidden group bg-white p-5 rounded-2xl shadow-sm border border-slate-100 text-left hover:shadow-md transition-all active:scale-95 flex flex-col justify-between h-36"
  >
    <div className={`absolute right-[-15px] top-[-15px] w-24 h-24 rounded-full -z-0 transition-colors ${guide.category === 'medical' ? 'bg-rose-50 group-hover:bg-rose-100' : guide.category === 'disaster' ? 'bg-orange-50 group-hover:bg-orange-100' : 'bg-emerald-50 group-hover:bg-emerald-100'}`} />
    
    <div className={`p-3 rounded-xl w-fit ${guide.category === 'medical' ? 'bg-rose-100 text-rose-600' : guide.category === 'disaster' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
      {getIcon(guide.iconName)}
    </div>
    
    <div className="relative z-10 mt-2">
      <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1">{guide.title}</h3>
      <p className="text-xs text-slate-500 truncate">{guide.summary}</p>
    </div>
  </button>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<EmergencyCategory | 'all'>('all');

  const handleGuideSelect = (id: string) => {
    setSelectedGuideId(id);
    setView(ViewState.GUIDE_DETAIL);
  };

  const filteredGuides = EMERGENCY_GUIDES.filter(g => {
    const matchesSearch = g.title.includes(searchTerm) || g.summary.includes(searchTerm);
    const matchesCategory = filterCategory === 'all' || g.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const renderContent = () => {
    switch (view) {
      case ViewState.HOME:
        return (
          <div className="p-4 pb-24 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start pt-2">
               <div>
                 <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Guardian</h1>
                 <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                   <WifiOff size={14} /> 离线模式
                 </p>
               </div>
               <button 
                 onClick={() => setView(ViewState.TOOLS)}
                 className="bg-slate-900 text-white p-3 rounded-full shadow-lg active:scale-95 transition-transform"
               >
                 <AlertOctagon size={24} />
               </button>
            </div>

            {/* Search */}
            <div className="relative">
              <input 
                type="text"
                placeholder="搜索紧急情况 (如: 烧伤, 骨折...)"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
              />
              <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
            </div>

            {/* Quick Actions Grid */}
            {!searchTerm && (
              <div className="grid grid-cols-3 gap-3">
                 <button onClick={() => setView(ViewState.KIT)} className="bg-blue-50 p-4 rounded-xl flex flex-col items-center gap-2 text-blue-700 active:scale-95 transition">
                    <BriefcaseMedical />
                    <span className="text-xs font-bold">急救包</span>
                 </button>
                 <button onClick={() => setView(ViewState.PLAN)} className="bg-emerald-50 p-4 rounded-xl flex flex-col items-center gap-2 text-emerald-700 active:scale-95 transition">
                    <Users />
                    <span className="text-xs font-bold">家庭预案</span>
                 </button>
                 <button onClick={() => setView(ViewState.TOOLS)} className="bg-slate-50 p-4 rounded-xl flex flex-col items-center gap-2 text-slate-700 active:scale-95 transition">
                    <Compass />
                    <span className="text-xs font-bold">工具箱</span>
                 </button>
              </div>
            )}

            {/* Emergency Grid */}
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                 <h2 className="font-bold text-lg text-slate-800">
                    {searchTerm ? '搜索结果' : '常用急救'}
                 </h2>
                 {!searchTerm && <button onClick={() => setView(ViewState.GUIDE_LIST)} className="text-rose-600 text-sm font-semibold">查看全部</button>}
               </div>
               
               {filteredGuides.length === 0 ? (
                 <div className="text-center py-10 text-slate-400">未找到相关指南</div>
               ) : (
                 <div className="grid grid-cols-2 gap-3">
                   {filteredGuides.slice(0, searchTerm ? undefined : 6).map(guide => (
                     <EmergencyCard key={guide.id} guide={guide} onClick={() => handleGuideSelect(guide.id)} />
                   ))}
                 </div>
               )}
            </div>
          </div>
        );
      
      case ViewState.GUIDE_LIST:
        return (
          <div className="p-4 pb-24 space-y-4">
            <h2 className="text-2xl font-bold mb-4">急救指南库</h2>
            
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
               {['all', 'medical', 'disaster', 'survival'].map(cat => (
                 <button 
                   key={cat}
                   onClick={() => setFilterCategory(cat as any)}
                   className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${filterCategory === cat ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
                 >
                   {cat === 'all' ? '全部' : cat === 'medical' ? '医疗' : cat === 'disaster' ? '灾难' : '户外'}
                 </button>
               ))}
            </div>

            <div className="space-y-3">
              {filteredGuides.map(guide => (
                <div 
                  key={guide.id} 
                  onClick={() => handleGuideSelect(guide.id)}
                  className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between active:bg-slate-50"
                >
                  <div className="flex gap-4 items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${guide.category === 'medical' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
                       {getIcon(guide.iconName)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{guide.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-1">{guide.summary}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-300" />
                </div>
              ))}
            </div>
          </div>
        );

      case ViewState.GUIDE_DETAIL:
        const guide = EMERGENCY_GUIDES.find(g => g.id === selectedGuideId);
        if (!guide) return null;
        return <GuideDetail guide={guide} onBack={() => setView(ViewState.HOME)} />;

      case ViewState.TOOLS:
        return <Tools />;

      case ViewState.PLAN:
        return <PlanView />;

      case ViewState.KIT:
        return <KitView />;
      
      default:
        return null;
    }
  };

  // Bottom Nav
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 relative shadow-2xl overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {renderContent()}
      </div>

      {/* Bottom Navigation (Hidden in Guide Detail Mode) */}
      {view !== ViewState.GUIDE_DETAIL && (
        <div className="absolute bottom-0 w-full bg-white border-t border-slate-200 px-2 py-2 pb-4 flex justify-between items-center z-20 safe-area-bottom">
          <button 
            onClick={() => setView(ViewState.HOME)}
            className={`flex-1 flex flex-col items-center gap-1 py-1 ${view === ViewState.HOME ? 'text-rose-600' : 'text-slate-400'}`}
          >
            <Home size={22} strokeWidth={view === ViewState.HOME ? 2.5 : 2} />
            <span className="text-[10px] font-medium">首页</span>
          </button>
          
          <button 
             onClick={() => setView(ViewState.GUIDE_LIST)}
             className={`flex-1 flex flex-col items-center gap-1 py-1 ${view === ViewState.GUIDE_LIST ? 'text-rose-600' : 'text-slate-400'}`}
          >
            <BookOpen size={22} strokeWidth={view === ViewState.GUIDE_LIST ? 2.5 : 2} />
            <span className="text-[10px] font-medium">指南</span>
          </button>

          <button 
               onClick={() => setView(ViewState.TOOLS)}
               className="relative -top-5 bg-slate-900 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 border-slate-50 active:scale-95 transition"
             >
            <Hammer size={20} />
          </button>

          <button 
            onClick={() => setView(ViewState.PLAN)}
            className={`flex-1 flex flex-col items-center gap-1 py-1 ${view === ViewState.PLAN ? 'text-rose-600' : 'text-slate-400'}`}
          >
            <Map size={22} strokeWidth={view === ViewState.PLAN ? 2.5 : 2} />
            <span className="text-[10px] font-medium">预案</span>
          </button>

          <button 
            onClick={() => setView(ViewState.KIT)}
            className={`flex-1 flex flex-col items-center gap-1 py-1 ${view === ViewState.KIT ? 'text-rose-600' : 'text-slate-400'}`}
          >
            <Package size={22} strokeWidth={view === ViewState.KIT ? 2.5 : 2} />
            <span className="text-[10px] font-medium">物资</span>
          </button>
        </div>
      )}
    </div>
  );
}
