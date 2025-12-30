import React, { useEffect } from 'react';
import Signup from '../components/Signup';
import { useAppSelector } from '../hooks';
import { useNavigate } from 'react-router-dom';

const SignupPage: React.FC = () => {
  const user = useAppSelector(state => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  return <Signup />;
};

export default SignupPage;
