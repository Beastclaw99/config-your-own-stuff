
import { useEffect } from 'react';
import { useClientDataFetching } from './client-dashboard/useDataFetching';

export const useClientDashboard = (userId: string) => {
  const {
    projects,
    applications,
    payments,
    reviews,
    profileData,
    isLoading,
    fetchDashboardData
  } = useClientDataFetching(userId);

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
