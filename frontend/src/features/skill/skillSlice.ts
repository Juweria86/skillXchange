// features/skills/skillSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "./skillAPI";

interface SkillState {
  skills: any[];
  loading: boolean;
  error: string | null;
}

const initialState: SkillState = {
  skills: [],
  loading: false,
  error: null,
};

export const getSkills = createAsyncThunk(
  "skills/getSkills",
  async (token: string) => {
    return await fetchSkills(token);
  }
);

export const addSkill = createAsyncThunk(
  "skills/addSkill",
  async ({ token, skillData }: { token: string; skillData: any }) => {
    return await createSkill(token, skillData);
  }
);

export const editSkill = createAsyncThunk(
  "skills/editSkill",
  async ({ token, id, skillData }: { token: string; id: string; skillData: any }) => {
    return await updateSkill(token, id, skillData);
  }
);

export const removeSkill = createAsyncThunk(
  "skills/removeSkill",
  async ({ token, id }: { token: string; id: string }) => {
    await deleteSkill(token, id);
    return id;
  }
);

const skillSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSkills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSkills.fulfilled, (state, action) => {
        state.loading = false;
        state.skills = action.payload;
      })
      .addCase(getSkills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch skills";
      })
      .addCase(addSkill.fulfilled, (state, action) => {
        state.skills.push(action.payload);
      })
      .addCase(editSkill.fulfilled, (state, action) => {
        const index = state.skills.findIndex(
          (skill) => skill._id === action.payload._id
        );
        if (index !== -1) {
          state.skills[index] = action.payload;
        }
      })
      .addCase(removeSkill.fulfilled, (state, action) => {
        state.skills = state.skills.filter(
          (skill) => skill._id !== action.payload
        );
      });
  },
});

export default skillSlice.reducer;