import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  authToken: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  subscriptionType: string; // Default type
}

const initialState: AuthState = {
  authToken: null,
  userId: null,
  isAuthenticated: false,
  subscriptionType: "free",
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

export const { login, logout, setSubscriptionType } = authSlice.actions;
export default authSlice.reducer;
