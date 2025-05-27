
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectsTab from './client/ProjectsTab';
import ApplicationsTab from './client/ApplicationsTab';
import CreateProjectTab from './client/CreateProjectTab';
import PaymentsTab from './client/PaymentsTab';
import ProfileTab from './client/ProfileTab';
import { useClientDashboard } from '@/hooks/useClientDashboard';
import { useProjectOperations } from '@/hooks/useProjectOperations';
import { useReviewOperations } from '@/hooks/useReviewOperations';
import { useApplicationOperations } from '@/hooks/useApplicationOperations';

interface ClientDashboardProps {
  userId: string;
  initialTab?: string;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ userId, initialTab = 'projects' }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);

  // Use custom hooks for data fetching and operations
  const { 
    projects, 
    applications, 
    payments, 
    reviews, 
    profileData, 
    isLoading, 
    fetchDashboardData 
  } = useClientDashboard(userId);
  
  const { 
    editProject, 
    projectToDelete, 
    editedProject, 
    newProject, 
    isSubmitting: isProjectSubmitting, 
    setEditedProject, 
    setNewProject, 
    handleCreateProject, 
    handleEditInitiate, 
    handleEditCancel, 
    handleUpdateProject, 
    handleDeleteInitiate, 
    handleDeleteCancel, 
    handleDeleteProject 
  } = useProjectOperations(userId, fetchDashboardData);
  
  const { 
    projectToReview, 
    reviewData, 
    isSubmitting: isReviewSubmitting, 
    setReviewData, 
    handleReviewInitiate, 
    handleReviewCancel, 
    handleReviewSubmit 
  } = useReviewOperations(userId, applications, fetchDashboardData);
  
  const { 
    isProcessing, 
    handleApplicationUpdate 
  } = useApplicationOperations(userId, fetchDashboardData);
  
  // Set the active tab based on initialTab prop
  useEffect(() => {
    if (initialTab && ['projects', 'applications', 'create', 'payments', 'profile'].includes(initialTab)) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  
  // Props to pass to tab components
  const projectsTabProps = {
    isLoading,
    projects,
    applications,
    editProject,
    projectToDelete,
    editedProject,
    isSubmitting: isProjectSubmitting,
    setEditedProject,
    handleEditInitiate,
    handleEditCancel,
    handleUpdateProject,
    handleDeleteInitiate,
    handleDeleteCancel,
    handleDeleteProject
  };
  
  const applicationsTabProps = {
    isLoading,
    projects,
    applications,
    handleApplicationUpdate
  };
  
  const paymentsTabProps = {
    isLoading,
    projects,
    reviews,
    applications,
    projectToReview,
    reviewData,
    isSubmitting: isReviewSubmitting,
    handleReviewInitiate,
    handleReviewCancel,
    handleReviewSubmit,
    setReviewData
  };
  
  const profileTabProps = {
    profileData,
    projects,
    navigate
  };
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="projects" data-value="projects">Your Projects</TabsTrigger>
        <TabsTrigger value="applications" data-value="applications">Applications</TabsTrigger>
        <TabsTrigger value="create" data-value="create">Post New Project</TabsTrigger>
        <TabsTrigger value="payments" data-value="payments">Payments</TabsTrigger>
        <TabsTrigger value="profile" data-value="profile">Profile</TabsTrigger>
      </TabsList>
      
      <TabsContent value="projects">
        <ProjectsTab {...projectsTabProps} />
      </TabsContent>
      
      <TabsContent value="applications">
        <ApplicationsTab {...applicationsTabProps} />
      </TabsContent>
      
      <TabsContent value="create">
        <CreateProjectTab />
      </TabsContent>
      
      <TabsContent value="payments">
        <PaymentsTab {...paymentsTabProps} />
      </TabsContent>
      
      <TabsContent value="profile">
        <ProfileTab {...profileTabProps} />
      </TabsContent>
    </Tabs>
  );
};

export default ClientDashboard;
