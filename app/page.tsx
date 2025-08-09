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

  const onFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(f);
  };

  const suggest = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vibe, alt })
      });
      const data: CaptionResp = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.caption) setTop(data.caption);
    } catch (e:any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 border border-white/20 rounded-xl">
            <label className="block text-sm mb-2">Upload image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && onFile(e.target.files[0])}
              className="block w-full text-sm"
            />
            <p className="text-xs opacity-70 mt-2">PNG/JPG recommended. Nothing weird, okay? 😅</p>
          </div>

          <div className="p-4 border border-white/20 rounded-xl space-y-3">
            <div>
              <label className="block text-sm mb-1">Vibe</label>
              <select value={vibe} onChange={(e)=>setVibe(e.target.value)} className="w-full bg-transparent border border-white/20 rounded-lg p-2">
                <option value="playful">Playful</option>
                <option value="sarcastic">Sarcastic</option>
                <option value="deadpan">Deadpan</option>
                <option value="wholesome">Wholesome</option>
                <option value="chaotic neutral">Chaotic Neutral</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Alt text / what's happening in the image?</label>
              <input value={alt} onChange={(e)=>setAlt(e.target.value)} placeholder="e.g., cat staring at laptop" className="w-full bg-transparent border border-white/20 rounded-lg p-2" />
            </div>
            <button onClick={suggest} disabled={loading} className="px-4 py-2 rounded-xl bg-white text-black font-medium disabled:opacity-60">
              {loading ? "Thinking..." : "Suggest caption with AI"}
            </button>
            {error && <p className="text-red-400 text-sm">Error: {error}</p>}
          </div>

          <div className="p-4 border border-white/20 rounded-xl space-y-2">
            <label className="block text-sm">Top text</label>
            <input value={top} onChange={(e)=>setTop(e.target.value)} className="w-full bg-transparent border border-white/20 rounded-lg p-2" />
            <label className="block text-sm mt-3">Bottom text</label>
            <input value={bottom} onChange={(e)=>setBottom(e.target.value)} className="w-full bg-transparent border border-white/20 rounded-lg p-2" />
          </div>
        </div>
        <div>
          {!image ? (
            <div className="h-[480px] border border-dashed border-white/20 rounded-xl flex items-center justify-center text-center p-6">
              <p className="opacity-70">Upload an image to start. The preview and download will appear here.</p>
            </div>
          ) : (
            <MemeCanvas image={image} topText={top} bottomText={bottom} />
          )}
        </div>
      </div>
    </main>
  );
}
