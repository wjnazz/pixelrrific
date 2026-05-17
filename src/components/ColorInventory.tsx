import React from 'react';
import type { ProcessedResult } from '../lib/imageProcessor';
import type { Modality } from '../lib/palettes';

interface Props {
  data: ProcessedResult;
  modality: Modality;
}

export const ColorInventory: React.FC<Props> = ({ data, modality }) => {
  const inventoryArray = Object.values(data.colorInventory).sort((a, b) => b.count - a.count);

  const getTypeLabel = () => {
    switch (modality) {
      case 'diamond': return 'Drills';
      case 'crossstitch': return 'Stitches';
      case 'perler': return 'Beads';
      case 'lego': return 'Studs';
      default: return 'Units';
    }
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6 w-full">
      <h3 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">Materials Inventory</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {inventoryArray.map((item) => (
          <div key={item.info.id} className="flex items-center gap-3 p-3 bg-gray-50 border rounded-lg">
            <div
              className="w-10 h-10 rounded shadow-inner flex items-center justify-center font-bold border border-gray-300"
              style={{
                backgroundColor: item.info.hex,
                color: getContrastColor(item.info.rgb)
              }}
            >
              {item.info.symbol}
            </div>
            <div className="flex flex-col flex-1">
              <span className="font-semibold text-sm truncate" title={item.info.name}>
                {item.info.name}
              </span>
              <span className="text-xs text-gray-500">ID: {item.info.id}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-bold text-gray-700">{item.count}</span>
              <span className="text-[10px] uppercase text-gray-400">{getTypeLabel()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper inside this file to avoid re-exporting right now
const getContrastColor = (rgb: [number, number, number]) => {
  const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};
