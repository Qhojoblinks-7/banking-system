import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUser } from '../store/userSlice';
import { fetchTransactions } from '../store/transactionsSlice';

const RefreshData = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const refresh = async () => {
      try {
        // Dispatch both thunks concurrently and wait for them to complete
        await Promise.all([
          dispatch(fetchUser()).unwrap(),
          dispatch(fetchTransactions()).unwrap(),
        ]);
        setLoading(false);
        // After a successful refresh, navigate to the dashboard
        navigate('/user-dashboard');
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    refresh();
  }, [dispatch, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-700 text-lg font-semibold">Refreshing data, please wait...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 p-4">
        <p className="text-red-700 text-lg font-semibold">Error refreshing data: {error}</p>
      </div>
    );
  }

  return null;
};

export default RefreshData;
