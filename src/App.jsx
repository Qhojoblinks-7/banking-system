import { Routes, Route } from 'react-router-dom';
import CreateAccount from './components/CreateAccount';
import Home from './components/Home';
import UserAccountOverview from './components/UserAccountOverview';
import ErrorBoundary from './components/ErrorBoundary'; // Import the ErrorBoundary component
import UserDashboard from './components/UserDashboard';
import AccountOverview from './components/AccountOverview';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create-account" element={<CreateAccount />} />
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
        path="/user-account_overview" 
        element={
          <ErrorBoundary>
            <UserAccountOverview />
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
    </Routes>
  );
};

export default App;
