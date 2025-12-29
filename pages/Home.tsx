
import React, { useState } from 'react';
import { FoodSpot, FoodType } from '../types';
import { ICONS, RuchiLogo, KERALA_DISTRICTS } from '../constants';
import { GoogleGenAI } from "@google/genai";

interface HomeProps {
  spots: FoodSpot[];
  onSelectSpot: (id: string) => void;
  title?: string;
  location?: string;
  onLocationRequest?: () => void;
  onChangeLocation?: (loc: string) => void;
  onOpenChat: () => void;
}

const Home: React.FC<HomeProps> = ({ 
  spots, 
  onSelectSpot, 
  title = "Discover local gems", 
  location = "Ernakulam",
  onLocationRequest,
  onChangeLocation,
  onOpenChat
}) => {
  const [filter, setFilter] = useState<FoodType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [isSearchingMaps, setIsSearchingMaps] = useState(false);

  const filteredSpots = spots.filter(spot => {
    const matchesFilter = filter === 'All' || spot.foodTypes.includes(filter as FoodType);
    const search = searchQuery.toLowerCase();
    const matchesSearch = 
      spot.name.toLowerCase().includes(search) || 
      spot.speciality.toLowerCase().includes(search) ||
      spot.area.toLowerCase().includes(search);
    return matchesFilter && matchesSearch;
  });

  const searchWithMaps = async () => {
    if (!searchQuery) return;
    setIsSearchingMaps(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Find authentic food spots matching "${searchQuery}" in ${location}, Kerala. Prioritize small local eateries.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleMaps: {} }],
        },
      });
      console.log('Maps result:', response.text);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearchingMaps(false);
    }
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      {/* Header - More compact */}
      <div className="p-3 bg-white/95 backdrop-blur-md sticky top-0 z-20 shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
           <div className="scale-90 origin-left">
             <RuchiLogo />
           </div>
           <button 
            onClick={() => setShowLocationPicker(true)}
            className="flex items-center space-x-1.5 text-[8px] font-black text-[#065F46] bg-[#065F46]/5 px-2.5 py-1.5 rounded-full border border-[#065F46]/10 active:scale-95 transition-all shadow-sm"
           >
             <ICONS.Location className={`w-3 h-3 ${location === 'Locating...' ? 'animate-bounce' : ''}`} />
             <span className="max-w-[80px] truncate uppercase tracking-widest">{location}</span>
             <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="opacity-40"><path d="m6 9 6 6 6-6"/></svg>
           </button>
        </div>

        <div className="relative group">
          <input 
            type="text"
            placeholder="Search food or shops..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-4 text-xs focus:border-[#065F46] outline-none transition-all placeholder:text-slate-400 text-slate-900 font-bold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            onClick={searchWithMaps}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#065F46] p-1.5 bg-white rounded-md shadow-sm border border-slate-100 active:scale-90 transition-transform"
          >
            {isSearchingMaps ? (
              <div className="w-3.5 h-3.5 border-2 border-[#065F46] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* Categories - Compact */}
      <div className="p-2 overflow-x-auto whitespace-nowrap scrollbar-hide flex space-x-2 bg-white/50 border-b border-gray-50">
        <button
          onClick={() => setFilter('All')}
          className={`px-3 py-1.5 rounded-lg text-[7px] font-black transition-all border uppercase tracking-widest ${
            filter === 'All' 
              ? 'bg-[#065F46] text-white border-[#065F46]' 
              : 'bg-white text-slate-500 border-slate-100'
          }`}
        >
          All
        </button>
        {Object.values(FoodType).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1.5 rounded-lg text-[7px] font-black transition-all border uppercase tracking-widest ${
              filter === type 
                ? 'bg-[#065F46] text-white border-[#065F46]' 
                : 'bg-white text-slate-500 border-slate-100'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="px-3 pb-24 space-y-4 animate-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center justify-between mt-4 px-1">
            <h2 className="text-xs font-black text-[#0F172A] tracking-tight uppercase">{title}</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#065F46]/20 to-transparent ml-3"></div>
        </div>

        {filteredSpots.length > 0 ? (
          filteredSpots.map((spot, index) => (
            <div 
              key={spot.spotId}
              onClick={() => onSelectSpot(spot.spotId)}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 active:scale-[0.98] transition-all cursor-pointer group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="h-32 w-full relative overflow-hidden">
                <img src={spot.images[0]} alt={spot.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-white/95 px-1.5 py-0.5 rounded-md flex items-center space-x-1 shadow-md">
                  <ICONS.Star filled className="w-2.5 h-2.5" />
                  <span className="text-[9px] font-black text-[#0F172A]">{spot.avgRating || 'New'}</span>
                </div>
                <div className="absolute bottom-2 right-2">
                  <div className="bg-[#065F46] text-white px-2 py-0.5 rounded-md text-[6px] font-black uppercase tracking-widest shadow-md">
                    {spot.area}
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-black text-[#0F172A] text-xs leading-tight">{spot.name}</h3>
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[6px] text-[#065F46] font-black uppercase tracking-widest bg-[#065F46]/5 px-1.5 py-0.5 rounded border border-[#065F46]/10">{spot.speciality}</span>
                </div>
                <p className="text-[9px] text-slate-500 mt-2 line-clamp-2 leading-relaxed font-bold opacity-80">{spot.description}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 flex flex-col items-center justify-center text-center px-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 mx-1">
            <ICONS.Location className="w-6 h-6 text-slate-300" />
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-3">Nothing here yet</p>
            <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-relaxed">
              No spots found in <span className="text-[#065F46]">"{searchQuery || location}"</span>.
            </p>
          </div>
        )}
      </div>

      {/* Floating Chat Button - Compact */}
      <button 
        onClick={onOpenChat}
        className="fixed bottom-20 right-4 w-10 h-10 bg-[#065F46] text-white rounded-xl shadow-2xl flex items-center justify-center active:scale-90 transition-all z-40 border-2 border-white animate-bounce"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
      </button>

      {/* Location Picker */}
      {showLocationPicker && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[420px] rounded-3xl p-5 animate-in slide-in-from-bottom duration-500 mb-2 shadow-2xl flex flex-col max-h-[75vh]">
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="text-sm font-black text-[#0F172A] tracking-tight uppercase">Select District</h3>
              <button onClick={() => setShowLocationPicker(false)} className="text-slate-300 p-1.5 bg-slate-50 rounded-lg active:scale-75 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <button 
                onClick={() => { onLocationRequest?.(); setShowLocationPicker(false); }}
                className="w-full bg-[#065F46] text-white py-2.5 rounded-xl font-black text-[9px] shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-2 mb-4 uppercase tracking-widest"
            >
                <ICONS.Location className="w-3 h-3" />
                <span>Use GPS Search</span>
            </button>

            <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide">
                <div className="grid grid-cols-2 gap-2 pb-2">
                    {KERALA_DISTRICTS.map(loc => (
                        <button 
                            key={loc}
                            onClick={() => { onChangeLocation?.(loc); setShowLocationPicker(false); }}
                            className={`p-2.5 rounded-xl border text-[8px] font-black transition-all text-center uppercase tracking-widest ${location === loc ? 'bg-[#065F46] border-[#065F46] text-white' : 'bg-slate-50 border-slate-50 text-slate-500'}`}
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
