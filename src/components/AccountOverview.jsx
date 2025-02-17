import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userProfilePic from '../assets/avatars-3-d-avatar-210.png'; // Adjust path as needed
import Layout from './Layout';

const AccountOverview = () => {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Example of fetching user data
    const fetchData = async () => {
      // Replace with actual API call or data fetching logic
      const userData = {
        name: 'John Doe',
        accountNumber: '123456789012345',
        accounts: [
          {
            type: 'Savings Account',
            id: '987654321',
            balance: '₵10,000',
          },
          {
            type: 'Fixed Deposit Account',
            id: '876543210',
            balance: '₵5,000',
          },
          {
            type: 'Business Account',
            id: '765432109',
            balance: '₵15,000',
          },
          {
            type: 'Current Account',
            id: '654321098',
            balance: '₵7,500',
          },
        ],
      };

      setUser(userData);
      setAccounts(userData.accounts);
    };

    fetchData();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (!user) {
    return <div>Loading...</div>;
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
          {accounts.map((account) => (
            <AccountInfo key={account.id} account={account} />
          ))}
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
