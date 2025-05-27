
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project, Application, Payment, Review } from '@/components/dashboard/types';

export const useClientDashboard = (userId: string) => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch client's profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;
      setProfileData(profileData);
      
      // Fetch client's projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', userId)
        .order('created_at', { ascending: false });
      
      if (projectsError) throw projectsError;
      setProjects(projectsData || []);
      
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
      
      setApplications(transformedApplications);
      
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
      setPayments(paymentsData || []);
      
      // Fetch reviews submitted by the client
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('client_id', userId);
      
      if (reviewsError) throw reviewsError;
      setReviews(reviewsData || []);
      
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  return {
    projects,
    applications,
    payments,
    reviews,
    profileData,
    isLoading,
    fetchDashboardData
  };
};
