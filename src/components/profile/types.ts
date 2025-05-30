export interface ProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  account_type: 'client' | 'professional';
  skills: string[] | null;
  rating: number | null;
  created_at: string;
  updated_at: string;
  location: string | null;
  phone: string | null;
  portfolio_urls: string[] | null;
  is_available: boolean;
  verification_status: 'pending' | 'verified' | 'rejected';
  hourly_rate: number | null;
  years_experience: number | null;
  bio: string | null;
  certifications: string[] | null;
}

export interface ProfessionalStats {
  completedProjects: number;
  activeProjects: number;
  totalEarnings: number;
  averageRating: number;
  totalReviews: number;
}

export interface ClientStats {
  postedProjects: number;
  completedProjects: number;
  activeProjects: number;
  totalSpent: number;
}
