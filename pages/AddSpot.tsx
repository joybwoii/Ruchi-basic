
import React, { useState, useRef } from 'react';
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
    mapLink: '',
    foodTypes: [] as FoodType[],
  });
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    (Array.from(files) as File[]).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setImages(prev => [...prev, reader.result as string].slice(0, 5));
      reader.readAsDataURL(file);
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.speciality && formData.foodTypes.length > 0 && formData.area) {
      onSubmit({
        ...formData,
        location: { lat: 10.8505, lng: 76.2711 }, 
        images: images.length > 0 ? images : [],
        addedBy: userId
      });
    } else {
      alert("Fill all fields.");
    }
  };

  return (
    <div className="h-full bg-white flex flex-col animate-in fade-in duration-500">
      <div className="p-3 bg-white/95 backdrop-blur-md flex items-center justify-between sticky top-0 z-10 border-b border-slate-100 shadow-sm">
        <button onClick={onBack} className="text-slate-400 p-1.5 bg-slate-50 rounded-lg active:scale-90 transition-all">
          <ICONS.ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">New Spot</h2>
        <div className="w-8" />
      </div>

      <form onSubmit={handleFormSubmit} className="p-4 space-y-5 flex-1 overflow-y-auto pb-24 scrollbar-hide">
        {/* Images - Compact */}
        <div className="space-y-2">
          <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest px-1">Evidence ({images.length}/5)</label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleFileChange} />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="shrink-0 w-16 h-16 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-[#065F46] active:scale-95">
              <ICONS.Add className="w-4 h-4" />
            </button>
            {images.map((img, i) => (
              <div key={i} className="shrink-0 w-16 h-16 relative">
                <img src={img} className="w-full h-full object-cover rounded-xl border border-slate-100" />
                <button type="button" onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute -top-1 -right-1 w-4 h-4 bg-white text-red-500 rounded-full shadow-md flex items-center justify-center border border-red-50"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
              </div>
            ))}
          </div>
        </div>

        {/* Inputs - Compact */}
        <div className="space-y-3 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
          <div className="grid grid-cols-1 gap-2">
            <select required className="bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-[10px] font-black" value={formData.district} onChange={e => setFormData(p => ({...p, district: e.target.value}))}>
              {KERALA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <input required className="bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-[10px] font-bold uppercase" placeholder="Local Area" value={formData.area} onChange={e => setFormData(p => ({...p, area: e.target.value}))} />
            <input required className="bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-[10px] font-black" placeholder="Shop Name" value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} />
            <input required className="bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-[10px] font-bold" placeholder="Speciality" value={formData.speciality} onChange={e => setFormData(p => ({...p, speciality: e.target.value}))} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest px-1">Category</label>
          <div className="flex flex-wrap gap-1.5">
            {Object.values(FoodType).map(type => (
              <button key={type} type="button" onClick={() => setFormData(p => ({...p, foodTypes: p.foodTypes.includes(type) ? p.foodTypes.filter(t => t !== type) : [...p.foodTypes, type]}))} className={`px-2.5 py-1 rounded-md text-[7px] font-black transition-all border uppercase tracking-widest ${formData.foodTypes.includes(type) ? 'bg-[#065F46] text-white border-[#065F46]' : 'bg-white text-slate-400 border-slate-100'}`}>
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <textarea rows={2} className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-[10px] font-medium resize-none" placeholder="Description..." value={formData.description} onChange={e => setFormData(p => ({...p, description: e.target.value}))} />
          <input required className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-[10px] font-medium" placeholder="Full Address" value={formData.address} onChange={e => setFormData(p => ({...p, address: e.target.value}))} />
        </div>

        <button type="submit" className="w-full bg-[#065F46] text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-lg">Submit Spot</button>
      </form>
    </div>
  );
};

export default AddSpot;
