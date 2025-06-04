
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Project } from '../../types';

interface EditProjectFormProps {
  project: Project;
  editedProject: {
    title: string;
    description: string;
    budget: string;
  };
  isSubmitting: boolean;
  onCancel: () => void;
  onSave: (updates: { title: string; description: string; budget: string }) => Promise<void>;
}

const EditProjectForm: React.FC<EditProjectFormProps> = ({ 
  project,
  editedProject, 
  isSubmitting,
  onCancel,
  onSave
}) => {
  const handleSave = async () => {
    await onSave(editedProject);
  };

  return (
    <Card className="mt-6 border-blue-200">
      <CardHeader className="bg-blue-50">
        <CardTitle>Edit Project</CardTitle>
        <CardDescription>Make changes to your project details</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Project Title</Label>
            <Input 
              id="edit-title" 
              value={editedProject.title}
              readOnly
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea 
              id="edit-description" 
              className="min-h-[120px]"
              value={editedProject.description}
              readOnly
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-budget">Budget</Label>
            <Input 
              id="edit-budget" 
              value={editedProject.budget}
              readOnly
              placeholder="e.g., $5,000 or Negotiable"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSubmitting}>
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EditProjectForm;
