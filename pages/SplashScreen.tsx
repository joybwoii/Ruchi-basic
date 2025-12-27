
import React from 'react';
import { RuchiLogo, APP_NAME } from '../constants';

const SplashScreen: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-50 rounded-full blur-[100px] opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-50 rounded-full blur-[100px] opacity-60"></div>

      <div className="relative flex flex-col items-center animate-in fade-in zoom-in duration-1000 p-8 z-10">
        <RuchiLogo size="lg" />
        
        <div className="flex flex-col items-center mt-12">
            <h1 className="text-[#0F172A] text-xl font-black tracking-widest uppercase opacity-20">{APP_NAME}</h1>
            <div className="h-1.5 w-12 bg-[#D97706] rounded-full mb-8 shadow-sm"></div>
            <p className="text-[#64748B] text-sm font-black tracking-[0.4em] uppercase opacity-90 text-center leading-relaxed">
              Experience <span className="text-[#065F46]">Authentic</span> <br/> 
              Kerala Flavors
            </p>
        </div>
      </div>
      
      <div className="absolute bottom-20 flex flex-col items-center z-10">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-[#065F46] rounded-full animate-spin shadow-md"></div>
        <p className="mt-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">Warming up the kitchen...</p>
      </div>
    </div>
  );
};

export default SplashScreen;
