"use client";

import { useEffect, useRef } from "react";

type Props = {
  image: string; // data URL
  topText?: string;
  bottomText?: string;
};

function drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number) {
  const lines: string[] = [];
  const words = text.split(" ");
  let line = "";
  for (let i = 0; i < words.length; i++) {
    const testLine = line ? line + " " + words[i] : words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      lines.push(line);
      line = words[i];
    } else {
      line = testLine;
    }
  }
  if (line) lines.push(line);

  const lineHeight = parseInt(ctx.font) * 1.2 || 40;
  for (let i = 0; i < lines.length; i++) {
    const lw = ctx.measureText(lines[i]).width;
    ctx.strokeText(lines[i], x - lw / 2, y + i * lineHeight);
    ctx.fillText(lines[i], x - lw / 2, y + i * lineHeight);
  }
}

export default function MemeCanvas({ image, topText = "", bottomText = "" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = ref.current!;
      const ctx = canvas.getContext("2d")!;
      const W = Math.min(1080, img.width);
      const scale = W / img.width;
      const H = img.height * scale;

      canvas.width = W;
      canvas.height = H;

      ctx.drawImage(img, 0, 0, W, H);
      // Text styles
      const fontSize = Math.max(24, Math.floor(W * 0.06));
      ctx.font = `bold ${fontSize}px Impact, Arial, sans-serif`;
      ctx.textBaseline = "top";
      ctx.lineWidth = Math.ceil(fontSize / 10);
      ctx.strokeStyle = "black";
      ctx.fillStyle = "white";

      // Top text
      if (topText) {
        drawText(ctx, topText.toUpperCase(), W / 2, 10, W * 0.92);
      }
      // Bottom text
      if (bottomText) {
        // Approximate height for bottom multiline
        const lineHeight = fontSize * 1.2;
        const lines = Math.ceil(bottomText.length * fontSize * 0.6 / (W * 0.92));
        const y = H - (lines * lineHeight) - 10;
        ctx.textBaseline = "top";
        drawText(ctx, bottomText.toUpperCase(), W / 2, Math.max(10, y), W * 0.92);
      }
    };
  }, [image, topText, bottomText]);

  const download = () => {
    const url = ref.current!.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "meme.png";
    a.click();
  };

  return (
    <div className="space-y-2">
      <canvas ref={ref} className="w-full rounded-xl shadow" />
      <button onClick={download} className="px-4 py-2 rounded-xl bg-white text-black font-medium">
        Download PNG
      </button>
    </div>
  );
}
