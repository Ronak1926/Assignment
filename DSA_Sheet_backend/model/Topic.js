import mongoose from 'mongoose';

const subTopicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  leetcodeLink: { type: String },
  youtubeLink: { type: String },
  articleLink: { type: String },
  level: { type: String, enum: ['EASY', 'MEDIUM', 'HARD'] },
  status: { type: String, default: 'Pending' },
  isChecked: { type: Boolean, default: false },
});

const topicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    subTopics: [subTopicSchema],
  },
  { timestamps: true }
);

const Topic = mongoose.model('Topic', topicSchema);

export default Topic;
