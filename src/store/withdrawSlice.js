import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const withdraw = createAsyncThunk(
  "withdraw/submit",
  async (withdrawData) => {
    const response = await axios.post("/api/withdraw", withdrawData, {
      withCredentials: true,
    });
    return response.data;
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
      })
      .addCase(withdraw.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.withdrawal = action.payload.withdrawal;
      })
      .addCase(withdraw.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default withdrawSlice.reducer;
