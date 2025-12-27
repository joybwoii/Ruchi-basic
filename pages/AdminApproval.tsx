
import React from 'react';
import { FoodSpot } from '../types';
import { ICONS, COLORS } from '../constants';

interface AdminApprovalProps {
  pendingSpots: FoodSpot[];
  onBack: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const AdminApproval: React.FC<AdminApprovalProps> = ({ pendingSpots, onBack, onApprove, onReject }) => {
  return (
    <div className="h-full bg-[#FDF5E6] flex flex-col">
      <div className="p-6 bg-white flex items-center justify-between sticky top-0 z-10 border-b border-gray-100">
        <button onClick={onBack} className="text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h2 className="text-lg font-bold text-gray-800">Admin Approval</h2>
        <div className="bg-[#228B22] text-white text-[10px] font-bold px-2 py-1 rounded-lg">
          {pendingSpots.length}
        </div>
      </div>

      <div className="p-6 space-y-6 flex-1 overflow-y-auto pb-32">
        {pendingSpots.length > 0 ? pendingSpots.map((spot) => (
          <div key={spot.spotId} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <div className="h-48 relative">
              <img src={spot.images[0]} className="w-full h-full object-cover" alt={spot.name} />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-gray-600 shadow-sm uppercase tracking-widest">
                Pending Approval
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900">{spot.name}</h3>
              <p className="text-[10px] text-[#228B22] font-bold uppercase tracking-wider mb-2">{spot.speciality}</p>
              <p className="text-xs text-gray-500 line-clamp-2 mb-4 font-light leading-relaxed">{spot.description}</p>
              
              <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-bold mb-6">
                <ICONS.Location />
                <span>{spot.address}</span>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => onReject(spot.spotId)}
                  className="flex-1 bg-red-50 text-red-500 py-4 rounded-2xl font-bold text-xs active:scale-95 transition-all border border-red-100"
                >
                  Reject
                </button>
                <button 
                  onClick={() => onApprove(spot.spotId)}
                  className="flex-[2] bg-[#228B22] text-white py-4 rounded-2xl font-bold text-xs shadow-lg shadow-[#228B22]/10 active:scale-95 transition-all"
                >
                  Approve & Give Points
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="py-20 flex flex-col items-center justify-center opacity-40">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <p className="mt-4 text-sm font-medium">All caught up! No pending spots.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApproval;
