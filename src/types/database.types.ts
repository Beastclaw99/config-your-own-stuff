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
          account_type: 'client' | 'professional'
          first_name: string | null
          last_name: string | null
          rating: number | null
          skills: string[] | null
          created_at: string
          updated_at: string | null
          location: string | null
          phone: string | null
          portfolio_urls: string[] | null
          is_available: boolean
          verification_status: 'pending' | 'verified' | 'rejected'
          hourly_rate: number | null
          years_experience: number | null
          bio: string | null
          certifications: string[] | null
        }
        Insert: {
          id: string
          account_type: 'client' | 'professional'
          first_name?: string | null
          last_name?: string | null
          rating?: number | null
          skills?: string[] | null
          created_at?: string
          updated_at?: string | null
          location?: string | null
          phone?: string | null
          portfolio_urls?: string[] | null
          is_available?: boolean
          verification_status?: 'pending' | 'verified' | 'rejected'
          hourly_rate?: number | null
          years_experience?: number | null
          bio?: string | null
          certifications?: string[] | null
        }
        Update: {
          id?: string
          account_type?: 'client' | 'professional'
          first_name?: string | null
          last_name?: string | null
          rating?: number | null
          skills?: string[] | null
          created_at?: string
          updated_at?: string | null
          location?: string | null
          phone?: string | null
          portfolio_urls?: string[] | null
          is_available?: boolean
          verification_status?: 'pending' | 'verified' | 'rejected'
          hourly_rate?: number | null
          years_experience?: number | null
          bio?: string | null
          certifications?: string[] | null
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
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'success' | 'warning' | 'error'
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'info' | 'success' | 'warning' | 'error'
          read?: boolean
          created_at?: string
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