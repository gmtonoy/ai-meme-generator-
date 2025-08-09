"use client";
import { useEffect, useRef } from "react";

interface Props {
  image: string;
  topText: string;
  bottomText: string;
}

export default function MemeCanvas({ image, topText, bottomText }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      // Caption style
      const fontSize = Math.max(28, Math.floor(img.width / 14));
      ctx.font = `${fontSize}px Impact, Arial Black, sans-serif`;
      ctx.textAlign = "center";

      // Outline stroke + fill for meme look
      ctx.lineWidth = Math.max(4, Math.floor(fontSize / 10));
      ctx.strokeStyle = "#000";
      ctx.fillStyle = "#fff";

      const margin = Math.max(16, Math.floor(img.height / 40));
      if (topText) {
        const y = margin + fontSize;
        ctx.strokeText(topText.toUpperCase(), img.width / 2, y);
        ctx.fillText(topText.toUpperCase(), img.width / 2, y);
      }
      if (bottomText) {
        const y = img.height - margin;
        ctx.strokeText(bottomText.toUpperCase(), img.width / 2, y);
        ctx.fillText(bottomText.toUpperCase(), img.width / 2, y);
      }
    };
  }, [image, topText, bottomText]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-black/30 ring-1 ring-white/10">
      <canvas ref={canvasRef} className="block h-auto w-full" />
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
      <div className="absolute bottom-3 right-3">
        <button
          onClick={download}
          className="pointer-events-auto rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-600"
        >
          Download PNG
        </button>
      </div>
    </div>
  );
}
