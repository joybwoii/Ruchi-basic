
import React, { useState } from 'react';
// Fixed: relative imports corrected for root file
import { FoodSpot, FoodType } from './types';
import { ICONS, RuchiLogo } from './constants';

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
  location = "Kochi",
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

  const popularLocations = ['Kochi', 'Kozhikode', 'Alappuzha', 'Trivandrum', 'Munnar'];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-5 bg-white sticky top-0 z-20 shadow-md border-b border-gray-200">
        <div className="flex items-center justify-between mb-5">
           <div className="flex items-center space-x-2">
             {/* Use RuchiLogo component instead of missing LOGO_URL export */}
             <RuchiLogo />
           </div>
           <button 
            onClick={() => setShowLocationPicker(true)}
            className="flex items-center space-x-2 text-xs font-black text-[#065F46] bg-green-50 px-4 py-2.5 rounded-full border border-green-200 active:scale-95 transition-transform"
           >
             <ICONS.Location className="w-4 h-4" />
             <span className="max-w-[120px] truncate">{location}</span>
             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-60"><path d="m6 9 6 6 6-6"/></svg>
           </button>
        </div>

        <div className="relative">
          <input 
            type="text"
            placeholder="Search specialties or spots..."
            className="w-full bg-white border-2 border-gray-200 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-[#065F46] focus:border-[#065F46] outline-none transition-all placeholder:text-gray-500 text-[#0F172A] font-bold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-5 overflow-x-auto whitespace-nowrap scrollbar-hide flex space-x-3 bg-[#FDF5E6]/40">
        {['All', FoodType.VEG, FoodType.NON_VEG, FoodType.SEAFOOD].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type as any)}
            className={`px-6 py-3.5 rounded-2xl text-xs font-black transition-all border-2 ${
              filter === type 
                ? 'bg-[#065F46] text-white border-[#065F46] shadow-xl translate-y-[-2px]' 
                : 'bg-white text-[#334155] border-gray-200 shadow-sm'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="px-5 pb-32 space-y-8">
        <h2 className="text-xl font-black text-[#0F172A] tracking-tight mt-6">{title}</h2>

        {filteredSpots.length > 0 ? (
          filteredSpots.map((spot) => (
            <div 
              key={spot.spotId}
              onClick={() => onSelectSpot(spot.spotId)}
              className="bg-white rounded-[40px] overflow-hidden shadow-xl border border-gray-100 active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="h-56 w-full relative overflow-hidden">
                <img 
                  src={spot.images[0]} 
                  alt={spot.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl flex items-center space-x-1.5 shadow-2xl border border-white/50">
                  <ICONS.Star filled className="w-5 h-5" />
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-black text-[#0F172A]">{spot.avgRating}</span>
                    <span className="text-[7px] font-black uppercase text-[#D97706] tracking-tighter">Ruchi</span>
                  </div>
                </div>
                <div className="absolute bottom-5 left-5 flex gap-2">
                    {spot.foodTypes.map(t => (
                        <span key={t} className="text-[10px] font-black uppercase tracking-widest px-3 py-2 bg-black/60 backdrop-blur-md text-white rounded-xl border border-white/20 shadow-lg">{t}</span>
                    ))}
                </div>
              </div>
              <div className="p-7">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <h3 className="font-black text-[#0F172A] text-xl leading-tight group-hover:text-[#065F46] transition-colors">{spot.name}</h3>
                    <p className="text-[11px] text-[#065F46] font-black uppercase mt-2 tracking-widest bg-green-50 w-fit px-3 py-1 rounded-lg border border-green-100">{spot.speciality}</p>
                  </div>
                  <div className="flex items-center space-x-1.5 text-[#334155] bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                    <ICONS.Location className="w-4 h-4 text-[#065F46]" />
                    <span className="text-[11px] font-black">1.2 km</span>
                  </div>
                </div>
                
                <p className="text-sm text-[#334155] mt-4 line-clamp-2 leading-relaxed font-bold opacity-90">{spot.description}</p>

                <div className="flex items-center mt-6 pt-6 border-t-2 border-gray-50 justify-between">
                  <div className="flex -space-x-4">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-4 border-white overflow-hidden shadow-md">
                        <img src={`https://picsum.photos/seed/${spot.spotId+i*13}/100`} alt="visitor" />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center shadow-md">
                      <span className="text-[10px] font-black text-[#334155]">+{spot.reviewCount}</span>
                    </div>
                  </div>
                  <div className="text-[11px] font-black text-[#64748B] uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    <span className="text-[#065F46] font-black">{spot.viewsCount}</span> Views
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 flex flex-col items-center justify-center text-center opacity-60">
            <div className="w-24 h-24 bg-white border-4 border-dashed border-gray-200 rounded-full flex items-center justify-center mb-8 shadow-sm">
              <ICONS.Location className="w-12 h-12 text-gray-300" />
            </div>
            <p className="text-lg font-black uppercase tracking-widest text-[#0F172A]">No spots here yet</p>
            <p className="text-sm font-bold text-[#64748B] mt-3">Try a different location or filter</p>
          </div>
        )}
      </div>

      {/* Location Selection Drawer */}
      {showLocationPicker && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[420px] rounded-[48px] p-10 animate-in slide-in-from-bottom duration-300 mb-2 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-[#0F172A] tracking-tight">Select Location</h3>
              <button onClick={() => setShowLocationPicker(false)} className="text-slate-400 p-2 active:scale-90 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <button 
                onClick={() => { onLocationRequest?.(); setShowLocationPicker(false); }}
                className="w-full bg-[#065F46] text-white py-6 rounded-[32px] font-black text-base shadow-2xl shadow-[#065F46]/30 active:scale-95 transition-all flex items-center justify-center space-x-4 mb-10"
            >
                <ICONS.Location className="w-6 h-6" />
                <span className="tracking-widest uppercase">USE GPS LOCATION</span>
            </button>

            <div className="space-y-6">
                <p className="text-xs font-black text-[#64748B] uppercase tracking-[0.2em] px-2 text-center">Or Pick a City</p>
                <div className="grid grid-cols-2 gap-4">
                    {popularLocations.map(loc => (
                        <button 
                            key={loc}
                            onClick={() => { onChangeLocation?.(loc); setShowLocationPicker(false); }}
                            className={`p-5 rounded-[28px] border-2 text-sm font-black transition-all text-center ${location === loc ? 'bg-green-50 border-[#065F46] text-[#065F46] shadow-md' : 'bg-white border-slate-100 text-[#334155] hover:border-slate-300'}`}
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
