import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchTopics } from '../store/topicSlice';

const ProgressPage: React.FC = () => {
  const dispatch = useAppDispatch();
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
      <div className="mt-10">
        <h2 className="mb-2 text-lg font-semibold">Progress Reports</h2>
        {loading ? (
          <p>Calculating progress...</p>
        ) : (
          <>
            <p>Easy: {computeProgress('EASY')}%</p>
            <p>Medium: {computeProgress('MEDIUM')}%</p>
            <p>Hard: {computeProgress('HARD')}%</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;
