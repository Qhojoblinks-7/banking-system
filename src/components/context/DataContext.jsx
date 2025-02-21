import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Global states
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [expenditures, setExpenditures] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  // When token changes, set default axios header and fetch all relevant data
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserData();
      fetchBalance();
      fetchTransactions();
      fetchLoans();
      fetchExpenditures();
      fetchInvestments();
      fetchAnalytics();
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Login: authenticate and set token and user
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/login', { email, password });
      setToken(response.data.token);
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout: clear user and token data
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  // Register a new user
  const register = async (registrationData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/register', registrationData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch functions for various data endpoints

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/user');
      setUser(response.data.user);
    } catch (error) {
      console.error('Fetch user data error:', error);
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await axios.get('/api/balance');
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Fetch balance error:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/api/transactions');
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Fetch transactions error:', error);
    }
  };

  const fetchLoans = async () => {
    try {
      const response = await axios.get('/api/loans');
      setLoans(response.data.loans);
    } catch (error) {
      console.error('Fetch loans error:', error);
    }
  };

  const fetchExpenditures = async () => {
    try {
      const response = await axios.get('/api/expenditures');
      setExpenditures(response.data.expenditures);
    } catch (error) {
      console.error('Fetch expenditures error:', error);
    }
  };

  const fetchInvestments = async () => {
    try {
      const response = await axios.get('/api/investments');
      setInvestments(response.data.investments);
    } catch (error) {
      console.error('Fetch investments error:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/api/analytics');
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Fetch analytics error:', error);
    }
  };

  // Update functions to add new records

  // Add a new transaction (e.g., deposit or debit)
  const addTransaction = async (transactionData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/transactions', transactionData);
      setTransactions(prev => [response.data.transaction, ...prev]);
      // Optionally refresh balance after a transaction
      fetchBalance();
      return response.data;
    } catch (error) {
      console.error('Add transaction error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Submit a new loan request
  const createLoan = async (loanData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/loans', loanData);
      setLoans(prev => [response.data.loan, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Create loan error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Initiate a funds transfer between accounts
  const initiateTransfer = async (transferData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/transfers', transferData);
      // Refresh balance as it might change after a transfer
      fetchBalance();
      return response.data;
    } catch (error) {
      console.error('Initiate transfer error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Add a new expenditure record
  const addExpenditure = async (expenditureData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/expenditures', expenditureData);
      setExpenditures(prev => [response.data.expenditure, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Add expenditure error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Add a new investment record
  const addInvestment = async (investmentData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/investments', investmentData);
      setInvestments(prev => [response.data.investment, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Add investment error:', error);
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
        fetchUserData,
        fetchBalance,
        fetchTransactions,
        fetchLoans,
        fetchExpenditures,
        fetchInvestments,
        fetchAnalytics,
        addTransaction,
        createLoan,
        initiateTransfer,
        addExpenditure,
        addInvestment,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
