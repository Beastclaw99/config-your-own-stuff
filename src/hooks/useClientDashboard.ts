
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { Project, Application, Payment, Review } from '@/components/dashboard/types';

export const useClientDashboard = (userId: string) => {
  const { toast } = useToast();
  
  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Project management state
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [editedProject, setEditedProject] = useState<Partial<Project> | null>(null);
  const [newProject, setNewProject] = useState<Partial<Project>>({});
  const [isProjectSubmitting, setIsProjectSubmitting] = useState(false);

  // Review state
  const [projectToReview, setProjectToReview] = useState<string | null>(null);
  const [reviewData, setReviewData] = useState<{ rating: number; comment: string }>({ rating: 5, comment: '' });
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

  const fetchDashboardData = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      setError(null);

      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          client:profiles!projects_client_id_fkey(first_name, last_name)
        `)
        .eq('client_id', userId)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      // Transform projects with proper type casting
      const validStatuses = ['open', 'applied', 'assigned', 'in-progress', 'submitted', 'revision', 'completed', 'paid', 'archived', 'disputed'] as const;
      const transformedProjects: Project[] = (projectsData || []).map(project => ({
        ...project,
        status: validStatuses.includes(project.status as any) ? project.status : 'open',
        updated_at: project.updated_at || project.created_at
      }));

      setProjects(transformedProjects);

      // Fetch applications for client's projects
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          project:projects!inner(id, title, status, budget, created_at, client_id),
          professional:profiles!applications_professional_id_fkey(first_name, last_name, rating, skills)
        `)
        .eq('project.client_id', userId)
        .order('created_at', { ascending: false });

      if (applicationsError) throw applicationsError;

      // Transform applications with proper type casting
      const validApplicationStatuses = ['pending', 'accepted', 'rejected', 'withdrawn'] as const;
      const transformedApplications: Application[] = (applicationsData || []).map(app => ({
        id: app.id,
        project_id: app.project_id,
        professional_id: app.professional_id,
        cover_letter: app.cover_letter,
        proposal_message: app.proposal_message,
        bid_amount: app.bid_amount,
        availability: app.availability,
        status: validApplicationStatuses.includes(app.status as any) ? app.status as Application['status'] : 'pending',
        created_at: app.created_at,
        updated_at: app.updated_at || app.created_at,
        project: app.project ? {
          id: app.project.id,
          title: app.project.title,
          status: validStatuses.includes(app.project.status as any) ? app.project.status : 'open',
          budget: app.project.budget,
          created_at: app.project.created_at
        } : undefined,
        professional: app.professional ? {
          first_name: app.professional.first_name,
          last_name: app.professional.last_name,
          rating: app.professional.rating || undefined,
          skills: app.professional.skills || undefined
        } : undefined
      }));

      setApplications(transformedApplications);

      // Fetch payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select(`
          *,
          project:projects(title),
          professional:profiles!payments_professional_id_fkey(first_name, last_name)
        `)
        .eq('client_id', userId)
        .order('created_at', { ascending: false });

      if (paymentsError) throw paymentsError;

      // Transform payments with proper type casting
      const validPaymentStatuses = ['pending', 'completed', 'failed'] as const;
      const transformedPayments = (paymentsData || []).map(payment => ({
        ...payment,
        status: validPaymentStatuses.includes(payment.status as any) ? payment.status as Payment['status'] : 'pending',
        created_at: payment.created_at || new Date().toISOString()
      }));

      setPayments(transformedPayments);

      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('client_id', userId)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      // Transform reviews to handle the database field naming issue
      const transformedReviews: Review[] = (reviewsData || []).map(review => ({
        ...review,
        updated_at: review['updated at'] || review.created_at || new Date().toISOString()
      }));

      setReviews(transformedReviews);

      // Fetch profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      setProfileData(profile);

    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Project operations
  const handleEditInitiate = (project: Project) => {
    setEditProject(project);
    setEditedProject({ ...project });
  };

  const handleEditCancel = () => {
    setEditProject(null);
    setEditedProject(null);
  };

  const handleUpdateProject = async (projectId: string, updates: Partial<Project>) => {
    try {
      setIsProjectSubmitting(true);

      const { error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .eq('client_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project updated successfully"
      });

      setEditProject(null);
      setEditedProject(null);
      await fetchDashboardData();

    } catch (err: any) {
      console.error('Error updating project:', err);
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProjectSubmitting(false);
    }
  };

  const handleDeleteInitiate = (projectId: string) => {
    setProjectToDelete(projectId);
  };

  const handleDeleteCancel = () => {
    setProjectToDelete(null);
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      setIsProjectSubmitting(true);

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('client_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project deleted successfully"
      });

      setProjectToDelete(null);
      await fetchDashboardData();

    } catch (err: any) {
      console.error('Error deleting project:', err);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProjectSubmitting(false);
    }
  };

  // Review operations
  const handleReviewInitiate = (projectId: string) => {
    setProjectToReview(projectId);
    setReviewData({ rating: 5, comment: '' });
  };

  const handleReviewCancel = () => {
    setProjectToReview(null);
    setReviewData({ rating: 5, comment: '' });
  };

  const handleReviewSubmit = async (projectId: string, data: { rating: number; comment: string }) => {
    try {
      setIsReviewSubmitting(true);

      const project = projects.find(p => p.id === projectId);
      if (!project?.professional_id) {
        throw new Error('No professional assigned to this project');
      }

      const { error } = await supabase
        .from('reviews')
        .insert([{
          project_id: projectId,
          client_id: userId,
          professional_id: project.professional_id,
          rating: data.rating,
          comment: data.comment
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Review submitted successfully"
      });

      setProjectToReview(null);
      setReviewData({ rating: 5, comment: '' });
      await fetchDashboardData();

    } catch (err: any) {
      console.error('Error submitting review:', err);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  // Application operations
  const handleApplicationUpdate = async (applicationId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Application ${status} successfully`
      });

      await fetchDashboardData();

    } catch (err: any) {
      console.error('Error updating application:', err);
      toast({
        title: "Error",
        description: "Failed to update application. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  return {
    // Data
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
  };
};
