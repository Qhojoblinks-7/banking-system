import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import RefreshData from "./components/user/RefreshData";

// Lazy loaded components for better performance
const Login = lazy(() => import("./components/auth/Login"));
const Register = lazy(() => import("./components/auth/Register"));
const CreateAccount = lazy(() => import("./components/auth/CreateAccount"));
const Home = lazy(() => import("./components/Home"));
const Analytics = lazy(() => import("./components/userdashboard/Analytics"));
const LoanApplication = lazy(() => import("./components/user/LoanApplication"));
const UserAccountOverview = lazy(() => import("./components/userdashboard/UserAccountOverview"));
const UserDashboard = lazy(() => import("./components/userdashboard/UserDashboard"));
const AccountOverview = lazy(() => import("./components/userdashboard/AccountOverview"));
const TransactionHistory = lazy(() => import("./components/user/TransactionHistory"));
const TransferFunds = lazy(() => import("./components/user/TransferFunds"));
const Deposits = lazy(() => import("./components/user/Deposits"));
const Withdrawals = lazy(() => import("./components/user/Withdrawals"));
const Settings = lazy(() => import("./components/userdashboard/Settings"));
const Investments = lazy(() => import("./components/user/Investments"));
const Cards = lazy(() => import("./components/cards/Cards"));
const BillPayments = lazy(() => import("./components/user/BillPayments"));
const OTPVerification = lazy(() => import("./components/OTPVerification"));

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/analytics" 
          element={
            <ErrorBoundary>
              <Analytics />
            </ErrorBoundary>
          }
        />
        <Route path="/loanapplication" element={<LoanApplication />} />
        <Route 
          path="/user-account-overview" 
          element={
            <ErrorBoundary>
              <UserAccountOverview />
            </ErrorBoundary>
          }
        />
        <Route 
          path="/user-dashboard" 
          element={
            <ErrorBoundary>
              <UserDashboard />
            </ErrorBoundary>
          }
        />
        <Route 
          path="/account-overview" 
          element={
            <ErrorBoundary>
              <AccountOverview />
            </ErrorBoundary>
          }
        />
        <Route 
          path="/transaction-history" 
          element={
            <ErrorBoundary>
              <TransactionHistory />
            </ErrorBoundary>
          }
        />
        <Route 
          path="/transfer-funds" 
          element={
            <ErrorBoundary>
              <TransferFunds />
            </ErrorBoundary>
          }
        />
        <Route 
          path="/deposits" 
          element={
            <ErrorBoundary>
              <Deposits />
            </ErrorBoundary>
          }
        />
        <Route 
          path="/withdrawals" 
          element={
            <ErrorBoundary>
              <Withdrawals />
            </ErrorBoundary>
          }
        />
        <Route 
          path="/settings" 
          element={
            <ErrorBoundary>
              <Settings />
            </ErrorBoundary>
          }
        />
        <Route 
          path="/verify-otp" 
          element={
            <ErrorBoundary>
              <OTPVerification />
            </ErrorBoundary>
          }
        />
        <Route 
          path="/investments" 
          element={
            <ErrorBoundary>
              <Investments />
            </ErrorBoundary>
          }
        />
        <Route 
          path="/cards" 
          element={
            <ErrorBoundary>
              <Cards />
            </ErrorBoundary>
          }
        />
        <Route 
          path="/bill-payments" 
          element={
            <ErrorBoundary>
              <BillPayments />
            </ErrorBoundary>
          }
        />
        <Route
        path="/refresh-data"
        element={
          <ErrorBoundary>
            <RefreshData />
          </ErrorBoundary>
        }
      />
      </Routes>
    </Suspense>
  );
};

export default App;
