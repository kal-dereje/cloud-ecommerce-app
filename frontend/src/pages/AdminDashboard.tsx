import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNav from '../components/AdminNav';

const AdminDashboard: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex animate-fade-in">
    <AdminNav />
    <main className="flex-1 p-8 transition-all duration-300 ease-in-out">
      <Outlet />
    </main>
  </div>
);

export default AdminDashboard;