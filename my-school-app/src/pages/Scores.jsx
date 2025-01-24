import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Scores = () => {
  const [scores, setScores] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]); // State to store classes
  const [formData, setFormData] = useState({
    student_id: "",
    subject_id: "",
    score: "",
    term: "",
    year: ""
  });
  const [filters, setFilters] = useState({
    student_id: "",
    term: "",
    year: "",
    class_id: "" // Added class_id to filters
  });
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scoresPerPage] = useState(10);

  // Fetch scores, subjects, and classes on component mount
  useEffect(() => {
    fetchScores();
    fetchSubjects();
    fetchClasses(); // Fetch the list of classes
  }, []);

  const fetchScores = async () => {
    try {
      const response = await axios.get("https://school-back-z4bc.onrender.com/score_grades");
      setScores(response.data);
    } catch (error) {
      toast.error("Failed to fetch scores");
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get("https://school-back-z4bc.onrender.com/subjects");
      setSubjects(response.data);
    } catch (error) {
      toast.error("Failed to fetch subjects");
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get("https://school-back-z4bc.onrender.com/classes");
      setClasses(response.data);
    } catch (error) {
      toast.error("Failed to fetch classes");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`https://school-back-z4bc.onrender.com/score_grades/${editingId}`, formData);
        toast.success("Score updated successfully");
      } else {
        await axios.post("https://school-back-z4bc.onrender.com/score_grades", formData);
        toast.success("Score added successfully");
      }
      setFormData({
        student_id: "",
        subject_id: "",
        score: "",
        term: "",
        year: ""
      });
      setEditingId(null);
      fetchScores();
    } catch (error) {
      toast.error("Failed to save score");
    }
  };

  const handleEdit = (score) => {
    setEditingId(score.id);
    setFormData({
      student_id: score.student_id,
      subject_id: score.subject_id,
      score: score.score || "",
      term: score.term || "",
      year: score.year || ""
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this score?")) return;
    try {
      await axios.delete(`https://school-back-z4bc.onrender.com/score_grades/${id}`);
      toast.success("Score deleted successfully");
      fetchScores();
    } catch (error) {
      toast.error("Failed to delete score");
    }
  };

  const filteredScores = scores.filter(
    (score) =>
      (!filters.student_id || score.student_id.toString() === filters.student_id) &&
      (!filters.term || score.term === filters.term) &&
      (!filters.year || score.year.toString() === filters.year) &&
      (!filters.class_id || score.class_id?.toString() === filters.class_id) // Filter by class_id
  );

  const indexOfLastScore = currentPage * scoresPerPage;
  const indexOfFirstScore = indexOfLastScore - scoresPerPage;
  const currentScores = filteredScores.slice(indexOfFirstScore, indexOfLastScore);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6 text-center">Manage Scores</h1>

      {/* Search Filters */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
        <h2 className="text-xl font-bold mb-4">Search Scores</h2>
        <div className="grid grid-cols-4 gap-4">
          <input
            type="number"
            name="student_id"
            value={filters.student_id}
            onChange={handleFilterChange}
            placeholder="Admission No."
            className="border rounded p-2"
          />
          <select
            name="term"
            value={filters.term}
            onChange={handleFilterChange}
            className="border rounded p-2"
          >
            <option value="">Select Term</option>
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
          </select>
          <input
            type="number"
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
            placeholder="Year"
            className="border rounded p-2"
          />
          <select
            name="class_id"
            value={filters.class_id}
            onChange={handleFilterChange}
            className="border rounded p-2"
          >
            <option value="">Select Class</option>
            {classes.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.class_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Form */}
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="student_id"
            value={formData.student_id}
            onChange={handleInputChange}
            placeholder="Admission No."
            className="border rounded p-2"
            required
          />
          <select
            name="subject_id"
            value={formData.subject_id}
            onChange={handleInputChange}
            className="border rounded p-2"
            required
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.subject_name}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="score"
            value={formData.score}
            onChange={handleInputChange}
            placeholder="Score"
            className="border rounded p-2"
            required
          />
          <select
            name="term"
            value={formData.term}
            onChange={handleInputChange}
            className="border rounded p-2"
            required
          >
            <option value="">Select Term</option>
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
          </select>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            placeholder="Year"
            className="border rounded p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {editingId ? "Update Score" : "Add Score"}
        </button>
      </form>

      {/* Score List */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h2 className="text-xl font-bold mb-4">Scores</h2>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">Student Name</th>
              <th className="border px-4 py-2">Subject Name</th>
              <th className="border px-4 py-2">Score</th>
              <th className="border px-4 py-2">Term</th>
              <th className="border px-4 py-2">Year</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentScores.map((score) => (
              <tr key={score.id}>
                <td className="border px-4 py-2">{score.student_name}</td>
                <td className="border px-4 py-2">{score.subject_name}</td>
                <td className="border px-4 py-2">{score.score || "N/A"}</td>
                <td className="border px-4 py-2">{score.term || "N/A"}</td>
                <td className="border px-4 py-2">{score.year || "N/A"}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-2"
                    onClick={() => handleEdit(score)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white py-1 px-2"
                    onClick={() => handleDelete(score.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex justify-center mt-4">
          {[...Array(Math.ceil(filteredScores.length / scoresPerPage)).keys()].map((num) => (
            <button
              key={num}
              onClick={() => paginate(num + 1)}
              className={`mx-1 px-3 py-1 rounded ${currentPage === num + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              {num + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scores;
