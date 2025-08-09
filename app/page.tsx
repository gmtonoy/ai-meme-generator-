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
     if (!alt.trim()) return;
     setLoading(true);
     setError(null);
     try {
       const r = await fetch("/api/caption", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ vibe, alt }),
       });
       const data: CaptionResp = await r.json();
       if (data.error) throw new Error(data.error);
       if (data.caption) setTop(data.caption);
     } catch (e: any) {
       setError(e.message || "Something went wrong");
     } finally {
       setLoading(false);
     }
   };

   return (
     <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
       {/* Header */}
       <header className="border-b border-white/10 bg-black/20 backdrop-blur">
         <div className="mx-auto max-w-6xl px-4 py-5 flex items-center justify-between">
           <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
             AI Meme Generator
           </h1>
           <span className="text-xs md:text-sm opacity-70">
             Next.js · Tailwind · Gemini
           </span>
         </div>
       </header>

       <div className="mx-auto max-w-6xl px-4 py-8 md:py-12 grid gap-8 md:grid-cols-2">
         {/* Controls */}
         <section className="space-y-6">
           {/* Upload */}
           <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl">
             <h2 className="mb-3 text-lg font-semibold">Upload image</h2>
             <label className="block">
               <input
                 type="file"
                 accept="image/*"
                 onChange={(e) => e.target.files && onFile(e.target.files[0])}
                 className="block w-full text-sm file:me-4 file:rounded-lg file:border-0 file:bg-indigo-500 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-indigo-600"
               />
             </label>
             <p className="mt-2 text-xs opacity-70">
               Choose a PNG or JPG. Keep it wholesome 😄
             </p>
           </div>

           {/* AI Caption */}
           <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl space-y-4">
             <div className="grid gap-3">
               <label className="text-sm opacity-90">Vibe</label>
               <select
                 value={vibe}
                 onChange={(e) => setVibe(e.target.value)}
                 className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 outline-none ring-0 focus:border-indigo-400"
               >
                 <option value="playful">Playful</option>
                 <option value="sarcastic">Sarcastic</option>
                 <option value="deadpan">Deadpan</option>
                 <option value="wholesome">Wholesome</option>
                 <option value="chaotic neutral">Chaotic Neutral</option>
               </select>
             </div>

             <div className="grid gap-2">
               <label className="text-sm opacity-90">Alt description</label>
               <input
                 value={alt}
                 onChange={(e) => setAlt(e.target.value)}
                 placeholder="Describe what's happening in the image"
                 className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 outline-none focus:border-indigo-400"
               />
             </div>

             <button
               onClick={suggest}
               disabled={loading || !alt.trim()}
               className="w-full rounded-lg bg-indigo-500 px-4 py-2 font-semibold transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
             >
               {loading ? "Generating..." : "Suggest caption"}
             </button>

             {error && (
               <p className="text-sm text-red-400">Error: {error}</p>
             )}
           </div>

           {/* Manual text */}
           <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl space-y-4">
             <div className="grid gap-2">
               <label className="text-sm opacity-90">Top text</label>
               <input
                 value={top}
                 onChange={(e) => setTop(e.target.value)}
                 className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 outline-none focus:border-indigo-400"
               />
             </div>
             <div className="grid gap-2">
               <label className="text-sm opacity-90">Bottom text</label>
               <input
                 value={bottom}
                 onChange={(e) => setBottom(e.target.value)}
                 className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 outline-none focus:border-indigo-400"
               />
             </div>
           </div>
         </section>

         {/* Preview */}
         <section className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5 shadow-xl">
           {!image ? (
             <div className="flex h-[520px] items-center justify-center rounded-xl border border-dashed border-white/15 text-center text-sm opacity-70">
               Upload an image to see the preview and download option.
             </div>
           ) : (
             <MemeCanvas image={image} topText={top} bottomText={bottom} />
           )}
         </section>
       </div>

       <footer className="mx-auto max-w-6xl px-4 pb-10 text-center text-xs opacity-60">
         © {new Date().getFullYear()} Meme Machine — built with 💙
       </footer>
     </main>
   );
 }
