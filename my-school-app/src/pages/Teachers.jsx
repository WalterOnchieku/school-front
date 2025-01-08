import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const TeachersPage = () => {
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        date_of_admission: "",
        subject_id: "",
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
    });
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTeachers();
        fetchSubjects();
    }, [pagination.currentPage, searchQuery]);

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const query = searchQuery ? `&search=${searchQuery}` : "";
            const response = await axios.get(
                `http://127.0.0.1:5000/teachers?page=${pagination.currentPage}${query}`
            );
            const data = response.data;
            setTeachers(data.teachers);
            setPagination({
                currentPage: data.current_page,
                totalPages: data.pages,
            });
        } catch (error) {
            toast.error("Failed to fetch teachers");
        } finally {
            setLoading(false);
        }
    };

    const fetchSubjects = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/subjects");
            setSubjects(response.data);
        } catch (error) {
            toast.error("Failed to fetch subjects");
        }
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateTeacher = async (e) => {
        e.preventDefault();
        try {
            if (!formData.first_name || !formData.last_name || !formData.subject_id) {
                toast.error("All fields are required.");
                return;
            }
            await axios.post("http://127.0.0.1:5000/teachers", formData);
            toast.success("Teacher created successfully!");
            fetchTeachers();
            setFormData({
                first_name: "",
                last_name: "",
                date_of_admission: "",
                subject_id: "",
            });
        } catch (error) {
            toast.error("Failed to create teacher");
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleDeleteTeacher = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/teachers/${id}`);
            toast.success("Teacher deleted successfully!");
            fetchTeachers();
        } catch (error) {
            toast.error("Failed to delete teacher");
        }
    };

    const handleEditTeacher = (teacher) => {
        setEditingTeacher({
            ...teacher,
            subject_id: teacher.subject_id || "",
        });
    };

    const handleUpdateTeacher = async (e) => {
        e.preventDefault();
        try {
            if (!editingTeacher.first_name || !editingTeacher.last_name || !editingTeacher.subject_id) {
                toast.error("All fields are required.");
                return;
            }
            await axios.put(
                `http://127.0.0.1:5000/teachers/${editingTeacher.id}`,
                editingTeacher
            );
            toast.success("Teacher updated successfully!");
            fetchTeachers();
            setEditingTeacher(null);
        } catch (error) {
            toast.error("Failed to update teacher");
        }
    };

    const handleEditChange = (e) => {
        setEditingTeacher({ ...editingTeacher, [e.target.name]: e.target.value });
    };

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, currentPage: newPage }));
    };

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Teacher Management</h1>
            {/* Search Bar */}
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">

            <input
                type="text"
                placeholder="Search teachers..."
                className="border p-2 w-full mb-4"
                value={searchQuery}
                onChange={handleSearchChange}
            />
            </div>

            {/* Create Teacher Form */}
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">

            <form className="mb-4" onSubmit={handleCreateTeacher}>
                <h2 className="text-lg font-bold mb-2">Create Teacher</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">First Name:</label>
                        <input
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            className="border p-2 w-full"
                            value={formData.first_name}
                            onChange={handleFormChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Last Name:</label>
                        <input
                            type="text"
                            name="last_name"
                            placeholder="Last Name"
                            className="border p-2 w-full"
                            value={formData.last_name}
                            onChange={handleFormChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Date of Recruitment:</label>
                        <input
                            type="date"
                            name="date_of_admission"
                            className="border p-2 w-full"
                            value={formData.date_of_admission}
                            onChange={handleFormChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Subject:</label>
                        <select
                            name="subject_id"
                            className="border p-2 w-full"
                            value={formData.subject_id}
                            onChange={handleFormChange}
                            required
                        >
                            <option value="">Select Subject</option>
                            {subjects.map((subject) => (
                                <option key={subject.id} value={subject.id}>
                                    {subject.subject_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 mt-4 w-full">
                    Create Teacher
                </button>
            </form>
            </div>

            {/* Teachers Table */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2">First Name</th>
                            <th className="border border-gray-300 p-2">Last Name</th>
                            <th className="border border-gray-300 p-2">Date of Recruitment</th>
                            <th className="border border-gray-300 p-2">Subject</th>
                            <th className="border border-gray-300 p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map((teacher) => (
                            <tr key={teacher.id}>
                                <td className="border border-gray-300 p-2">{teacher.first_name}</td>
                                <td className="border border-gray-300 p-2">{teacher.last_name}</td>
                                <td className="border border-gray-300 p-2">{teacher.date_of_admission}</td>
                                <td className="border border-gray-300 p-2">{teacher.subject_name}</td>
                                <td className="border border-gray-300 p-2">
                                    <button
                                        className="bg-yellow-500 hover:bg-yellow-700 text-white p-1 mr-2"
                                        onClick={() => handleEditTeacher(teacher)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-700 text-white p-1"
                                        onClick={() => handleDeleteTeacher(teacher.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <button
                    className="bg-gray-500 text-white p-2"
                    disabled={pagination.currentPage <= 1}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                >
                    Previous
                </button>
                <span>
                    Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                    className="bg-gray-500 text-white p-2"
                    disabled={pagination.currentPage >= pagination.totalPages}
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                >
                    Next
                </button>
            </div>

            {/* Edit Teacher Form */}
            {editingTeacher && (
                <form className="mt-4" onSubmit={handleUpdateTeacher}>
                    <h2 className="text-lg font-bold mb-2">Edit Teacher</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">First Name:</label>
                            <input
                                type="text"
                                name="first_name"
                                placeholder="First Name"
                                className="border p-2 w-full"
                                value={editingTeacher.first_name}
                                onChange={handleEditChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Last Name:</label>
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Last Name"
                                className="border p-2 w-full"
                                value={editingTeacher.last_name}
                                onChange={handleEditChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Date of Admission:</label>
                            <input
                                type="date"
                                name="date_of_admission"
                                className="border p-2 w-full"
                                value={editingTeacher.date_of_admission}
                                onChange={handleEditChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Subject:</label>
                            <select
                                name="subject_id"
                                className="border p-2 w-full"
                                value={editingTeacher.subject_id}
                                onChange={handleEditChange}
                                required
                            >
                                <option value="">Select Subject</option>
                                {subjects.map((subject) => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject.subject_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="bg-green-500 text-white p-2 mt-4 w-full">
                        Update Teacher
                    </button>
                </form>
            )}
        </div>
    );
};

export default TeachersPage;
