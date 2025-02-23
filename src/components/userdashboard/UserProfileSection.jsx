import PropTypes from "prop-types"; // Import PropTypes for prop validation

import userProfilePic from "../../assets/avatars-3-d-avatar-210.png"; // Adjust path as needed

const UserProfileSection = ({ userData, balanceVisible, toggleBalance }) => { 
  // Validate props

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <img
          src={userProfilePic}
          alt="User Profile"
          className="w-16 h-16 rounded-full border-2 border-green-500"
        />
        <div className="ml-4">
          <h2 className="text-xl font-bold text-gray-800">{userData.full_name}</h2>
          <p className="text-gray-600">Account Type: {userData.account_type}</p>
          <p className="text-gray-600">
            Balance: {balanceVisible ? `$${userData.balance.toFixed(2)}` : "****"}
            <button
              onClick={toggleBalance}
              className="ml-2 text-blue-500 hover:underline"
            >
              {balanceVisible ? "Hide" : "Show"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

UserProfileSection.propTypes = {
  userData: PropTypes.shape({
    full_name: PropTypes.string.isRequired,
    account_type: PropTypes.string.isRequired,
    balance: PropTypes.number.isRequired,
  }).isRequired,
  balanceVisible: PropTypes.bool.isRequired,
  toggleBalance: PropTypes.func.isRequired,
};

export default UserProfileSection;
