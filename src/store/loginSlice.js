import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk("/auth/login", async ({ user }) => {
  const response = await axios.post("http://localhost:3000/api/login", user, {
    withCredentials: true,
  });
  return response?.data;
});

export const registerUser = createAsyncThunk("/auth/register", async (user) => {
  const response = await axios.post("http://localhost:3000/api/register", user);
  return response?.data;
});

const initialState = {
  user: null,
  isLoading: false,
  isAuth: false,
};

const loginSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        (state.isLoading = false),
          (state.user = action.payload),
          (state.isAuth = true);
      })
      .addCase(loginUser.rejected, (state, action) => {
        (state.isLoading = false), (state.user = null), (state.isAuth = false);
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        (state.isLoading = false),
          (state.user = action.payload),
          (state.isAuth = true);
      })
      .addCase(registerUser.rejected, (state, action) => {
        (state.isLoading = false), (state.user = null), (state.isAuth = false);
      });
  },
});

export default loginSlice.reducer;
