import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [pickupLocations, setPickupLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    date_of_birth: "",
    gender: "",
    date_of_admission: "",
    class_id: "",
    nemis_no: "",
    assessment_no: "",
    pickup_location_id: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [editingStudent, setEditingStudent] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Fetch students, pickup locations, and classes
  useEffect(() => {
    fetchStudents();
    fetchPickupLocations();
    fetchClasses();
  }, [pagination.currentPage]);

  const fetchStudents = async () => {
    try {
      const response = await fetch(
        `https://school-back-z4bc.onrender.com/students?page=${pagination.currentPage}&per_page=10`
      );
      const data = await response.json();
      setStudents(data.students);
      setPagination({ currentPage: data.current_page, totalPages: data.pages });
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students!");
    }
  };

  const fetchPickupLocations = async () => {
    try {
      const response = await fetch("https://school-back-z4bc.onrender.com/pickup-location");
      const data = await response.json();
      setPickupLocations(data);
    } catch (error) {
      console.error("Error fetching pickup locations:", error);
      toast.error("Failed to load pickup locations!");
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch("https://school-back-z4bc.onrender.com/classes");
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to load classes!");
    }
  };

  // Handle form changes
  const handleFormChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddOrEditStudent = async (e) => {
    e.preventDefault();
    const url = editingStudent
      ? `https://school-back-z4bc.onrender.com/students/${editingStudent.id}`
      : "https://school-back-z4bc.onrender.com/students";
    const method = editingStudent ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error(await response.text());

      toast.success(
        editingStudent ? "Student updated successfully!" : "Student added successfully!"
      );
      resetForm();
      fetchStudents();
    } catch (error) {
      console.error("Error saving student:", error);
      toast.error("Failed to save student!");
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      date_of_birth: student.date_of_birth,
      gender: student.gender,
      date_of_admission: student.date_of_admission,
      class_id: student.class_id,
      nemis_no: student.nemis_no,
      assessment_no: student.assessment_no,
      pickup_location_id: student.pickup_location_id,
    });
    setIsFormVisible(true);
  };

  const handleDelete = async (studentId) => {
    try {
      const response = await fetch(`https://school-back-z4bc.onrender.com/students/${studentId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(await response.text());
      toast.success("Student deleted successfully!");
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Failed to delete student!");
    }
  };

  const resetForm = () => {
    setEditingStudent(null);
    setFormData({
      name: "",
      date_of_birth: "",
      gender: "",
      date_of_admission: "",
      class_id: "",
      nemis_no: "",
      assessment_no: "",
      pickup_location_id: "",
    });
    setIsFormVisible(false);
  };

  const filteredStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      student.id.toString().includes(query)
    );
  });

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Student Management</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search students..."
        className="border p-2 w-full mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Toggle Form */}
      <button
        onClick={() => setIsFormVisible(!isFormVisible)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isFormVisible ? "Hide Form" : "Add New Student"}
      </button>

      {/* Form */}
      {isFormVisible && (
        <form onSubmit={handleAddOrEditStudent} className="bg-white shadow-md p-4 mb-6">
          {/* Form Fields */}
          {[
            { label: "Name", name: "name", type: "text" },
            { label: "Date of Birth", name: "date_of_birth", type: "date" },
            { label: "Date of Admission", name: "date_of_admission", type: "date" },
            { label: "NEMIS No.", name: "nemis_no", type: "text" },
            { label: "Assessment No.", name: "assessment_no", type: "text" },
          ].map(({ label, name, type }) => (
            <label key={name} className="block mb-2">
              {label}:
              <input
                type={type}
                name={name}
                className="border p-2 w-full mb-2"
                value={formData[name]}
                onChange={handleFormChange}
              />
            </label>
          ))}
          {/* Dropdowns */}
          <label>
                    Gender:
                    <select
                        name="gender"
                        className="border p-2 w-full mb-2"
                        value={formData.gender}
                        onChange={handleFormChange}
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </label>
          <label>
            Class:
            <select
              name="class_id"
              className="border p-2 w-full mb-2"
              value={formData.class_id}
              onChange={handleFormChange}
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.class_name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Pickup Location:
            <select
              name="pickup_location_id"
              className="border p-2 w-full mb-2"
              value={formData.pickup_location_id}
              onChange={handleFormChange}
            >
              <option value="">Select Pickup Location</option>
              {pickupLocations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.location_name}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" className="bg-blue-500 text-white p-2 w-full">
            {editingStudent ? "Update Student" : "Add Student"}
          </button>
        </form>
      )}

      {/* Table */}
      <table className="table-auto w-full border border-gray-300">
        <thead>
          <tr>
            {["Adm No.", "Name", "DOB", "DOA", "Gender", "Class", "Nemis No.", "Assessment No.", "Actions"].map(
              (heading) => (
                <th key={heading} className="border p-2">
                  {heading}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id}>
              {[
                student.id,
                student.name,
                student.date_of_birth,
                student.date_of_admission,
                student.gender,
                student.class_name,
                student.nemis_no,
                student.assessment_no,
              ].map((value, index) => (
                <td key={index} className="border p-2">
                  {value}
                </td>
              ))}
              <td className="border p-2 flex gap-2">
                <button
                  className="bg-yellow-500 text-white px-4 py-1"
                  onClick={() => handleEdit(student)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-1"
                  onClick={() => handleDelete(student.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          className="bg-gray-500 text-white px-4 py-2"
          disabled={pagination.currentPage === 1}
          onClick={() =>
            setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })
          }
        >
          Previous
        </button>
        <span>
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button
          className="bg-gray-500 text-white px-4 py-2"
          disabled={pagination.currentPage === pagination.totalPages}
          onClick={() =>
            setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StudentsPage;
