"use client";

import React, { useState } from "react";

export default function Page() {
  const [mode, setMode] = useState<"artist" | "fan">("artist");

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="p-10 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold tracking-tight">
          DropCircle UI
        </h1>
        <p className="mt-2 text-slate-600">
          Private releases. Real feedback. Paid drops.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setMode("artist")}
            className={`px-4 py-2 rounded-xl border ${
              mode === "artist"
                ? "bg-black text-white"
                : "bg-white border-slate-300"
            }`}
          >
            Artist
          </button>

          <button
            onClick={() => setMode("fan")}
            className={`px-4 py-2 rounded-xl border ${
              mode === "fan"
                ? "bg-black text-white"
                : "bg-white border-slate-300"
            }`}
          >
            Fan
          </button>
        </div>

        <div className="mt-8 p-6 rounded-2xl border shadow-sm">
          {mode === "artist" ? (
            <div>
              <h2 className="text-xl font-semibold">Artist Dashboard</h2>
              <p className="mt-2 text-slate-600">
                Upload → Choose Circle → Publish → Share.
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold">Fan View</h2>
              <p className="mt-2 text-slate-600">
                Hear early drops and support artists directly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
