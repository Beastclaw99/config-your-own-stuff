import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import ProfessionalSidebar from '@/components/dashboard/ProfessionalSidebar';
import ClientSidebar from '@/components/dashboard/ClientSidebar';
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [accountType, setAccountType] = useState<string | null>(null);
  
  // Fetch user account type
  useEffect(() => {
    const fetchAccountType = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('account_type')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        setAccountType(data.account_type);
      } catch (error) {
        console.error('Error fetching account type:', error);
      }
    };

    fetchAccountType();
  }, [user]);
  
  // Show sidebar for all logged-in users
  const showSidebar = !!user;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        <main className={`flex-1 transition-all duration-300 ${showSidebar ? 'mr-16 md:mr-64' : ''}`}>
          {children}
        </main>
        {showSidebar && accountType === 'professional' && <ProfessionalSidebar />}
        {showSidebar && accountType === 'client' && <ClientSidebar />}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
