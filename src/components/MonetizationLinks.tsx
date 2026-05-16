import React from 'react';
import { Coffee, ShoppingCart } from 'lucide-react';

export const SupportButtons: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-4 mt-8 justify-center">
      <a href="#" className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-2 px-4 rounded-full transition-colors shadow-sm">
        <Coffee size={20} />
        Buy me a coffee
      </a>
      <a href="#" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors shadow-sm">
        <ShoppingCart size={20} />
        Shop Supplies (Affiliate)
      </a>
    </div>
  );
};
