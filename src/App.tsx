
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from './contexts/AuthContext';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TradeProfessionalMarketplace from './pages/TradeProfessionalMarketplace';
import ProjectDetails from './pages/ProjectDetails';
import CalendarPage from './pages/CalendarPage';
import MessagingPage from './pages/MessagingPage';
import AnalyticsPage from './pages/AnalyticsPage';
import CompliancePage from './pages/CompliancePage';
import CreateProject from '@/pages/CreateProject';
import ProjectDispatch from '@/pages/ProjectDispatch';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/marketplace" element={<TradeProfessionalMarketplace />} />
              <Route path="/projects/:projectId" element={<ProjectDetails />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/messages" element={<MessagingPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/compliance" element={<CompliancePage />} />
              <Route path="/client/create-project" element={<CreateProject />} />
              <Route path="/client/dispatch/:projectId" element={<ProjectDispatch />} />
            </Routes>
            <Toaster />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
