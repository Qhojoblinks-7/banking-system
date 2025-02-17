import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import userProfilePic from '../assets/avatars-3-d-avatar-210.png';

const UserAccountOverview = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    full_name: 'Loading...',
    account_type: 'N/A',
    balance: 0.00
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = 'user-id'; // Replace with the actual user ID
        console.log(`Fetching data for user ID: ${userId}`); // Debugging: Log user ID
        const response = await axios.get(`/api/user/${userId}`);
        console.log('Response data:', response.data); // Debugging: Log response data
        setUserData(response.data.user || {
          full_name: 'New User',
          account_type: 'N/A',
          balance: 0.00
        });
      } catch (err) {
        console.error('Error fetching user data:', err); // Debugging: Log error
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleDashboardNavigation = () => {
    navigate('/user-dashboard');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-indigo-500">
      <div className="bg-white p-10 rounded-lg shadow-2xl text-center max-w-md transform transition-all hover:scale-105">
        <img src={userProfilePic} alt="User Profile" className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-indigo-500 shadow-md" />
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-4">{userData.full_name}</h2>
        <p className="text-lg text-gray-600 mb-4 font-medium">Account Type: {userData.account_type}</p>
        <p className="text-lg text-gray-600 mb-4 font-medium">Balance: ${userData.balance}</p>
        <ul className="text-left mb-6 space-y-2">
          <li className="text-gray-600 text-md font-medium">• 24/7 Customer Support</li>
          <li className="text-gray-600 text-md font-medium">• Free International Transfers</li>
          <li className="text-gray-600 text-md font-medium">• High-Interest Rates</li>
        </ul>
        <button
          className="bg-indigo-500 text-white py-3 px-8 rounded-lg hover:bg-indigo-600 shadow-md transition duration-300 text-lg font-semibold"
          onClick={handleDashboardNavigation}
          aria-label="Go to Dashboard"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
  
};

export default UserAccountOverview;
