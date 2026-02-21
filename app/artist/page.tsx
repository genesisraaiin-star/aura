"use client";
import React, { useState } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

// Connect to the Supabase Database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const LinkedCirclesLogo = ({ className = "w-16 h-10", stroke = "currentColor" }) => (
  <svg viewBox="0 0 60 40" fill="none" stroke={stroke} strokeWidth="2" className={className}>
    <circle cx="22" cy="20" r="14" />
    <circle cx="38" cy="20" r="14" />
  </svg>
);

export default function ArtistPortal() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      if (isLogin) {
        // Log in existing artist
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        // Register new artist
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }

      // If successful, push them into the new Control Hub (we will build this next)
      router.push('/artist/hub');

    } catch (error: any) {
      console.error("Auth Error:", error);
      setStatus('error');
      setErrorMessage(error.message.toUpperCase());
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f0] text-black font-sans selection:bg-black selection:text-[#f4f4f0] flex flex-col items-center justify-center p-6 md:p-12 relative">
      
      <div className="absolute top-12 left-6">
        <Link href="/" className="flex items-center gap-3 hover:opacity-50 transition-opacity">
          <LinkedCirclesLogo className="w-10 h-6" stroke="black" />
          <span className="text-2xl font-serif tracking-tighter mt-1">AURA</span>
        </Link>
      </div>

      <main className="w-full max-w-md mx-auto flex flex-col items-center animate-in fade-in duration-1000">
        
        <div className="text-center mb-12 w-full border-b-2 border-black pb-8">
          <Lock size={32} className="mx-auto mb-6" />
          <h1 className="font-serif text-5xl font-bold tracking-tight mb-2">Artist Protocol</h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            {isLogin ? 'SECURE LOGIN FACILITY' : 'APPLY FOR PLATFORM ACCESS'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="w-full flex flex-col gap-6">
          <div className="space-y-6">
            <input 
              type="email" 
              placeholder="ARTIST EMAIL" 
              required
              className="w-full bg-transparent border-b-2 border-zinc-300 py-4 font-mono text-center text-sm uppercase tracking-[0.2em] focus:outline-none focus:border-black transition-colors placeholder:text-zinc-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <input 
              type="password" 
              placeholder="PASSWORD" 
              required
              className="w-full bg-transparent border-b-2 border-zinc-300 py-4 font-mono text-center text-sm uppercase tracking-[0.2em] focus:outline-none focus:border-black transition-colors placeholder:text-zinc-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-black text-white py-6 mt-4 font-bold text-xs uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {status === 'loading' ? 'AUTHENTICATING...' : (isLogin ? 'INITIALIZE SESSION' : 'REGISTER ARTIST')}
            {!status && <ArrowRight size={16} />}
          </button>

          <div className="h-8 flex items-center justify-center">
            {status === 'error' && (
              <p className="font-mono text-[10px] text-red-600 uppercase tracking-widest text-center">
                {errorMessage}
              </p>
            )}
          </div>
        </form>

        <button 
          onClick={() => {
            setIsLogin(!isLogin);
            setErrorMessage('');
            setStatus('idle');
          }}
          className="mt-8 font-mono text-[10px] text-zinc-500 hover:text-black transition-colors uppercase tracking-[0.2em] flex items-center gap-2"
        >
          {isLogin ? "NEW ARTIST? REGISTER HERE." : "HAVE AN ACCOUNT? LOG IN."}
        </button>

      </main>
    </div>
  );
}
