import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MarketplacePage from './pages/MarketplacePage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
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
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
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
