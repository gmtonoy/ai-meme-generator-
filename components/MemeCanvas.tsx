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

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Text styling
      const fontSize = Math.max(24, Math.floor(img.width / 15));
      ctx.font = `${fontSize}px Impact, sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#000000";

      // Top text
      if (topText) {
        ctx.fillText(topText.toUpperCase(), img.width / 2, fontSize + 10);
        ctx.strokeText(topText.toUpperCase(), img.width / 2, fontSize + 10);
      }

      // Bottom text
      if (bottomText) {
        ctx.fillText(
          bottomText.toUpperCase(),
          img.width / 2,
          img.height - 10
        );
        ctx.strokeText(
          bottomText.toUpperCase(),
          img.width / 2,
          img.height - 10
        );
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
    <div className="relative w-full overflow-hidden rounded-2xl shadow-xl">
      <canvas ref={canvasRef} className="w-full h-auto" />
      <button
        onClick={download}
        className="absolute bottom-4 right-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg transition-colors"
      >
        Download PNG
      </button>
    </div>
  );
}
