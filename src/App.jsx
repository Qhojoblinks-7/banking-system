import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Analytics from './components/Analytics';
import LoanApplication from './components/LoanApplication';



// Lazy loading components for better performance
const CreateAccount = lazy(() => import('./components/CreateAccount'));
const Home = lazy(() => import('./components/Home'));
const UserAccountOverview = lazy(() => import('./components/UserAccountOverview'));
const UserDashboard = lazy(() => import('./components/UserDashboard'));
const AccountOverview = lazy(() => import('./components/AccountOverview'));
const TransactionHistory = lazy(() => import('./components/TransactionHistory'));
const TransferFunds = lazy(() => import('./components/TransferFunds')); // Import TransferFunds component
const ErrorBoundary = lazy(() => import('./components/ErrorBoundary'));
const Deposits = lazy(() => import('./components/Deposits'));
const Withdrawals = lazy(() => import('./components/Withdrawals'));
const Settings = lazy(() => import('./components/Settings'));
const Investments = lazy(() => import('./components/Investments')); 
const Cards = lazy(() => import('./components/cards/Cards'));
const BillPayments = lazy(() => import('./components/BillPayments'));
const OTPVerification = lazy(() => import('./components/OTPVerification'));


const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/analytics" element={<Analytics />} />

        {/* Wrap error-prone components with ErrorBoundary */}
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
        
        {/* Add new route for TransferFunds */}
        <Route 
          path="/transfer-funds" 
          element={
            <ErrorBoundary>
              <TransferFunds />
            </ErrorBoundary>
          } 
        />
        <Route path='/deposits' element={
          <ErrorBoundary>
            <Deposits />
          </ErrorBoundary>
        } />
        <Route path='/withdrawals' element={
          <ErrorBoundary>
            <Withdrawals />
          </ErrorBoundary>
        } />
        <Route path='/settings' element={
          <ErrorBoundary>
            <Settings />
          </ErrorBoundary>
        } />
        <Route path="/verify-otp" element={
          <ErrorBoundary>
            <OTPVerification />
          </ErrorBoundary>
        } />
        <Route path="/investments" element={
          <ErrorBoundary>
            <Investments />
          </ErrorBoundary>
        } />
        <Route path="/loanapplication" element={
          <ErrorBoundary>
            <LoanApplication />
          </ErrorBoundary>
        } />
        <Route path="/cards" element={
          <ErrorBoundary>
            <Cards />
          </ErrorBoundary>
        } />
        <Route path="/bill-payments" element={
          <ErrorBoundary>
            <BillPayments />
          </ErrorBoundary>
        } />
        
        {/* Add additional routes for analytics, cards, payments, investments, settings etc. if needed */}
      </Routes>
       
    </Suspense>
  );
};

export default App;

