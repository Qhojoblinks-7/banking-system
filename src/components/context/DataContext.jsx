import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient'; // Import Supabase client
import PropTypes from 'prop-types';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
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

  // Fetch user data – only if user is available
  const fetchUserData = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Fetch user data error:', error);
    }
  }, [user]);

  const fetchBalance = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('balances')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (error) throw error;
      setBalance(data.balance);
    } catch (error) {
      console.error('Fetch balance error:', error);
    }
  }, [user]);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      setTransactions(data);
    } catch (error) {
      console.error('Fetch transactions error:', error);
    }
  }, [user]);

  const fetchLoans = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      setLoans(data);
    } catch (error) {
      console.error('Fetch loans error:', error);
    }
  }, [user]);

  const fetchExpenditures = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('expenditures')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      setExpenditures(data);
    } catch (error) {
      console.error('Fetch expenditures error:', error);
    }
  }, [user]);

  const fetchInvestments = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      setInvestments(data);
    } catch (error) {
      console.error('Fetch investments error:', error);
    }
  }, [user]);

  const fetchAnalytics = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      setAnalytics(data);
    } catch (error) {
      console.error('Fetch analytics error:', error);
    }
  }, [user]);

  // When token changes, fetch all data (if user is already set)
  useEffect(() => {
    if (token && user) {
      fetchUserData();
      fetchBalance();
      fetchTransactions();
      fetchLoans();
      fetchExpenditures();
      fetchInvestments();
      fetchAnalytics();
    }
  }, [token, user, fetchUserData, fetchBalance, fetchTransactions, fetchLoans, fetchExpenditures, fetchInvestments, fetchAnalytics]);

  // Login: authenticate using Supabase and store token (access token from session)
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data.user);
      setToken(data.session.access_token);
      localStorage.setItem('token', data.session.access_token);
      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout: clear state and remove token
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  // Register: create a new user using Supabase auth
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
      return data.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
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
      fetchBalance();
      return data;
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
  
  // In the code above, we have defined a  DataContext  context and a  DataProvider  component that wraps the entire application. The  DataProvider  component provides the global state and methods to the rest of the application. 
  // The  DataProvider  component contains the following state variables: 
  // user : The current user token : The user token balance : The user's account balance transactions : The user's transaction history loans : The user's loan history expenditures : The user's expenditure history investments : The user's investment history analytics : The user's analytics data loading : A boolean to indicate when data is being fetched 
  // The  DataProvider  component also contains the following methods: 
  // login : Authenticates a user using Supabase auth logout : Logs out a user register : Registers a new user addTransaction : Adds a new transaction createLoan : Creates a new loan request initiateTransfer : Initiates a funds transfer between accounts addExpenditure : Adds a new expenditure record fetchUserData : Fetches user data fetchBalance : Fetches the user's account balance fetchTransactions : Fetches the user's transaction history fetchLoans : Fetches the user's loan history fetchExpenditures : Fetches the user's expenditure history fetchInvestments : Fetches the user's investment history fetchAnalytics : Fetches the user's analytics data 
  // The  useData  hook is used to access the global state and methods from the  DataContext  context. 
  // Step 4: Create the Login Component 
  // Next, we will create a  Login  component that will allow users to log in to the application. 
  // Create a new file named  Login.jsx  in the  src/components  directory and add the following code: