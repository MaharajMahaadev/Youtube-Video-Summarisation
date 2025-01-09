import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { AuthPage } from './components/auth/AuthPage.jsx';
import { VideoSummaryPage } from './components/VideoSummaryPage.jsx';
import { NhostProvider } from '@nhost/react';
import { nhost } from './lib/host.js'
import { NhostApolloProvider } from '@nhost/react-apollo';

export default function App() {

  const [session, setSession] = useState(null)

  useEffect(() => {
    setSession(nhost.auth.getSession())

    nhost.auth.onAuthStateChanged((_, session) => {
      setSession(session)
    })
  }, []);

  return (
    <NhostApolloProvider nhost={nhost}>
    <NhostProvider nhost={nhost}>
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
      </Routes>
    </BrowserRouter>
  </NhostProvider>
  </NhostApolloProvider>
  );
}