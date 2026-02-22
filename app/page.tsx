"use client";
import React, { useState } from 'react';
import { ArrowRight, Lock as LockIcon } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const LinkedCirclesLogo = ({ className = "w-16 h-10", stroke = "currentColor" }) => (
  <svg viewBox="0 0 60 40" fill="none" stroke={stroke} strokeWidth="2" className={className}>
    <circle cx="22" cy="20" r="14" />
    <circle cx="38" cy="20" r="14" />
  </svg>
);

export default function DropCirclesApp() {
  const [formMode, setFormMode] = useState<'request' | 'login'>('request');

  // Beta request form state
  const [reqName, setReqName] = useState('');
  const [reqEmail, setReqEmail] = useState('');
  const [reqNote, setReqNote] = useState('');
  const [reqStatus, setReqStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'duplicate'>('idle');
  const [reqError, setReqError] = useState('');

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqName || !reqEmail) return;
    setReqStatus('loading');
    setReqError('');

    try {
      const { error } = await supabase
        .from('beta_requests')
        .insert([{
          name: reqName.trim(),
          email: reqEmail.toLowerCase().trim(),
          note: reqNote.trim() || null,
        }]);

      if (error) {
        // Duplicate email — already requested
        if (error.code === '23505') {
          setReqStatus('duplicate');
          return;
        }
        throw error;
      }

      setReqStatus('success');
    } catch (err: any) {
      setReqError('SUBMISSION FAILED. PLEASE RETRY.');
      setReqStatus('error');
    }
  };

  const resetRequest = () => {
    setReqName(''); setReqEmail(''); setReqNote('');
    setReqStatus('idle'); setReqError('');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black flex flex-col items-center py-24 px-6 relative overflow-x-hidden">

      <div className="absolute top-12 left-1/2 -translate-x-1/2 animate-in fade-in slide-in-from-top-4 duration-1000 flex flex-col items-center gap-2">
        <LinkedCirclesLogo className="w-16 h-10 text-white opacity-90" />
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600">DropCircles</span>
      </div>

      <main className="w-full max-w-4xl mx-auto flex flex-col items-center mt-16 animate-in fade-in duration-1000 delay-300 fill-mode-both">
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center">

          <h1 className="text-6xl md:text-[8rem] font-serif font-bold tracking-tighter mb-12">
            INVITE ONLY
          </h1>

          <div className="flex flex-col items-center text-center space-y-10 mb-16 w-full">
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-400">
              THE ECOSYSTEM IS CURRENTLY LOCKED.
            </p>

            <div className="border-l border-zinc-700 pl-6 text-left space-y-4 py-2 mx-auto">
              <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-300 leading-relaxed">
                [01] A CLOSED-CIRCUIT<br />INFRASTRUCTURE.
              </p>
              <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-300">
                [02] ZERO LEAKS. ZERO ALGORITHMS.
              </p>
              <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-300">
                [03] DIRECT-TO-VAULT DROPS.
              </p>
            </div>

            <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-500 max-w-sm mx-auto leading-relaxed pt-6">
              BETA ACCESS IS STRICTLY LIMITED TO 100 VISIONARIES.
            </p>
          </div>

          {/* ── BETA REQUEST FORM ── */}
          {formMode === 'request' && (
            <div className="w-full max-w-sm">
              {reqStatus === 'success' ? (
                <div className="text-center space-y-6 animate-in fade-in duration-500">
                  <div className="border border-zinc-700 p-8 space-y-4">
                    <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-500">Request Received</p>
                    <h2 className="font-serif text-3xl font-bold tracking-tight">Position Secured.</h2>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 leading-relaxed">
                      Your request is under review.<br />If approved, you'll receive your credentials directly.
                    </p>
                  </div>
                  <button
                    onClick={resetRequest}
                    className="font-mono text-[10px] text-zinc-600 hover:text-white transition-colors uppercase tracking-[0.2em] border-b border-zinc-800 hover:border-white pb-1"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : reqStatus === 'duplicate' ? (
                <div className="text-center space-y-6 animate-in fade-in duration-500">
                  <div className="border border-zinc-700 p-8 space-y-4">
                    <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-500">Already Registered</p>
                    <h2 className="font-serif text-3xl font-bold tracking-tight">You're On The List.</h2>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 leading-relaxed">
                      This email already has a pending request.<br />We'll be in touch when you're approved.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRequest} className="flex flex-col gap-6">
                  <div className="space-y-5">
                    <input
                      type="text"
                      placeholder="YOUR NAME"
                      required
                      value={reqName}
                      onChange={e => setReqName(e.target.value)}
                      className="w-full bg-transparent border-b border-zinc-700 py-4 font-mono text-center text-xs uppercase tracking-[0.3em] focus:outline-none focus:border-white transition-colors placeholder:text-zinc-600 text-white"
                    />
                    <input
                      type="email"
                      placeholder="EMAIL ADDRESS"
                      required
                      value={reqEmail}
                      onChange={e => setReqEmail(e.target.value)}
                      className="w-full bg-transparent border-b border-zinc-700 py-4 font-mono text-center text-xs uppercase tracking-[0.3em] focus:outline-none focus:border-white transition-colors placeholder:text-zinc-600 text-white"
                    />
                    <textarea
                      placeholder="WHY DO YOU WANT ACCESS? (OPTIONAL)"
                      value={reqNote}
                      onChange={e => setReqNote(e.target.value)}
                      maxLength={300}
                      rows={3}
                      className="w-full bg-transparent border-b border-zinc-700 py-4 font-mono text-center text-xs uppercase tracking-[0.3em] focus:outline-none focus:border-white transition-colors placeholder:text-zinc-600 text-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reqStatus === 'loading'}
                    className="w-full bg-black text-white border border-white py-5 font-bold text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {reqStatus === 'loading' ? 'TRANSMITTING...' : 'REQUEST BETA ACCESS'}
                    {reqStatus === 'idle' && <ArrowRight size={16} />}
                  </button>

                  {reqStatus === 'error' && (
                    <p className="font-mono text-[10px] text-red-600 uppercase tracking-widest text-center">{reqError}</p>
                  )}
                </form>
              )}

              <button
                onClick={() => setFormMode('login')}
                className="mt-12 font-mono text-[10px] text-zinc-600 hover:text-white transition-colors uppercase tracking-[0.2em] border-b border-zinc-800 hover:border-white pb-1 block mx-auto"
              >
                Already Approved? Sign In →
              </button>
            </div>
          )}

          {/* ── ALREADY APPROVED / SIGN IN HINT ── */}
          {formMode === 'login' && (
            <div className="w-full max-w-sm text-center space-y-8 animate-in fade-in duration-300">
              <div className="border border-zinc-800 p-8 space-y-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600">Visionary Terminal</p>
                <h2 className="font-serif text-3xl font-bold tracking-tight">Access Granted.</h2>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 leading-relaxed">
                  Use the credentials sent to your email to sign in to your Visionary hub.
                </p>
                <Link
                  href="/artist"
                  className="inline-flex items-center gap-2 mt-2 bg-white text-black px-8 py-4 font-bold font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors"
                >
                  Go To Sign In <ArrowRight size={14} />
                </Link>
              </div>
              <button
                onClick={() => setFormMode('request')}
                className="font-mono text-[10px] text-zinc-600 hover:text-white transition-colors uppercase tracking-[0.2em] border-b border-zinc-800 hover:border-white pb-1"
              >
                ← Request Access Instead
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-32 space-y-8 opacity-40 hover:opacity-100 transition-opacity duration-700 pb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
            <span className="text-zinc-600 block">No platform.</span>
            <span className="text-zinc-600 block">No permission.</span>
            <span className="text-zinc-600 block">No performance.</span>
          </h2>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
            <span className="text-zinc-400 block">You create.</span>
            <span className="text-zinc-400 block">You invite.</span>
            <span className="text-zinc-400 block">You collect.</span>
          </h2>
        </div>
      </main>

      {/* Hidden backdoor */}
      <Link href="/artist" className="absolute bottom-4 right-4 w-8 h-8 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
        <LockIcon size={12} className="text-zinc-600" />
      </Link>
    </div>
  );
}
