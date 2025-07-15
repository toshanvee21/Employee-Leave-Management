import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createProject = createAsyncThunk('projects/create', async (projectData) => {
  const response = await axios.post('http://localhost:5000/api/createproject', projectData);
  return response.data;
});

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    status: 'idle',
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProject.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createProject.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(createProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default projectSlice.reducer;
