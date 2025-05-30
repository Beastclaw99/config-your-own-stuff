import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Database } from '@/types/database.types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

interface ProfessionalDetailsProps {
  formData: ProfileRow;
  onFormDataChange: (field: string, value: any) => void;
}

const ProfessionalDetails: React.FC<ProfessionalDetailsProps> = ({
  formData,
  onFormDataChange
}) => {
  const handleSkillAdd = (value: string) => {
    if (value && !formData.skills?.includes(value)) {
      onFormDataChange('skills', [...(formData.skills || []), value]);
    }
  };

  const handleSkillRemove = (skill: string) => {
    onFormDataChange('skills', formData.skills?.filter(s => s !== skill) || []);
  };

  const handleCertificationAdd = (value: string) => {
    if (value && !formData.certifications?.includes(value)) {
      onFormDataChange('certifications', [...(formData.certifications || []), value]);
    }
  };

  const handleCertificationRemove = (certification: string) => {
    onFormDataChange('certifications', formData.certifications?.filter(c => c !== certification) || []);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio || ''}
            onChange={(e) => onFormDataChange('bio', e.target.value || null)}
            placeholder="Tell us about yourself and your experience"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="years_experience">Years of Experience</Label>
          <Input
            id="years_experience"
            type="number"
            min="0"
            value={formData.years_experience || ''}
            onChange={(e) => onFormDataChange('years_experience', e.target.value ? parseInt(e.target.value) : null)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hourly_rate">Hourly Rate (TTD)</Label>
          <Input
            id="hourly_rate"
            type="number"
            min="0"
            value={formData.hourly_rate || ''}
            onChange={(e) => onFormDataChange('hourly_rate', e.target.value ? parseInt(e.target.value) : null)}
          />
        </div>

        <div className="space-y-2">
          <Label>Skills</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.skills?.map((skill, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {skill}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0"
                  onClick={() => handleSkillRemove(skill)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add a skill"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSkillAdd((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Certifications</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.certifications?.map((certification, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {certification}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0"
                  onClick={() => handleCertificationRemove(certification)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add a certification"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCertificationAdd((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => onFormDataChange('location', e.target.value)}
            placeholder="Enter your location"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="verification_status">Verification Status</Label>
          <Select
            value={formData.verification_status}
            onValueChange={(value) => onFormDataChange('verification_status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select verification status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="is_available">Availability</Label>
          <Select
            value={formData.is_available ? 'true' : 'false'}
            onValueChange={(value) => onFormDataChange('is_available', value === 'true')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Available</SelectItem>
              <SelectItem value="false">Not Available</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalDetails; 