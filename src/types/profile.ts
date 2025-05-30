export interface ProfileData {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  profile_image_url: string;
  bio: string;
  business_name: string;
  business_description: string;
  years_of_experience: number;
  specialties: string[];
  certifications: string[];
  insurance_info: string;
  license_number: string;
  service_areas: string[];
  portfolio_images: string[];
  created_at: string;
  updated_at: string;
} 