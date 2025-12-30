import express from 'express';
import { getTopics, createTopic, addSubTopic, updateTopic, deleteTopic, updateSubTopic, deleteSubTopic } from '../controllers/topicController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All topic routes require authentication so changes are per-user
router.use(protect);

router.get('/', getTopics);
router.post('/', createTopic);
router.put('/:id', updateTopic);
router.delete('/:id', deleteTopic);

router.post('/:topicId/subtopics', addSubTopic);
router.put('/:topicId/subtopics/:subId', updateSubTopic);
router.delete('/:topicId/subtopics/:subId', deleteSubTopic);

export default router;
