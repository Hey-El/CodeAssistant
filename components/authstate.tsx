import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  authToken: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  subscriptionType: string; // Default type
}

interface CodeState {
  snippet: string | null;
  keywords: string[];
  codingChallenge: Array<{ title: string; description: string }>;
}

const initialState: AuthState = {
  authToken: null,
  userId: null,
  isAuthenticated: false,
  subscriptionType: "free",
};

const codeState: CodeState = {
  snippet: null,
  keywords: [],
  codingChallenge: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ authToken: string; userId: string }>
    ) => {
      state.authToken = action.payload.authToken;
      state.userId = action.payload.userId;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.authToken = null;
      state.userId = null;
      state.isAuthenticated = false;
    },
    setSubscriptionType: (state, action: PayloadAction<string>) => {
      state.subscriptionType = action.payload;
    },
  },
});

const codeSnippetSlice = createSlice({
  name: "codeSnippet", // name of the slice
  initialState: codeState, // Use the renamed initial state here
  reducers: {
    // Set the code snippet
    setSnippet: (state, action: PayloadAction<string>) => {
      state.snippet = action.payload;
    },
    // Set extracted keywords
    setKeywords: (state, action: PayloadAction<string[]>) => {
      state.keywords = action.payload;
    },
    // Set related coding challenges
    setCodingChallenges: (
      state,
      action: PayloadAction<Array<{ title: string; description: string }>>
    ) => {
      state.codingChallenge = action.payload;
    },
  },
});

const persistConfig = {
  key: "auth",
  storage: AsyncStorage,
};

const persistedAuthReducer = persistReducer(persistConfig, authSlice.reducer);

const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  codeSnippet: codeSnippetSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);

export const { login, logout, setSubscriptionType } = authSlice.actions;
export const { setSnippet, setKeywords, setCodingChallenges } =
  codeSnippetSlice.actions;

export default store;
