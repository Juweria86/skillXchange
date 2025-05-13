// src/redux/skillMatchesSlice.ts
import { getState } from '@/app/store';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface Match {
  id: string;
  name: string;
  avatar: string;
  location: string;
  teaches: string[];
  learns: string[];
  match: number;
  active: boolean;
}

interface SkillMatchesState {
  matches: Match[];
  loading: boolean;
  error: string | null;
}

const initialState: SkillMatchesState = {
  matches: [],
  loading: false,
  error: null,
};

export const fetchSkillMatches = createAsyncThunk(
  'skillMatches/fetchSkillMatches',
  async (_, { getState }) => {
    try {
      const token = (getState() as any).auth.token;
      
      const response = await axios.get('http://localhost:5000/api/match/ai-matches', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.matches;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch matches');
    }
  }
);


const skillMatchesSlice = createSlice({
  name: 'skillMatches',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkillMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSkillMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload;
      })
      .addCase(fetchSkillMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch matches';
      });
  },
});

export default skillMatchesSlice.reducer;