
import React, { useState } from 'react';
import { User, FoodSpot, Review, SocialLink } from '../types';
import { ICONS, COLORS, LEVEL_THRESHOLDS } from '../constants';

interface ProfileProps {
  user: User;
  spots: FoodSpot[];
  reviews: Review[];
  onAddSpot: () => void;
  onUpdateProfile: (updates: Partial<User>) => void;
  onLogout: () => void;
  onNavigateAdmin?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, spots, reviews, onAddSpot, onUpdateProfile, onLogout, onNavigateAdmin }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const currentLevelIndex = LEVEL_THRESHOLDS.findIndex(l => l.level === user.guideLevel);
  const nextLevel = currentLevelIndex > 0 ? LEVEL_THRESHOLDS[currentLevelIndex - 1] : null;
  const progressPercent = nextLevel ? (user.ruchiPoints / nextLevel.points) * 100 : 100;

  return (
    <div className="h-full bg-white flex flex-col scrollbar-hide">
      {/* Improved Header with better contrast */}
      <div className="p-6 pb-12 bg-[#065F46] rounded-b-[40px] relative shadow-lg">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img src={user.profileImage} alt={user.name} className="w-16 h-16 rounded-[24px] border-2 border-white/40 shadow-xl object-cover" />
            </div>
            <div className="text-white drop-shadow-md">
              <h1 className="text-xl font-black tracking-tight text-white">{user.name}</h1>
              <p className="text-[9px] text-white/80 font-black uppercase tracking-widest mt-0.5">{user.guideLevel}</p>
            </div>
          </div>
          <button 
            onClick={() => setShowSettings(true)}
            className="bg-white/10 backdrop-blur-xl p-2 rounded-xl text-white border border-white/20 active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
        </div>

        <div className="bg-white rounded-[24px] p-5 shadow-xl absolute -bottom-16 left-6 right-6 z-10 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Community Status</p>
              <h3 className="text-sm font-black text-[#065F46] uppercase tracking-tighter">{user.guideLevel}</h3>
            </div>
            <div className="bg-[#D97706] w-10 h-10 rounded-xl flex flex-col items-center justify-center shadow-lg rotate-2 text-white">
              <span className="text-[10px] font-black">{user.ruchiPoints}</span>
              <span className="text-[5px] font-black uppercase tracking-tighter">Pts</span>
            </div>
          </div>
          <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
            <div className="h-full bg-[#065F46] rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-20 px-6 flex-1 overflow-y-auto pb-32 scrollbar-hide">
        {/* Admin Dashboard Access */}
        {user.isAdmin && (
            <button 
                onClick={onNavigateAdmin}
                className="w-full bg-[#D97706] text-white p-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all mb-4 shadow-lg"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                <span className="text-[10px] font-black uppercase tracking-widest">Admin Approval Dashboard</span>
            </button>
        )}

        <button 
            onClick={onAddSpot}
            className="w-full bg-[#FDF5E6] border border-dashed border-[#065F46]/40 p-3.5 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all mb-6"
        >
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#065F46] shadow-sm">
                    <ICONS.Add className="w-4 h-4" />
                </div>
                <div className="text-left">
                    <h4 className="text-[10px] font-black text-gray-800 uppercase tracking-tight">Add a Spot</h4>
                    <p className="text-[7px] text-gray-400 font-bold uppercase tracking-widest">Share gems and earn points</p>
                </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#065F46] opacity-30"><path d="m9 18 6-6-6-6"/></svg>
        </button>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
            <p className="text-lg font-black text-gray-800">{spots.length}</p>
            <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Shared</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
            <p className="text-lg font-black text-gray-800">{reviews.length}</p>
            <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Reviews</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] px-1">Your Contributions</h2>
          <div className="space-y-2">
            {spots.length > 0 ? spots.map(spot => (
              <div key={spot.spotId} className="flex items-center space-x-3 bg-white p-2 rounded-xl border border-gray-100">
                <img src={spot.images[0]} className="w-10 h-10 rounded-lg object-cover" alt={spot.name} />
                <div className="flex-1">
                  <h4 className="text-[9px] font-black text-gray-800 uppercase">{spot.name}</h4>
                  <p className={`text-[7px] font-black uppercase ${spot.isApproved ? 'text-green-600' : 'text-orange-400'}`}>
                    {spot.isApproved ? 'Approved' : 'Pending Approval'}
                  </p>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">No contributions yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-end justify-center p-4">
          <div className="bg-white w-full max-w-[420px] rounded-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-black text-gray-800 uppercase tracking-widest">Settings</h3>
              <button onClick={() => setShowSettings(false)} className="text-gray-300 p-1.5 bg-slate-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <button 
                onClick={onLogout}
                className="w-full flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100 text-red-600 active:scale-[0.98] transition-all"
            >
                <span className="font-black text-[10px] uppercase tracking-widest">Log Out</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
