
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import PortfolioUpload from '@/components/profile/PortfolioUpload';
import { ProfileData } from '@/components/profile/types';

const EditProfile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'personal';
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    location: '',
    phone: '',
    email: '',
    hourly_rate: '',
    availability: '' as 'available' | 'busy' | 'unavailable' | '',
    skills: [] as string[],
    profile_visibility: true,
    show_email: true,
    show_phone: true,
    allow_messages: true,
  });

  const fetchProfile = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      // Cast the database profile to our ProfileData type
      const profileData: ProfileData = {
        ...data,
        bio: data.bio || null,
        location: data.location || null,
        phone: data.phone || null,
        email: data.email || null,
        hourly_rate: data.hourly_rate || null,
        availability: (data.availability as 'available' | 'busy' | 'unavailable') || null,
        skills: data.skills || null,
        certifications: data.certifications || null,
        completed_projects: data.completed_projects || null,
        response_rate: data.response_rate || null,
        on_time_completion: data.on_time_completion || null,
        profile_visibility: data.profile_visibility ?? true,
        show_email: data.show_email ?? true,
        show_phone: data.show_phone ?? true,
        allow_messages: data.allow_messages ?? true,
        profile_image: data.profile_image || null,
        verification_status: (data.verification_status as 'unverified' | 'pending' | 'verified') || null,
      };
      
      setProfile(profileData);
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        bio: data.bio || '',
        location: data.location || '',
        phone: data.phone || '',
        email: data.email || '',
        hourly_rate: data.hourly_rate?.toString() || '',
        availability: (data.availability as 'available' | 'busy' | 'unavailable') || '',
        skills: data.skills || [],
        profile_visibility: data.profile_visibility ?? true,
        show_email: data.show_email ?? true,
        show_phone: data.show_phone ?? true,
        allow_messages: data.allow_messages ?? true,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return (
    <Card>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div>
              {/* Render your profile form here */}
            </div>
            <PortfolioUpload userId={user?.id || ''} onUploadComplete={fetchProfile} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EditProfile;
