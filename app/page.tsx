"use client";

import { useState } from "react";
import MemeCanvas from "@/components/MemeCanvas";

type CaptionResp = { caption?: string; error?: string };

export default function Page() {
  const [image, setImage] = useState<string | null>(null);
  const [top, setTop] = useState("");
  const [bottom, setBottom] = useState("");
  const [vibe, setVibe] = useState("playful");
  const [alt, setAlt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const suggest = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vibe, alt }),
      });
      const data: CaptionResp = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.caption) setTop(data.caption);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <h1 className="text-3xl md:text-5xl font-bold text-center mb-8">
        AI Meme Generator
      </h1>
      <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        <div className="space-y-6">
          <div className="bg-slate-700/30 backdrop-blur rounded-2xl p-5 shadow-lg">
            <label className="block text-sm mb-2 font-medium">
              Upload image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) onFile(e.target.files[0]);
              }}
              className="block w-full file:mr-4 file:px-3 file:py-2 file:border-0 file:bg-slate-600 file:text-white file:rounded-full cursor-pointer"
            />
            <p className="text-xs opacity-70 mt-2">
              Choose a PNG or JPG. Keep it wholesome 😄
            </p>
          </div>

          <div className="bg-slate-700/30 backdrop-blur rounded-2xl p-5 shadow-lg space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Vibe</label>
              <select
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-2"
              >
                <option value="playful">Playful</option>
                <option value="sarcastic">Sarcastic</option>
                <option value="deadpan">Deadpan</option>
                <option value="wholesome">Wholesome</option>
                <option value="chaotic neutral">Chaotic Neutral</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Alt description
              </label>
              <input
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Describe what's happening in the image"
                className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-2"
              />
            </div>
            <button
              onClick={suggest}
              disabled={loading || !alt.trim()}
              className="w-full py-2 font-semibold rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Generating..." : "Suggest caption"}
            </button>
            {error && (
              <p className="text-sm text-red-400">Error: {error}</p>
            )}
          </div>

          <div className="bg-slate-700/30 backdrop-blur rounded-2xl p-5 shadow-lg space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Top text
              </label>
              <input
                value={top}
                onChange={(e) => setTop(e.target.value)}
                className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Bottom text
              </label>
              <input
                value={bottom}
                onChange={(e) => setBottom(e.target.value)}
                className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-2"
              />
            </div>
          </div>
        </div>
        <div>
          {!image ? (
            <div className="h-[500px] flex items-center justify-center border-2 border-dashed border-slate-600 rounded-2xl p-6 text-center">
              <p className="opacity-70">
                Upload an image to see the preview and download option.
              </p>
            </div>
          ) : (
            <MemeCanvas image={image} topText={top} bottomText={bottom} />
          )}
        </div>
      </div>
      <footer className="mt-12 text-center text-sm opacity-60">
        Built with Next.js, Tailwind, and Google Gemini.
      </footer>
    </div>
  );
}
