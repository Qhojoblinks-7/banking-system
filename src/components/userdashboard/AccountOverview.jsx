import { useData } from "../context/DataContext"; // Use global DataContext
import userProfilePic from "../../assets/avatars-3-d-avatar-210.png"; // Adjust path as needed
import Layout from "../Layout";
import PropTypes from 'prop-types'; // Import PropTypes for prop validation

const AccountOverview = () => {
  const { user, loading } = useData(); // Access global user state from DataContext

  if (loading) {
    return <div className="text-center">Loading user details...</div>;
  }

  if (!user) {
    return <div className="text-center">Loading user details...</div>;
  }

  return (
    <Layout>
      <div className="bg-white p-8 rounded-lg shadow-2xl text-center w-full max-w-md mx-auto">
        <div className="flex items-center space-x-4 mb-4">
          <img src={userProfilePic} alt="User Profile" className="w-16 h-16 rounded-full" />
          <div>
            <h2 className="text-xl font-bold">{user?.full_name}</h2>
            <p>Account Number: {user?.account_number}</p>
          </div>
        </div>

        <div className="mt-4 text-left">
          <h3 className="text-lg font-bold mb-2">Accounts</h3>
          {user?.accounts && user.accounts.length > 0 ? (
            user.accounts.map((account) => (
              <AccountInfo key={account?.account_id} account={account} />
            ))
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
    <h4 className="font-bold">{account.account_type}</h4>
    <p>Account ID: {account.account_id}</p>
    <p>Total Balance: GHC {account.balance}</p>
    {account.account_type === "Current Account" && (
      <div className="bg-gray-200 h-24 mt-2 rounded-lg flex items-center justify-center text-gray-600">
        [Line Graph Placeholder]
      </div>
    )}
  </div>
);

AccountInfo.propTypes = { 
  account: PropTypes.shape({
    account_type: PropTypes.string.isRequired, 
    account_id: PropTypes.string.isRequired,
    balance: PropTypes.number.isRequired,
  }).isRequired,
};

export default AccountOverview;
