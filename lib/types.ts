export interface User {
  email: string;
  role: string;
  phone_number: string;
}

export interface Tokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  user: User;
  tokens: Tokens;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export type UserRole = 'admin' | 'customer' | 'driver' | 'manager' | 'vendor';

export interface SessionUser extends User {
  isAuthenticated: boolean;
}

// Truck API Types
export interface TruckType {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface TruckSearchResult {
  id: string;
  registration_number: string;
  truck_type: string;
  capacity: string;
  make: string;
  model: string;
  year: string;
  availability_status: string;
  base_price_per_km: string;
  current_location_address: string;
  vendor_id: number;
  vendor_name: string;
  vendor_phone: string;
  primary_image?: string;
}

// API Response structure for truck search
export interface TruckSearchResponse {
  matching_routes: number;
  search_criteria: {
    origin_city: string;
    destination_city: string;
    total_distance_km: number;
    delivery_date: string | null;
    pickup_date: string;
    number_of_trucks: number;
    weight_tons: number;
  };
  total_found: number;
  trucks: TruckSearchResult[];
}

// Quotation Request Types
export interface QuotationRequestPayload {
  vendor_id: string;
  vendor_name: string;
  total_amount: number;
  origin_pincode: string;
  destination_pincode: string;
  pickup_date: string;
  drop_date: string;
  weight: string;
  weight_unit: string;
  vehicle_type?: string;
  urgency_level: string;
  items: QuotationRequestItem[];
}

export interface QuotationRequestItem {
  vehicle_id: string;
  vehicle_model: string;
  vehicle_type: string;
  max_weight: string;
  gps_number: string;
  unit_price: string;
  quantity: number;
  estimated_delivery: string;
}

export interface QuotationRequestResponse {
  id: string;
  status: string;
  message: string;
  quotation_request_id?: string;
  created_at: string;
}

// Truck search parameters - matching API URL format
export interface TruckSearchParams {
  origin_pincode?: string;
  destination_pincode?: string;
  weight?: number;
  pickup_date?: string; // ISO date format YYYY-MM-DD
  drop_date?: string; // ISO date format YYYY-MM-DD
  truck_type?: string;
  capacity_min?: number;
  capacity_max?: number;
  availability_status?: string;
  max_price_per_km?: number;
  vendor_name?: string;
  page?: number;
  limit?: number;
}
