
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import ProfessionalSidebar from '@/components/dashboard/ProfessionalSidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Show professional sidebar only for logged-in users on dashboard or professional-specific pages
  const showProfessionalSidebar = user && (
    location.pathname === '/dashboard' ||
    location.pathname === '/insights' ||
    location.pathname === '/analytics' ||
    location.pathname === '/notifications' ||
    location.pathname === '/messages' ||
    location.pathname === '/calendar' ||
    location.pathname === '/settings' ||
    location.pathname === '/support' ||
    location.pathname === '/help'
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      {showProfessionalSidebar && <ProfessionalSidebar />}
    </div>
  );
};

export default Layout;
