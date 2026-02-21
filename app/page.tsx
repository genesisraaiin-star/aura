"use client";
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function WaitlistGate() {
  const [key, setKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'denied'>('idle');

  const handleAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key) return;
    
    setStatus('loading');
    
    // Simulates a secure backend check, then denies to build hype
    setTimeout(() => {
      setStatus('denied');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black flex flex-col justify-between p-6 md:p-12">
      {/* Top Navbar / Logo */}
      <nav className="flex justify-between items-start border-b border-zinc-900 pb-6">
        <div className="font-serif text-3xl tracking-tighter">∞ AURA</div>
        <div className="font-mono text-xs uppercase tracking-widest text-zinc-500">
          [ Phase 1 : Closed ]
        </div>
      </nav>

      {/* Main Center Content */}
      <main className="max-w-2xl w-full mx-auto flex flex-col items-center text-center mt-12 mb-20 animate-in fade-in duration-1000">
        <h1 className="font-serif text-6xl md:text-8xl font-bold uppercase tracking-tight mb-6">
          Invite Only
        </h1>
        <p className="font-mono text-sm md:text-base text-zinc-400 uppercase tracking-widest mb-16 max-w-md leading-relaxed">
          The ecosystem is currently locked. Beta access is strictly limited to 100 artists. 
        </p>

        <form onSubmit={handleAccess} className="w-full max-w-sm flex flex-col gap-2">
          <input 
            type="text" 
            placeholder="ENTER ACCESS KEY" 
            className="w-full bg-transparent border-b-2 border-zinc-800 py-4 px-2 font-mono text-center text-lg uppercase tracking-widest focus:outline-none focus:border-white transition-colors placeholder:text-zinc-700"
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
              setStatus('idle');
            }}
          />
          <button 
            type="submit"
            disabled={status === 'loading'}
            className="w-full border-2 border-white bg-black text-white py-4 mt-6 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white"
          >
            {status === 'loading' ? 'Verifying...' : 'Unlock'}
            {status !== 'loading' && <ArrowRight size={18} />}
          </button>

          {/* Hype/Denial Message */}
          <div className="h-8 mt-4 flex items-center justify-center">
            {status === 'denied' && (
              <p className="font-mono text-xs text-red-600 uppercase tracking-widest animate-pulse">
                Invalid Key. Access Denied.
              </p>
            )}
          </div>
        </form>

        {/* Waitlist Link */}
        <button className="mt-8 font-mono text-xs text-zinc-600 hover:text-white underline underline-offset-8 decoration-zinc-800 transition-colors uppercase tracking-widest">
          Request A Beta Key
        </button>
      </main>

      {/* Footer Branding */}
      <footer className="flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-700 border-t border-zinc-900 pt-6">
        <div>&copy; 2026 AURA</div>
        <div className="text-center hidden md:block text-zinc-500">
          Experience Infinite Greatness Here Today
        </div>
        <div>E.I.G.H.T.</div>
      </footer>
    </div>
  );
}
