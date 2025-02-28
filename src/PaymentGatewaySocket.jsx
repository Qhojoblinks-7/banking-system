// PaymentGatewaySocket.js
import { useEffect, useState } from "react";
import io from "socket.io-client";

// Connect to the Socket.IO server (adjust the URL if necessary)
const socket = io("http://localhost:3000");

const PaymentGatewaySocket = () => {
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    // Listen for real-time payment status updates
    socket.on("paymentStatus", (data) => {
      setStatuses((prev) => [...prev, data]);
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.off("paymentStatus");
    };
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Real-Time Payment Updates</h2>
      <ul className="space-y-2">
        {statuses.map((status, index) => (
          <li key={index} className="border p-2 rounded">
            <strong>Transaction {status.transactionId}</strong> ({status.type}):{" "}
            <span
              className={
                status.status === "success"
                  ? "text-green-600"
                  : status.status === "failed"
                  ? "text-red-600"
                  : "text-gray-600"
              }
            >
              {status.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentGatewaySocket;
