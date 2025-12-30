import mongoose from 'mongoose';

const userSubTopicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  leetcodeLink: { type: String },
  youtubeLink: { type: String },
  articleLink: { type: String },
  level: { type: String, enum: ['EASY', 'MEDIUM', 'HARD'] },
  status: { type: String, default: 'Pending' },
  isChecked: { type: Boolean, default: false },
  // true = user created this subtopic; false = came from default master Topic
  isCustom: { type: Boolean, default: false },
});

const userTopicSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // If this is based on a default master Topic, store reference here.
    baseTopic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', default: null },
    title: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    subTopics: [userSubTopicSchema],
  },
  { timestamps: true }
);

const UserTopic = mongoose.model('UserTopic', userTopicSchema);

export default UserTopic;
