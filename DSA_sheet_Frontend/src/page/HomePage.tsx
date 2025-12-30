import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchTopics } from '../store/topicSlice';
import TopicAccordion from '../components/TopicAccordion';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const { items: topics, loading } = useAppSelector(state => state.topics);

  useEffect(() => {
    if (topics.length === 0) {
      dispatch(fetchTopics());
    }
  }, [dispatch, topics.length]);

  const computeProgress = (level: 'EASY' | 'MEDIUM' | 'HARD'): number => {
    let total = 0;
    let done = 0;

    topics.forEach(topic => {
      topic.subTopics.forEach(sub => {
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

  return (
    <div>
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-2xl font-semibold">Welcome {user?.name}</h1>
        <p className="mt-1 text-sm text-gray-600">Email: {user?.email}</p>
      </div>

      <div id="topics" className="mb-8 pt-6 text-center">
        <h2 className="text-xl font-semibold text-blue-600">Topics</h2>
        <p className="text-sm text-gray-600">Explore these exciting topics!</p>
      </div>

      {loading ? (
        <p>Loading topics...</p>
      ) : (
        topics.map((topic, index) => (
          <TopicAccordion key={index} topic={topic} topicIndex={index} />
        ))
      )}

      <div id="progress" className="mt-10">
        <h2 className="mb-2 text-lg font-semibold">Progress Reports</h2>
        <p>Easy: {computeProgress('EASY')}%</p>
        <p>Medium: {computeProgress('MEDIUM')}%</p>
        <p>Hard: {computeProgress('HARD')}%</p>
      </div>
    </div>
  );
};

export default HomePage;
