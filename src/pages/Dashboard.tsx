
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import ClientDashboard from '@/components/dashboard/ClientDashboard';
import ProfessionalDashboard from '@/components/dashboard/ProfessionalDashboard';

const Dashboard: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [accountType, setAccountType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const activeTab = location.state?.activeTab || 'projects';

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        setError(null);
        console.log('Fetching user profile for:', user.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('account_type')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Profile fetch error:', error);
          throw error;
        }
        
        console.log('Profile data:', data);
        setAccountType(data.account_type);
      } catch (error: any) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load your profile. Please try again later.');
        toast({
          title: "Error",
          description: "Failed to load your profile. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUserProfile();
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [user, authLoading, toast]);

  const retryFetchProfile = async () => {
    setIsLoading(true);
    if (user) {
      try {
        setError(null);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('account_type')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        setAccountType(data.account_type);
      } catch (error: any) {
        console.error('Error retrying profile fetch:', error);
        setError('Failed to load your profile. Please try again later.');
        toast({
          title: "Error",
          description: "Failed to load your profile. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // If not logged in, redirect to login
  if (!authLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  // Loading state
  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-ttc-blue-700" />
          <span className="ml-2 text-lg">Loading your dashboard...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
        
        {error ? (
          <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-6">
            <p className="text-red-700">{error}</p>
            <Button 
              onClick={retryFetchProfile} 
              variant="outline" 
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        ) : accountType === 'client' ? (
          <ClientDashboard userId={user.id} initialTab={activeTab} />
        ) : accountType === 'professional' ? (
          <ProfessionalDashboard userId={user.id} />
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
            <p className="text-yellow-700">
              Your account type is not properly set. Please contact support.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
