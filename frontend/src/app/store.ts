// store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import authReducer from "../features/auth/authSlice";
import skillReducer from "../features/skill/skillSlice";
import userReducer from "../features/user/userSlice";
import skillMatchesReducer from "../features/skill/skillMatchesSlice";
import messageReducer from "../features/messages/messageSlice";
import connectionReducer from "../features/connections/connectionSlice";
import { sessionApi } from "../features/sessions/sessionApi";
import sessionReducer from "../features/sessions/sessionSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  skills: skillReducer,
  user: userReducer,
  skillMatches: skillMatchesReducer,
  messages: messageReducer,
  connections: connectionReducer,
  [sessionApi.reducerPath]: sessionApi.reducer,
  sessions: sessionReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // only persist auth slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }).concat(sessionApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
