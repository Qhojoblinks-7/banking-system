import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useState, useEffect } from 'react';
import Overlay from './components/Overlay'; // Import the Overlay component
import Deposits from './components/Deposits';

// Lazy loading components for better performance
const CreateAccount = lazy(() => import('./components/CreateAccount'));
const Home = lazy(() => import('./components/Home'));
const UserAccountOverview = lazy(() => import('./components/UserAccountOverview'));
const UserDashboard = lazy(() => import('./components/UserDashboard'));
const AccountOverview = lazy(() => import('./components/AccountOverview'));
const TransactionHistory = lazy(() => import('./components/TransactionHistory'));
const TransferFunds = lazy(() => import('./components/TransferFunds'));
const LoanApplication = lazy(() => import('./components/LoanApplication')); // Added LoanApplication
const Withdrawals = lazy(() => import('./components/Withdrawals')); // Added Withdrawal
const Settings = lazy(() => import('./components/Settings')); // Added Settings
const ErrorBoundary = lazy(() => import('./components/ErrorBoundary'));

const App = () => {
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(!navigator.onLine);

  // Listen for network changes
  useEffect(() => {
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      {/* Show Overlay only if offline or components are still loading */}
      <Overlay visible={offline || loading} />

      <Suspense fallback={<Overlay visible={true} />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/withdrawals" element={<Withdrawals />} />
          <Route path="/loan-application" element={<LoanApplication />} />

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
            path="Deposits" 
            element={
              <ErrorBoundary>
                <Deposits />
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
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
