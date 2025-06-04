import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Application, Project } from '@/types';
import { useToast } from "@/components/ui/use-toast";

export const useApplicationOperations = () => {
  const { toast } = useToast();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleViewApplication = (application: Application, project: Project) => {
    setSelectedApplication(application);
    setSelectedProject(project);
  };

  const handleCloseDialog = () => {
    setSelectedApplication(null);
    setSelectedProject(null);
  };

  const handleAcceptApplication = async () => {
    if (!selectedApplication) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'accepted' })
        .eq('id', selectedApplication.id);

      if (error) throw error;

      // Update project status to in_progress
      const { error: projectError } = await supabase
        .from('projects')
        .update({ status: 'in_progress' })
        .eq('id', selectedApplication.project_id);

      if (projectError) throw projectError;

      handleCloseDialog();
    } catch (error) {
      console.error('Error accepting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectApplication = async () => {
    if (!selectedApplication) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'rejected' })
        .eq('id', selectedApplication.id);

      if (error) throw error;
      handleCloseDialog();
    } catch (error) {
      console.error('Error rejecting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    selectedApplication,
    selectedProject,
    isSubmitting,
    handleViewApplication,
    handleCloseDialog,
    handleAcceptApplication,
    handleRejectApplication
  };
};
