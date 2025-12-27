
import React from 'react';

export const COLORS = {
  LEAF_GREEN: '#065F46', // Emerald 800
  TURMERIC_YELLOW: '#D97706', // Amber 600
  CHILLI_RED: '#991B1B', // Red 800
  CREAM: '#FDF5E6',
  TEXT_BLACK: '#0F172A', // Slate 900
  TEXT_GRAY: '#334155', // Slate 700
  TEXT_LIGHT: '#64748B', // Slate 500
};

export const KERALA_DISTRICTS = [
  'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 
  'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 
  'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
];

export const APP_NAME = "Ruchi Spots";

export const POINTS_RULES = {
  ADD_SPOT: 50,
  SPOT_APPROVED: 25,
  ADD_REVIEW: 10,
  REVIEW_LIKED: 5,
};

export const LEVEL_THRESHOLDS = [
  { level: 'Master Food Guide', points: 1500 },
  { level: 'Ruchi Expert', points: 700 },
  { level: 'Taste Guide', points: 300 },
  { level: 'Local Foodie', points: 100 },
  { level: 'New Explorer', points: 0 },
];

export const ICONS = {
  Home: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  ),
  Favorites: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={props.fill || "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
  ),
  History: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
  ),
  Profile: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  Add: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
  ),
  // Fixed: removed redundant </polygon> closing tag
  Star: ({ filled, ...props }: { filled?: boolean; [key: string]: any }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={filled ? '#D97706' : "none"} stroke={filled ? '#D97706' : "currentColor"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  ),
  Location: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  ArrowLeft: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m15 18-6-6 6-6"/></svg>
  )
};

export const RuchiLogo: React.FC<{ size?: 'sm' | 'lg' }> = ({ size = 'sm' }) => {
  return (
    <div className={`ruchi-logo-container flex flex-col items-center ${size === 'lg' ? 'scale-150 py-12' : 'scale-100'}`}>
      <div className="ruchi-logo-card relative">
        <div className="flex flex-col items-center leading-none">
          <span className="ruchi-3d-text font-black text-3xl tracking-tighter">RUCHI</span>
          <span className="ruchi-3d-text font-black text-xl tracking-[0.2em] -mt-1 ml-4 text-[#D97706]">SPOTS</span>
        </div>
        <div className="absolute -top-4 -right-4 w-6 h-6 bg-[#D97706] rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </div>
      </div>
    </div>
  );
};
