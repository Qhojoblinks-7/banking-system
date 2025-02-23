import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient'; // Import Supabase client
import PropTypes from 'prop-types'; // Import PropTypes for prop validation

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Global states and prop validation
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [expenditures, setExpenditures] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  // When token changes, fetch all relevant data
  useEffect(() => {
    if (token) {
      fetchUserData();
      fetchBalance();
      fetchTransactions();
      fetchLoans();
      fetchExpenditures();
      fetchInvestments();
      fetchAnalytics();
    }
  }, [token]);

  // Wrap other fetch functions in useCallback as well
  const fetchUserData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) throw error;
      setUser(data); // Set user data from Supabase
    } catch (error) {
      console.error('Fetch user data error:', error);
    }
  }, [user]);

  const fetchBalance = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('balances')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (error) throw error;
      setBalance(data.balance); // Set balance from Supabase
    } catch (error) {
      console.error('Fetch balance error:', error);
    }
  }, [user]);

  const fetchTransactions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      setTransactions(data); // Set transactions from Supabase
    } catch (error) {
      console.error('Fetch transactions error:', error);
    }
  }, [user]);

  const fetchLoans = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      setLoans(data); // Set loans from Supabase
    } catch (error) {
      console.error('Fetch loans error:', error);
    }
  }, [user]);

  const fetchExpenditures = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('expenditures')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      setExpenditures(data); // Set expenditures from Supabase
    } catch (error) {
      console.error('Fetch expenditures error:', error);
    }
  }, [user]);

  const fetchInvestments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      setInvestments(data); // Set investments from Supabase
    } catch (error) {
      console.error('Fetch investments error:', error);
    }
  }, [user]);

  const fetchAnalytics = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      setAnalytics(data); // Set analytics from Supabase
    } catch (error) {
      console.error('Fetch analytics error:', error);
    }
  }, [user]);

  // Login: authenticate and set token and user
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data.user);
      localStorage.setItem('token', data.session.access_token); // Store access token
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false); // Set loading state to false
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
      const { data, error } = await supabase.auth.signUp({
        email: registrationData.email,
        password: registrationData.password,
        options: {
          data: {
            full_name: registrationData.full_name,
            phone_number: registrationData.phone_number,
            date_of_birth: registrationData.date_of_birth,
            residential_address: registrationData.residential_address,
            account_type: registrationData.account_type,
            username: registrationData.username,
          },
          captchaToken: registrationData.captchaToken,
        },
      });
      if (error) throw error;
      return data.user; // Return user object
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  // Add a new transaction (e.g., deposit or debit)
  const addTransaction = async (transactionData) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .insert(transactionData);
      if (error) throw error;
      setTransactions(prev => [data[0], ...prev]);
      // Optionally refresh balance after a transaction
      fetchBalance();
      return data;
    } catch (error) {
      console.error('Add transaction error:', error);
      throw error;
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  // Submit a new loan request
  const createLoan = async (loanData) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('loans')
        .insert(loanData);
      if (error) throw error;
      setLoans(prev => [data[0], ...prev]);
      return data;
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
      const { data, error } = await supabase
        .from('transfers')
        .insert(transferData);
      if (error) throw error;
      // Refresh balance as it might change after a transfer
      fetchBalance();
      return data;
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
      const { data, error } = await supabase
        .from('expenditures')
        .insert(expenditureData);
      if (error) throw error;
      setExpenditures(prev => [data[0], ...prev]);
      return data;
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
