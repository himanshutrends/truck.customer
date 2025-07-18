'use client';

import React, { forwardRef, useState } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string;
  error?: string;
  showInfo?: boolean;
  options: SelectOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
}

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ label, error, showInfo, options, placeholder, onChange, className, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(props.value || '');

    const handleSelect = (value: string) => {
      setSelectedValue(value);
      onChange?.(value);
      setIsOpen(false);
    };

    const selectedOption = options.find(option => option.value === selectedValue);

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

        {/* Select Field */}
        <div className="relative">
          <div 
            className="flex items-center justify-between border border-neutral-200 rounded-lg bg-white px-4 py-2.5 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className={`text-base ${selectedOption ? 'text-neutral-900' : 'text-neutral-400'}`}>
              {selectedOption ? selectedOption.label : placeholder || 'Select an option'}
            </span>
            <DropdownIcon className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Dropdown Options */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {options.map((option) => (
                <div
                  key={option.value}
                  className="px-4 py-2.5 hover:bg-neutral-50 cursor-pointer text-base text-neutral-900"
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}

          {/* Hidden select for form submission */}
          <select
            ref={ref}
            {...props}
            value={selectedValue}
            onChange={(e) => handleSelect(e.target.value)}
            className="sr-only"
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {error && (
            <p className="text-sm text-red-500 mt-1">{error}</p>
          )}
        </div>
      </div>
    );
  }
);

SelectInput.displayName = 'SelectInput';

function DropdownIcon({ className }: { className?: string }) {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="#a3a3a3"
        strokeWidth="2"
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
