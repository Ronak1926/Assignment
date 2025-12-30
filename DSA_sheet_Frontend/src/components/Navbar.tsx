import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { clearUser } from '../store/authSlice';
import { resetTopics } from '../store/topicSlice';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);

  const handleLogout = () => {
    dispatch(clearUser());
    dispatch(resetTopics());
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <div className="text-lg font-bold">Dashboard</div>
        <nav className="flex items-center gap-6 text-sm">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'font-semibold underline' : 'hover:underline'
            }
          >
            Profile
          </NavLink>
          <NavLink
            to="/topics"
            className={({ isActive }) =>
              isActive ? 'font-semibold underline' : 'hover:underline'
            }
          >
            Topics
          </NavLink>
          <NavLink
            to="/progress"
            className={({ isActive }) =>
              isActive ? 'font-semibold underline' : 'hover:underline'
            }
          >
            Progress
          </NavLink>
          {user && (
            <button
              onClick={handleLogout}
              className="rounded border border-white px-3 py-1 text-xs font-medium hover:bg-white/10"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
