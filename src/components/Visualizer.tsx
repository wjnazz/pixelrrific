import React, { useEffect, useRef, useState } from 'react';
import type { ProcessedResult } from '../lib/imageProcessor';
import { Grid, Eye, Search } from 'lucide-react';

type ViewMode = 'color' | 'symbols' | 'bw-symbols';

interface VisualizerProps {
  data: ProcessedResult;
}

export const Visualizer: React.FC<VisualizerProps> = ({ data }) => {
  const [mode, setMode] = useState<ViewMode>('color');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // We determine a drawing scale so the tiny pixel art looks large enough to see on screen.
  const [scale, setScale] = useState(10);

  useEffect(() => {
    // Auto scale to fit container horizontally
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 40; // padding
      const maxScale = Math.floor(containerWidth / data.gridWidth);
      setScale(Math.max(1, Math.min(25, maxScale))); // Min 1px per pixel, Max 25px
    }
  }, [data.gridWidth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = data.gridWidth * scale;
    canvas.height = data.gridHeight * scale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background (white)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    data.pixels.forEach((pixel) => {
      const px = pixel.x * scale;
      const py = pixel.y * scale;

      // Draw background color
      if (mode === 'color' || mode === 'symbols') {
        ctx.fillStyle = pixel.color.hex;
        ctx.fillRect(px, py, scale, scale);
      } else {
        // Black and White symbols background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(px, py, scale, scale);
      }

      // Draw grid lines
      ctx.strokeStyle = mode === 'bw-symbols' ? '#E5E7EB' : 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 1;
      ctx.strokeRect(px, py, scale, scale);

      // Draw symbols
      if (mode === 'symbols' || mode === 'bw-symbols') {
        ctx.fillStyle = mode === 'bw-symbols' ? '#000000' : getContrastColor(pixel.color.rgb);
        ctx.font = `${Math.floor(scale * 0.7)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pixel.color.symbol || '', px + scale / 2, py + scale / 2 + 1);
      }
    });

  }, [data, mode, scale]);

  // Helper to determine whether to write text in black or white based on background color brightness
  const getContrastColor = (rgb: [number, number, number]) => {
    const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg border">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('color')}
            className={`px-4 py-2 rounded-md font-medium flex items-center gap-2 ${mode === 'color' ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <Eye size={18} /> Color
          </button>
          <button
            onClick={() => setMode('symbols')}
            className={`px-4 py-2 rounded-md font-medium flex items-center gap-2 ${mode === 'symbols' ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <Grid size={18} /> Symbols
          </button>
          <button
            onClick={() => setMode('bw-symbols')}
            className={`px-4 py-2 rounded-md font-medium flex items-center gap-2 ${mode === 'bw-symbols' ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <Search size={18} /> B&W
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Zoom:</span>
          <input
            type="range"
            min={1}
            max={30}
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            className="w-24"
          />
        </div>
      </div>

      <div
        ref={containerRef}
        className="w-full overflow-auto border-2 border-gray-300 rounded-lg bg-gray-50 flex justify-center max-h-[70vh] p-4"
        style={{ cursor: 'grab' }}
      >
        <canvas
          ref={canvasRef}
          className="shadow-md bg-white block"
          style={{ width: `${data.gridWidth * scale}px`, height: `${data.gridHeight * scale}px` }}
        />
      </div>

      <div className="text-sm text-gray-500 text-center">
        Generated Grid: {data.gridWidth} x {data.gridHeight} pixels ({data.gridWidth * data.gridHeight} total items).
      </div>
    </div>
  );
};
