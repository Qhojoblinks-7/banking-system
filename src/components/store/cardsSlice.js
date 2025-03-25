import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { selectSupabaseAccessToken } from "./authSlice"; // Import the selector

export const addCard = createAsyncThunk(
  "cards/add",
  async (cardData, { getState }) => { // Added getState
    const accessToken = selectSupabaseAccessToken(getState()); // Get the token
    const response = await axios.post("/api/cards", cardData, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Include the token
      },
      withCredentials: true,
    });
    return response.data;
  }
);

export const fetchCards = createAsyncThunk(
  "cards/fetch",
  async (_, { getState }) => { // Added getState
    const accessToken = selectSupabaseAccessToken(getState()); // Get the token
    const response = await axios.get("/api/cards", {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Include the token
      },
      withCredentials: true,
    });
    return response.data;
  }
);

export const verifyCard = createAsyncThunk(
  "cards/verify",
  async (verificationData, { getState }) => { // Added getState
    const accessToken = selectSupabaseAccessToken(getState()); // Get the token
    const response = await axios.post("/api/cards/verify", verificationData, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Include the token
      },
      withCredentials: true,
    });
    return response.data;
  }
);

const cardsSlice = createSlice({
  name: "cards",
  initialState: {
    cards:[],
    addStatus: "idle",
    fetchStatus: "idle",
    verifyStatus: "idle",
    error: null,
    verification: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCard.pending, (state) => {
        state.addStatus = "loading";
      })
      .addCase(addCard.fulfilled, (state, action) => {
        state.addStatus = "succeeded";
        // Optionally update the cards list if needed.
      })
      .addCase(addCard.rejected, (state, action) => {
        state.addStatus = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchCards.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.cards = action.payload.cards;
      })
      .addCase(fetchCards.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.error = action.error.message;
      })
      .addCase(verifyCard.pending, (state) => {
        state.verifyStatus = "loading";
      })
      .addCase(verifyCard.fulfilled, (state, action) => {
        state.verifyStatus = "succeeded";
        state.verification = action.payload.verified;
      })
      .addCase(verifyCard.rejected, (state, action) => {
        state.verifyStatus = "failed";
        state.error = action.error.message;
      });
  },
});

export default cardsSlice.reducer;