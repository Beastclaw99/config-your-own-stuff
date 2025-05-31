import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { Camera, Loader2, CheckCircle, AlertCircle, Clock, X } from 'lucide-react';
import { ProfileData } from '@/components/profile/types';
import type { Database } from '@/integrations/supabase/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PortfolioUpload from '@/components/profile/PortfolioUpload';
import { Badge } from '@/components/ui/badge';

type Profile = Database['public']['Tables']['profiles']['Row'];

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
        availability: data.availability || '',
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only update if it's a comma-separated list (for backward compatibility)
    if (value.includes(',')) {
      const skills = value.split(',').map(skill => skill.trim()).filter(Boolean);
      setFormData(prev => ({
        ...prev,
        skills
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setIsSaving(true);
      
      // Validate hourly rate
      const hourlyRate = formData.hourly_rate ? parseFloat(formData.hourly_rate) : null;
      if (formData.hourly_rate && isNaN(hourlyRate!)) {
        throw new Error('Invalid hourly rate');
      }

      // Validate availability
      if (formData.availability && !['available', 'busy', 'unavailable'].includes(formData.availability)) {
        throw new Error('Invalid availability status');
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          bio: formData.bio,
          location: formData.location,
          phone: formData.phone,
          email: formData.email,
          hourly_rate: hourlyRate,
          availability: formData.availability || null,
          skills: formData.skills,
          profile_visibility: formData.profile_visibility,
          show_email: formData.show_email,
          show_phone: formData.show_phone,
          allow_messages: formData.allow_messages,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully!"
      });
      
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      setIsSaving(true);
      
      // Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      // Update profile with new image URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Profile photo updated successfully!"
      });
      
      // Refresh profile data
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      // Cast the updated profile to our ProfileData type
      const profileData: ProfileData = {
        ...updatedProfile,
        bio: updatedProfile.bio || null,
        location: updatedProfile.location || null,
        phone: updatedProfile.phone || null,
        email: updatedProfile.email || null,
        hourly_rate: updatedProfile.hourly_rate || null,
        availability: (updatedProfile.availability as 'available' | 'busy' | 'unavailable') || null,
        skills: updatedProfile.skills || null,
        certifications: updatedProfile.certifications || null,
        completed_projects: updatedProfile.completed_projects || null,
        response_rate: updatedProfile.response_rate || null,
        on_time_completion: updatedProfile.on_time_completion || null,
        profile_visibility: updatedProfile.profile_visibility ?? true,
        show_email: updatedProfile.show_email ?? true,
        show_phone: updatedProfile.show_phone ?? true,
        allow_messages: updatedProfile.allow_messages ?? true,
        profile_image: updatedProfile.profile_image || null,
        verification_status: (updatedProfile.verification_status as 'unverified' | 'pending' | 'verified') || null,
      };
      
      setProfile(profileData);
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Error",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-ttc-blue-700" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Edit Profile</h1>
            <Button
              variant="outline"
              onClick={() => navigate('/profile')}
            >
              Cancel
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="contact">Contact Information</TabsTrigger>
              <TabsTrigger value="professional">Professional Details</TabsTrigger>
              <TabsTrigger value="photo">Profile Photo</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                          id="first_name"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                          id="last_name"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="min-h-[120px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contact">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="professional">
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile?.account_type === 'professional' && (
                      <>
                        <div className="space-y-2">
                          <Label>Verification Status</Label>
                          <div className="flex items-center gap-2">
                            {profile.verification_status === 'verified' ? (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Verified
                              </Badge>
                            ) : profile.verification_status === 'pending' ? (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Clock className="h-4 w-4 mr-1" />
                                Pending Review
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-800">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Unverified
                              </Badge>
                            )}
                          </div>
                          {profile.verification_status !== 'verified' && (
                            <p className="text-sm text-gray-600 mt-1">
                              Complete your profile and upload required documents to get verified.
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="hourly_rate">Hourly Rate (TTD)</Label>
                          <Input
                            id="hourly_rate"
                            name="hourly_rate"
                            type="number"
                            value={formData.hourly_rate}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="availability">Availability</Label>
                          <Select
                            value={formData.availability}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value as 'available' | 'busy' | 'unavailable' }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select availability" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">Available</SelectItem>
                              <SelectItem value="busy">Busy</SelectItem>
                              <SelectItem value="unavailable">Unavailable</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="skills">Skills</Label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {formData.skills.map((skill, index) => (
                              <Badge 
                                key={index} 
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      skills: prev.skills.filter((_, i) => i !== index)
                                    }));
                                  }}
                                  className="ml-1 hover:text-red-500"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              id="skills"
                              name="skills"
                              placeholder="Add a skill"
                              value={formData.skills.join(', ')}
                              onChange={handleSkillsChange}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const input = document.getElementById('skills') as HTMLInputElement;
                                const newSkill = input.value.trim();
                                if (newSkill && !formData.skills.includes(newSkill)) {
                                  setFormData(prev => ({
                                    ...prev,
                                    skills: [...prev.skills, newSkill]
                                  }));
                                  input.value = '';
                                }
                              }}
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                        <PortfolioUpload userId={user?.id || ''} onUploadComplete={() => fetchProfile()} />
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="photo">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Photo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center gap-4">
                      <Avatar className="h-32 w-32">
                        <AvatarImage src={profile?.profile_image || `https://api.dicebear.com/6/initials/svg?seed=${profile?.first_name} ${profile?.last_name}`} />
                        <AvatarFallback className="text-2xl">{profile?.first_name?.[0]}{profile?.last_name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          id="photo-upload"
                        />
                        <Label
                          htmlFor="photo-upload"
                          className="cursor-pointer"
                        >
                          <Button
                            type="button"
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <Camera className="h-4 w-4" />
                            Upload Photo
                          </Button>
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <div className="mt-6 flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/profile')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default EditProfile; 