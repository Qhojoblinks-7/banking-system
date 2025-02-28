import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch user details, now including the token in the Authorization header.
export const fetchUser = createAsyncThunk(
  "user/fetch",
  async (_, { getState }) => {
    const { token } = getState().auth; // Retrieve token from the auth slice
    const response = await axios.get("/api/user", {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
);

// Async thunk to update user profile
export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData) => {
    const response = await axios.post("/api/update-profile", profileData, {
      withCredentials: true,
    });
    return response.data;
  }
);

const initialState = {
  user: null,
  accountNumber: null,
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Synchronous reducer to update the user state
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
      if (action.payload.account_number) {
        state.accountNumber = action.payload.account_number;
      }
    },
    // Synchronous reducer to clear user data (e.g., on logout)
    clearUser(state) {
      state.user = null;
      state.accountNumber = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user cases
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accountNumber = action.payload.account_number;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Update user profile cases
      .addCase(updateUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accountNumber = action.payload.account_number;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { updateUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
