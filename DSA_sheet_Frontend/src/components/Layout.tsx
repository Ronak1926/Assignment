import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useAppSelector } from '../hooks';

const Layout: React.FC = () => {
  const user = useAppSelector(state => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-4">
        <Outlet />
      </main>
      <footer className="mt-10 border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        &copy; 2024 Dashboard. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Layout;
