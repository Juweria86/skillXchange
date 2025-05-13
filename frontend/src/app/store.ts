import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import skillReducer from "../features/skill/skillSlice";
import userReducer from '../features/user/userSlice';
import skillMatchesReducer from "../features/skill/skillMatchesSlice";
import messageReducer from "../features/messages/messageSlice";
import connectionReducer from "../features/connections/connectionSlice";
import { sessionApi } from '../features/sessions/sessionApi';
import sessionReducer from '../features/sessions/sessionSlice';





export const store = configureStore({
  reducer: {
    auth: authReducer,
    skills: skillReducer,
    user: userReducer,
    skillMatches: skillMatchesReducer,
    messages: messageReducer,
    connections: connectionReducer,
    [sessionApi.reducerPath]: sessionApi.reducer,
    sessions: sessionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sessionApi.middleware)
});
  
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
