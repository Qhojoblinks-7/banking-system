// registerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const registerUser = createAsyncThunk(
  "register/registerUser", // Unique action type
  async (userData, { rejectWithValue }) => {
    console.log("registerUser thunk dispatched with data:", userData);
    try {
      console.log("registerUser: Making API call to /register with data:", userData);
      const response = await api.post("/auth/register", userData);      console.log("registerUser: API call successful, response data:", response.data);
      return response.data; // Expecting data containing user and token
    } catch (error) {
      console.error("registerUser: API call failed, error:", error);
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const registerSlice = createSlice({
  name: "register",
  initialState: {
    user: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user; // Adjust based on your backend response
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export default registerSlice.reducer;