import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const testConnection = createAsyncThunk(
  "testConnection/fetch",
  async () => {
    const response = await axios.get("/api/test-connection");
    return response.data;
  }
);

const testConnectionSlice = createSlice({
  name: "testConnection",
  initialState: {
    message: "",
    data: null,
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(testConnection.pending, (state) => {
        state.status = "loading";
      })
      .addCase(testConnection.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload.message;
        state.data = action.payload.data;
      })
      .addCase(testConnection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default testConnectionSlice.reducer;
