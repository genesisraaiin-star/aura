"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Check, X, Clock, Users, ChevronDown, ChevronUp, LogOut, Copy, RefreshCw, MessageSquare } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================
// CHANGE THIS — your private admin password
// ============================================================
const ADMIN_PASSWORD = '$kyisblu3';

const LinkedCirclesLogo = ({ className = "w-10 h-6", stroke = "currentColor" }) => (
  <svg viewBox="0 0 60 40" fill="none" stroke={stroke} strokeWidth="2" className={className}>
    <circle cx="22" cy="20" r="14" />
    <circle cx="38" cy="20" r="14" />
  </svg>
);

type Request = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  note: string | null;
  status: 'pending' | 'approved' | 'denied';
  reviewed_at: string | null;
  supabase_user_id: string | null;
};

type Visionary = {
  id: string;
  email: string;
  created_at: string;
  name?: string;
  circle_count?: number;
  fan_count?: number;
  feedback_count?: number;
};

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState(false);

  const [requests, setRequests] = useState<Request[]>([]);
  const [visionaries, setVisionaries] = useState<Visionary[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'requests' | 'visionaries'>('requests');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'denied'>('pending');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const login = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); }
    else { setPwError(true); setTimeout(() => setPwError(false), 1500); }
  };

  useEffect(() => { if (authed) fetchAll(); }, [authed]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const { data: reqs } = await supabase
        .from('beta_requests')
        .select('*')
        .order('created_at', { ascending: false });
      setRequests(reqs || []);

      // Fetch Supabase auth users via a join on artist_profiles
      const { data: profiles } = await supabase
        .from('artist_profiles')
        .select('artist_id, name');

      // For each profile, get circle count, fan count, feedback count
      const enriched: Visionary[] = [];
      for (const p of (profiles || [])) {
        const { count: circles } = await supabase
          .from('circles')
          .select('*', { count: 'exact', head: true })
          .eq('artist_id', p.artist_id);

        const circleIds = await supabase
          .from('circles')
          .select('id')
          .eq('artist_id', p.artist_id);

        const ids = (circleIds.data || []).map((c: any) => c.id);

        let fans = 0;
        if (ids.length > 0) {
          const { count } = await supabase
            .from('fan_roster')
            .select('*', { count: 'exact', head: true })
            .in('circle_id', ids);
          fans = count || 0;
        }

        // Match to beta request for email
        const matched = (reqs || []).find((r: Request) => r.supabase_user_id === p.artist_id);

        enriched.push({
          id: p.artist_id,
          email: matched?.email || '—',
          created_at: matched?.reviewed_at || '',
          name: p.name || '—',
          circle_count: circles || 0,
          fan_count: fans,
        });
      }
      setVisionaries(enriched);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (req: Request, newStatus: 'approved' | 'denied') => {
    setActionLoading(req.id);
    try {
      const { error } = await supabase
        .from('beta_requests')
        .update({ status: newStatus, reviewed_at: new Date().toISOString() })
        .eq('id', req.id);
      if (error) throw error;
      setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: newStatus, reviewed_at: new Date().toISOString() } : r));
      showToast(`${req.name} ${newStatus === 'approved' ? 'approved ✓' : 'denied ✗'}`);
    } catch (e: any) {
      showToast('Error: ' + e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    showToast('Email copied to clipboard');
  };

  const copyCredentialTemplate = (req: Request) => {
    const template = `Hi ${req.name},

Your DropCircles Visionary access has been approved.

Sign in at: ${typeof window !== 'undefined' ? window.location.origin : ''}/artist

Email: ${req.email}
Temporary Password: [SET A PASSWORD AND ADD IT HERE]

You'll be prompted to update your password on first login.

Welcome to the circle.

— DropCircles`;
    navigator.clipboard.writeText(template);
    showToast('Credential email template copied ✓');
  };

  const markCredentialsSent = async (req: Request) => {
    // You manually create the Supabase user — this just notes it
    const note = window.prompt(`Enter the Supabase User ID for ${req.email} (from Supabase Auth dashboard):`);
    if (!note) return;
    await supabase.from('beta_requests').update({ supabase_user_id: note }).eq('id', req.id);
    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, supabase_user_id: note } : r));
    showToast('User ID saved ✓');
  };

  const filteredRequests = requests.filter(r => filterStatus === 'all' ? true : r.status === filterStatus);
  const pendingCount = requests.filter(r => r.status === 'pending').length;

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-sm text-center space-y-8">
          <div className="flex flex-col items-center gap-2">
            <LinkedCirclesLogo className="w-12 h-8" stroke="white" />
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-500">Admin Terminal</p>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="ADMIN PASSWORD"
              value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              className={`w-full bg-transparent border-b py-4 font-mono text-center text-xs uppercase tracking-[0.3em] focus:outline-none transition-colors placeholder:text-zinc-600 text-white ${pwError ? 'border-red-600 animate-pulse' : 'border-zinc-700 focus:border-white'}`}
            />
            <button
              onClick={login}
              className="w-full border border-white py-4 font-bold font-mono text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all"
            >
              Access Admin Panel
            </button>
          </div>
          {pwError && <p className="font-mono text-[10px] text-red-600 uppercase tracking-widest animate-pulse">ACCESS DENIED</p>}
        </div>
      </div>
    );
  }

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f4f4f0] text-black font-sans selection:bg-black selection:text-[#f4f4f0]">

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-black text-white font-mono text-[10px] uppercase tracking-widest px-4 py-3 shadow-lg animate-in fade-in slide-in-from-top-2">
          {toast}
        </div>
      )}

      {/* Nav */}
      <nav className="bg-white border-b-2 border-black px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <LinkedCirclesLogo className="w-10 h-6" stroke="black" />
          <span className="text-2xl font-serif tracking-tighter">DropCircles</span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 border border-zinc-200 px-2 py-1 ml-2">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={fetchAll} className="text-zinc-400 hover:text-black transition-colors p-2">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => setAuthed(false)} className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 hover:text-red-600 transition-colors flex items-center gap-2">
            <LogOut size={12} /> Lock
          </button>
        </div>
      </nav>

      {/* Stats bar */}
      <div className="bg-white border-b border-zinc-200 px-6 py-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Requests', value: requests.length },
            { label: 'Pending Review', value: pendingCount, highlight: pendingCount > 0 },
            { label: 'Approved', value: requests.filter(r => r.status === 'approved').length },
            { label: 'Visionaries Active', value: visionaries.length },
          ].map(({ label, value, highlight }) => (
            <div key={label} className={`border-2 px-4 py-3 ${highlight ? 'border-black bg-black text-white' : 'border-zinc-200'}`}>
              <p className={`font-mono text-[9px] uppercase tracking-[0.2em] mb-1 ${highlight ? 'text-zinc-400' : 'text-zinc-400'}`}>{label}</p>
              <p className={`font-serif text-3xl font-bold ${highlight ? 'text-white' : 'text-black'}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">

        {/* Tabs */}
        <div className="flex gap-8 border-b-2 border-zinc-200">
          {(['requests', 'visionaries'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-mono text-xs font-bold uppercase tracking-widest pb-3 transition-colors ${activeTab === tab ? 'text-black border-b-4 border-black -mb-[2px]' : 'text-zinc-400 hover:text-black'}`}
            >
              {tab === 'requests' ? `Beta Requests (${requests.length})` : `Visionaries (${visionaries.length})`}
            </button>
          ))}
        </div>

        {/* ── REQUESTS TAB ── */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {/* Filter */}
            <div className="flex gap-2 flex-wrap">
              {(['pending', 'approved', 'denied', 'all'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`font-mono text-[10px] uppercase tracking-widest px-4 py-2 border-2 transition-all ${filterStatus === s ? 'border-black bg-black text-white' : 'border-zinc-200 text-zinc-500 hover:border-black hover:text-black'}`}
                >
                  {s} {s !== 'all' && `(${requests.filter(r => r.status === s).length})`}
                </button>
              ))}
            </div>

            {filteredRequests.length === 0 ? (
              <div className="border-2 border-dashed border-zinc-200 py-20 text-center">
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">No {filterStatus} requests</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRequests.map(req => (
                  <div key={req.id} className={`border-2 bg-white transition-all ${req.status === 'pending' ? 'border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'border-zinc-200'}`}>

                    {/* Main row */}
                    <div className="p-5 flex items-center gap-4">
                      {/* Status dot */}
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${req.status === 'pending' ? 'bg-black animate-pulse' : req.status === 'approved' ? 'bg-green-500' : 'bg-red-400'}`} />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-bold text-sm uppercase tracking-tight">{req.name}</span>
                          <span className="font-mono text-[10px] text-zinc-500">{req.email}</span>
                          {req.supabase_user_id && (
                            <span className="font-mono text-[8px] uppercase tracking-widest bg-green-50 text-green-700 border border-green-200 px-2 py-0.5">Account Created</span>
                          )}
                        </div>
                        <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 mt-1">
                          {new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {req.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateStatus(req, 'approved')}
                              disabled={actionLoading === req.id}
                              className="flex items-center gap-1.5 px-3 py-2 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-mono text-[10px] uppercase tracking-widest transition-all disabled:opacity-40"
                            >
                              <Check size={12} /> Approve
                            </button>
                            <button
                              onClick={() => updateStatus(req, 'denied')}
                              disabled={actionLoading === req.id}
                              className="flex items-center gap-1.5 px-3 py-2 border-2 border-zinc-300 text-zinc-400 hover:border-red-500 hover:text-red-500 font-mono text-[10px] uppercase tracking-widest transition-all disabled:opacity-40"
                            >
                              <X size={12} /> Deny
                            </button>
                          </>
                        )}
                        {req.status === 'approved' && !req.supabase_user_id && (
                          <button
                            onClick={() => copyCredentialTemplate(req)}
                            className="flex items-center gap-1.5 px-3 py-2 border-2 border-black text-black hover:bg-black hover:text-white font-mono text-[10px] uppercase tracking-widest transition-all"
                          >
                            <Copy size={12} /> Copy Email Template
                          </button>
                        )}
                        {req.status === 'approved' && !req.supabase_user_id && (
                          <button
                            onClick={() => markCredentialsSent(req)}
                            className="px-3 py-2 border-2 border-zinc-300 text-zinc-400 hover:border-black hover:text-black font-mono text-[10px] uppercase tracking-widest transition-all"
                          >
                            Log User ID
                          </button>
                        )}
                        <button
                          onClick={() => copyEmail(req.email)}
                          className="p-2 text-zinc-300 hover:text-black transition-colors"
                          title="Copy email"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
                          className="p-2 text-zinc-300 hover:text-black transition-colors"
                        >
                          {expandedId === req.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded — note + undo */}
                    {expandedId === req.id && (
                      <div className="px-5 pb-5 border-t-2 border-zinc-100 pt-4 space-y-3 animate-in fade-in duration-200">
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-400 mb-1">Note from Visionary</p>
                          <p className="font-mono text-xs text-zinc-600 uppercase tracking-wide leading-relaxed">
                            {req.note || '— No note provided —'}
                          </p>
                        </div>
                        {req.status !== 'pending' && (
                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => updateStatus(req, req.status === 'approved' ? 'denied' : 'approved')}
                              className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 hover:text-black transition-colors border-b border-zinc-200 hover:border-black pb-0.5"
                            >
                              Change to {req.status === 'approved' ? 'Denied' : 'Approved'} ↩
                            </button>
                          </div>
                        )}
                        {req.supabase_user_id && (
                          <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-400">
                            Supabase UID: <span className="text-black">{req.supabase_user_id}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── VISIONARIES TAB ── */}
        {activeTab === 'visionaries' && (
          <div className="space-y-4">
            {visionaries.length === 0 ? (
              <div className="border-2 border-dashed border-zinc-200 py-20 text-center">
                <Users size={32} className="mx-auto mb-4 text-zinc-300" />
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">No active Visionaries yet</p>
              </div>
            ) : (
              <div className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <table className="w-full">
                  <thead className="border-b-2 border-black bg-zinc-50">
                    <tr>
                      {['Visionary', 'Email', 'Circles', 'Fans', 'Joined'].map(h => (
                        <th key={h} className="px-5 py-3 text-left font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-normal">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visionaries.map((v, i) => (
                      <tr key={v.id} className={`border-b border-zinc-100 last:border-0 hover:bg-zinc-50 transition-colors ${i % 2 === 0 ? '' : 'bg-zinc-50/30'}`}>
                        <td className="px-5 py-4 font-bold text-sm uppercase tracking-tight">{v.name}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-zinc-500">{v.email}</span>
                            <button onClick={() => copyEmail(v.email)} className="text-zinc-300 hover:text-black transition-colors">
                              <Copy size={10} />
                            </button>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-serif text-xl font-bold">{v.circle_count}</td>
                        <td className="px-5 py-4 font-serif text-xl font-bold">{v.fan_count}</td>
                        <td className="px-5 py-4 font-mono text-[10px] text-zinc-400">
                          {v.created_at ? new Date(v.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* How to add a Visionary instructions */}
            <div className="border-2 border-dashed border-zinc-300 p-6 space-y-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-400">How to onboard an approved Visionary</p>
              <div className="space-y-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                <p>[1] Approve their request in the Beta Requests tab</p>
                <p>[2] Go to Supabase → Authentication → Users → Add User</p>
                <p>[3] Enter their email + a temp password</p>
                <p>[4] Click "Copy Email Template" on their request card and send it to them</p>
                <p>[5] Click "Log User ID" and paste in their Supabase UID to keep records</p>
                <p>[6] They log in at /artist, see the hub, and start building</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
