import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Lazy loading components for better performance
const CreateAccount = lazy(() => import('./components/CreateAccount'));
const Home = lazy(() => import('./components/Home'));
const UserAccountOverview = lazy(() => import('./components/UserAccountOverview'));
const UserDashboard = lazy(() => import('./components/UserDashboard'));
const AccountOverview = lazy(() => import('./components/AccountOverview'));
const TransactionHistory = lazy(() => import('./components/TransactionHistory'));
const TransferFunds = lazy(() => import('./components/TransferFunds')); // Import TransferFunds component
const ErrorBoundary = lazy(() => import('./components/ErrorBoundary'));

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-account" element={<CreateAccount />} />

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
        
        {/* Add additional routes for analytics, cards, payments, investments, settings etc. if needed */}
      </Routes>
    </Suspense>
  );
};

export default App;

