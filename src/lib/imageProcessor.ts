import { PALETTES } from './palettes';
import type { Modality, ColorInfo } from './palettes';
import type { PixelCrop } from 'react-image-crop';

// Helper: Get color distance squared
const colorDistanceSq = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) => {
  return (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2;
};

// Helper: Find closest palette color
const findClosestColor = (r: number, g: number, b: number, palette: ColorInfo[]): ColorInfo => {
  let minDistance = Infinity;
  let closestColor = palette[0];

  for (const color of palette) {
    const dist = colorDistanceSq(r, g, b, color.rgb[0], color.rgb[1], color.rgb[2]);
    if (dist < minDistance) {
      minDistance = dist;
      closestColor = color;
    }
  }

  return closestColor;
};

export type ProcessedPixel = {
  x: number;
  y: number;
  color: ColorInfo;
};

export type ProcessedResult = {
  pixels: ProcessedPixel[];
  gridWidth: number;
  gridHeight: number;
  colorInventory: Record<string, { count: number; info: ColorInfo }>;
};

/**
 * Extracts the cropped region of an image, scales it down to the exact target grid size,
 * and maps each pixel to the nearest palette color.
 */
export const processImage = async (
  image: HTMLImageElement,
  crop: PixelCrop,
  targetWidthPixels: number,
  targetHeightPixels: number,
  modality: Modality
): Promise<ProcessedResult> => {
  return new Promise((resolve) => {
    // 1. Draw cropped area to a temporary canvas of the exact target pixel size
    const canvas = document.createElement('canvas');
    canvas.width = targetWidthPixels;
    canvas.height = targetHeightPixels;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!ctx) throw new Error("Could not get 2d context");

    // We use standard drawImage to let the browser scale the cropped region down
    // The crop parameters are percentages or pixels, react-image-crop provides pixel crop in onComplete
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      targetWidthPixels,
      targetHeightPixels
    );

    // 2. Read the pixel data
    const imageData = ctx.getImageData(0, 0, targetWidthPixels, targetHeightPixels);
    const data = imageData.data;

    const palette = PALETTES[modality].colors;
    const pixels: ProcessedPixel[] = [];
    const colorInventory: Record<string, { count: number; info: ColorInfo }> = {};

    // 3. Map colors and build inventory
    for (let y = 0; y < targetHeightPixels; y++) {
      for (let x = 0; x < targetWidthPixels; x++) {
        const i = (y * targetWidthPixels + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // Skip completely transparent pixels (optional, but good for PNGs)
        // For simplicity we will assume a white background if transparent
        const finalR = a < 128 ? 255 : r;
        const finalG = a < 128 ? 255 : g;
        const finalB = a < 128 ? 255 : b;

        const closest = findClosestColor(finalR, finalG, finalB, palette);

        pixels.push({ x, y, color: closest });

        if (!colorInventory[closest.id]) {
          colorInventory[closest.id] = { count: 0, info: closest };
        }
        colorInventory[closest.id].count += 1;
      }
    }

    resolve({
      pixels,
      gridWidth: targetWidthPixels,
      gridHeight: targetHeightPixels,
      colorInventory
    });
  });
};
