
import React, { useState } from 'react';
import { RuchiLogo, APP_NAME } from '../constants';

interface AuthProps {
  onLogin: (email: string, pass: string) => void;
  onSignUp: (name: string, email: string, pass: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onSignUp }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(formData.email, formData.password);
    } else {
      onSignUp(formData.name, formData.email, formData.password);
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-white overflow-y-auto scrollbar-hide">
      <div className="p-10 pt-16 flex flex-col items-center">
        <RuchiLogo size="lg" />
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
            {isLogin ? 'Welcome Back!' : 'Join the Community'}
          </h2>
          <p className="text-sm text-slate-400 font-bold mt-2">
            {isLogin ? 'Sign in to explore authentic spots' : 'Create an account to start your journey'}
          </p>
        </div>
      </div>

      <div className="px-8 pb-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
              <input 
                type="text"
                required
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 px-6 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-[#065F46]/5 focus:border-[#065F46] outline-none shadow-sm placeholder:opacity-30"
                placeholder="Enter your name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
            <input 
              type="email"
              required
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 px-6 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-[#065F46]/5 focus:border-[#065F46] outline-none shadow-sm placeholder:opacity-30"
              placeholder="name@example.com"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Password</label>
            <input 
              type="password"
              required
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 px-6 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-[#065F46]/5 focus:border-[#065F46] outline-none shadow-sm placeholder:opacity-30"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#065F46] text-white py-6 rounded-[32px] font-black text-lg shadow-2xl shadow-[#065F46]/30 active:scale-95 transition-all uppercase tracking-[0.2em] mt-8"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-black text-slate-500 hover:text-[#065F46] transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
      
      <div className="mt-auto p-10 text-center">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-loose">
          By continuing, you agree to our <br/>
          <span className="text-[#065F46]">Terms of Service</span> and <span className="text-[#065F46]">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
