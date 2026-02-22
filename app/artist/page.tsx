"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { ArrowRight, Lock, Clock, XCircle, Send } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const LinkedCirclesLogo = ({ className = "w-16 h-10", stroke = "currentColor" }) => (
  <svg viewBox="0 0 60 40" fill="none" stroke={stroke} strokeWidth="2" className={className}>
    <circle cx="22" cy="20" r="14" />
    <circle cx="38" cy="20" r="14" />
  </svg>
);

type Screen = 'login' | 'pending' | 'denied';

export default function ArtistLogin() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Follow-up message state (for denied screen)
  const [followUp, setFollowUp] = useState('');
  const [followUpStatus, setFollowUpStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');

  useEffect(() => {
    const fuse = setTimeout(() => setIsLoading(false), 1500);
    checkUser();
    return () => clearTimeout(fuse);
  }, []);

  const checkUser = async () => {
    try {
      if (!supabaseUrl || !supabaseKey) throw new Error("Missing env vars.");
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1000));
      const { data, error } = await Promise.race([sessionPromise, timeoutPromise]) as any;
      if (error) throw error;
      if (data?.session?.user?.email) router.push('/artist/hub');
      else setIsLoading(false);
    } catch {
      supabase.auth.signOut().catch(() => {});
      if (typeof window !== 'undefined') { localStorage.clear(); sessionStorage.clear(); }
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        // Check if they have a beta request so we can show the right screen
        const { data: request } = await supabase
          .from('beta_requests')
          .select('status')
          .eq('email', email.toLowerCase().trim())
          .maybeSingle();

        if (request?.status === 'pending') {
          setScreen('pending');
          setIsLoading(false);
          return;
        }

        if (request?.status === 'denied') {
          setScreen('denied');
          setIsLoading(false);
          return;
        }

        // No request found or some other error
        throw signInError;
      }

      router.push('/artist/hub');
    } catch (err: any) {
      setError("AUTHORIZATION DENIED: " + err.message);
      setIsLoading(false);
    }
  };

  const sendFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUp.trim()) return;
    setFollowUpStatus('loading');
    try {
      await supabase
        .from('beta_requests')
        .update({ note: followUp.trim() })
        .eq('email', email.toLowerCase().trim());
      setFollowUpStatus('sent');
    } catch {
      setFollowUpStatus('error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-mono text-[10px] uppercase tracking-[0.3em] gap-8">
        <p className="animate-pulse">INITIALIZING WORKSPACE...</p>
        <button
          onClick={() => { localStorage.clear(); sessionStorage.clear(); setIsLoading(false); }}
          className="border border-zinc-800 text-zinc-600 px-4 py-2 hover:text-white hover:border-white transition-colors"
        >
          FORCE OVERRIDE
        </button>
      </div>
    );
  }

  // ── PENDING SCREEN ─────────────────────────────────────────────────────────
  if (screen === 'pending') {
    return (
      <div className="min-h-screen bg-[#f4f4f0] text-black font-sans flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border-4 border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center animate-in fade-in duration-500">
          <Clock size={32} className="mx-auto mb-6 text-zinc-400" />
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-400 mb-3">Request Status</p>
          <h1 className="font-serif text-4xl font-bold tracking-tight mb-4">Under Review.</h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 leading-relaxed mb-8">
            Your beta request for <span className="text-black font-bold">{email}</span> is currently pending review.<br /><br />
            Once approved, you'll receive your login credentials directly. No action required on your end.
          </p>
          <div className="border-t-2 border-zinc-100 pt-6">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-400 mb-2">Want to add anything?</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-zinc-300 mb-4">Update your note to the team below.</p>
            {followUpStatus === 'sent' ? (
              <p className="font-mono text-[10px] uppercase tracking-widest text-black font-bold">Message sent. We'll keep it in mind.</p>
            ) : (
              <form onSubmit={sendFollowUp} className="space-y-3">
                <textarea
                  value={followUp}
                  onChange={e => setFollowUp(e.target.value)}
                  placeholder="TELL US MORE ABOUT YOURSELF..."
                  maxLength={500}
                  rows={3}
                  className="w-full border-b-2 border-zinc-200 bg-transparent py-2 font-mono text-xs uppercase tracking-wide focus:outline-none focus:border-black transition-colors placeholder:text-zinc-300 resize-none"
                />
                <button
                  type="submit"
                  disabled={followUpStatus === 'loading' || !followUp.trim()}
                  className="w-full bg-black text-white py-3 font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  <Send size={12} /> {followUpStatus === 'loading' ? 'Sending...' : 'Send Note'}
                </button>
              </form>
            )}
          </div>
          <button onClick={() => setScreen('login')} className="mt-6 font-mono text-[9px] uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
            ← Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  // ── DENIED SCREEN ──────────────────────────────────────────────────────────
  if (screen === 'denied') {
    return (
      <div className="min-h-screen bg-[#f4f4f0] text-black font-sans flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border-4 border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center animate-in fade-in duration-500">
          <XCircle size={32} className="mx-auto mb-6 text-zinc-300" />
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-400 mb-3">Request Status</p>
          <h1 className="font-serif text-4xl font-bold tracking-tight mb-4">Not This Time.</h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 leading-relaxed mb-8">
            Your beta request for <span className="text-black font-bold">{email}</span> was not approved for this round.<br /><br />
            Beta access is extremely limited. If you believe this was a mistake or want to make a case for reconsideration, send us a note below.
          </p>
          <div className="border-t-2 border-zinc-100 pt-6">
            {followUpStatus === 'sent' ? (
              <p className="font-mono text-[10px] uppercase tracking-widest text-black font-bold">Message received. We'll review it.</p>
            ) : (
              <form onSubmit={sendFollowUp} className="space-y-3">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-400 mb-3">Make your case</p>
                <textarea
                  value={followUp}
                  onChange={e => setFollowUp(e.target.value)}
                  placeholder="WHY SHOULD WE RECONSIDER?"
                  maxLength={500}
                  rows={3}
                  className="w-full border-b-2 border-zinc-200 bg-transparent py-2 font-mono text-xs uppercase tracking-wide focus:outline-none focus:border-black transition-colors placeholder:text-zinc-300 resize-none"
                />
                <button
                  type="submit"
                  disabled={followUpStatus === 'loading' || !followUp.trim()}
                  className="w-full bg-black text-white py-3 font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  <Send size={12} /> {followUpStatus === 'loading' ? 'Sending...' : 'Send Reconsideration Request'}
                </button>
                {followUpStatus === 'error' && <p className="font-mono text-[9px] text-red-500 uppercase tracking-widest">Failed. Try again.</p>}
              </form>
            )}
          </div>
          <button onClick={() => setScreen('login')} className="mt-6 font-mono text-[9px] uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
            ← Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  // ── LOGIN SCREEN ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f4f4f0] text-black font-sans selection:bg-black selection:text-[#f4f4f0] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border-4 border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center animate-in fade-in duration-500">
        <Lock size={32} className="mx-auto mb-6 text-black" />
        <h1 className="font-serif text-4xl font-bold tracking-tighter mb-2">DropCircles</h1>
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-8">SECURE VISIONARY TERMINAL</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="EMAIL DESIGNATION"
            required
            className="w-full bg-transparent border-b-2 border-zinc-300 py-3 font-mono text-center text-xs uppercase tracking-[0.2em] focus:outline-none focus:border-black transition-colors"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="PASSPHRASE"
            required
            className="w-full bg-transparent border-b-2 border-zinc-300 py-3 font-mono text-center text-xs uppercase tracking-[0.2em] focus:outline-none focus:border-black transition-colors"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-4 font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-[#ff3300] transition-colors flex items-center justify-center gap-3"
          >
            AUTHORIZE <ArrowRight size={14} />
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 border-2 border-red-200 bg-red-50 text-red-600 font-mono text-[10px] uppercase tracking-widest leading-relaxed">
            {error}
          </div>
        )}

        <div className="mt-8 pt-6 border-t-2 border-zinc-100">
          <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-3">Don't have access yet?</p>
          <a href="/" className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 hover:text-black transition-colors border-b border-zinc-200 hover:border-black pb-0.5">
            Request Beta Access →
          </a>
        </div>
      </div>
    </div>
  );
}
