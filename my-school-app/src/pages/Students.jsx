import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";

const StudentsPage = () => {
    const [students, setStudents] = useState([]);
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
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
    });
    const [editingStudent, setEditingStudent] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    useEffect(() => {
        fetchStudents();
        fetchClasses();
    }, [pagination.currentPage]);

    const fetchStudents = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/students?page=${pagination.currentPage}&per_page=10`);
            const data = await response.json();
            setStudents(data.students);
            setPagination({
                currentPage: data.current_page,
                totalPages: data.pages,
            });
        } catch (error) {
            console.error("Error fetching students:", error);
            toast.error("Failed to load students!");
        }
    };

    const fetchClasses = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/classes");
            const data = await response.json();
            setClasses(data);
        } catch (error) {
            console.error("Error fetching classes:", error);
            toast.error("Failed to load classes!");
        }
    };

    const handleSearchChange = (e) => setSearchQuery(e.target.value);

    const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleAddOrEditStudent = async (e) => {
        e.preventDefault();
        const url = editingStudent
            ? `http://127.0.0.1:5000/students/${editingStudent.id}`
            : "http://127.0.0.1:5000/students";
        const method = editingStudent ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error(await response.text());

            toast.success(editingStudent ? "Student updated successfully!" : "Student added successfully!");
            setEditingStudent(null);
            setFormData({
                name: "",
                date_of_birth: "",
                gender: "",
                date_of_admission: "",
                class_id: "",
                nemis_no: "",
                assessment_no: "",
            });
            setIsFormVisible(false);// hide form after submission
            fetchStudents();
        } catch (error) {
            console.error("Error adding/updating student:", error);
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
        });
        setIsFormVisible(true);
    };

    const handleDelete = async (studentId) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/students/${studentId}`, { method: "DELETE" });

            if (!response.ok) throw new Error(await response.text());

            toast.success("Student deleted successfully!");
            fetchStudents();
        } catch (error) {
            console.error("Error deleting student:", error);
            toast.error("Failed to delete student!");
        }
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
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-6 mb-6">

            {/* Search */}
            <input
                type="text"
                placeholder="Search students..."
                className="border p-2 w-full mb-4"
                value={searchQuery}
                onChange={handleSearchChange}
            />
            </div>

            {/* Toggle Form Visibility */}
            <button
                onClick={() => setIsFormVisible(!isFormVisible)}
                className="mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded shadow hover:bg-blue-600"
            >
                {isFormVisible ? "Hide Form" : "Add New Student"}
            </button>

            {/* Form */}
            {isFormVisible && (
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">

            <form onSubmit={handleAddOrEditStudent} className="mb-4">
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        className="border p-2 w-full mb-2"
                        value={formData.name}
                        onChange={handleFormChange}
                        required
                    />
                </label>
                <label>
                    Date of Birth:
                    <input
                        type="date"
                        name="date_of_birth"
                        className="border p-2 w-full mb-2"
                        value={formData.date_of_birth}
                        onChange={handleFormChange}
                        required
                    />
                </label>
                <label>
                    Date of Admission:
                    <input
                        type="date"
                        name="date_of_admission"
                        className="border p-2 w-full mb-2"
                        value={formData.date_of_admission}
                        onChange={handleFormChange}
                        required
                    />
                </label>
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
                <label>
                    Nemis No.:
                    <input
                        type="text"
                        name="nemis_no"
                        className="border p-2 w-full mb-2"
                        value={formData.nemis_no}
                        onChange={handleFormChange}
                    />
                </label>
                <label>
                    Assessment No.:
                    <input
                        type="text"
                        name="assessment_no"
                        className="border p-2 w-full mb-2"
                        value={formData.assessment_no}
                        onChange={handleFormChange}
                    />
                </label>
                <button type="submit" className="bg-blue-500 text-white p-2 w-full">
                    {editingStudent ? "Update Student" : "Add Student"}
                </button>
            </form>
            </div>
        )}
        
            {/* Table */}
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">Admission No.</th>
                        <th className="border border-gray-300 p-2">Name</th>
                        <th className="border border-gray-300 p-2">Date of Birth</th>
                        <th className="border border-gray-300 p-2">Date of Admission</th>
                        <th className="border border-gray-300 p-2">Gender</th>
                        <th className="border border-gray-300 p-2">Class</th>
                        <th className="border border-gray-300 p-2">Nemis No.</th>
                        <th className="border border-gray-300 p-2">Assessment No.</th>
                        <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStudents.map((student) => (
                        <tr key={student.id}>
                            <td className="border border-gray-300 p-2">{student.id}</td>
                            <td className="border border-gray-300 p-2">{student.name}</td>
                            <td className="border border-gray-300 p-2">{student.date_of_birth}</td>
                            <td className="border border-gray-300 p-2">{student.date_of_admission}</td>
                            <td className="border border-gray-300 p-2">{student.gender}</td>
                            <td className="border border-gray-300 p-2">{student.class_name}</td>
                            <td className="border border-gray-300 p-2">{student.nemis_no}</td>
                            <td className="border border-gray-300 p-2">{student.assessment_no}</td>
                            <td className="border border-gray-300 p-2">
                                <button
                                    className="bg-yellow-500 text-white p-2 mr-2"
                                    onClick={() => handleEdit(student)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white p-2"
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
            <div className="flex justify-between items-center mt-4">
                <button
                    className="bg-gray-500 text-white p-2"
                    disabled={pagination.currentPage <= 1}
                    onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
                >
                    Previous
                </button>
                <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
                <button
                    className="bg-gray-500 text-white p-2"
                    disabled={pagination.currentPage >= pagination.totalPages}
                    onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default StudentsPage;
