
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Users, Clock } from 'lucide-react';

interface CreateProjectTabProps {
  newProject: any;
  setNewProject: any;
  handleCreateProject: any;
  isSubmitting: boolean;
}

const CreateProjectTab: React.FC<CreateProjectTabProps> = () => {
  const navigate = useNavigate();

  const handleCreateProject = () => {
    navigate('/client/create-project');
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <Plus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create a New Project</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Post your project and connect with qualified professionals on ProLinkTT. 
          Our comprehensive form will help you define all the details needed to get started.
        </p>
        
        <Button onClick={handleCreateProject} size="lg" className="mb-8">
          <Plus className="h-5 w-5 mr-2" />
          Create Project
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <FileText className="h-8 w-8 text-blue-500 mb-2" />
            <CardTitle className="text-lg">Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">
              Define your project with title, description, category, location, and requirements.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-8 w-8 text-green-500 mb-2" />
            <CardTitle className="text-lg">Find Professionals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">
              Dispatch your project to vetted professionals that match your requirements.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Clock className="h-8 w-8 text-purple-500 mb-2" />
            <CardTitle className="text-lg">Track Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">
              Monitor your project status and communicate with professionals in real-time.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateProjectTab;
