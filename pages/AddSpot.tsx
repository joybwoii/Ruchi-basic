
import React, { useState } from 'react';
import { FoodSpot, FoodType } from '../types';
import { ICONS, COLORS, KERALA_DISTRICTS } from '../constants';

interface AddSpotProps {
  onBack: () => void;
  onSubmit: (spot: Omit<FoodSpot, 'spotId' | 'isApproved' | 'viewsCount' | 'likesCount' | 'avgRating' | 'reviewCount' | 'createdAt'>) => void;
  userId: string;
}

const AddSpot: React.FC<AddSpotProps> = ({ onBack, onSubmit, userId }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    speciality: '',
    address: '',
    district: KERALA_DISTRICTS[0],
    area: '',
    foodTypes: [] as FoodType[],
  });
  const [images, setImages] = useState<string[]>([]);

  const handleAddImage = () => {
    const nextId = Math.floor(Math.random() * 1000);
    const newImg = `https://images.unsplash.com/photo-${1504674900247 + nextId}-08c7d5000460?auto=format&fit=crop&w=800&q=80`;
    setImages([...images, newImg]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const toggleFoodType = (type: FoodType) => {
    setFormData(prev => ({
      ...prev,
      foodTypes: prev.foodTypes.includes(type) 
        ? prev.foodTypes.filter(t => t !== type)
        : [...prev.foodTypes, type]
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.speciality && formData.foodTypes.length > 0 && formData.area) {
      onSubmit({
        ...formData,
        location: { lat: 10.8505, lng: 76.2711 }, // Mock Kerala Center
        images: images.length > 0 ? images : [`https://source.unsplash.com/featured/?kerala,food,${formData.speciality}`],
        addedBy: userId
      });
    } else {
      alert("Please fill all mandatory fields including specific area.");
    }
  };

  return (
    <div className="h-full bg-white flex flex-col animate-in fade-in duration-500">
      <div className="p-6 bg-white/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-10 border-b border-slate-100">
        <button onClick={onBack} className="text-slate-300 p-2 bg-slate-50 rounded-2xl active:scale-90 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest">Contribute Spot</h2>
        <div className="w-12" />
      </div>

      <form onSubmit={handleFormSubmit} className="p-8 space-y-12 flex-1 overflow-y-auto pb-40 scrollbar-hide">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Gallery</label>
            <span className="text-[10px] font-black text-[#065F46] uppercase tracking-widest">{images.length}/5</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
            <button 
              type="button"
              onClick={handleAddImage}
              className="flex-shrink-0 w-36 h-36 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center justify-center text-[#065F46] hover:bg-[#065F46]/5 transition-all group shadow-sm active:scale-95"
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Add Photo</span>
            </button>
            {images.map((img, i) => (
              <div key={i} className="flex-shrink-0 w-36 h-36 relative group animate-in zoom-in duration-300">
                <img src={img} className="w-full h-full object-cover rounded-[40px] shadow-2xl border-2 border-white" alt="preview" />
                <button 
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 w-9 h-9 bg-white text-red-500 rounded-2xl shadow-xl flex items-center justify-center border-2 border-red-50 active:scale-75 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-10">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] px-2">District</label>
                    <select 
                        required
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-5 px-6 text-xs font-black text-slate-900 focus:ring-4 focus:ring-[#065F46]/5 focus:border-[#065F46] outline-none shadow-sm transition-all appearance-none uppercase tracking-widest"
                        value={formData.district}
                        onChange={e => setFormData(prev => ({ ...prev, district: e.target.value }))}
                    >
                        {KERALA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                <div className="space-y-4">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] px-2">Local Area</label>
                    <input 
                        type="text"
                        required
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-5 px-6 text-xs font-black text-slate-900 focus:ring-4 focus:ring-[#065F46]/5 focus:border-[#065F46] outline-none shadow-sm placeholder:opacity-30 transition-all uppercase tracking-widest"
                        placeholder="e.g. Fort Kochi"
                        value={formData.area}
                        onChange={e => setFormData(prev => ({ ...prev, area: e.target.value }))}
                    />
                </div>
            </div>

            <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] px-2">Spot Name</label>
            <input 
                type="text"
                required
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-5 px-6 text-sm font-black text-slate-900 focus:ring-4 focus:ring-[#065F46]/5 focus:border-[#065F46] outline-none shadow-sm placeholder:opacity-30 transition-all"
                placeholder="The name of the eatery"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
            </div>

            <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] px-2">Must-Try Speciality</label>
            <input 
                type="text"
                required
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-5 px-6 text-sm font-black text-slate-900 focus:ring-4 focus:ring-[#065F46]/5 focus:border-[#065F46] outline-none shadow-sm placeholder:opacity-30 transition-all"
                placeholder="e.g. Chemmeen Roast"
                value={formData.speciality}
                onChange={e => setFormData(prev => ({ ...prev, speciality: e.target.value }))}
            />
            </div>

            <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] px-2">Vibe & Category</label>
            <div className="flex flex-wrap gap-3">
                {Object.values(FoodType).map(type => (
                <button
                    key={type}
                    type="button"
                    onClick={() => toggleFoodType(type)}
                    className={`px-6 py-4 rounded-[24px] text-[10px] font-black transition-all border-2 uppercase tracking-widest ${
                    formData.foodTypes.includes(type)
                        ? 'bg-[#065F46] text-white border-[#065F46] shadow-xl translate-y-[-2px]'
                        : 'bg-slate-50 text-slate-400 border-slate-50'
                    }`}
                >
                    {type}
                </button>
                ))}
            </div>
            </div>

            <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] px-2">Taste Story</label>
            <textarea 
                rows={4}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-[40px] py-6 px-8 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-[#065F46]/5 focus:border-[#065F46] outline-none shadow-sm placeholder:opacity-30 resize-none transition-all leading-relaxed"
                placeholder="Share your culinary findings..."
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
            </div>

            <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] px-2">Full Address</label>
            <input 
                type="text"
                required
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-5 px-6 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-[#065F46]/5 focus:border-[#065F46] outline-none shadow-sm placeholder:opacity-30 transition-all"
                placeholder="House name, Street, Landmark"
                value={formData.address}
                onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
            />
            </div>
        </div>

        <div className="pt-8">
          <div className="bg-[#065F46]/5 p-8 rounded-[48px] border-2 border-[#065F46]/10 mb-12 flex items-center space-x-6 animate-pulse">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-[#065F46] shadow-xl shadow-[#065F46]/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            </div>
            <div className="flex-1">
                <p className="text-[11px] font-black text-[#065F46] uppercase tracking-[0.2em] mb-1">Explorer Bonus</p>
                <p className="text-[12px] text-slate-500 font-bold leading-relaxed">Verified spots grant <span className="text-[#065F46] font-black">+75 Points</span> and a <span className="text-[#065F46] font-black">Contributor Badge</span>!</p>
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full bg-[#065F46] text-white py-7 rounded-[40px] font-black text-lg shadow-2xl shadow-[#065F46]/30 active:scale-95 transition-all uppercase tracking-[0.3em] ring-8 ring-[#065F46]/5"
          >
            Submit for Verification
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSpot;
