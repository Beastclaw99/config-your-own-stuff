import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle } from 'lucide-react';
import BasicDetailsStep from './steps/BasicDetailsStep';
import RequirementsStep from './steps/RequirementsStep';
import BudgetTimelineStep from './steps/BudgetTimelineStep';
import MilestonesDeliverablesStep from './steps/MilestonesDeliverablesStep';
import ReviewStep from './steps/ReviewStep';
import { ProjectData } from './types';

const ProjectCreationWizard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState<ProjectData>({
    title: '',
    description: '',
    category: '',
    location: '',
    requirements: [],
    skills: [],
    budget: 0,
    timeline: '',
    urgency: '',
    milestones: [],
    deliverables: []
  });

  const steps = [
    { number: 1, title: 'Basic Details', component: BasicDetailsStep },
    { number: 2, title: 'Requirements', component: RequirementsStep },
    { number: 3, title: 'Budget & Timeline', component: BudgetTimelineStep },
    { number: 4, title: 'Milestones & Deliverables', component: MilestonesDeliverablesStep },
    { number: 5, title: 'Review', component: ReviewStep }
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDataUpdate = (stepData: Partial<ProjectData>) => {
    setProjectData(prev => ({ ...prev, ...stepData }));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a project",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create the project first
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert([
          {
            title: projectData.title,
            description: projectData.description,
            category: projectData.category,
            location: projectData.location,
            requirements: projectData.requirements,
            required_skills: projectData.skills.join(','),
            budget: projectData.budget.toString(),
            expected_timeline: projectData.timeline,
            urgency: projectData.urgency,
            client_id: user.id,
            status: 'open'
          }
        ])
        .select()
        .single();

      if (projectError) throw projectError;

      // Create milestones
      if (projectData.milestones.length > 0) {
        const { error: milestonesError } = await supabase
          .from('project_milestones')
          .insert(
            projectData.milestones.map(milestone => ({
              ...milestone,
              project_id: project.id,
              created_by: user.id,
              status: 'not_started',
              is_complete: false
            }))
          );

        if (milestonesError) throw milestonesError;
      }

      // Create deliverables
      if (projectData.deliverables.length > 0) {
        const { error: deliverablesError } = await supabase
          .from('project_deliverables')
          .insert(
            projectData.deliverables.map(deliverable => ({
              ...deliverable,
              project_id: project.id,
              uploaded_by: user.id,
              file_url: deliverable.deliverable_type === 'file' ? deliverable.content || '' : ''
            }))
          );

        if (deliverablesError) throw deliverablesError;
      }

      toast({
        title: "Success",
        description: "Project created successfully!"
      });

      // Navigate to the project details page
      navigate(`/project/${project.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const progress = (currentStep / steps.length) * 100;

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicDetailsStep data={projectData} onUpdate={handleDataUpdate} />;
      case 2:
        return <RequirementsStep data={projectData} onUpdate={handleDataUpdate} />;
      case 3:
        return <BudgetTimelineStep data={projectData} onUpdate={handleDataUpdate} />;
      case 4:
        return <MilestonesDeliverablesStep data={projectData} onUpdate={handleDataUpdate} />;
      case 5:
        return <ReviewStep data={projectData} />;
      default:
        return <BasicDetailsStep data={projectData} onUpdate={handleDataUpdate} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create New Project</CardTitle>
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-sm text-gray-600">
              {steps.map((step) => (
                <div key={step.number} className="flex items-center">
                  {currentStep > step.number ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <span className={`w-4 h-4 rounded-full text-xs flex items-center justify-center mr-1 ${
                      currentStep === step.number ? 'bg-blue-500 text-white' : 'bg-gray-300'
                    }`}>
                      {step.number}
                    </span>
                  )}
                  <span className={currentStep === step.number ? 'font-medium' : ''}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderCurrentStep()}
          
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep === steps.length ? (
              <Button onClick={handleSubmit}>
                Create Project
              </Button>
            ) : (
              <Button onClick={nextStep}>
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectCreationWizard;
