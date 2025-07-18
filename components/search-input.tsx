'use client';

import React, { forwardRef } from 'react';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: 'location';
  showInfo?: boolean;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ label, error, icon, showInfo, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-[248.667px]">
        {/* Label */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-neutral-900 leading-5">
            {label}
          </label>
          {showInfo && (
            <div className="w-[18px] h-[18px] flex items-center justify-center">
              <InfoIcon />
            </div>
          )}
        </div>

        {/* Input Field */}
        <div className="relative">
          <div className="flex items-center border border-neutral-200 rounded-lg bg-white px-4 py-2.5">
            {icon === 'location' && (
              <div className="w-6 h-6 mr-1 flex items-center justify-center">
                <LocationIcon />
              </div>
            )}
            <input
              ref={ref}
              {...props}
              className={`flex-1 text-base text-neutral-400 bg-transparent border-none outline-none placeholder:text-neutral-400 ${className}`}
            />
          </div>
          {error && (
            <p className="text-sm text-red-500 mt-1">{error}</p>
          )}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

function LocationIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 13.5C13.6569 13.5 15 12.1569 15 10.5C15 8.84315 13.6569 7.5 12 7.5C10.3431 7.5 9 8.84315 9 10.5C9 12.1569 10.3431 13.5 12 13.5Z"
        stroke="#a3a3a3"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 2.25C16.5563 2.25 20.25 5.94365 20.25 10.5C20.25 12.8906 19.0781 15.2812 17.5312 17.3438C16.6875 18.4219 15.75 19.4062 14.8594 20.2969C14.1094 21.0469 13.0781 21.75 12 21.75C10.9219 21.75 9.89063 21.0469 9.14063 20.2969C8.25 19.4062 7.3125 18.4219 6.46875 17.3438C4.92188 15.2812 3.75 12.8906 3.75 10.5C3.75 5.94365 7.44365 2.25 12 2.25Z"
        stroke="#a3a3a3"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="9"
        cy="9"
        r="8"
        stroke="#a3a3a3"
        strokeWidth="1.5"
      />
      <path
        d="M9 12.75V9"
        stroke="#a3a3a3"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="9"
        cy="6.75"
        r="0.75"
        fill="#a3a3a3"
      />
    </svg>
  );
}
