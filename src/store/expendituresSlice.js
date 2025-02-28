import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchExpenditures = createAsyncThunk(
  "expenditures/fetch",
  async () => {
    const response = await axios.get("/api/expenditures", {
      withCredentials: true,
    });
    return response.data;
  }
);

export const addExpenditure = createAsyncThunk(
  "expenditures/add",
  async (expenditureData) => {
    const response = await axios.post("/api/expenditures", expenditureData, {
      withCredentials: true,
    });
    return response.data;
  }
);

const expendituresSlice = createSlice({
  name: "expenditures",
  initialState: {
    expenditures: [],
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
