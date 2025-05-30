export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          first_name: string
          last_name: string
          email: string
          phone: string
          address: string
          city: string
          state: string
          zip_code: string
          country: string
          profile_image_url: string
          bio: string
          business_name: string
          business_description: string
          years_of_experience: number
          specialties: string[]
          certifications: string[]
          insurance_info: string
          license_number: string
          service_areas: string[]
          portfolio_images: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string
          country?: string
          profile_image_url?: string
          bio?: string
          business_name?: string
          business_description?: string
          years_of_experience?: number
          specialties?: string[]
          certifications?: string[]
          insurance_info?: string
          license_number?: string
          service_areas?: string[]
          portfolio_images?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string
          country?: string
          profile_image_url?: string
          bio?: string
          business_name?: string
          business_description?: string
          years_of_experience?: number
          specialties?: string[]
          certifications?: string[]
          insurance_info?: string
          license_number?: string
          service_areas?: string[]
          portfolio_images?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'success' | 'warning' | 'error'
          read: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'success' | 'warning' | 'error'
          read?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'info' | 'success' | 'warning' | 'error'
          read?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 