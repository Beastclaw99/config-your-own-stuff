import { useState } from 'react';
import { useClientDashboard } from '@/hooks/useClientDashboard';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectsTab } from './tabs/ProjectsTab';
import { ApplicationsTab } from './tabs/ApplicationsTab';
import { CreateProjectTab } from './tabs/CreateProjectTab';
import { PaymentsTab } from './tabs/PaymentsTab';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const ClientDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('projects');
  
  const {
    projects,
    applications,
    payments,
    reviews,
    profileData,
    isLoading,
    error,
    // Project operations
    editProject,
    projectToDelete,
    editedProject,
    newProject,
    isProjectSubmitting,
    handleEditInitiate,
    handleEditCancel,
    handleUpdateProject,
    handleDeleteInitiate,
    handleDeleteCancel,
    handleDeleteProject,
    // Review operations
    projectToReview,
    reviewData,
    isReviewSubmitting,
    handleReviewInitiate,
    handleReviewCancel,
    handleReviewSubmit,
    // Application operations
    handleApplicationUpdate,
    // Data refresh
    fetchDashboardData
  } = useClientDashboard(user?.id || '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="create">Create Project</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <ProjectsTab
            projects={projects}
            editProject={editProject}
            projectToDelete={projectToDelete}
            editedProject={editedProject}
            isSubmitting={isProjectSubmitting}
            onEditInitiate={handleEditInitiate}
            onEditCancel={handleEditCancel}
            onUpdateProject={handleUpdateProject}
            onDeleteInitiate={handleDeleteInitiate}
            onDeleteCancel={handleDeleteCancel}
            onDeleteProject={handleDeleteProject}
            onReviewInitiate={handleReviewInitiate}
          />
        </TabsContent>

        <TabsContent value="applications">
          <ApplicationsTab
            applications={applications}
            onApplicationUpdate={handleApplicationUpdate}
          />
        </TabsContent>

        <TabsContent value="create">
          <CreateProjectTab
            onProjectCreated={fetchDashboardData}
          />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentsTab
            payments={payments}
            profileData={profileData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
