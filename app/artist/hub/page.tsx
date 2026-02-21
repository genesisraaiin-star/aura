"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Folder, LogOut, Lock, Globe, Upload, Link as LinkIcon, Edit2, Music, Video, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Connect to Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const LinkedCirclesLogo = ({ className = "w-16 h-10", stroke = "currentColor" }) => (
  <svg viewBox="0 0 60 40" fill="none" stroke={stroke} strokeWidth="2" className={className}>
    <circle cx="22" cy="20" r="14" />
    <circle cx="38" cy="20" r="14" />
  </svg>
);

export default function VisionaryHub() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [circles, setCircles] = useState<any[]>([]);
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // UI States
  const [activeCircle, setActiveCircle] = useState<any>(null);
  const [newCircleTitle, setNewCircleTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    checkUserAndFetchCircles();
  }, []);

  // Fetch the logged-in visionary and their circles
  const checkUserAndFetchCircles = async () => {
    setIsLoading(true);
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      router.push('/artist');
      return;
    }
    setUser(session.user);

    const { data: circleData } = await supabase
      .from('circles')
      .select('*')
      .eq('artist_id', session.user.id)
      .order('created_at', { ascending: false });

    setCircles(circleData || []);
    if (circleData && circleData.length > 0) {
      handleSelectCircle(circleData[0]);
    }
    setIsLoading(false);
  };

  // Fetch artifacts when a circle is selected
  const handleSelectCircle = async (circle: any) => {
    setActiveCircle(circle);
    const { data } = await supabase
      .from('artifacts')
      .select('*')
      .eq('circle_id', circle.id)
      .order('created_at', { ascending: true });
    setArtifacts(data || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/artist');
  };

  // --- CORE FUNCTIONS ---

  const createCircle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCircleTitle || circles.length >= 3) return;

    const { data, error } = await supabase
      .from('circles')
      .insert([{ title: newCircleTitle, is_live: false, artist_id: user.id }])
      .select()
      .single();

    if (!error && data) {
      setCircles([data, ...circles]);
      setNewCircleTitle('');
      handleSelectCircle(data);
    }
  };

  const renameCircle = async () => {
    const newName = window.prompt("ENTER NEW CIRCLE DESIGNATION:", activeCircle.title);
    if (!newName || newName === activeCircle.title) return;

    const { error } = await supabase
      .from('circles')
      .update({ title: newName })
      .eq('id', activeCircle.id);

    if (!error) {
      setActiveCircle({ ...activeCircle, title: newName });
      setCircles(circles.map(c => c.id === activeCircle.id ? { ...c, title: newName } : c));
    }
  };

  const toggleLiveStatus = async () => {
    const newStatus = !activeCircle.is_live;
    const confirmMsg = newStatus 
      ? "OPEN THE VAULT? Fans with the link will be able to access this Circle." 
      : "SEAL THE VAULT? This will immediately take the link offline.";
      
    if (!window.confirm(confirmMsg)) return;

    const { error } = await supabase
      .from('circles')
      .update({ is_live: newStatus })
      .eq('id', activeCircle.id);

    if (!error) {
      setActiveCircle({ ...activeCircle, is_live: newStatus });
      setCircles(circles.map(c => c.id === activeCircle.id ? { ...c, is_live: newStatus } : c));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeCircle) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `artifacts/${fileName}`;

      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage.from('vault').upload(filePath, file);
      if (uploadError) throw uploadError;

      // 2. Link to Database
      const { data, error: dbError } = await supabase
        .from('artifacts')
        .insert([{
          circle_id: activeCircle.id,
          title: file.name.replace(`.${fileExt}`, ''),
          file_path: filePath,
          file_type: file.type
        }])
        .select()
        .single();

      if (dbError) throw dbError;
      setArtifacts([...artifacts, data]);

    } catch (err) {
      alert("UPLOAD FAILED. PLEASE TRY AGAIN.");
    } finally {
      setIsUploading(false);
    }
  };

  const copyInviteLink = () => {
    // We will build the /drop/[id] page next to act as the fan receiver
    const link = `${window.location.origin}/drop/${activeCircle.id}`;
    navigator.clipboard.writeText(link);
    alert("INVITE LINK COPIED TO CLIPBOARD.");
  };

  if (isLoading) return <div className="min-h-screen bg-[#f4f4f0] flex items-center justify-center font-mono text-xs uppercase tracking-widest text-zinc-500">Initializing Workspace...</div>;

  return (
    <div className="min-h-screen bg-[#f4f4f0] text-black font-sans selection:bg-black selection:text-[#f4f4f0] pb-32 animate-in fade-in duration-500">
      
      {/* Top Navigation */}
      <nav className="flex justify-between items-center px-6 py-4 border-b-2 border-black bg-white">
        <div className="flex items-center gap-3">
          <LinkedCirclesLogo className="w-10 h-6" stroke="black" />
          <span className="text-2xl font-serif tracking-tighter mt-1">AURA</span>
        </div>
        <div className="flex gap-6 items-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 hidden md:block">
            VISIONARY: {user?.email}
          </span>
          <button onClick={handleLogout} className="text-[10px] font-bold font-mono uppercase tracking-[0.2em] text-black hover:text-red-600 transition-colors flex items-center gap-2">
            Logout <LogOut size={12} />
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto pt-16 px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEFT PANEL: CIRCLE MANAGER */}
        <div className="lg:col-span-1 space-y-8">
          <div>
            <h2 className="font-serif text-3xl font-bold tracking-tight mb-2">DropCircles</h2>
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              {circles.length} OF 3 SLOTS ALLOCATED
            </p>
          </div>

          <div className="space-y-3">
            {circles.map(circle => (
              <button 
                key={circle.id}
                onClick={() => handleSelectCircle(circle)}
                className={`w-full text-left p-4 border-2 transition-all flex items-center justify-between group ${activeCircle?.id === circle.id ? 'border-black bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'border-black bg-white hover:bg-zinc-100 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}`}
              >
                <div className="flex items-center gap-3 truncate pr-2">
                  <Folder size={16} className={activeCircle?.id === circle.id ? 'text-white flex-shrink-0' : 'text-zinc-400 group-hover:text-black flex-shrink-0'} />
                  <span className="font-bold text-sm uppercase tracking-tight truncate">{circle.title}</span>
                </div>
                {circle.is_live ? (
                  <Globe size={14} className="text-[#4ade80] flex-shrink-0" />
                ) : (
                  <Lock size={14} className={activeCircle?.id === circle.id ? 'text-zinc-400 flex-shrink-0' : 'text-zinc-300 flex-shrink-0'} />
                )}
              </button>
            ))}

            {circles.length < 3 && (
              <form onSubmit={createCircle} className="border-2 border-dashed border-zinc-400 bg-transparent p-4 flex flex-col gap-4 focus-within:border-black transition-colors mt-6">
                <input 
                  type="text" 
                  placeholder="NEW CIRCLE NAME" 
                  required
                  className="w-full bg-transparent border-b-2 border-zinc-300 py-2 font-mono text-xs uppercase tracking-widest focus:outline-none focus:border-black transition-colors"
                  value={newCircleTitle}
                  onChange={(e) => setNewCircleTitle(e.target.value)}
                />
                <button type="submit" className="w-full bg-zinc-200 text-black py-3 font-bold text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2">
                  <Plus size={14} /> Forge Circle
                </button>
              </form>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: VAULT INTERIOR */}
        <div className="lg:col-span-3">
          {!activeCircle ? (
            <div className="h-full min-h-[500px] border-2 border-dashed border-zinc-300 flex flex-col items-center justify-center text-center p-12 bg-white/50">
              <Folder size={48} className="text-zinc-300 mb-6" />
              <h3 className="font-serif text-2xl font-bold mb-2 text-zinc-400">No Circle Selected</h3>
              <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">Select or create a Circle to manage your artifacts.</p>
            </div>
          ) : (
            <div className="border-2 border-black bg-white p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col min-h-[600px]">
              
              {/* Circle Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-12 gap-6 border-b-2 border-zinc-100 pb-8">
                <div className="group relative">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">ACTIVE DIRECTORY</p>
                  <div className="flex items-center gap-4">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">{activeCircle.title}</h1>
                    <button onClick={renameCircle} className="text-zinc-300 hover:text-black transition-colors p-2">
                      <Edit2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-3 min-w-[200px]">
                  <button 
                    onClick={toggleLiveStatus}
                    className={`w-full py-4 px-6 font-bold text-xs uppercase tracking-widest border-2 flex items-center justify-center gap-2 transition-colors ${activeCircle.is_live ? 'border-[#4ade80] bg-[#4ade80]/10 text-[#4ade80] hover:bg-[#4ade80] hover:text-black' : 'border-zinc-300 bg-transparent text-zinc-500 hover:bg-black hover:text-white hover:border-black'}`}
                  >
                    {activeCircle.is_live ? <><Globe size={16}/> LIVE (BRING OFFLINE)</> : <><Lock size={16}/> OFFLINE (MAKE LIVE)</>}
                  </button>
                  
                  <button 
                    onClick={copyInviteLink}
                    className="w-full py-3 px-6 font-bold text-[10px] uppercase tracking-widest border-2 border-black bg-black text-white flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors disabled:opacity-50"
                  >
                    <LinkIcon size={14}/> Copy Fan Invite Link
                  </button>
                </div>
              </div>

              {/* Artifacts List */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400">Encrypted Artifacts</h3>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="audio/*, video/*" 
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <button className="text-[10px] font-bold font-mono uppercase tracking-widest text-white bg-black px-4 py-2 flex items-center gap-2 hover:bg-[#ff3300] transition-colors">
                      {isUploading ? 'ENCRYPTING...' : <><Upload size={14} /> Upload Audio/Video</>}
                    </button>
                  </div>
                </div>
                
                {artifacts.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center bg-zinc-50 border-2 border-dashed border-zinc-200 text-zinc-400">
                    <Music size={32} className="mb-4 opacity-50" />
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em]">VAULT IS CURRENTLY EMPTY</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {artifacts.map((artifact) => (
                      <div key={artifact.id} className="flex items-center justify-between p-4 border-2 border-black hover:bg-zinc-50 transition-colors group">
                        <div className="flex items-center gap-4 truncate">
                          <div className="w-10 h-10 bg-black text-white flex items-center justify-center flex-shrink-0">
                            {artifact.file_type?.includes('video') ? <Video size={16} /> : <Music size={16} />}
                          </div>
                          <div>
                            <p className="font-bold text-sm uppercase tracking-tight truncate">{artifact.title}</p>
                            <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 mt-1">{artifact.file_type}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

      </main>
    </div>
  );
}
