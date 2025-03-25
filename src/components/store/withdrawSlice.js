import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API Base URL
const BASE_URL = "/api";

// Async thunk to handle withdrawals
export const withdraw = createAsyncThunk(
  "withdraw/submit",
  async (withdrawData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Authentication token not found. Please log in.");
      }

      const response = await axios.post(`${BASE_URL}/withdraw`, withdrawData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Withdrawal error:", error);
      if (error.response) {
        return rejectWithValue(error.response.data.error || "Withdrawal failed.");
      } else {
        return rejectWithValue(error.message || "Withdrawal failed due to network error.");
      }
    }
  }
);

const withdrawSlice = createSlice({
  name: "withdraw",
  initialState: {
    withdrawal: null,
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(withdraw.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(withdraw.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.withdrawal = action.payload.withdrawal;
      })
      .addCase(withdraw.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default withdrawSlice.reducer;