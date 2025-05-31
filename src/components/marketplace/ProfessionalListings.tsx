import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import ProfessionalCard from './ProfessionalCard';
import ProfessionalListItem from './ProfessionalListItem';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfessionalListingsProps {
  viewMode: 'grid' | 'list';
  filters: {
    skills?: string[];
    rating?: number;
    location?: string;
    hourlyRate?: {
      min?: number;
      max?: number;
    };
    availability?: 'available' | 'busy' | 'unavailable';
    verificationStatus?: 'verified' | 'pending' | 'unverified';
  };
  sortBy?: {
    field: 'rating' | 'hourly_rate' | 'completed_projects' | 'response_rate' | 'on_time_completion';
    order: 'asc' | 'desc';
  };
}

const ProfessionalListings: React.FC<ProfessionalListingsProps> = ({ viewMode, filters, sortBy }) => {
  const [professionals, setProfessionals] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('profiles')
          .select('*')
          .eq('account_type', 'professional');

        // Apply filters
        if (filters.skills?.length) {
          query = query.contains('skills', filters.skills);
        }
        if (filters.rating) {
          query = query.gte('rating', filters.rating);
        }
        if (filters.location) {
          query = query.ilike('location', `%${filters.location}%`);
        }
        if (filters.hourlyRate?.min) {
          query = query.gte('hourly_rate', filters.hourlyRate.min);
        }
        if (filters.hourlyRate?.max) {
          query = query.lte('hourly_rate', filters.hourlyRate.max);
        }
        if (filters.availability) {
          query = query.eq('availability', filters.availability);
        }
        if (filters.verificationStatus) {
          query = query.eq('verification_status', filters.verificationStatus);
        }

        // Apply sorting
        if (sortBy?.field) {
          query = query.order(sortBy.field, { ascending: sortBy.order === 'asc' });
        }

        const { data, error } = await query;

        if (error) throw error;
        setProfessionals(data || []);
      } catch (err) {
        console.error('Error fetching professionals:', err);
        setError('Failed to load professionals. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [filters, sortBy]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-ttc-blue-700" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        <p>{error}</p>
      </div>
    );
  }

  if (professionals.length === 0) {
    return (
      <div className="text-center text-gray-600 py-8">
        <p>No professionals found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
      {professionals.map((professional) => (
        viewMode === 'grid' ? (
          <ProfessionalCard key={professional.id} professional={professional} />
        ) : (
          <ProfessionalListItem key={professional.id} professional={professional} />
        )
      ))}
    </div>
  );
};

export default ProfessionalListings;
