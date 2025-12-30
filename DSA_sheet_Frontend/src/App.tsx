import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './page/LoginPage';
import SignupPage from './page/SignupPage';
import HomePage from './page/HomePage';
import ProfilePage from './page/ProfilePage';
import TopicsPage from './page/TopicsPage';
import ProgressPage from './page/ProgressPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route element={<Layout />}>
        <Route path="/" element={<ProfilePage />} />
        <Route path="/topics" element={<TopicsPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/dashboard" element={<HomePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
