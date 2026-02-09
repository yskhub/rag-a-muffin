import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ChatInterface from './components/ChatInterface';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatInterface />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <Link
        to="/admin"
        className="fixed bottom-6 right-6 p-4 bg-gray-900 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all text-xl"
        title="Admin Dashboard"
      >
        ⚙️
      </Link>
    </BrowserRouter>
  );
}

export default App;
