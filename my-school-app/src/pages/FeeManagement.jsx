import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const FeeManagement = () => {
  const [feeStructures, setFeeStructures] = useState([]);
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    class_id: "",
    tuition_fee: 0,
    books_fee: 0,
    miscellaneous_fee: 0,
    boarding_fee: 0,
    prize_giving_fee: 0,
    exam_fee: 0,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchFeeStructures();
    fetchClasses();
  }, []);

  const fetchFeeStructures = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/fee-structure");
      setFeeStructures(response.data);
    } catch (error) {
      toast.error("Failed to fetch fee structures");
      console.error("Error fetching fee structures:", error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/classes");
      setClasses(response.data);
    } catch (error) {
      toast.error("Failed to fetch classes");
      console.error("Error fetching classes:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://127.0.0.1:5000/fee-structure/${editingId}`, formData);
        toast.success("Fee structure updated successfully");
      } else {
        await axios.post("http://127.0.0.1:5000/fee-structure", formData);
        toast.success("Fee structure added successfully");
      }
      fetchFeeStructures();
      resetForm();
    } catch (error) {
      toast.error("Failed to save fee structure");
      console.error("Error saving fee structure:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/fee-structure/${id}`);
      fetchFeeStructures();
      toast.success("Fee structure deleted successfully");
    } catch (error) {
      toast.error("Failed to delete fee structure");
      console.error("Error deleting fee structure:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      class_id: "",
      tuition_fee: 0,
      books_fee: 0,
      miscellaneous_fee: 0,
      boarding_fee: 0,
      prize_giving_fee: 0,
      exam_fee: 0,
    });
    setEditingId(null);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
        <h2 className="text-xl font-bold mb-4">Fee Management</h2>
        <form onSubmit={handleSubmit}>
          {/* Class Selection */}
          <label className="block mb-2">
            Class:
            <select
              className="border p-2 w-full"
              value={formData.class_id}
              onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
              required
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.class_name}
                </option>
              ))}
            </select>
          </label>

          {/* Fees */}
          {[
            { label: "Tuition Fee", field: "tuition_fee" },
            { label: "Books Fee", field: "books_fee" },
            { label: "Miscellaneous Fee", field: "miscellaneous_fee" },
            { label: "Boarding Fee", field: "boarding_fee" },
            { label: "Prize-Giving Fee", field: "prize_giving_fee" },
            { label: "Exam Fee", field: "exam_fee" },
          ].map((fee) => (
            <label key={fee.field} className="block mb-2">
              {fee.label}:
              <input
                type="number"
                className="border p-2 w-full"
                value={formData[fee.field]}
                onChange={(e) => setFormData({ ...formData, [fee.field]: e.target.value })}
                required
              />
            </label>
          ))}

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 mt-4 w-full"
          >
            {editingId ? "Update" : "Add"} Fee Structure
          </button>
        </form>
      </div>

      <h3 className="text-lg font-bold">Fee Structures</h3>
      {feeStructures.length === 0 ? (
        <p>No fee structures available.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Class</th>
              <th className="border border-gray-300 p-2">Tuition Fee</th>
              <th className="border border-gray-300 p-2">Books Fee</th>
              <th className="border border-gray-300 p-2">Miscellaneous Fee</th>
              <th className="border border-gray-300 p-2">Boarding Fee</th>
              <th className="border border-gray-300 p-2">Prize-Giving Fee</th>
              <th className="border border-gray-300 p-2">Exam Fee</th>
              <th className="border border-gray-300 p-2">Total Fee</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {feeStructures.map((fee) => (
              <tr key={fee.id}>
                <td className="border border-gray-300 p-2">{fee.class_details?.class_name || "N/A"}</td>
                <td className="border border-gray-300 p-2">{fee.tuition_fee}</td>
                <td className="border border-gray-300 p-2">{fee.books_fee}</td>
                <td className="border border-gray-300 p-2">{fee.miscellaneous_fee}</td>
                <td className="border border-gray-300 p-2">{fee.boarding_fee}</td>
                <td className="border border-gray-300 p-2">{fee.prize_giving_fee}</td>
                <td className="border border-gray-300 p-2">{fee.exam_fee}</td>
                <td className="border border-gray-300 p-2">{fee.total_fee}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-700 text-white p-1 mr-2"
                    onClick={() => setEditingId(fee.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white p-1"
                    onClick={() => handleDelete(fee.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FeeManagement;
