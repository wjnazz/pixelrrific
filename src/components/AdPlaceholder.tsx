import React from 'react';

export const AdPlaceholder: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`bg-gray-200 border-2 border-dashed border-gray-400 text-gray-500 flex flex-col items-center justify-center p-4 rounded-lg min-h-[100px] ${className}`}>
      <span className="font-semibold text-sm">Advertisement Space</span>
      <span className="text-xs mt-1">Google AdSense Placeholder</span>
    </div>
  );
};
