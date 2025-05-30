import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ProfileData } from '@/types/profile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalDetails from '@/components/profile/PersonalDetails';
import ProfessionalDetails from '@/components/profile/ProfessionalDetails';
import PortfolioUpload from '@/components/profile/PortfolioUpload';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Calendar, Phone, Mail } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<ProfileData>({
    id: '',
    user_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    profile_image_url: '',
    bio: '',
    business_name: '',
    business_description: '',
    years_of_experience: 0,
    specialties: [],
    certifications: [],
    insurance_info: '',
    license_number: '',
    service_areas: [],
    portfolio_images: [],
    created_at: '',
    updated_at: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        // Ensure all required fields are present
        const profileData: ProfileData = {
          id: data.id || '',
          user_id: data.user_id || user?.id || '',
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || user?.email || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          zip_code: data.zip_code || '',
          country: data.country || '',
          profile_image_url: data.profile_image_url || '',
          bio: data.bio || '',
          business_name: data.business_name || '',
          business_description: data.business_description || '',
          years_of_experience: data.years_of_experience || 0,
          specialties: data.specialties || [],
          certifications: data.certifications || [],
          insurance_info: data.insurance_info || '',
          license_number: data.license_number || '',
          service_areas: data.service_areas || [],
          portfolio_images: data.portfolio_images || [],
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString()
        };
        setFormData(profileData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
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
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: formData.id || undefined,
          user_id: user?.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip_code,
          country: formData.country,
          profile_image_url: formData.profile_image_url,
          bio: formData.bio,
          business_name: formData.business_name,
          business_description: formData.business_description,
          years_of_experience: formData.years_of_experience,
          specialties: formData.specialties,
          certifications: formData.certifications,
          insurance_info: formData.insurance_info,
          license_number: formData.license_number,
          service_areas: formData.service_areas,
          portfolio_images: formData.portfolio_images,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

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

  if (isLoading) {
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
                      userId={user?.id || ''}
                      currentUrls={formData.portfolio_images}
                      onUrlsUpdate={(urls) => handleFormDataChange('portfolio_images', urls)}
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
                      <AvatarImage src={formData.profile_image_url || `https://api.dicebear.com/6/initials/svg?seed=${formData.first_name} ${formData.last_name}`} />
                      <AvatarFallback className="text-2xl">
                        {formData.first_name.charAt(0)}{formData.last_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="mt-4">
                    <h1 className="text-2xl font-bold">{formData.first_name} {formData.last_name}</h1>
                    <p className="text-gray-600">{formData.business_name}</p>
                  </div>

                  <div className="mt-4 space-y-2 w-full">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {formData.city}, {formData.state}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{formData.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{formData.email}</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4 w-full">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience</span>
                      <span className="font-semibold">{formData.years_of_experience} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Specialties</span>
                      <span className="font-semibold">{formData.specialties.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Certifications</span>
                      <span className="font-semibold">{formData.certifications.length}</span>
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
