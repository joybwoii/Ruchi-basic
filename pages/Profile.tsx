
import React, { useState } from 'react';
import { User, FoodSpot, Review, SocialLink } from '../types';
import { ICONS, COLORS, LEVEL_THRESHOLDS } from '../constants';

interface ProfileProps {
  user: User;
  spots: FoodSpot[];
  reviews: Review[];
  onNavigateAdmin: () => void;
  onAddSpot: () => void;
  onUpdateProfile: (updates: Partial<User>) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, spots, reviews, onNavigateAdmin, onAddSpot, onUpdateProfile, onLogout }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit form state
  const [editName, setEditName] = useState(user.name);
  const [editImage, setEditImage] = useState(user.profileImage);
  const [socials, setSocials] = useState<SocialLink[]>(user.socialLinks || []);

  const currentLevelIndex = LEVEL_THRESHOLDS.findIndex(l => l.level === user.guideLevel);
  const nextLevel = currentLevelIndex > 0 ? LEVEL_THRESHOLDS[currentLevelIndex - 1] : null;
  const progressPercent = nextLevel 
    ? (user.ruchiPoints / nextLevel.points) * 100 
    : 100;

  const handleSaveProfile = () => {
    onUpdateProfile({
      name: editName,
      profileImage: editImage,
      socialLinks: socials
    });
    setIsEditing(false);
  };

  const addSocial = () => {
    setSocials([...socials, { platform: 'Instagram', url: '' }]);
  };

  return (
    <div className="h-full bg-white flex flex-col scrollbar-hide">
      <div className="p-8 pb-14 bg-[#065F46] rounded-b-[50px] relative shadow-xl">
        <div className="flex justify-between items-start mb-10">
          <div className="flex items-center space-x-5">
            <div className="relative group">
              <img src={user.profileImage} alt={user.name} className="w-20 h-20 rounded-[30px] border-4 border-white/20 shadow-2xl object-cover" />
              <button 
                onClick={() => setIsEditing(true)}
                className="absolute -bottom-1 -right-1 bg-[#D97706] w-7 h-7 rounded-xl border-2 border-white flex items-center justify-center shadow-lg active:scale-90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
              </button>
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-black tracking-tight">{user.name}</h1>
              <p className="text-xs text-white/60 font-black uppercase tracking-widest mt-1">{user.guideLevel}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowSettings(true)}
              className="bg-white/10 backdrop-blur-xl p-3 rounded-2xl text-white border border-white/10 active:scale-90 transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[35px] p-7 shadow-2xl absolute -bottom-20 left-6 right-6 z-10 border border-gray-50">
          <div className="flex justify-between items-center mb-5">
            <div>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Rank</p>
              <h3 className="text-lg font-black text-[#065F46] uppercase tracking-tighter">{user.guideLevel}</h3>
            </div>
            <div className="bg-[#D97706] w-14 h-14 rounded-[20px] flex flex-col items-center justify-center shadow-xl shadow-[#D97706]/30 rotate-2">
              <span className="text-sm font-black leading-none text-white">{user.ruchiPoints}</span>
              <span className="text-[7px] font-black uppercase tracking-tighter mt-1 text-white">Points</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="h-2.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
              <div 
                className="h-full bg-[#065F46] rounded-full transition-all duration-1000" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {nextLevel && (
              <p className="text-[9px] text-gray-400 text-center font-bold uppercase tracking-widest">
                <span className="text-[#065F46]">{nextLevel.points - user.ruchiPoints} pts</span> to {nextLevel.level}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-28 px-6 flex-1 overflow-y-auto pb-32">
        <button 
            onClick={onAddSpot}
            className="w-full bg-[#FDF5E6] border-2 border-dashed border-[#065F46]/30 p-6 rounded-[30px] flex items-center justify-between group active:scale-[0.98] transition-all mb-8"
        >
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#065F46] shadow-sm group-hover:bg-[#065F46] group-hover:text-white transition-colors">
                    <ICONS.Add />
                </div>
                <div className="text-left">
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">Found a Gem?</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Share it and earn +50 Points</p>
                </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#065F46] opacity-30"><path d="m9 18 6-6-6-6"/></svg>
        </button>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-gray-50/50 p-5 rounded-[30px] border border-gray-100 text-center">
            <p className="text-2xl font-black text-gray-900">{spots.length}</p>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Shared</p>
          </div>
          <div className="bg-gray-50/50 p-5 rounded-[30px] border border-gray-100 text-center">
            <p className="text-2xl font-black text-gray-900">{reviews.length}</p>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Reviews</p>
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Your Contribution Journey</h2>
            </div>
            <div className="space-y-4">
              {spots.length > 0 ? spots.map(spot => (
                <div key={spot.spotId} className="flex items-center space-x-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                  <img src={spot.images[0]} className="w-16 h-16 rounded-[18px] object-cover" alt={spot.name} />
                  <div className="flex-1">
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-tight">{spot.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold">{spot.address}</p>
                    <div className="mt-2">
                       <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${spot.isApproved ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                        {spot.isApproved ? 'Active' : 'Pending Verification'}
                       </span>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-center py-12 text-xs text-gray-300 font-bold uppercase tracking-widest border-2 border-dashed border-gray-50 rounded-[40px] px-8">
                  Your journey starts here. <br/> Add a local food spot to begin.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[48px] p-8 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-xl font-black mb-6 text-[#0F172A] uppercase tracking-tight">Update Details</h3>
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Display Name</label>
                <input 
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none focus:border-[#065F46] transition-all"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Profile Photo URL</label>
                <input 
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none focus:border-[#065F46] transition-all"
                  value={editImage}
                  onChange={e => setEditImage(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Connect Channels</label>
                <div className="space-y-3 max-h-40 overflow-y-auto scrollbar-hide">
                  {socials.map((s, i) => (
                    <div key={i} className="flex gap-2">
                      <select 
                        className="bg-gray-100 rounded-xl p-2 text-xs font-bold text-slate-900 border-none outline-none"
                        value={s.platform}
                        onChange={e => {
                          const next = [...socials];
                          next[i].platform = e.target.value as any;
                          setSocials(next);
                        }}
                      >
                        <option>Instagram</option>
                        <option>Facebook</option>
                        <option>Website</option>
                      </select>
                      <input 
                        className="flex-1 bg-gray-100 rounded-xl p-2 text-xs text-slate-900 outline-none"
                        placeholder="Link or username"
                        value={s.url}
                        onChange={e => {
                          const next = [...socials];
                          next[i].url = e.target.value;
                          setSocials(next);
                        }}
                      />
                    </div>
                  ))}
                  <button onClick={addSocial} className="text-[#065F46] text-xs font-black flex items-center gap-1 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    ADD SOCIAL LINK
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-10 flex gap-3">
              <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-100 py-4 rounded-2xl font-black text-xs uppercase tracking-widest">Cancel</button>
              <button onClick={handleSaveProfile} className="flex-1 bg-[#065F46] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[420px] rounded-[48px] p-10 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-[#0F172A] tracking-tight uppercase tracking-widest">Ruchi Settings</h3>
              <button onClick={() => setShowSettings(false)} className="text-slate-300 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {user.isAdmin && (
                <button onClick={() => { onNavigateAdmin(); setShowSettings(false); }} className="w-full flex items-center justify-between p-6 bg-slate-50 rounded-[24px] group border-2 border-transparent hover:border-[#065F46]/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#065F46] shadow-sm">
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                    </div>
                    <div className="text-left">
                      <p className="font-black text-sm uppercase tracking-tight">Admin Console</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Approve new spots</p>
                    </div>
                  </div>
                </button>
              )}

              <button className="w-full flex items-center justify-between p-6 bg-slate-50 rounded-[24px] group border-2 border-transparent hover:border-[#065F46]/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#065F46] shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z"/><path d="m22 9-10 7L2 9"/></svg>
                  </div>
                  <div className="text-left">
                    <p className="font-black text-sm uppercase tracking-tight">Contact Support</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Help with your account</p>
                  </div>
                </div>
              </button>

              <button 
                onClick={onLogout}
                className="w-full flex items-center justify-between p-6 bg-red-50/50 rounded-[24px] group border border-red-100 active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                  </div>
                  <div className="text-left">
                    <p className="font-black text-sm text-red-600 uppercase tracking-tight">Sign Out</p>
                    <p className="text-[10px] text-red-400 font-bold uppercase">End session</p>
                  </div>
                </div>
              </button>
            </div>
            
            <p className="text-center mt-12 text-[9px] font-black text-gray-300 uppercase tracking-[0.5em]">Ruchi Spots v1.5.0</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
