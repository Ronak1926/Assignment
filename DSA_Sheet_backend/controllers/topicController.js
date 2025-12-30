import Topic from '../model/Topic.js';
import UserTopic from '../model/UserTopic.js';

// Return merged list: default master topics + per-user overrides and user-only topics
export const getTopics = async (req, res) => {
  try {
    const userId = req.user._id;

    const [masterTopics, userTopics] = await Promise.all([
      Topic.find().lean(),
      UserTopic.find({ user: userId }).lean(),
    ]);

    const userByBase = new Map();
    userTopics.forEach(ut => {
      if (ut.baseTopic) {
        userByBase.set(ut.baseTopic.toString(), ut);
      }
    });

    const result = [];

    // For each master topic, return user override if exists, else master
    masterTopics.forEach(mt => {
      const override = userByBase.get(mt._id.toString());
      if (override) {
        result.push({
          _id: override._id,
          title: override.title,
          status: override.status,
          // user override of a default topic: editable topic & subtopics flagged with isCustom
          isDefault: false,
          subTopics: override.subTopics,
        });
      } else {
        // pure default topic coming from master collection: not editable, subtopics are default
        result.push({
          _id: mt._id,
          title: mt.title,
          status: mt.status,
          subTopics: mt.subTopics.map(st => ({
            _id: st._id,
            name: st.name,
            leetcodeLink: st.leetcodeLink,
            youtubeLink: st.youtubeLink,
            articleLink: st.articleLink,
            level: st.level,
            status: st.status,
            isChecked: st.isChecked,
            isCustom: false,
          })),
          isDefault: true,
        });
      }
    });

    // Add user-only topics (no baseTopic)
    userTopics
      .filter(ut => !ut.baseTopic)
      .forEach(ut => {
        result.push({
          _id: ut._id,
          title: ut.title,
          status: ut.status,
          subTopics: ut.subTopics,
          isDefault: false,
        });
      });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a topic that the user created (not a default one)
export const updateTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const topic = await UserTopic.findOneAndUpdate(
      { _id: id, user: req.user._id, baseTopic: null },
      { $set: { title } },
      { new: true }
    );

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found or cannot edit default topic' });
    }

    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a topic that the user created (not a default one)
export const deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await UserTopic.findOneAndDelete({
      _id: id,
      user: req.user._id,
      baseTopic: null,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Topic not found or cannot delete default topic' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a subtopic only if it was created by this user (isCustom)
export const updateSubTopic = async (req, res) => {
  try {
    const { topicId, subId } = req.params;

    const topic = await UserTopic.findOne({ _id: topicId, user: req.user._id });
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    const sub = topic.subTopics.id(subId);
    if (!sub || !sub.isCustom) {
      return res.status(403).json({ message: 'Cannot edit default subtopic' });
    }

    const { name, leetcodeLink, youtubeLink, articleLink, level, status, isChecked } = req.body;

    if (name !== undefined) sub.name = name;
    if (leetcodeLink !== undefined) sub.leetcodeLink = leetcodeLink;
    if (youtubeLink !== undefined) sub.youtubeLink = youtubeLink;
    if (articleLink !== undefined) sub.articleLink = articleLink;
    if (level !== undefined) sub.level = level;
    if (status !== undefined) sub.status = status;
    if (isChecked !== undefined) sub.isChecked = isChecked;

    await topic.save();
    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a subtopic only if it was created by this user (isCustom)
export const deleteSubTopic = async (req, res) => {
  try {
    const { topicId, subId } = req.params;

    const topic = await UserTopic.findOne({ _id: topicId, user: req.user._id });
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    const sub = topic.subTopics.id(subId);
    if (!sub || !sub.isCustom) {
      return res.status(403).json({ message: 'Cannot delete default subtopic' });
    }

    topic.subTopics.pull(subId);
    await topic.save();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a topic that belongs only to this user
export const createTopic = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const topic = await UserTopic.create({
      user: req.user._id,
      baseTopic: null,
      title,
      status: 'Pending',
      subTopics: [],
    });
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add subtopic only for this user.
// If topicId refers to a user topic, modify it directly.
// If it refers to a master topic, create a user copy first.
export const addSubTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { name, leetcodeLink, youtubeLink, articleLink, level } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Subtopic name is required' });
    }

    const userId = req.user._id;

    // Try to find an existing user topic with this id first
    let userTopic = await UserTopic.findOne({ _id: topicId, user: userId });

    if (!userTopic) {
      // Maybe it's a master topic id; create a user copy based on master
      const master = await Topic.findById(topicId);
      if (!master) {
        return res.status(404).json({ message: 'Topic not found' });
      }

      userTopic = await UserTopic.create({
        user: userId,
        baseTopic: master._id,
        title: master.title,
        status: master.status,
        subTopics: master.subTopics.map(st => ({
          name: st.name,
          leetcodeLink: st.leetcodeLink,
          youtubeLink: st.youtubeLink,
          articleLink: st.articleLink,
          level: st.level,
          status: st.status,
          isChecked: st.isChecked,
          isCustom: false,
        })),
      });
    }

    userTopic.subTopics.push({
      name,
      leetcodeLink: leetcodeLink || '#',
      youtubeLink: youtubeLink || '#',
      articleLink: articleLink || '#',
      level: level || 'EASY',
      status: 'Pending',
      isChecked: false,
      isCustom: true,
    });

    await userTopic.save();

    res.status(201).json(userTopic);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
