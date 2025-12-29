
import React from 'react';
import { FoodSpot } from '../types';
import { ICONS } from '../constants';

interface AdminApprovalProps {
  pendingSpots: FoodSpot[];
  onBack: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void; // Used for permanent deletion
}

const AdminApproval: React.FC<AdminApprovalProps> = ({ pendingSpots, onBack, onApprove, onReject }) => {
  return (
    <div className="h-full bg-[#FDF5E6] flex flex-col">
      <div className="p-4 bg-white flex items-center justify-between sticky top-0 z-10 border-b border-gray-100 shadow-sm">
        <button onClick={onBack} className="text-gray-400 p-2 bg-slate-50 rounded-lg active:scale-90">
          <ICONS.ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Pending Approvals</h2>
        <div className="bg-[#065F46] text-white text-[9px] font-black px-2.5 py-1 rounded-lg">
          {pendingSpots.length}
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto pb-24 scrollbar-hide">
        {pendingSpots.length > 0 ? pendingSpots.map((spot) => (
          <div key={spot.spotId} className="bg-white rounded-[24px] overflow-hidden shadow-md border border-gray-100 animate-in fade-in duration-300">
            <div className="h-32 relative">
              <img src={spot.images[0]} className="w-full h-full object-cover" alt={spot.name} />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[7px] font-black text-[#D97706] shadow-sm uppercase tracking-widest">
                Contribution
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-black text-gray-900 leading-tight mb-1">{spot.name}</h3>
              <p className="text-[8px] text-[#065F46] font-black uppercase tracking-widest mb-2">{spot.speciality} • {spot.area}</p>
              
              <div className="flex items-center space-x-2 text-[8px] text-gray-400 font-bold mb-4">
                <ICONS.Location className="w-2.5 h-2.5" />
                <span className="truncate">{spot.address}</span>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => onReject(spot.spotId)}
                  className="flex-1 bg-red-50 text-red-600 py-2.5 rounded-xl font-black text-[9px] active:scale-95 transition-all border border-red-100 uppercase tracking-widest"
                >
                  Delete
                </button>
                <button 
                  onClick={() => onApprove(spot.spotId)}
                  className="flex-[1.5] bg-[#065F46] text-white py-2.5 rounded-xl font-black text-[9px] shadow-md active:scale-95 transition-all uppercase tracking-widest"
                >
                  Approve Spot
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="py-20 flex flex-col items-center justify-center text-center opacity-40 grayscale">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <p className="mt-4 text-[10px] font-black uppercase tracking-widest">All caught up</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApproval;
