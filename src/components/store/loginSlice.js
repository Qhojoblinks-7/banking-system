// loginSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const loginUser = createAsyncThunk(
  "login/loginUser", // Unique action type
  async (credentials, { rejectWithValue }) => {
    console.log("loginUser thunk dispatched with credentials:", credentials);
    try {
      console.log("loginUser: Making API call to /auth/login with credentials:", credentials);
      const response = await api.post("/auth/login", credentials);
      console.log("loginUser: API call successful, response data:", response.data);
      return response.data; // Expecting data containing user and token
    } catch (error) {
      console.error("loginUser: API call failed, error:", error);
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState: {
    user: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.data.user; // Adjust based on your backend response
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export default loginSlice.reducer;