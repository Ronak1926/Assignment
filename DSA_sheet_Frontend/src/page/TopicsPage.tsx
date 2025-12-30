import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchTopics, createTopicAsync, addSubtopicAsync, updateTopicAsync, deleteTopicAsync, updateSubtopicAsync, deleteSubtopicAsync } from '../store/topicSlice';
import TopicAccordion, { type Topic, type SubTopic } from '../components/TopicAccordion';
import AddTopicModal from '../components/AddTopicModal';
import AddSubtopicModal from '../components/AddSubtopicModal';
import EditTopicModal from '../components/EditTopicModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import toast from 'react-hot-toast';

const TopicsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: topics, loading } = useAppSelector(state => state.topics);

  // Modal states
  const [addTopicModalOpen, setAddTopicModalOpen] = useState(false);
  const [editTopicModalOpen, setEditTopicModalOpen] = useState(false);
  const [deleteTopicModalOpen, setDeleteTopicModalOpen] = useState(false);

  const [subtopicModalOpen, setSubtopicModalOpen] = useState(false);
  const [deleteSubtopicModalOpen, setDeleteSubtopicModalOpen] = useState(false);

  // Active items
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [editingSubtopic, setEditingSubtopic] = useState<{ topicId: string; subId: string; data: SubTopic } | null>(null);
  const [deletingSubtopic, setDeletingSubtopic] = useState<{ topic: Topic; sub: SubTopic } | null>(null);

  useEffect(() => {
    if (topics.length === 0) {
      dispatch(fetchTopics());
    }
  }, [dispatch, topics.length]);

  // --- Topic Handlers ---

  const handleAddTopic = async (title: string) => {
    try {
      await dispatch(createTopicAsync(title)).unwrap();
      toast.success('Topic added');
      setAddTopicModalOpen(false);
    } catch {
      toast.error('Failed to add topic');
    }
  };

  const handleOpenEditTopic = (topic: Topic) => {
    setActiveTopic(topic);
    setEditTopicModalOpen(true);
  };

  const handleEditTopicSubmit = async (title: string) => {
    if (!activeTopic || !activeTopic._id) return;
    try {
      await dispatch(updateTopicAsync({ id: activeTopic._id, title })).unwrap();
      toast.success('Topic updated');
      setEditTopicModalOpen(false);
      setActiveTopic(null);
    } catch {
      toast.error('Failed to update topic');
    }
  };

  const handleOpenDeleteTopic = (topic: Topic) => {
    setActiveTopic(topic);
    setDeleteTopicModalOpen(true);
  };

  const handleDeleteTopicConfirm = async () => {
    if (!activeTopic || !activeTopic._id) return;
    try {
      await dispatch(deleteTopicAsync(activeTopic._id)).unwrap();
      toast.success('Topic deleted');
      setDeleteTopicModalOpen(false);
      setActiveTopic(null);
    } catch {
      toast.error('Failed to delete topic');
    }
  };

  // --- Subtopic Handlers ---

  const handleOpenAddSubtopic = (topic: Topic) => {
    setActiveTopic(topic);
    setEditingSubtopic(null);
    setSubtopicModalOpen(true);
  };

  const handleOpenEditSubtopic = (topic: Topic, sub: SubTopic) => {
    if (!topic._id || !sub._id) return;
    setActiveTopic(topic);
    setEditingSubtopic({ topicId: topic._id, subId: sub._id, data: sub });
    setSubtopicModalOpen(true);
  };

  const handleSubtopicSubmit = async (values: { name: string; leetcodeLink?: string; youtubeLink?: string; articleLink?: string; level: 'EASY' | 'MEDIUM' | 'HARD'; }) => {
    if (!activeTopic || !activeTopic._id) return;

    try {
      if (editingSubtopic) {
        await dispatch(
          updateSubtopicAsync({
            topicId: activeTopic._id,
            subId: editingSubtopic.subId,
            data: values,
          })
        ).unwrap();
        toast.success('Subtopic updated');
      } else {
        await dispatch(
          addSubtopicAsync({
            topicId: activeTopic._id,
            ...values,
          })
        ).unwrap();
        toast.success('Subtopic added');
      }
      setSubtopicModalOpen(false);
      setActiveTopic(null);
      setEditingSubtopic(null);
    } catch {
      toast.error('Failed to save subtopic');
    }
  };

  const handleOpenDeleteSubtopic = (topic: Topic, sub: SubTopic) => {
    setDeletingSubtopic({ topic, sub });
    setDeleteSubtopicModalOpen(true);
  };

  const handleDeleteSubtopicConfirm = async () => {
    if (!deletingSubtopic) return;
    const { topic, sub } = deletingSubtopic;
    if (!topic._id || !sub._id) return;

    try {
      await dispatch(deleteSubtopicAsync({ topicId: topic._id, subId: sub._id })).unwrap();
      toast.success('Subtopic deleted');
      setDeleteSubtopicModalOpen(false);
      setDeletingSubtopic(null);
    } catch {
      toast.error('Failed to delete subtopic');
    }
  };

  return (
    <div>
      <div id="topics" className="mb-5 text-center">
        <h2 className="text-xl font-semibold text-blue-600">Topics</h2>
        <p className="text-sm text-gray-600">Explore these exciting topics!</p>
        <button
          className="mt-3 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          onClick={() => setAddTopicModalOpen(true)}
        >
          Add Topic
        </button>
      </div>

      {loading ? (
        <p>Loading topics...</p>
      ) : (
        topics.map((topic, index) => (
          <TopicAccordion
            key={index}
            topic={topic}
            topicIndex={index}
            onAddSubtopicClick={handleOpenAddSubtopic}
            onEditTopic={handleOpenEditTopic}
            onDeleteTopic={handleOpenDeleteTopic}
            onEditSubtopic={handleOpenEditSubtopic}
            onDeleteSubtopic={handleOpenDeleteSubtopic}
          />
        ))
      )}

      {/* Add Topic Modal */}
      <AddTopicModal
        open={addTopicModalOpen}
        onClose={() => setAddTopicModalOpen(false)}
        onSubmit={handleAddTopic}
      />

      {/* Edit Topic Modal */}
      <EditTopicModal
        open={editTopicModalOpen}
        onClose={() => setEditTopicModalOpen(false)}
        onSubmit={handleEditTopicSubmit}
        initialTitle={activeTopic?.title || ''}
      />

      {/* Delete Topic Confirmation */}
      <DeleteConfirmationModal
        open={deleteTopicModalOpen}
        onClose={() => setDeleteTopicModalOpen(false)}
        onConfirm={handleDeleteTopicConfirm}
        title="Delete Topic"
        message={`Are you sure you want to delete the topic "${activeTopic?.title}"? This action cannot be undone.`}
      />

      {/* Add/Edit Subtopic Modal */}
      <AddSubtopicModal
        open={subtopicModalOpen}
        onClose={() => setSubtopicModalOpen(false)}
        onSubmit={handleSubtopicSubmit}
        initialValues={editingSubtopic ? {
          name: editingSubtopic.data.name,
          leetcodeLink: editingSubtopic.data.leetcodeLink,
          youtubeLink: editingSubtopic.data.youtubeLink,
          articleLink: editingSubtopic.data.articleLink,
          level: editingSubtopic.data.level as 'EASY' | 'MEDIUM' | 'HARD',
        } : undefined}
        mode={editingSubtopic ? 'edit' : 'add'}
      />

      {/* Delete Subtopic Confirmation */}
      <DeleteConfirmationModal
        open={deleteSubtopicModalOpen}
        onClose={() => setDeleteSubtopicModalOpen(false)}
        onConfirm={handleDeleteSubtopicConfirm}
        title="Delete Subtopic"
        message={`Are you sure you want to delete the subtopic "${deletingSubtopic?.sub.name}"?`}
      />
    </div>
  );
};

export default TopicsPage;
