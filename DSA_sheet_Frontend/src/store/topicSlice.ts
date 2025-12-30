import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../utils/api';
import type { Topic } from '../components/TopicAccordion';

interface TopicState {
  items: Topic[];
  loading: boolean;
}

const initialState: TopicState = {
  items: [],
  loading: false,
};

export const fetchTopics = createAsyncThunk('topics/fetch', async () => {
  const response = await api.get<Topic[]>('/api/topics');
  return response.data;
});

export const createTopicAsync = createAsyncThunk(
  'topics/create',
  async (title: string) => {
    const response = await api.post<Topic>('/api/topics', { title });
    return response.data;
  }
);

export const updateTopicAsync = createAsyncThunk(
  'topics/update',
  async ({ id, title }: { id: string; title: string }) => {
    const response = await api.put<Topic>(`/api/topics/${id}`, { title });
    return response.data;
  }
);

export const deleteTopicAsync = createAsyncThunk(
  'topics/delete',
  async (id: string) => {
    await api.delete(`/api/topics/${id}`);
    return id;
  }
);

export interface NewSubtopicPayload {
  topicId: string;
  name: string;
  leetcodeLink?: string;
  youtubeLink?: string;
  articleLink?: string;
  level?: 'EASY' | 'MEDIUM' | 'HARD';
}

export const addSubtopicAsync = createAsyncThunk(
  'topics/addSubtopic',
  async (payload: NewSubtopicPayload) => {
    const { topicId, ...body } = payload;
    const response = await api.post<Topic>(`/api/topics/${topicId}/subtopics`, body);
    return response.data;
  }
);

export interface UpdateSubtopicPayload {
  topicId: string;
  subId: string;
  data: Partial<{
    name: string;
    leetcodeLink?: string;
    youtubeLink?: string;
    articleLink?: string;
    level?: 'EASY' | 'MEDIUM' | 'HARD';
  }>;
}

export const updateSubtopicAsync = createAsyncThunk(
  'topics/updateSubtopic',
  async (payload: UpdateSubtopicPayload) => {
    const { topicId, subId, data } = payload;
    const response = await api.put<Topic>(`/api/topics/${topicId}/subtopics/${subId}`, data);
    return response.data;
  }
);

export const deleteSubtopicAsync = createAsyncThunk(
  'topics/deleteSubtopic',
  async ({ topicId, subId }: { topicId: string; subId: string }) => {
    await api.delete(`/api/topics/${topicId}/subtopics/${subId}`);
    return { topicId, subId };
  }
);

const topicSlice = createSlice({
  name: 'topics',
  initialState,
  reducers: {
    toggleSubTopic(
      state,
      action: { payload: { topicIndex: number; subIndex: number } }
    ) {
      const { topicIndex, subIndex } = action.payload;
      const topic = state.items[topicIndex];
      if (!topic) return;
      const sub = topic.subTopics[subIndex];
      if (!sub) return;

      sub.isChecked = !sub.isChecked;
      sub.status = sub.isChecked ? 'Done' : 'Pending';

      // Update overall topic status: Done only if all subtopics are Done
      const allDone = topic.subTopics.every(st => st.status === 'Done');
      topic.status = allDone ? 'Done' : 'Pending';
    },
    resetTopics(state) {
      state.items = [];
      state.loading = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTopics.pending, state => {
        state.loading = true;
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTopics.rejected, state => {
        state.loading = false;
      })
      .addCase(createTopicAsync.pending, state => {
        state.loading = true;
      })
      .addCase(createTopicAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createTopicAsync.rejected, state => {
        state.loading = false;
      })
      .addCase(addSubtopicAsync.pending, state => {
        state.loading = true;
      })
      .addCase(addSubtopicAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.items.findIndex(t => t._id === updated._id);
        if (index !== -1) {
          state.items[index] = updated;
        }
      })
      .addCase(addSubtopicAsync.rejected, state => {
        state.loading = false;
      })
      .addCase(updateTopicAsync.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.items.findIndex(t => t._id === updated._id);
        if (index !== -1) {
          state.items[index] = updated;
        }
      })
      .addCase(deleteTopicAsync.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter(t => t._id !== id);
      })
      .addCase(updateSubtopicAsync.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.items.findIndex(t => t._id === updated._id);
        if (index !== -1) {
          state.items[index] = updated;
        }
      })
      .addCase(deleteSubtopicAsync.fulfilled, (state, action) => {
        const { topicId, subId } = action.payload;
        const topic = state.items.find(t => t._id === topicId);
        if (topic) {
          topic.subTopics = topic.subTopics.filter(st => (st as any)._id !== subId);
        }
      });
  },
});

export const { toggleSubTopic, resetTopics } = topicSlice.actions;
export default topicSlice.reducer;
