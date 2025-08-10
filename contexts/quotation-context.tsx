'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { DateRange } from 'react-day-picker';

// Types for quotation system
export interface QuotationSearchParams {
  originPinCode: string;
  destinationPinCode: string;
  originLocation?: string;
  destinationLocation?: string;
  weight: string;
  weightUnit: 'kg' | 'tonnes';
  vehicleType?: string;
  pickupDate: Date;
  dropDate: Date;
  dateRange?: DateRange;
  shipmentDescription?: string;
  urgencyLevel: 'standard' | 'express' | 'urgent';
  specialRequirements?: string[];
}

export interface VehicleDetails {
  id: string;
  vendorId: number;
  vendorName: string;
  name: string;
  badge?: string;
  price: string;
  vehicleType: string;
  maxWeight: string;
  model: string;
  gpsNumber: string;
  estimatedDelivery: string;
  route: {
    from: string;
    to: string;
    price: string;
  };
  weight: {
    amount: string;
    rate: string;
    total: string;
  };
  deliveryType: {
    type: string;
    price: string;
  };
  total: string;
  specs?: {
    loadCapacity: string;
    dimensions: string;
    fuelType: string;
    yearOfManufacture: string;
    kmDriven: string;
    insuranceValidity: string;
    permitType: string;
    ownership: string;
    registrationState: string;
  };
  pricing?: {
    perKm: string;
    minimumFare: string;
    driverAllowance: string;
    perHour: string;
  };
  operatingStates?: string[];
  isBookmarked?: boolean;
}

export interface QuotationItem {
  vehicle: VehicleDetails;
  quantity: number;
  customRequirements?: string;
  selectedAt: Date;
}

export interface Quotation {
  id: string;
  searchParams: QuotationSearchParams;
  vendorId: number;
  vendorName: string;
  items: QuotationItem[];
  totalAmount: number;
  status: 'draft' | 'requested' | 'received' | 'accepted' | 'declined';
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  notes?: string;
}

interface QuotationState {
  searchParams: QuotationSearchParams | null;
  currentQuotation: Quotation | null;
  quotationHistory: Quotation[];
  pendingVendorSwitch: {
    vehicle: VehicleDetails;
    newVendorId: number;
    newVendorName: string;
  } | null;
  isLoading: boolean;
  error: string | null;
}

