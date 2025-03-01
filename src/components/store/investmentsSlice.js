import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchInvestments = createAsyncThunk(
  "investments/fetch",
  async () => {
    const response = await axios.get("/api/investments", {
      withCredentials: true,
    });
    return response.data;
  }
);

export const addInvestment = createAsyncThunk(
  "investments/add",
  async (investmentData) => {
    const response = await axios.post("/api/investments", investmentData, {
      withCredentials: true,
    });
    return response.data;
  }
);

const investmentsSlice = createSlice({
  name: "investments",
  initialState: {
    investments: [],
    fetchStatus: "idle",
    addStatus: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvestments.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchInvestments.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.investments = action.payload.investments;
      })
      .addCase(fetchInvestments.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.error = action.error.message;
      })
      .addCase(addInvestment.pending, (state) => {
        state.addStatus = "loading";
      })
      .addCase(addInvestment.fulfilled, (state, action) => {
        state.addStatus = "succeeded";
        state.investments.push(action.payload.investment);
      })
      .addCase(addInvestment.rejected, (state, action) => {
        state.addStatus = "failed";
        state.error = action.error.message;
      });
  },
});

export default investmentsSlice.reducer;