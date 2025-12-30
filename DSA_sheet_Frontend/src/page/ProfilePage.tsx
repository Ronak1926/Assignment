import React from 'react';
import { useAppSelector } from '../hooks';

const ProfilePage: React.FC = () => {
  const user = useAppSelector(state => state.auth.user);

  return (
    <div className="rounded-md bg-white px-6 py-4 shadow-sm">
      <h1 className="text-2xl font-semibold">Welcome {user?.name}</h1>
      <p className="mt-1 text-sm text-gray-600">Email: {user?.email}</p>
    </div>
  );
};

export default ProfilePage;
