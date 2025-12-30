import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopicAccordion, {type Topic,type SubTopic } from './TopicAccordion';
import api from '../utils/api';

interface UserInfo {
    name: string;
    email: string;
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserInfo | null>(null);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
        } else {
            setUser(JSON.parse(storedUser));
        }

        // Fetch topics from backend (MongoDB)
        const fetchTopics = async () => {
            try {
                const response = await api.get<Topic[]>('/api/topics');
                setTopics(response.data);
            } catch (error) {
                console.error('Error fetching topics', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopics();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const computeProgress = (level: 'EASY' | 'MEDIUM' | 'HARD'): number => {
        let total = 0;
        let done = 0;

        topics.forEach((topic: Topic) => {
            topic.subTopics.forEach((sub: SubTopic) => {
                if (sub.level === level) {
                    total += 1;
                    if (sub.status === 'Done' || sub.isChecked) {
                        done += 1;
                    }
                }
            });
        });

        if (total === 0) return 0;
        return Math.round((done / total) * 100);
    };

    if (!user) return null;

    return (
        <div>
            <header className="header">
                <div className="container header-content">
                    <div className="logo">Dashboard</div>
                    <nav className="nav-links">
                        <a href="#profile">Profile</a>
                        <a href="#topics">Topics</a>
                        <a href="#progress">Progress</a>
                        <button onClick={handleLogout}>Logout</button>
                    </nav>
                </div>
            </header>

            <div className="container">
                <div className="welcome-section">
                    <h1 className="welcome-title">Welcome {user.name}</h1>
                    <p className="welcome-email">Email: {user.email}</p>
                </div>

                <div id="topics" className="mb-8 text-center">
                    <h2 className="text-xl font-semibold text-blue-600">Topics</h2>
                    <p className="text-sm text-gray-600">Explore these exciting topics!</p>
                </div>

                {loading ? (
                    <p>Loading topics...</p>
                ) : (
                    topics.map((topic, index) => (
                        <TopicAccordion key={index} topic={topic} topicIndex={0} />
                    ))
                )}

                <div id="progress" className="mt-10">
                    <h2 className="mb-2 text-lg font-semibold">Progress Reports</h2>
                    <p>Easy: {computeProgress('EASY')}%</p>
                    <p>Medium: {computeProgress('MEDIUM')}%</p>
                    <p>Hard: {computeProgress('HARD')}%</p>
                </div>
            </div>

            <footer className="footer">
                &copy; 2024 Dashboard. All Rights Reserved.
            </footer>
        </div>
    );
};

export default Dashboard;
