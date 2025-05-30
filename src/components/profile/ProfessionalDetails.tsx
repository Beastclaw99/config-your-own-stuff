import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ProfessionalDetailsProps {
  formData: {
    business_name: string;
    business_description: string;
    years_of_experience: number;
    specialties: string[];
    certifications: string[];
    insurance_info: string;
    license_number: string;
    service_areas: string[];
  };
  onFormDataChange: (field: string, value: any) => void;
}

const ProfessionalDetails: React.FC<ProfessionalDetailsProps> = ({
  formData,
  onFormDataChange
}) => {
  const handleSpecialtyAdd = (value: string) => {
    if (value && !formData.specialties.includes(value)) {
      onFormDataChange('specialties', [...formData.specialties, value]);
    }
  };

  const handleSpecialtyRemove = (specialty: string) => {
    onFormDataChange('specialties', formData.specialties.filter(s => s !== specialty));
  };

  const handleCertificationAdd = (value: string) => {
    if (value && !formData.certifications.includes(value)) {
      onFormDataChange('certifications', [...formData.certifications, value]);
    }
  };

  const handleCertificationRemove = (certification: string) => {
    onFormDataChange('certifications', formData.certifications.filter(c => c !== certification));
  };

  const handleServiceAreaAdd = (value: string) => {
    if (value && !formData.service_areas.includes(value)) {
      onFormDataChange('service_areas', [...formData.service_areas, value]);
    }
  };

  const handleServiceAreaRemove = (area: string) => {
    onFormDataChange('service_areas', formData.service_areas.filter(a => a !== area));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="business_name">Business Name</Label>
          <Input
            id="business_name"
            value={formData.business_name}
            onChange={(e) => onFormDataChange('business_name', e.target.value)}
            placeholder="Enter your business name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="business_description">Business Description</Label>
          <Textarea
            id="business_description"
            value={formData.business_description}
            onChange={(e) => onFormDataChange('business_description', e.target.value)}
            placeholder="Describe your business and services"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="years_of_experience">Years of Experience</Label>
          <Input
            id="years_of_experience"
            type="number"
            min="0"
            value={formData.years_of_experience}
            onChange={(e) => onFormDataChange('years_of_experience', parseInt(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label>Specialties</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.specialties.map((specialty, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {specialty}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0"
                  onClick={() => handleSpecialtyRemove(specialty)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add a specialty"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSpecialtyAdd((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Certifications</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.certifications.map((certification, index) => (
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
          <Label htmlFor="insurance_info">Insurance Information</Label>
          <Textarea
            id="insurance_info"
            value={formData.insurance_info}
            onChange={(e) => onFormDataChange('insurance_info', e.target.value)}
            placeholder="Enter your insurance details"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="license_number">License Number</Label>
          <Input
            id="license_number"
            value={formData.license_number}
            onChange={(e) => onFormDataChange('license_number', e.target.value)}
            placeholder="Enter your professional license number"
          />
        </div>

        <div className="space-y-2">
          <Label>Service Areas</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.service_areas.map((area, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {area}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0"
                  onClick={() => handleServiceAreaRemove(area)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add a service area"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleServiceAreaAdd((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalDetails; 