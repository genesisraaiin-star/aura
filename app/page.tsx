"use client";
import React, { useState } from 'react';
import { UploadCloud, Users, CreditCard, Mic, Plus, ArrowRight, Shield, PlayCircle } from 'lucide-react';

export default function AuraDashboard() {
  const [activeTab, setActiveTab] = useState('drop');

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-zinc-800">
      {/* Top Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-zinc-900">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
          <h1 className="text-xl font-bold tracking-widest uppercase">Aura</h1>
        </div>
        <div className="flex gap-8 text-sm font-medium text-zinc-400">
          <button onClick={() => setActiveTab('drop')} className={`transition-colors hover:text-white ${activeTab === 'drop' && 'text-white'}`}>The Drop</button>
          <button onClick={() => setActiveTab('guestlist')} className={`transition-colors hover:text-white ${activeTab === 'guestlist' && 'text-white'}`}>Guest List</button>
          <button onClick={() => setActiveTab('vault')} className={`transition-colors hover:text-white ${activeTab === 'vault' && 'text-white'}`}>The Vault</button>
        </div>
        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold border border-zinc-700 cursor-pointer">
          JD
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto pt-16 px-8 pb-32">
        
        {/* --- TAB: THE DROP --- */}
        {activeTab === 'drop' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-semibold tracking-tight mb-2">Recent Drops</h2>
            <p className="text-zinc-400 mb-12">Secure, leak-proof sharing for your inner circle.</p>
            
            <div className="space-y-4">
              {['Midnight Drive (Demo v3)', 'Studio Session w/ Metro', 'Acoustic Ideas 04.12'].map((track, i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-900 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <button className="text-zinc-400 group-hover:text-white transition-colors">
                      <PlayCircle size={32} />
                    </button>
                    <div>
                      <h3 className="font-medium text-lg">{track}</h3>
                      <p className="text-sm text-zinc-500">Uploaded 2 days ago • Watermarked</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300">The Boardroom</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB: THE GUEST LIST --- */}
        {activeTab === 'guestlist' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-semibold tracking-tight mb-2">Digital VIP Passes</h2>
            <p className="text-zinc-400 mb-12">Manage your audiences and permissions.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Boardroom Card */}
              <div className="p-8 rounded-3xl bg-black border border-zinc-800 shadow-2xl relative overflow-hidden group">
                <Shield className="absolute top-4 right-4 text-zinc-700 w-24 h-24 opacity-20 -rotate-12" />
                <h3 className="text-2xl font-bold mb-1">The Boardroom</h3>
                <p className="text-zinc-500 text-sm mb-12">Industry Pros</p>
                <ul className="space-y-3 text-sm text-zinc-400 mb-8">
                  <li className="flex items-center gap-2">✓ Lossless Downloads</li>
                  <li className="flex items-center gap-2">✓ Time-stamped Voice Feedback</li>
                </ul>
                <button className="w-full py-3 rounded-xl bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors">Manage Access</button>
              </div>

              {/* Studio Card */}
              <div className="p-8 rounded-3xl bg-zinc-300 text-black border border-zinc-200 shadow-2xl relative overflow-hidden">
                <h3 className="text-2xl font-bold mb-1">The Studio</h3>
                <p className="text-zinc-600 text-sm mb-12">Friends & Collaborators</p>
                <ul className="space-y-3 text-sm text-zinc-700 mb-8">
                  <li className="flex items-center gap-2">✓ Streaming Only</li>
                  <li className="flex items-center gap-2">✓ A/B Voting</li>
                  <li className="flex items-center gap-2">✓ Comments</li>
                </ul>
                <button className="w-full py-3 rounded-xl bg-white text-black shadow-sm font-medium hover:bg-zinc-100 transition-colors">Manage Access</button>
              </div>

              {/* Front Row Card */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                <h3 className="text-2xl font-bold mb-1 relative z-10">The Front Row</h3>
                <p className="text-white/80 text-sm mb-12 relative z-10">Super Fans</p>
                <ul className="space-y-3 text-sm text-white/90 mb-8 relative z-10">
                  <li className="flex items-center gap-2">✓ Paid Subscriptions</li>
                  <li className="flex items-center gap-2">✓ Exclusive Chats</li>
                  <li className="flex items-center gap-2">✓ "Fund the Finish"</li>
                </ul>
                <button className="w-full py-3 rounded-xl bg-white/20 backdrop-blur-md text-white font-medium hover:bg-white/30 transition-colors relative z-10">Manage Access</button>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: THE VAULT --- */}
        {activeTab === 'vault' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-semibold tracking-tight mb-2">The Vault</h2>
            <p className="text-zinc-400 mb-12">Your D2C payouts and collaborator splits.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Apple Card Style Balance */}
              <div className="p-10 rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700 shadow-2xl flex flex-col justify-between h-80">
                <div>
                  <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-2">Available Balance</p>
                  <h1 className="text-6xl font-light tracking-tighter">$14,250.00</h1>
                </div>
                <button className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-white text-black font-semibold text-lg hover:bg-zinc-200 transition-colors">
                  Cash Out <ArrowRight size={20} />
                </button>
              </div>

              {/* Top Investors / Splits */}
              <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 flex flex-col h-80">
                <h3 className="text-xl font-semibold mb-6">Top Front Row Investors</h3>
                <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                  {[
                    { name: "Alex Mercer", amount: "$500", tier: "Fund the Finish" },
                    { name: "Sarah Jenkins", amount: "$120", tier: "Monthly Subs" },
                    { name: "David Chen", amount: "$90", tier: "Monthly Subs" }
                  ].map((investor, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-zinc-800/50 pb-4 last:border-0">
                      <div>
                        <p className="font-medium">{investor.name}</p>
                        <p className="text-xs text-zinc-500">{investor.tier}</p>
                      </div>
                      <span className="font-semibold text-green-400">{investor.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* The Drop (Floating Action Button) */}
      <button className="fixed bottom-10 right-10 w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform z-50">
        <Plus size={32} strokeWidth={1.5} />
      </button>
    </div>
  );
}
