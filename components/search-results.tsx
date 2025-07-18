import React from 'react';
import { TruckCard } from './truck-card';

const truckData = [
  {
    id: 1,
    image: '/truck.jpg',
    weight: '5-10 Tonnes',
    name: 'TATA 407',
    price: '₹591'
  },
  {
    id: 2,
    image: '/truck.jpg',
    weight: '10-15 Tonnes',
    name: 'TATA Ace',
    price: '₹591'
  },
  {
    id: 3,
    image: '/truck.jpg',
    weight: '15-20 Tonnes',
    name: 'Ashok Leyland',
    price: '₹591'
  },
  {
    id: 4,
    image: '/truck.jpg',
    weight: '30 Tonnes',
    name: 'Volvo S440',
    price: '₹591'
  },
  {
    id: 5,
    image: '/truck.jpg',
    weight: '45 Tonnes',
    name: 'TATA Prima',
    price: '₹591'
  },
  {
    id: 6,
    image: '/truck.jpg',
    weight: '60 Tonnes',
    name: 'Mahindra Evo',
    price: '₹591'
  }
];

export const SearchResults: React.FC = () => {
  return (
    <div className="w-full bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col items-center justify-start mt-4 mb-16">
          <div className="font-semibold text-[32px] text-black text-center mb-2 font-satoshi">
            Pick a truck
          </div>
          <div className="font-light text-[24px] text-black text-center font-satoshi">
            Select from a range of trucks for your needs
          </div>
        </div>

        {/* Truck Cards Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[42px] justify-items-center">
          {truckData.map((truck) => (
            <TruckCard
              key={truck.id}
              image={truck.image}
              weight={truck.weight}
              name={truck.name}
              price={truck.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
