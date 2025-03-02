import PropTypes from "prop-types";
import userProfilePic from "../../assets/avatars-3-d-avatar-210.png";

const UserProfileSection = ({ userData, balanceVisible, toggleBalance }) => {
  // Use a default of 0 if userData.balance is undefined
  const balance = typeof userData.balance === "number" ? userData.balance : 0;
  const formattedBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "GHC",
  }).format(balance);

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
            Balance: {balanceVisible ? formattedBalance : "****"}
            <button
              onClick={toggleBalance}
              className="ml-2 text-blue-500 hover:underline focus:outline-none"
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
    balance: PropTypes.number, // Not required now, default value will be used if undefined
  }).isRequired,
  balanceVisible: PropTypes.bool.isRequired,
  toggleBalance: PropTypes.func.isRequired,
};

export default UserProfileSection;