type QuotationAction =
  | { type: 'SET_SEARCH_PARAMS'; payload: QuotationSearchParams }
  | { type: 'UPDATE_SEARCH_PARAMS'; payload: Partial<QuotationSearchParams> }
  | { type: 'ADD_VEHICLE_TO_QUOTATION'; payload: VehicleDetails }
  | { type: 'REMOVE_VEHICLE_FROM_QUOTATION'; payload: string }
  | { type: 'UPDATE_VEHICLE_QUANTITY'; payload: { vehicleId: string; quantity: number } }
  | { type: 'SET_PENDING_VENDOR_SWITCH'; payload: { vehicle: VehicleDetails; newVendorId: string; newVendorName: string } }
  | { type: 'CONFIRM_VENDOR_SWITCH' }
  | { type: 'CANCEL_VENDOR_SWITCH' }
  | { type: 'CLEAR_QUOTATION' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SAVE_QUOTATION_TO_HISTORY' }
  | { type: 'UPDATE_QUOTATION_STATUS'; payload: { quotationId: string; status: Quotation['status'] } };

const initialState: QuotationState = {
  searchParams: null,
  currentQuotation: null,
  quotationHistory: [],
  pendingVendorSwitch: null,
  isLoading: false,
  error: null,
};

function quotationReducer(state: QuotationState, action: QuotationAction): QuotationState {
  switch (action.type) {
    case 'SET_SEARCH_PARAMS':
      return {
        ...state,
        searchParams: action.payload,
        error: null,
      };

    case 'UPDATE_SEARCH_PARAMS':
      return {
        ...state,
        searchParams: state.searchParams ? { ...state.searchParams, ...action.payload } : null,
      };

    case 'ADD_VEHICLE_TO_QUOTATION': {
      const vehicle = action.payload;
      
      // If no current quotation, create new one
      if (!state.currentQuotation) {
        const newQuotation: Quotation = {
          id: `quot_${Date.now()}`,
          searchParams: state.searchParams!,
          vendorId: vehicle.vendorId,
          vendorName: vehicle.vendorName,
          items: [{
            vehicle,
            quantity: 1,
            selectedAt: new Date(),
          }],
          totalAmount: parseFloat(vehicle.total.replace('₹', '').replace(',', '')),
          status: 'draft',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        return {
          ...state,
          currentQuotation: newQuotation,
          error: null,
        };
      }

      // If same vendor, add to current quotation
      if (state.currentQuotation.vendorId === vehicle.vendorId) {
        const existingItemIndex = state.currentQuotation.items.findIndex(
          item => item.vehicle.id === vehicle.id
        );

        let updatedItems;
        if (existingItemIndex >= 0) {
          // Update quantity if vehicle already exists
          updatedItems = state.currentQuotation.items.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          // Add new vehicle
          updatedItems = [
            ...state.currentQuotation.items,
            {
              vehicle,
              quantity: 1,
              selectedAt: new Date(),
            }
          ];
        }

        const totalAmount = updatedItems.reduce((sum, item) => 
          sum + (parseFloat(item.vehicle.total.replace('₹', '').replace(',', '')) * item.quantity), 0
        );

        return {
          ...state,
          currentQuotation: {
            ...state.currentQuotation,
            items: updatedItems,
            totalAmount,
            updatedAt: new Date(),
          },
          error: null,
        };
      }

      // Different vendor - set pending switch
      return {
        ...state,
        pendingVendorSwitch: {
          vehicle,
          newVendorId: vehicle.vendorId,
          newVendorName: vehicle.vendorName,
        },
        error: null,
      };
    }

    case 'REMOVE_VEHICLE_FROM_QUOTATION': {
      if (!state.currentQuotation) return state;

      const updatedItems = state.currentQuotation.items.filter(
        item => item.vehicle.id !== action.payload
      );

      if (updatedItems.length === 0) {
        return {
          ...state,
          currentQuotation: null,
          error: null,
        };
      }

      const totalAmount = updatedItems.reduce((sum, item) => 
        sum + (parseFloat(item.vehicle.total.replace('₹', '').replace(',', '')) * item.quantity), 0
      );

      return {
        ...state,
        currentQuotation: {
          ...state.currentQuotation,
          items: updatedItems,
          totalAmount,
          updatedAt: new Date(),
        },
        error: null,
      };
    }

    case 'UPDATE_VEHICLE_QUANTITY': {
      if (!state.currentQuotation) return state;

      const updatedItems = state.currentQuotation.items.map(item =>
        item.vehicle.id === action.payload.vehicleId
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      );

      const totalAmount = updatedItems.reduce((sum, item) => 
        sum + (parseFloat(item.vehicle.total.replace('₹', '').replace(',', '')) * item.quantity), 0
      );

      return {
        ...state,
        currentQuotation: {
          ...state.currentQuotation,
          items: updatedItems,
          totalAmount,
          updatedAt: new Date(),
        },
        error: null,
      };
    }

    case 'SET_PENDING_VENDOR_SWITCH':
      return {
        ...state,
        pendingVendorSwitch: action.payload,
        error: null,
      };

    case 'CONFIRM_VENDOR_SWITCH': {
      if (!state.pendingVendorSwitch) return state;

      // Save current quotation to history
      const historyUpdate = state.currentQuotation 
        ? [...state.quotationHistory, state.currentQuotation]
        : state.quotationHistory;

      // Create new quotation with the pending vehicle
      const newQuotation: Quotation = {
        id: `quot_${Date.now()}`,
        searchParams: state.searchParams!,
        vendorId: state.pendingVendorSwitch.newVendorId,
        vendorName: state.pendingVendorSwitch.newVendorName,
        items: [{
          vehicle: state.pendingVendorSwitch.vehicle,
          quantity: 1,
          selectedAt: new Date(),
        }],
        totalAmount: parseFloat(state.pendingVendorSwitch.vehicle.total.replace('₹', '').replace(',', '')),
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return {
        ...state,
        currentQuotation: newQuotation,
        quotationHistory: historyUpdate,
        pendingVendorSwitch: null,
        error: null,
      };
    }

    case 'CANCEL_VENDOR_SWITCH':
      return {
        ...state,
        pendingVendorSwitch: null,
        error: null,
      };

    case 'CLEAR_QUOTATION':
      return {
        ...state,
        currentQuotation: null,
        error: null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'SAVE_QUOTATION_TO_HISTORY': {
      if (!state.currentQuotation) return state;

      return {
        ...state,
        quotationHistory: [...state.quotationHistory, state.currentQuotation],
        currentQuotation: null,
      };
    }

    case 'UPDATE_QUOTATION_STATUS': {
      const updatedHistory = state.quotationHistory.map(quotation =>
        quotation.id === action.payload.quotationId
          ? { ...quotation, status: action.payload.status, updatedAt: new Date() }
          : quotation
      );

      return {
        ...state,
        quotationHistory: updatedHistory,
      };
    }

    default:
      return state;
  }
}

interface QuotationContextType {
  state: QuotationState;
  setSearchParams: (params: QuotationSearchParams) => void;
  updateSearchParams: (params: Partial<QuotationSearchParams>) => void;
  addVehicleToQuotation: (vehicle: VehicleDetails) => void;
  removeVehicleFromQuotation: (vehicleId: string) => void;
  updateVehicleQuantity: (vehicleId: string, quantity: number) => void;
  confirmVendorSwitch: () => void;
  cancelVendorSwitch: () => void;
  clearQuotation: () => void;
  saveQuotationToHistory: () => void;
  updateQuotationStatus: (quotationId: string, status: Quotation['status']) => void;
  isVehicleSelected: (vehicleId: string) => boolean;
  getSelectedVehicleCount: () => number;
  getTotalQuotationAmount: () => number;
  canSelectVehicle: (vehicle: VehicleDetails) => { canSelect: boolean; reason?: string };
}

const QuotationContext = createContext<QuotationContextType | undefined>(undefined);

export function useQuotation() {
  const context = useContext(QuotationContext);
  if (context === undefined) {
    throw new Error('useQuotation must be used within a QuotationProvider');
  }
  return context;
}

interface QuotationProviderProps {
  children: React.ReactNode;
}

export function QuotationProvider({ children }: QuotationProviderProps) {
  const [state, dispatch] = useReducer(quotationReducer, initialState);

  const setSearchParams = useCallback((params: QuotationSearchParams) => {
    dispatch({ type: 'SET_SEARCH_PARAMS', payload: params });
  }, []);

  const updateSearchParams = useCallback((params: Partial<QuotationSearchParams>) => {
    dispatch({ type: 'UPDATE_SEARCH_PARAMS', payload: params });
  }, []);

  const addVehicleToQuotation = useCallback((vehicle: VehicleDetails) => {
    dispatch({ type: 'ADD_VEHICLE_TO_QUOTATION', payload: vehicle });
  }, []);

  const removeVehicleFromQuotation = useCallback((vehicleId: string) => {
    dispatch({ type: 'REMOVE_VEHICLE_FROM_QUOTATION', payload: vehicleId });
  }, []);

  const updateVehicleQuantity = useCallback((vehicleId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_VEHICLE_QUANTITY', payload: { vehicleId, quantity } });
  }, []);

  const confirmVendorSwitch = useCallback(() => {
    dispatch({ type: 'CONFIRM_VENDOR_SWITCH' });
  }, []);

  const cancelVendorSwitch = useCallback(() => {
    dispatch({ type: 'CANCEL_VENDOR_SWITCH' });
  }, []);

  const clearQuotation = useCallback(() => {
    dispatch({ type: 'CLEAR_QUOTATION' });
  }, []);

  const saveQuotationToHistory = useCallback(() => {
    dispatch({ type: 'SAVE_QUOTATION_TO_HISTORY' });
  }, []);

  const updateQuotationStatus = useCallback((quotationId: string, status: Quotation['status']) => {
    dispatch({ type: 'UPDATE_QUOTATION_STATUS', payload: { quotationId, status } });
  }, []);

  // Helper functions
  const isVehicleSelected = useCallback((vehicleId: string): boolean => {
    return state.currentQuotation?.items.some(item => item.vehicle.id === vehicleId) || false;
  }, [state.currentQuotation]);

  const getSelectedVehicleCount = useCallback((): number => {
    return state.currentQuotation?.items.reduce((count, item) => count + item.quantity, 0) || 0;
  }, [state.currentQuotation]);

  const getTotalQuotationAmount = useCallback((): number => {
    return state.currentQuotation?.totalAmount || 0;
  }, [state.currentQuotation]);

  const canSelectVehicle = useCallback((vehicle: VehicleDetails): { canSelect: boolean; reason?: string } => {
    // If no current quotation, can always select
    if (!state.currentQuotation) {
      return { canSelect: true };
    }

    // If same vendor, can select
    if (state.currentQuotation.vendorId === vehicle.vendorId) {
      return { canSelect: true };
    }

    // Different vendor - will require confirmation
    return { 
      canSelect: true, 
      reason: `This will clear your current quotation from ${state.currentQuotation.vendorName} and start a new one with ${vehicle.vendorName}` 
    };
  }, [state.currentQuotation]);

  const contextValue: QuotationContextType = {
    state,
    setSearchParams,
    updateSearchParams,
    addVehicleToQuotation,
    removeVehicleFromQuotation,
    updateVehicleQuantity,
    confirmVendorSwitch,
    cancelVendorSwitch,
    clearQuotation,
    saveQuotationToHistory,
    updateQuotationStatus,
    isVehicleSelected,
    getSelectedVehicleCount,
    getTotalQuotationAmount,
    canSelectVehicle,
  };

  return (
    <QuotationContext.Provider value={contextValue}>
      {children}
    </QuotationContext.Provider>
  );
}
