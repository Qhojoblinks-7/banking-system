import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { selectSupabaseAccessToken } from "../store/authSlice"; // Import the selector

export const fetchExpenditures = createAsyncThunk(
  "expenditures/fetch",
  async (_, { getState }) => { // Added getState
    const accessToken = selectSupabaseAccessToken(getState()); // Get the token
    try {
      const response = await axios.get("/api/expenditures", {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include the token
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const addExpenditure = createAsyncThunk(
  "expenditures/add",
  async (expenditureData, { getState }) => { // Added getState
    const accessToken = selectSupabaseAccessToken(getState()); // Get the token
    try {
      const response = await axios.post("/api/expenditures", expenditureData, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include the token
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const expendituresSlice = createSlice({
  name: "expenditures",
  initialState: {
    expenditures:[],
    fetchStatus: "idle",
    addStatus: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenditures.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchExpenditures.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.expenditures = action.payload.expenditures;
      })
      .addCase(fetchExpenditures.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.error = action.error.message;
      })
      .addCase(addExpenditure.pending, (state) => {
        state.addStatus = "loading";
      })
      .addCase(addExpenditure.fulfilled, (state, action) => {
        state.addStatus = "succeeded";
        state.expenditures.push(action.payload.expenditure);
      })
      .addCase(addExpenditure.rejected, (state, action) => {
        state.addStatus = "failed";
        state.error = action.error.message;
      });
  },
});

export default expendituresSlice.reducer;