import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions, approveTransaction } from "../store/admintransactionsSlice";

const TransactionManagement = () => {
  const dispatch = useDispatch();
  const { transactions, status, error } = useSelector((state) => state.transactions);

  // Fetch transactions when the component mounts
  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  // Handle transaction approval
  const handleApproveTransaction = (transactionId) => {
    dispatch(approveTransaction(transactionId)).then(() => {
      // Refresh transactions after approval
      dispatch(fetchTransactions());
    });
  };

  // Loading state
  if (status === "loading") {
    return <h2>Loading transactions...</h2>;
  }

  // Error state
  if (status === "failed") {
    return <h2>Error: {error}</h2>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Transaction Management</h1>
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Transaction ID</th>
            <th>User</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">No transactions found</td>
            </tr>
          ) : (
            transactions.map((transaction) => (
              <tr key={transaction.transaction_id}>
                <td>{transaction.transaction_id}</td>
                <td>{transaction.user}</td>
                <td>${transaction.amount}</td>
                <td>
                  <span className={`badge ${transaction.status === "approved" ? "bg-success" : "bg-warning text-dark"}`}>
                    {transaction.status}
                  </span>
                </td>
                <td>
                  {transaction.status !== "approved" ? (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleApproveTransaction(transaction.transaction_id)}
                    >
                      Approve
                    </button>
                  ) : (
                    <span className="text-muted">Approved</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionManagement;
