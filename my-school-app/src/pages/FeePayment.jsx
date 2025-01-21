import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const FeePayments = () => {
  const [payments, setPayments] = useState([]);
  const [pickupLocations, setPickupLocations] = useState([]);
  const [newPayment, setNewPayment] = useState({
    student_id: "",
    amount: "",
    payment_date: "",
    term: "",
    year: "",
    method: "",
    pickup_location_id: "", // New field for pickup location
  });

  const fetchPayments = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/fee-payment");
      setPayments(response.data.fee_payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Error fetching payments");
    }
  };

  const fetchPickupLocations = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/pickup-location");
      setPickupLocations(response.data);
    } catch (error) {
      console.error("Error fetching pickup locations:", error);
      toast.error("Error fetching pickup locations");
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/fee-payment", newPayment);
      toast.success("Payment added successfully");
      setPayments([...payments, response.data.fee_payment]);
      setNewPayment({
        student_id: "",
        amount: "",
        payment_date: "",
        term: "",
        year: "",
        method: "",
        pickup_location_id: "", // Reset pickup location
      });
    } catch (error) {
      toast.error("Error submitting payment");
      console.error("Error submitting payment:", error);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchPickupLocations();
  }, []);

  const handleEdit = (paymentId) => {
    toast.info(`Edit feature for payment ID: ${paymentId} coming soon!`);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Fee Payments</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-6 mb-6">
        <form onSubmit={handlePaymentSubmit}>
          <input
            type="number"
            placeholder="Student ID"
            className="border p-2 w-full mb-4"
            value={newPayment.student_id}
            onChange={(e) => setNewPayment({ ...newPayment, student_id: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Amount"
            className="border p-2 w-full mb-4"
            value={newPayment.amount}
            onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
            required
          />
          <input
            type="date"
            placeholder="Payment Date"
            className="border p-2 w-full mb-4"
            value={newPayment.payment_date}
            onChange={(e) => setNewPayment({ ...newPayment, payment_date: e.target.value })}
            required
          />
          <select
            value={newPayment.term}
            className="border p-2 w-full mb-4"
            onChange={(e) => setNewPayment({ ...newPayment, term: e.target.value })}
            required
          >
            <option value="">Select Term</option>
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
          </select>
          <input
            type="number"
            placeholder="Year"
            className="border p-2 w-full mb-4"
            value={newPayment.year}
            onChange={(e) => setNewPayment({ ...newPayment, year: e.target.value })}
            required
          />
          <select
            value={newPayment.method}
            className="border p-2 w-full mb-4"
            onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
            required
          >
            <option value="" disabled>
              Select Payment Method
            </option>
            <option value="Direct Deposit">Direct Deposit</option>
            <option value="Mobile Money">Mobile Money</option>
          </select>
          <select
            value={newPayment.pickup_location_id}
            className="border p-2 w-full mb-4"
            onChange={(e) => setNewPayment({ ...newPayment, pickup_location_id: e.target.value })}
          >
            <option value="">Select Pickup Location (Optional)</option>
            {pickupLocations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.location_name} - {location.transport_fee}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Payment
          </button>
        </form>
      </div>
      <table className="table-auto w-full bg-white shadow-md rounded">
        <thead>
          <tr>
            <th className="px-4 py-2">Admission No.</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Payment Date</th>
            <th className="px-4 py-2">Term</th>
            <th className="px-4 py-2">Year</th>
            <th className="px-4 py-2">Method</th>
            <th className="px-4 py-2">Pickup Location</th>
            <th className="px-4 py-2">Balance</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td className="border px-4 py-2">{payment.student_id}</td>
              <td className="border px-4 py-2">{payment.amount}</td>
              <td className="border px-4 py-2">{payment.payment_date}</td>
              <td className="border px-4 py-2">{payment.term}</td>
              <td className="border px-4 py-2">{payment.year}</td>
              <td className="border px-4 py-2">{payment.method}</td>
              <td className="border px-4 py-2">
                {payment.pickup_location?.location_name || "N/A"}
              </td>
              <td className="border px-4 py-2">{payment.balance}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(payment.id)}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeePayments;
