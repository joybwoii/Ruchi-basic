
import React, { useState } from 'react';
import { FoodSpot, FoodType } from '../types';
import { ICONS, RuchiLogo, KERALA_DISTRICTS } from '../constants';

interface HomeProps {
  spots: FoodSpot[];
  onSelectSpot: (id: string) => void;
  title?: string;
  location?: string;
  onLocationRequest?: () => void;
  onChangeLocation?: (loc: string) => void;
}

const Home: React.FC<HomeProps> = ({ 
  spots, 
  onSelectSpot, 
  title = "Discover gems near you", 
  location = "Ernakulam",
  onLocationRequest,
  onChangeLocation
}) => {
  const [filter, setFilter] = useState<FoodType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const filteredSpots = spots.filter(spot => {
    const matchesFilter = filter === 'All' || spot.foodTypes.includes(filter as FoodType);
    const matchesSearch = spot.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          spot.speciality.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      {/* Header */}
      <div className="p-5 bg-white/95 backdrop-blur-md sticky top-0 z-20 shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between mb-5">
           <div className="hover:scale-105 transition-transform duration-300">
             <RuchiLogo />
           </div>
           <button 
            onClick={() => setShowLocationPicker(true)}
            className="flex items-center space-x-2 text-[10px] font-black text-[#065F46] bg-[#065F46]/5 px-4 py-2 rounded-full border border-[#065F46]/10 active:scale-95 transition-all shadow-sm"
           >
             <ICONS.Location className={`w-3.5 h-3.5 ${location === 'Locating...' ? 'animate-bounce' : ''}`} />
             <span className="max-w-[120px] truncate uppercase tracking-widest">{location}</span>
             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-40"><path d="m6 9 6 6 6-6"/></svg>
           </button>
        </div>

        <div className="relative group">
          <input 
            type="text"
            placeholder="Search specialties or spots..."
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-sm focus:ring-4 focus:ring-[#065F46]/5 focus:border-[#065F46] outline-none transition-all placeholder:text-slate-400 text-slate-900 font-bold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#065F46] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="p-5 overflow-x-auto whitespace-nowrap scrollbar-hide flex space-x-3 bg-white/50 border-b border-gray-50">
        <button
          onClick={() => setFilter('All')}
          className={`px-6 py-3.5 rounded-2xl text-[9px] font-black transition-all border-2 uppercase tracking-widest ${
            filter === 'All' 
              ? 'bg-[#065F46] text-white border-[#065F46] shadow-xl translate-y-[-1px]' 
              : 'bg-white text-slate-500 border-slate-100 shadow-sm'
          }`}
        >
          All
        </button>
        {Object.values(FoodType).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-6 py-3.5 rounded-2xl text-[9px] font-black transition-all border-2 uppercase tracking-widest ${
              filter === type 
                ? 'bg-[#065F46] text-white border-[#065F46] shadow-xl translate-y-[-1px]' 
                : 'bg-white text-slate-500 border-slate-100 shadow-sm'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="px-5 pb-32 space-y-8 animate-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center justify-between mt-8 px-1">
            <h2 className="text-xl font-black text-[#0F172A] tracking-tight">{title}</h2>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-[#065F46]/20 to-transparent ml-4"></div>
        </div>

        {filteredSpots.length > 0 ? (
          filteredSpots.map((spot, index) => (
            <div 
              key={spot.spotId}
              onClick={() => onSelectSpot(spot.spotId)}
              className="bg-white rounded-[40px] overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100 active:scale-[0.98] transition-all duration-300 cursor-pointer group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-60 w-full relative overflow-hidden">
                <img 
                  src={spot.images[0]} 
                  alt={spot.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                />
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-xl px-4 py-2.5 rounded-3xl flex items-center space-x-2 shadow-2xl border border-white/50">
                  <ICONS.Star filled className="w-5 h-5" />
                  <div className="flex flex-col items-center leading-none">
                    <span className="text-sm font-black text-[#0F172A]">{spot.avgRating || 'New'}</span>
                    <span className="text-[7px] font-black uppercase text-[#D97706] tracking-tighter mt-0.5">Ruchi</span>
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 flex flex-wrap gap-2 max-w-[85%]">
                    {spot.foodTypes.map(t => (
                        <span key={t} className="text-[9px] font-black uppercase tracking-widest px-4 py-2 bg-black/40 backdrop-blur-xl text-white rounded-2xl border border-white/20 shadow-lg">{t}</span>
                    ))}
                </div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <h3 className="font-black text-[#0F172A] text-2xl leading-tight group-hover:text-[#065F46] transition-colors tracking-tight">{spot.name}</h3>
                    <div className="flex items-center gap-2 mt-3">
                        <span className="text-[10px] text-[#065F46] font-black uppercase tracking-widest bg-[#065F46]/5 px-4 py-1.5 rounded-xl border border-[#065F46]/10">{spot.speciality}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">at {spot.area}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-slate-500 mt-5 line-clamp-2 leading-relaxed font-bold opacity-80">{spot.description}</p>

                <div className="flex items-center mt-8 pt-8 border-t border-slate-50 justify-between">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-9 h-9 rounded-2xl border-4 border-white overflow-hidden shadow-lg">
                        <img src={`https://picsum.photos/seed/${spot.spotId+i*17}/100`} alt="visitor" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="w-9 h-9 rounded-2xl border-4 border-white bg-slate-100 flex items-center justify-center shadow-lg">
                      <span className="text-[9px] font-black text-slate-500">+{spot.reviewCount}</span>
                    </div>
                  </div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#065F46] rounded-full animate-pulse"></div>
                    <span className="text-[#065F46]">{spot.viewsCount}</span> EXP
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center px-8">
            <div className="w-24 h-24 bg-white border-4 border-dashed border-slate-100 rounded-[40px] flex items-center justify-center mb-8 shadow-inner animate-in fade-in zoom-in">
              <ICONS.Location className="w-10 h-10 text-slate-200" />
            </div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-300">Quiet in {location}</p>
            <p className="text-[11px] font-bold text-slate-400 mt-4 uppercase tracking-widest leading-relaxed">No spots discovered in this district yet. Be the first to share one!</p>
          </div>
        )}
      </div>

      {/* Location Selection Drawer */}
      {showLocationPicker && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[420px] rounded-[56px] p-10 animate-in slide-in-from-bottom duration-500 mb-2 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center mb-8 px-2">
              <h3 className="text-2xl font-black text-[#0F172A] tracking-tight">Select District</h3>
              <button onClick={() => setShowLocationPicker(false)} className="text-slate-300 p-3 bg-slate-50 rounded-2xl active:scale-90 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <button 
                onClick={() => { onLocationRequest?.(); setShowLocationPicker(false); }}
                className="w-full bg-[#065F46] text-white py-6 rounded-[32px] font-black text-sm shadow-2xl shadow-[#065F46]/20 active:scale-95 transition-all flex items-center justify-center space-x-3 mb-8 ring-4 ring-[#065F46]/5"
            >
                <ICONS.Location className="w-5 h-5 animate-pulse" />
                <span className="tracking-[0.2em] uppercase">Use Live Location</span>
            </button>

            <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
                <div className="grid grid-cols-2 gap-4 pb-6">
                    {KERALA_DISTRICTS.map(loc => (
                        <button 
                            key={loc}
                            onClick={() => { onChangeLocation?.(loc); setShowLocationPicker(false); }}
                            className={`p-5 rounded-[28px] border-2 text-[10px] font-black transition-all text-center uppercase tracking-widest ${location === loc ? 'bg-[#065F46] border-[#065F46] text-white shadow-xl scale-105' : 'bg-slate-50 border-slate-50 text-slate-500 hover:border-slate-200'}`}
                        >
                            {loc}
                        </button>
                    ))}
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
