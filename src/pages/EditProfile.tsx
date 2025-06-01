import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/profile/edit?tab=${value}`);
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          bio: formData.bio,
          location: formData.location,
          phone: formData.phone,
          email: formData.email,
          hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
          availability: formData.availability || null,
          skills: formData.skills,
          profile_visibility: formData.profile_visibility,
          show_email: formData.show_email,
          show_phone: formData.show_phone,
          allow_messages: formData.allow_messages,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
      
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="min-h-32"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="professional">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hourly_rate">Hourly Rate (TTD)</Label>
                  <Input
                    id="hourly_rate"
                    type="number"
                    value={formData.hourly_rate}
                    onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <select
                    id="availability"
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value as 'available' | 'busy' | 'unavailable' | '' })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select availability</option>
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="portfolio">
              {user?.id && (
                <PortfolioUpload userId={user.id} onUploadComplete={fetchProfile} />
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6">
            <Button
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProfile;
