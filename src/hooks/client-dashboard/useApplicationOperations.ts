
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

export const useApplicationOperations = (fetchDashboardData: () => Promise<void>) => {
  const { toast } = useToast();

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

  return {
    handleApplicationUpdate
  };
};
