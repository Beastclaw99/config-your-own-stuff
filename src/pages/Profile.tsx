import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/database.types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalDetails from '@/components/profile/PersonalDetails';
import ProfessionalDetails from '@/components/profile/ProfessionalDetails';
import PortfolioUpload from '@/components/profile/PortfolioUpload';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Calendar, Phone, Mail } from 'lucide-react';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

const Profile: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProfileRow>({
    id: '',
    account_type: 'professional',
    first_name: null,
    last_name: null,
    rating: null,
    skills: null,
    created_at: new Date().toISOString(),
    updated_at: null,
    location: null,
    phone: null,
    portfolio_urls: null,
    is_available: true,
    verification_status: 'pending',
    hourly_rate: null,
    years_experience: null,
    bio: null,
    certifications: null
  });

  useEffect(() => {
    if (authLoading) return;
    
    if (user) {
      fetchProfile();
    } else {
      setIsLoading(false);
      setError('No user found. Please log in.');
    }
  }, [user, authLoading]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user?.id) {
        throw new Error('No user ID found');
      }

      const { data, error: supabaseError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (supabaseError) throw supabaseError;

      if (data) {
        setFormData(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to load profile data');
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormDataChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!user?.id) {
        throw new Error('No user ID found');
      }

      const { error: supabaseError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          account_type: formData.account_type,
          first_name: formData.first_name,
          last_name: formData.last_name,
          rating: formData.rating,
          skills: formData.skills,
          location: formData.location,
          phone: formData.phone,
          portfolio_urls: formData.portfolio_urls,
          is_available: formData.is_available,
          verification_status: formData.verification_status,
          hourly_rate: formData.hourly_rate,
          years_experience: formData.years_experience,
          bio: formData.bio,
          certifications: formData.certifications,
          updated_at: new Date().toISOString()
        });

      if (supabaseError) throw supabaseError;

      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive"
      });
    }
  };

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-red-500">{error}</p>
            <Button onClick={fetchProfile}>Retry</Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container-custom py-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <p>Please log in to view your profile.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList>
                <TabsTrigger value="personal">Personal Details</TabsTrigger>
                <TabsTrigger value="professional">Professional Details</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <PersonalDetails
                  formData={formData}
                  onFormDataChange={handleFormDataChange}
                />
              </TabsContent>

              <TabsContent value="professional">
                <ProfessionalDetails
                  formData={formData}
                  onFormDataChange={handleFormDataChange}
                />
              </TabsContent>

              <TabsContent value="portfolio">
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Images</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PortfolioUpload
                      userId={user.id}
                      currentUrls={formData.portfolio_urls || []}
                      onUrlsUpdate={(urls) => handleFormDataChange('portfolio_urls', urls)}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleSubmit}>
                Save Changes
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={`https://api.dicebear.com/6/initials/svg?seed=${formData.first_name || ''} ${formData.last_name || ''}`} />
                      <AvatarFallback className="text-2xl">
                        {formData.first_name?.charAt(0) || ''}{formData.last_name?.charAt(0) || ''}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="mt-4">
                    <h1 className="text-2xl font-bold">
                      {formData.first_name || ''} {formData.last_name || ''}
                    </h1>
                    <p className="text-gray-600 capitalize">{formData.account_type}</p>
                  </div>

                  <div className="mt-4 space-y-2 w-full">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {formData.location || 'No location set'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {formData.phone || 'No phone number set'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4 w-full">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience</span>
                      <span className="font-semibold">{formData.years_experience || 0} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Skills</span>
                      <span className="font-semibold">{formData.skills?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Certifications</span>
                      <span className="font-semibold">{formData.certifications?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
