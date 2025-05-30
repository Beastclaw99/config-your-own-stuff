import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { StarRating } from '@/components/ui/star-rating';

interface ProfessionalSearchFiltersProps {
  filters: {
    skills?: string[];
    rating?: number;
  };
  onFiltersChange: (filters: {
    skills?: string[];
    rating?: number;
  }) => void;
}

const SKILLS = [
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Painting',
  'Masonry',
  'Roofing',
  'HVAC',
  'Landscaping',
  'Flooring',
  'Drywall',
  'Tiling',
  'Welding',
  'Auto Repair',
  'Appliance Repair',
  'General Contractor'
];

const ProfessionalSearchFilters: React.FC<ProfessionalSearchFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const handleSkillToggle = (skill: string) => {
    const currentSkills = filters.skills || [];
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    
    onFiltersChange({ ...filters, skills: newSkills });
  };

  const handleRatingChange = (rating: number) => {
    onFiltersChange({ ...filters, rating });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <Label className="text-lg font-semibold mb-4 block">Skills</Label>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((skill) => (
                <Badge
                  key={skill}
                  variant={filters.skills?.includes(skill) ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-ttc-blue-50"
                  onClick={() => handleSkillToggle(skill)}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-lg font-semibold mb-4 block">Minimum Rating</Label>
            <div className="flex items-center space-x-2">
              <StarRating
                value={filters.rating || 0}
                onChange={handleRatingChange}
                size="large"
              />
              {filters.rating ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFiltersChange({ ...filters, rating: undefined })}
                >
                  <X className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
          </div>

          {(filters.skills?.length || filters.rating) && (
            <Button
              variant="outline"
              className="w-full"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalSearchFilters;
