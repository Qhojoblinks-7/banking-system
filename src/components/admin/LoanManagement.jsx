import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLoans, approveLoan } from "../store/adminloansSlice";

const LoanManagement = () => {
  const dispatch = useDispatch();
  const { loans, status, error } = useSelector((state) => state.loans);

  // Fetch loans when the component mounts
  useEffect(() => {
    dispatch(fetchLoans());
  }, [dispatch]);

  // Handle loan approval
  const handleApproveLoan = (loanId) => {
    dispatch(approveLoan(loanId)).then(() => {
      // Refresh loans after approving
      dispatch(fetchLoans());
    });
  };

  // Loading state
  if (status === "loading") {
    return <h2>Loading loans...</h2>;
  }

  // Error state
  if (status === "failed") {
    return <h2>Error: {error}</h2>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Loan Management</h1>
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Loan ID</th>
            <th>User</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loans.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">No loans found</td>
            </tr>
          ) : (
            loans.map((loan) => (
              <tr key={loan.loan_id}>
                <td>{loan.loan_id}</td>
                <td>{loan.user}</td>
                <td>${loan.amount}</td>
                <td>
                  <span className={`badge ${loan.status === "approved" ? "bg-success" : "bg-warning text-dark"}`}>
                    {loan.status}
                  </span>
                </td>
                <td>
                  {loan.status !== "approved" ? (
                    <button className="btn btn-success btn-sm" onClick={() => handleApproveLoan(loan.loan_id)}>
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

export default LoanManagement;
