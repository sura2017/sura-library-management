import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LANDING PAGE: Only show to people NOT logged in */}
        <Route path="/" element={
          <>
            <SignedOut>
              <Home />
            </SignedOut>
            <SignedIn>
              <Navigate to="/dashboard" />
            </SignedIn>
          </>
        } />

        {/* DASHBOARD: Only show to people WHO ARE logged in */}
        <Route path="/dashboard" element={
          <>
            <SignedIn>
              <Dashboard />
            </SignedIn>
            <SignedOut>
              <Navigate to="/" />
            </SignedOut>
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;