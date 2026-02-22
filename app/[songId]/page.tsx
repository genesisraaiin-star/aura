"use client";
import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Star, ThumbsUp, ThumbsDown, Check } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const LinkedCirclesLogo = ({ className = "w-10 h-6", stroke = "currentColor" }) => (
  <svg viewBox="0 0 60 40" fill="none" stroke={stroke} strokeWidth="2" className={className}>
    <circle cx="22" cy="20" r="14" />
    <circle cx="38" cy="20" r="14" />
  </svg>
);

// Usage: /feedback/no-check?title=No+Check
export default function FanFeedbackWidget({
  params,
  searchParams,
}: {
  params: { songId: string };
  searchParams: { title?: string };
}) {
  const songId = params.songId;
  const songTitle = searchParams.title
    ? decodeURIComponent(searchParams.title)
    : songId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const [thumb, setThumb] = useState<"up" | "down" | null>(null);
  const [stars, setStars] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [comment, setComment] = useState("");
  const [fanName, setFanName] = useState("");
  const [fanEmail, setFanEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!thumb && !stars && !comment.trim()) {
      setError("Give us something — a rating, a reaction, anything.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const { error: dbError } = await supabase.from("fan_feedback").insert({
        song_id: songId,
        song_title: songTitle,
        thumbs: thumb,
        star_rating: stars || null,
        comment: comment.trim() || null,
        fan_name: fanName.trim() || null,
        fan_email: fanEmail.trim() || null,
      });
      if (dbError) throw dbError;
      setSubmitted(true);
    } catch (err: any) {
      setError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f4f4f0] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-12 text-center">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={28} className="text-white" />
          </div>
          <h2 className="font-serif text-4xl font-bold tracking-tight mb-3">Respect.</h2>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            Your feedback is locked in. Real ones only.
          </p>
          <div className="mt-8 pt-8 border-t-2 border-zinc-100 flex items-center justify-center gap-2">
            <LinkedCirclesLogo className="w-8 h-5" stroke="#a1a1aa" />
            <span className="font-serif text-sm text-zinc-400 tracking-tight">DropCircles</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f0] flex items-center justify-center p-6 font-sans selection:bg-black selection:text-[#f4f4f0]">
      <div className="w-full max-w-md border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b-2 border-zinc-100">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-400 mb-1">Now Playing</p>
          <h1 className="font-serif text-5xl font-bold tracking-tight leading-none mb-3">
            {songTitle}
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Drop your honest reaction below
          </p>
        </div>

        <div className="px-8 py-6 space-y-7">

          {/* THUMBS */}
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-400 mb-3">Vibe Check</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setThumb(thumb === "up" ? null : "up")}
                className={`py-4 border-2 font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                  thumb === "up"
                    ? "border-black bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    : "border-zinc-300 text-zinc-500 hover:border-black hover:text-black"
                }`}
              >
                <ThumbsUp size={14} /> Fire
              </button>
              <button
                onClick={() => setThumb(thumb === "down" ? null : "down")}
                className={`py-4 border-2 font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                  thumb === "down"
                    ? "border-black bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    : "border-zinc-300 text-zinc-500 hover:border-black hover:text-black"
                }`}
              >
                <ThumbsDown size={14} /> Not for me
              </button>
            </div>
          </div>

          {/* STARS */}
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-400 mb-3">Rate It</p>
            <div
              className="flex gap-1"
              onMouseLeave={() => setHoverStar(0)}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onMouseEnter={() => setHoverStar(n)}
                  onClick={() => setStars(stars === n ? 0 : n)}
                  className="text-3xl leading-none transition-transform hover:scale-110 focus:outline-none"
                  style={{ color: n <= (hoverStar || stars) ? "#000" : "#d4d4d8" }}
                >
                  ★
                </button>
              ))}
              {stars > 0 && (
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 self-center ml-2">
                  {["", "Rough", "Decent", "Solid", "Hard", "Masterpiece"][stars]}
                </span>
              )}
            </div>
          </div>

          {/* COMMENT */}
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-400 mb-3">
              Say Something <span className="text-zinc-300">(optional)</span>
            </p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="What hit different? What could be better? Be real..."
              className="w-full border-2 border-zinc-200 bg-zinc-50 p-3 font-mono text-xs resize-none focus:outline-none focus:border-black transition-colors placeholder:text-zinc-300 uppercase tracking-wide"
            />
            <p className="font-mono text-[8px] text-zinc-300 text-right mt-1">{comment.length}/500</p>
          </div>

          {/* NAME / EMAIL */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-400 mb-2">
                Name <span className="text-zinc-300">(opt)</span>
              </p>
              <input
                type="text"
                value={fanName}
                onChange={(e) => setFanName(e.target.value)}
                maxLength={80}
                placeholder="Your name"
                className="w-full border-b-2 border-zinc-200 bg-transparent py-2 font-mono text-xs uppercase tracking-widest focus:outline-none focus:border-black transition-colors placeholder:text-zinc-300"
              />
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-400 mb-2">
                Email <span className="text-zinc-300">(opt)</span>
              </p>
              <input
                type="email"
                value={fanEmail}
                onChange={(e) => setFanEmail(e.target.value)}
                maxLength={120}
                placeholder="your@email.com"
                className="w-full border-b-2 border-zinc-200 bg-transparent py-2 font-mono text-xs uppercase tracking-widest focus:outline-none focus:border-black transition-colors placeholder:text-zinc-300"
              />
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <p className="font-mono text-[10px] uppercase tracking-widest text-red-500">{error}</p>
          )}

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-4 bg-black text-white font-bold font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Locking In..." : "Submit Feedback"}
          </button>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t-2 border-zinc-100 flex items-center justify-center gap-2">
          <LinkedCirclesLogo className="w-8 h-5" stroke="#a1a1aa" />
          <span className="font-serif text-sm text-zinc-400 tracking-tight">DropCircles</span>
        </div>
      </div>
    </div>
  );
}
