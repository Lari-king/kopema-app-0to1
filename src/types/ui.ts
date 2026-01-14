/**
 * UI-only types for KOPEMA prototype
 * 
 * ⚠️ THESE ARE NOT BUSINESS LOGIC TYPES
 * These types describe UI component props only.
 * Real business types should be defined in your backend/API layer.
 */

// Visual-only types for UI components
export type MembershipTier = 'free' | 'plus' | 'vip';
export type ServiceType = 'beauty' | 'food' | 'fashion' | 'realestate';

export interface AdvertiserCardData {
  id: string;
  name: string;
  photo: string;
  rating: number;
  priceLevel: 1 | 2 | 3;
  district: string;
  isOpen: boolean;
  tags: string[];
}

export interface BookingFormData {
  date: string;
  time: string;
  serviceLocation: 'advertiser' | 'client';
  clientAddress?: string;
  needsTransport: boolean;
  transportType?: 'taxi' | 'moto';
  guardianService: boolean;
}

export interface UserProfileData {
  name: string;
  email: string;
  photo: string;
  membershipTier: MembershipTier;
  memberCardNumber?: string;
}

export interface SearchFiltersData {
  query: string;
  serviceType?: ServiceType;
  district?: string;
  priceLevel?: (1 | 2 | 3)[];
  minRating?: number;
}
