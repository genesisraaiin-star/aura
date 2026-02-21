"use client";
import React, { useState } from 'react';
import { Plus, ArrowRight } from 'lucide-react';

export default function AuraApp() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [key, setKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'denied'>('idle');
  const [activeTab, setActiveTab] = useState('drop');

  const handleAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key) return;
    
    setStatus('loading');
    
    setTimeout(() => {
      const enteredKey = key.trim().toUpperCase();
      // Unlock if they use the brand acronym or track name
      if (enteredKey === 'EIGHT' || enteredKey === 'NOCHECK') {
        setIsUnlocked(true);
      } else {
        setStatus('denied');
      }
    }, 1200);
  };

  // ==========================================
  // VIEW 1: THE DASHBOARD (Unlocked State)
  // ==========================================
  if (isUnlocked) {
    return (
      <div className="min-h-screen bg-[#f4f4f0] text-black font-sans selection:bg-black selection:text-[#f4f4f0] pb-32 animate-in fade-in duration-1000">
        <nav className="flex justify-between items-center px-6 py-4 border-b-2 border-black bg-white">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-serif tracking-tighter">∞ AURA</span>
          </div>
          <div className="flex gap-8 text-xs font-bold uppercase tracking-[0.2em] hidden md:flex">
            <button onClick={() => setActiveTab('drop')} className={`hover:text-red-600 transition-colors ${activeTab === 'drop' && 'text-red-600 border-b-2 border-red-600'}`}>The Drop</button>
            <button onClick={() => setActiveTab('guestlist')} className={`hover:text-red-600 transition-colors ${activeTab === 'guestlist' && 'text-red-600 border-b-2 border-red-600'}`}>Circles</button>
            <button onClick={() => setActiveTab('vault')} className={`hover:text-red-600 transition-colors ${activeTab === 'vault' && 'text-red-600 border-b-2 border-red-600'}`}>Vault</button>
          </div>
          <div className="w-10 h-10 bg-black text-white flex items-center justify-center text-xs font-bold uppercase tracking-widest">
            SNY
          </div>
        </nav>

        <main className="max-w-4xl mx-auto pt-16 px-6">
          <div className="mb-16 border-b-2 border-black pb-12">
            <h1 className="font-serif text-6xl md:text-7xl font-bold tracking-tight mb-4">DropCircle UI</h1>
            <p className="font-mono text-sm uppercase tracking-widest text-zinc-500 mb-6">[ Secure Release Environment ]</p>
            <div className="flex gap-3 font-mono uppercase text-xs font-bold">
              <span className="px-3 py-1 bg-black text-white">Artist Mode</span>
              <span className="px-3 py-1 border-2 border-black text-black">Fan View</span>
            </div>
          </div>

          {activeTab === 'drop' && (
            <div className="animate-in fade-in duration-300">
              <h2 className="font-serif text-4xl font-bold mb-6">The Artifacts</h2>
              
              <div className="space-y-0 border-t-2 border-black bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b-2 border-black hover:bg-zinc-50 transition-colors cursor-pointer group">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="font-bold text-xl uppercase tracking-tight group-hover:text-red-600 transition-colors">No Check (Rough Draft)</h3>
                    <p className="text-xs font-mono text-zinc-500 mt-2 uppercase tracking-widest">WAV // 44.1kHz // WATERMARKED</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-black bg-black text-white">Boardroom</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b-2 border-black hover:bg-zinc-50 transition-colors cursor-pointer group">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="font-bold text-xl uppercase tracking-tight group-hover:text-red-600 transition-colors">Rain Screen Visuals</h3>
                    <p className="text-xs font-mono text-zinc-500 mt-2 uppercase tracking-widest">MP4 // 1080p // WATERMARKED</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-black bg-transparent text-black">Studio</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guestlist' && (
            <div className="animate-in fade-in duration-300">
              <h2 className="font-serif text-4xl font-bold mb-12">The Communion</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-black bg-white">
                <div className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-black flex flex-col h-full hover:bg-black hover:text-white transition-colors group">
                  <h3 className="font-serif text-3xl font-bold mb-2">The Boardroom</h3>
                  <p className="font-mono text-[10px] tracking-widest text-zinc-400 mb-8 uppercase">Industry // A&R</p>
                  <ul className="space-y-4 text-xs flex-1 font-mono uppercase tracking-widest">
                    <li>[+] Lossless WAVs</li>
                    <li>[+] Voice Notes</li>
                  </ul>
                </div>
                <div className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-black flex flex-col h-full bg-black text-white hover:bg-white hover:text-black transition-colors">
                  <h3 className="font-serif text-3xl font-bold mb-2">The Studio</h3>
                  <p className="font-mono text-[10px] tracking-widest text-zinc-500 mb-8 uppercase">Collaborators</p>
                  <ul className="space-y-4 text-xs flex-1 font-mono uppercase tracking-widest">
                    <li>[+] Stream Only</li>
                    <li>[+] A/B Voting</li>
                  </ul>
                </div>
                <div className="p-8 flex flex-col h-full hover:bg-[#ff3300] hover:text-white transition-colors">
                  <h3 className="font-serif text-3xl font-bold mb-2">Front Row</h3>
                  <p className="font-mono text-[10px] tracking-widest text-zinc-500 mb-8 uppercase">Super Fans</p>
                  <ul className="space-y-4 text-xs flex-1 font-mono uppercase tracking-widest">
                    <li>[+] Subscriptions</li>
                    <li>[+] Fund Drops</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vault' && (
            <div className="animate-in fade-in duration-300">
               <h2 className="font-serif text-4xl font-bold mb-12">The Vault</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 border-2 border-black bg-white flex flex-col justify-between h-72">
                  <div>
                    <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-4">Capital Generated</p>
                    <h1 className="font-serif text-7xl font-bold tracking-tighter">$14.2k</h1>
                  </div>
                  <button className="w-full flex items-center justify-between px-6 py-4 bg-black text-white font-mono text-xs uppercase tracking-widest hover:bg-[#ff3300] transition-colors">
                    <span>Initiate Transfer</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
                <div className="p-8 border-2 border-black bg-white flex flex-col h-72">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-widest mb-6">Top Providers</h3>
                  <div className="space-y-4 flex-1 overflow-y-auto font-mono text-xs uppercase tracking-widest">
                      <div className="flex justify-between border-b border-zinc-200 pb-3">
                        <span className="text-zinc-500">Alex Mercer</span>
                        <span className="font-bold text-black">$500</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-200 pb-3">
                        <span className="text-zinc-500">Sarah Jenkins</span>
                        <span className="font-bold text-black">$120</span>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        <button className="fixed bottom-8 right-8 w-16 h-16 bg-[#ff3300] text-white hover:bg-black hover:scale-105 transition-all flex items-center justify-center rounded-none z-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
          <Plus size={32} strokeWidth={2} />
        </button>

        <footer className="fixed bottom-4 left-6 font-mono text-[10px] text-zinc-400 uppercase tracking-[0.3em]">
          E.I.G.H.T.
        </footer>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: THE HYPE GATE (Locked State)
  // ==========================================
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black flex flex-col items-center justify-center p-6 md:p-12 relative">
      
      <main className="w-full max-w-2xl mx-auto flex flex-col items-center mt-[-5vh] animate-in fade-in duration-1000">
        
        {/* Title */}
        <h1 className="font-serif text-6xl md:text-8xl font-bold uppercase tracking-tighter mb-16 text-center w-full">
          INVITE ONLY
        </h1>
        
        {/* Mysterious Teaser Block */}
        <div className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] mb-12 flex flex-col items-center w-full">
          <p className="text-zinc-400 mb-6">THE ECOSYSTEM IS CURRENTLY LOCKED.</p>
          
          <div className="border-l border-zinc-600 pl-4 text-left text-zinc-300 space-y-3 py-2">
            <p>[01] A CLOSED-CIRCUIT<br/>INFRASTRUCTURE.</p>
            <p>[02] ZERO LEAKS. ZERO ALGORITHMS.</p>
            <p>[03] DIRECT-TO-VAULT DROPS.</p>
          </div>
          
          <p className="text-zinc-400 mt-8 max-w-xs text-center leading-relaxed">
            BETA ACCESS IS STRICTLY LIMITED TO 100 VISIONARIES.
          </p>
        </div>

        {/* The Poetic Gatekeeper */}
        <div className="mb-16 flex flex-col items-center text-center">
          <p className="font-serif italic text-lg md:text-xl text-zinc-500 max-w-sm leading-relaxed">
            "The Soul selects her own Society —<br />
            Then — shuts the Door."
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600 mt-4">
            — Emily Dickinson
          </p>
        </div>

        {/* Terminal Input */}
        <form onSubmit={handleAccess} className="w-full max-w-sm flex flex-col gap-6">
          <input 
            type="text" 
            placeholder="ENTER ACCESS KEY" 
            className="w-full bg-transparent border-b border-zinc-800 py-4 font-mono text-center text-xs uppercase tracking-[0.2em] focus:outline-none focus:border-white transition-colors placeholder:text-zinc-700 text-white"
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
              setStatus('idle');
            }}
          />
          
          <button 
            type="submit"
            disabled={status === 'loading'}
            className="w-full border border-white bg-black text-white py-4 font-mono font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {status === 'loading' ? 'VERIFYING...' : 'UNLOCK'}
            {status !== 'loading' && <ArrowRight size={14} strokeWidth={2} />}
          </button>

          <div className="h-4 mt-1 flex justify-center">
            {status === 'denied' && (
              <p className="font-mono text-[10px] text-red-600 uppercase tracking-widest animate-pulse">
                ACCESS DENIED.
              </p>
            )}
          </div>
        </form>

        <button className="mt-16 font-mono text-[9px] text-zinc-600 hover:text-white border-b border-zinc-800 hover:border-white transition-colors uppercase tracking-[0.3em] pb-1">
          REQUEST A BETA KEY
        </button>
      </main>

    </div>
  );
}
