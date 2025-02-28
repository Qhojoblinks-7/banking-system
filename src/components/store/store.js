import { configureStore } from "@reduxjs/toolkit";
import exchangeRatesReducer from "./exchangeRatesSlice";
import testConnectionReducer from "./testConnectionSlice";
import authReducer from "./authSlice"; // Consolidated auth slice for both register and login
import verifyOtpReducer from "./verifyOtpSlice";
import resendOtpReducer from "./resendOtpSlice";
import userReducer from "./userSlice";
import balanceReducer from "./balanceSlice";
import cardsReducer from "./cardsSlice";
import transactionsReducer from "./transactionsSlice";
import loansReducer from "./loansSlice";
import transfersReducer from "./transfersSlice";
import expendituresReducer from "./expendituresSlice";
import investmentsReducer from "./investmentsSlice";
import analyticsReducer from "./analyticsSlice";
import withdrawReducer from "./withdrawSlice";

const store = configureStore({
  reducer: {
    exchangeRates: exchangeRatesReducer,
    testConnection: testConnectionReducer,
    auth: authReducer,
    verifyOtp: verifyOtpReducer,
    resendOtp: resendOtpReducer,
    user: userReducer,
    balance: balanceReducer,
    cards: cardsReducer,
    transactions: transactionsReducer,
    loans: loansReducer,
    transfers: transfersReducer,
    expenditures: expendituresReducer,
    investments: investmentsReducer,
    analytics: analyticsReducer,
    withdraw: withdrawReducer,
  },
});

export default store;
