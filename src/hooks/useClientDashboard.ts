import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project, Application, Payment, Review } from '@/components/dashboard/types';

interface DashboardState {
  projects: Project[];
  applications: Application[];
  payments: Payment[];
  reviews: Review[];
  profileData: any;
  isLoading: boolean;
  error: Error | null;
}

interface ProjectOperations {
  editProject: Project | null;
  projectToDelete: string | null;
  editedProject: Partial<Project> | null;
  newProject: Partial<Project> | null;
  isSubmitting: boolean;
}

interface ReviewOperations {
  projectToReview: string | null;
  reviewData: Partial<Review> | null;
  isSubmitting: boolean;
}

export const useClientDashboard = (userId: string) => {
  const { toast } = useToast();
  const [state, setState] = useState<DashboardState>({
    projects: [],
    applications: [],
    payments: [],
    reviews: [],
    profileData: null,
    isLoading: true,
    error: null
  });

  const [projectOps, setProjectOps] = useState<ProjectOperations>({
    editProject: null,
    projectToDelete: null,
    editedProject: null,
    newProject: null,
    isSubmitting: false
  });

  const [reviewOps, setReviewOps] = useState<ReviewOperations>({
    projectToReview: null,
    reviewData: null,
    isSubmitting: false
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Fetch client's profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;
      
      // Fetch client's projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', userId)
        .order('created_at', { ascending: false });
      
      if (projectsError) throw projectsError;
      
      // Fetch applications for client's projects
      const { data: appsData, error: appsError } = await supabase
        .from('applications')
        .select(`
          *,
          project:projects(id, title, status, budget, created_at),
          professional:profiles!applications_professional_id_fkey(first_name, last_name)
        `)
        .in('project_id', projectsData.map(project => project.id) || []);
      
      if (appsError) throw appsError;
      
      // Transform applications to match the Application type
      const transformedApplications: Application[] = (appsData || []).map(app => ({
        id: app.id,
        project_id: app.project_id,
        professional_id: app.professional_id,
        cover_letter: app.cover_letter,
        proposal_message: app.proposal_message,
        bid_amount: app.bid_amount,
        availability: app.availability,
        status: app.status,
        created_at: app.created_at,
        updated_at: app.updated_at,
        project: app.project ? {
          id: app.project.id,
          title: app.project.title,
          status: app.project.status,
          budget: app.project.budget,
          created_at: app.project.created_at
        } : undefined,
        professional: app.professional
      }));
      
      // Fetch payments for client's projects
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select(`
          *,
          project:projects(title),
          professional:profiles!payments_professional_id_fkey(first_name, last_name)
        `)
        .eq('client_id', userId);
      
      if (paymentsError) throw paymentsError;
      
      // Fetch reviews submitted by the client
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('client_id', userId);
      
      if (reviewsError) throw reviewsError;

      setState({
        projects: projectsData || [],
        applications: transformedApplications,
        payments: paymentsData || [],
        reviews: reviewsData || [],
        profileData,
        isLoading: false,
        error: null
      });
      
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: new Error('Failed to load dashboard data')
      }));
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      });
    }
  }, [userId, toast]);

  // Project Operations
  const handleEditInitiate = useCallback((project: Project) => {
    setProjectOps(prev => ({
      ...prev,
      editProject: project,
      editedProject: { ...project }
    }));
  }, []);

  const handleEditCancel = useCallback(() => {
    setProjectOps(prev => ({
      ...prev,
      editProject: null,
      editedProject: null
    }));
  }, []);

  const handleUpdateProject = useCallback(async (projectId: string, updates: Partial<Project>) => {
    try {
      setProjectOps(prev => ({ ...prev, isSubmitting: true }));
      
      const { error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId);

      if (error) throw error;

      await fetchDashboardData();
      handleEditCancel();
      
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProjectOps(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [fetchDashboardData, handleEditCancel, toast]);

  const handleDeleteInitiate = useCallback((projectId: string) => {
    setProjectOps(prev => ({ ...prev, projectToDelete: projectId }));
  }, []);

  const handleDeleteCancel = useCallback(() => {
    setProjectOps(prev => ({ ...prev, projectToDelete: null }));
  }, []);

  const handleDeleteProject = useCallback(async (projectId: string) => {
    try {
      setProjectOps(prev => ({ ...prev, isSubmitting: true }));
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      await fetchDashboardData();
      handleDeleteCancel();
      
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProjectOps(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [fetchDashboardData, handleDeleteCancel, toast]);

  // Review Operations
  const handleReviewInitiate = useCallback((projectId: string) => {
    setReviewOps(prev => ({
      ...prev,
      projectToReview: projectId,
      reviewData: {
        project_id: projectId,
        client_id: userId,
        rating: 0,
        comment: ''
      }
    }));
  }, [userId]);

  const handleReviewCancel = useCallback(() => {
    setReviewOps(prev => ({
      ...prev,
      projectToReview: null,
      reviewData: null
    }));
  }, []);

  const handleReviewSubmit = useCallback(async (reviewData: Partial<Review>) => {
    try {
      setReviewOps(prev => ({ ...prev, isSubmitting: true }));
      
      const { error } = await supabase
        .from('reviews')
        .insert([reviewData]);

      if (error) throw error;

      await fetchDashboardData();
      handleReviewCancel();
      
      toast({
        title: "Success",
        description: "Review submitted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setReviewOps(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [fetchDashboardData, handleReviewCancel, toast]);

  // Application Operations
  const handleApplicationUpdate = useCallback(async (applicationId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) throw error;

      await fetchDashboardData();
      
      toast({
        title: "Success",
        description: `Application ${status} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update application. Please try again.",
        variant: "destructive"
      });
    }
  }, [fetchDashboardData, toast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    // State
    ...state,
    
    // Project Operations
    editProject: projectOps.editProject,
    projectToDelete: projectOps.projectToDelete,
    editedProject: projectOps.editedProject,
    newProject: projectOps.newProject,
    isProjectSubmitting: projectOps.isSubmitting,
    handleEditInitiate,
    handleEditCancel,
    handleUpdateProject,
    handleDeleteInitiate,
    handleDeleteCancel,
    handleDeleteProject,
    
    // Review Operations
    projectToReview: reviewOps.projectToReview,
    reviewData: reviewOps.reviewData,
    isReviewSubmitting: reviewOps.isSubmitting,
    handleReviewInitiate,
    handleReviewCancel,
    handleReviewSubmit,
    
    // Application Operations
    handleApplicationUpdate,
    
    // Data Refresh
    fetchDashboardData
  };
}; 