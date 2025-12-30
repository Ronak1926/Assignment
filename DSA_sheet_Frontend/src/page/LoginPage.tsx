import React, { useEffect } from 'react';
import Login from '../components/Login';
import { useAppSelector } from '../hooks';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const user = useAppSelector(state => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  return <Login />;
};

export default LoginPage;
