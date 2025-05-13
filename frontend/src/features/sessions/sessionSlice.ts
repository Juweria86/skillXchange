import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SessionView = "calendar" | "list";

interface SessionFormData {
  id?: string;
  title: string;
  date: Date;
  time: string; // Format: "HH:MM AM/PM - HH:MM AM/PM"
  skill: string;
  type: "learning" | "teaching";
}

interface SessionState {
  view: SessionView;
  showForm: boolean;
  editingSession: SessionFormData | null;
}

const initialState: SessionState = {
  view: "calendar",
  showForm: false,
  editingSession: null
};

const sessionSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    setView: (state, action: PayloadAction<SessionView>) => {
      state.view = action.payload;
    },
    setShowForm: (state, action: PayloadAction<boolean>) => {
      state.showForm = action.payload;
    },
    setEditingSession: (state, action: PayloadAction<SessionFormData | null>) => {
      state.editingSession = action.payload;
    },
    resetSessionForm: (state) => {
      state.showForm = false;
      state.editingSession = null;
    }
  }
});

export const { setView, setShowForm, setEditingSession, resetSessionForm } = sessionSlice.actions;
export default sessionSlice.reducer;

// Type for the root state
export type RootState = {
  sessions: SessionState;
};