export interface ProfileData {
  id: string;
  account_type: 'client' | 'professional';
  first_name: string;
  last_name: string;
  rating: number | null;
  skills: string[];
  created_at: string;
  updated_at: string | null;
  location: string;
  phone: string;
  portfolio_urls: string[];
  is_available: boolean;
  verification_status: 'pending' | 'verified' | 'rejected';
  hourly_rate: number | null;
  years_experience: number | null;
  bio: string;
  certifications: string[];
} 