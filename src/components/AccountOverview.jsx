import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userProfilePic from '../assets/avatars-3-d-avatar-210.png'; // Adjust path as needed
import Layout from './Layout';

const AccountOverview = () => {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Replace with your actual API endpoint
        const response = await fetch('https://your-api.com/api/user/accounts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token if required
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch account data');
        }

        const userData = await response.json();
        setUser(userData);
        setAccounts(userData.accounts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  if (!user) {
    return <div className="text-center">No user data available</div>;
  }

  return (
    <Layout>
      <div className="bg-white p-8 rounded-lg shadow-2xl text-center w-full max-w-md mx-auto">
        <div className="flex items-center space-x-4 mb-4">
          <img src={userProfilePic} alt="User Profile" className="w-16 h-16 rounded-full" />
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p>Account Number: {user.accountNumber}</p>
          </div>
        </div>

        <div className="mt-4 text-left">
          <h3 className="text-lg font-bold mb-2">Accounts</h3>
          {accounts.length > 0 ? (
            accounts.map((account) => <AccountInfo key={account.id} account={account} />)
          ) : (
            <p>No accounts found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

const AccountInfo = ({ account }) => (
  <div className="mb-4">
    <h4 className="font-bold">{account.type}</h4>
    <p>Account ID: {account.id}</p>
    <p>Total Balance: {account.balance}</p>
    {account.type === 'Current Account' && (
      <div className="bg-gray-200 h-24 mt-2 rounded-lg flex items-center justify-center text-gray-600">
        [Line Graph Placeholder]
      </div>
    )}
  </div>
);

export default AccountOverview;
