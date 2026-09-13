import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { HomePage } from './components/HomePage';
import { AuthPage } from './components/auth/AuthPage.jsx';
import { VideoSummaryPage } from './components/VideoSummaryPage.jsx';
import { ResetPassword } from './components/auth/ResetPassword.jsx'
import { AuthProvider, useAuth } from './lib/AuthContext.jsx';

function AppRoutes() {
  const { session, isLoading } = useAuth();
  if (isLoading) return null;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={
          session ? 
            <Navigate to="/dashboard" replace /> : 
            <AuthPage />
        } />
        <Route path="/dashboard" element={
          !session ? 
            <Navigate to="/auth" replace /> : 
            <VideoSummaryPage />
        } />
        <Route path="/reset" element={session ? <ResetPassword /> : <Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return <AuthProvider><AppRoutes /></AuthProvider>;
}
