import { Weight } from 'lucide-react';
import React from 'react';

interface TruckCardProps {
  image: string;
  weight: string;
  name: string;
  price: string;
}

export const TruckCard: React.FC<TruckCardProps> = ({ image, weight, name, price }) => {
  return (
    <div className="bg-blue-50 box-border flex flex-col h-[269px] items-center justify-center overflow-hidden p-[9px] rounded-[15px] w-[297px]">
      <div className="flex flex-col items-center justify-start w-full">
        <div className="flex flex-col gap-[11px] items-center justify-start w-full">
          {/* Truck Image */}
          <div className="w-full">
            <div className="p-[8px] w-full">
              <div className="flex items-center justify-center w-full">
                <div className="w-full">
                  <div 
                    className="w-full bg-center bg-cover bg-no-repeat h-24 rounded-lg"
                    style={{ backgroundImage: `url('${image}')` }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Weight Badge */}
          <div className="bg-white flex flex-row items-center justify-start p-1 rounded-[10px] shadow-sm">
            
            <Weight size={20} />
            <div className="flex items-center justify-center px-2">
              <div className="font-semibold text-[18px] text-black leading-normal">
                {weight}
              </div>
            </div>
          </div>
        </div>
        
        {/* Truck Info */}
        <div className="flex flex-col items-center justify-start w-full max-w-[140px]">
            <div className="flex items-center justify-center w-full">
                <div className="font-semibold text-[24px] text-black text-center leading-normal whitespace-nowrap">
                  {name}
                </div>
            </div>
            <div className="flex items-center justify-center w-full">
                <div className="text-[14px] text-black leading-normal text-center">
                  <span>Starting from </span>
                  <span className="font-bold text-blue-600">{price}</span>
                </div>
            </div>
        </div>
        
        {/* Know More Link */}
        <div className="flex items-center justify-center p-[8px]">
          <button className="font-medium text-[14px] text-[#3478f6] underline cursor-pointer hover:text-blue-800 transition-colors">
            Know more
          </button>
        </div>
      </div>
    </div>
  );
};
