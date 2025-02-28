import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const initiateTransfer = createAsyncThunk(
  "transfers/initiate",
  async (transferData) => {
    const response = await axios.post("/api/transfers", transferData, {
      withCredentials: true,
    });
    return response.data;
  }
);

const transfersSlice = createSlice({
  name: "transfers",
  initialState: {
    transfer: null,
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiateTransfer.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initiateTransfer.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.transfer = action.payload.transfer;
      })
      .addCase(initiateTransfer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default transfersSlice.reducer;
