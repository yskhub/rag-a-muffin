import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ChatInterface from './components/ChatInterface';
import AdminDashboard from './components/AdminDashboard';


function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<ChatInterface />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
