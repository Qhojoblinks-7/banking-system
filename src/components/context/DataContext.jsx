// DataContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {jwtDecode} from 'jwt-decode';

const DataContext = createContext();

export const DataProvider = ({ children } = {}) => {
  // Global state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [expenditures, setExpenditures] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  // Helper function to get auth headers
  const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  });

  // Helper function to check token validity
  const isTokenValid = (token) => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch (err) {
      return false;
    }
  };

  // Fetch user data from /api/user and merge account_number into user
  const fetchUserData = useCallback(async () => {
    if (!token || !isTokenValid(token)) return;
    try {
      const response = await fetch('/api/user', { headers: authHeaders() });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Error fetching user data');
      // Merge account_number (if returned) into user
      const updatedUser = { ...json.user };
      if (json.account_number) {
        updatedUser.account_number = json.account_number;
      }
      setUser(updatedUser);
    } catch (error) {
      console.error('Fetch user data error:', error);
    }
  }, [token]);

  // Fetch balance from /api/balance
  const fetchBalance = useCallback(async () => {
    if (!token || !isTokenValid(token)) return;
    try {
      const response = await fetch('/api/balance', { headers: authHeaders() });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Error fetching balance');
      setBalance(json.balance);
    } catch (error) {
      console.error('Fetch balance error:', error);
    }
  }, [token]);

  // Fetch transactions from /api/transactions
  const fetchTransactions = useCallback(async () => {
    if (!token || !isTokenValid(token)) return;
    try {
      const response = await fetch('/api/transactions', { headers: authHeaders() });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Error fetching transactions');
      setTransactions(json.transactions);
    } catch (error) {
      console.error('Fetch transactions error:', error);
    }
  }, [token]);

  // Fetch loans from /api/loans
  const fetchLoans = useCallback(async () => {
    if (!token || !isTokenValid(token)) return;
    try {
      const response = await fetch('/api/loans', { headers: authHeaders() });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Error fetching loans');
      setLoans(json.loans);
    } catch (error) {
      console.error('Fetch loans error:', error);
    }
  }, [token]);

  // Fetch expenditures from /api/expenditures
  const fetchExpenditures = useCallback(async () => {
    if (!token || !isTokenValid(token)) return;
    try {
      const response = await fetch('/api/expenditures', { headers: authHeaders() });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Error fetching expenditures');
      setExpenditures(json.expenditures);
    } catch (error) {
      console.error('Fetch expenditures error:', error);
    }
  }, [token]);

  // Fetch investments from /api/investments
  const fetchInvestments = useCallback(async () => {
    if (!token || !isTokenValid(token)) return;
    try {
      const response = await fetch('/api/investments', { headers: authHeaders() });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Error fetching investments');
      setInvestments(json.investments);
    } catch (error) {
      console.error('Fetch investments error:', error);
    }
  }, [token]);

  // Fetch analytics from /api/analytics
  const fetchAnalytics = useCallback(async () => {
    if (!token || !isTokenValid(token)) return;
    try {
      const response = await fetch('/api/analytics', { headers: authHeaders() });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Error fetching analytics');
      setAnalytics(json.analytics);
    } catch (error) {
      console.error('Fetch analytics error:', error);
    }
  }, [token]);

  // When token changes, fetch all data
  useEffect(() => {
    if (token && isTokenValid(token)) {
      fetchUserData();
      fetchBalance();
      fetchTransactions();
      fetchLoans();
      fetchExpenditures();
      fetchInvestments();
      fetchAnalytics();
    } else {
      logout();
    }
  }, [token, fetchUserData, fetchBalance, fetchTransactions, fetchLoans, fetchExpenditures, fetchInvestments, fetchAnalytics]);

  // Login: call /api/login
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Error logging in');
      setUser(json.user);
      setToken(json.token);
      localStorage.setItem('token', json.token);
      return json.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout: clear user and token
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  // Register: call /api/register
  const register = async (registrationData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Registration error');
      return json.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Add a new transaction via /api/transactions
  const addTransaction = async (transactionData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(transactionData),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Error adding transaction');
      setTransactions((prev) => [json.transaction, ...prev]);
      fetchBalance();
      return json;
    } catch (error) {
      console.error('Add transaction error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Submit a new loan request via /api/loans
  const createLoan = async (loanData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/loans', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(loanData),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Error creating loan');
      setLoans((prev) => [json.loan, ...prev]);
      return json;
    } catch (error) {
      console.error('Create loan error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Initiate a funds transfer via /api/transfers
  const initiateTransfer = async (transferData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/transfers', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(transferData),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Error initiating transfer');
      fetchBalance();
      return json;
    } catch (error) {
      console.error('Initiate transfer error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Add a new expenditure via /api/expenditures
  const addExpenditure = async (expenditureData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/expenditures', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(expenditureData),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Error adding expenditure');
      setExpenditures((prev) => [json.expenditure, ...prev]);
      return json;
    } catch (error) {
      console.error('Add expenditure error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        user,
        token,
        balance,
        transactions,
        loans,
        expenditures,
        investments,
        analytics,
        loading,
        login,
        logout,
        register,
        addTransaction,
        createLoan,
        initiateTransfer,
        addExpenditure,
        fetchUserData,
        fetchBalance,
        fetchTransactions,
        fetchLoans,
        fetchExpenditures,
        fetchInvestments,
        fetchAnalytics,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);

export default DataProvider;
