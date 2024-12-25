import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ClassesPage = () => {
    const [classes, setClasses] = useState([]); // State for all classes
    const [teachers, setTeachers] = useState([]); // State for teachers dropdown
    const [formData, setFormData] = useState({
        class_name: "",
        teacher_id: "",
    }); // State for form data
    const [editingClass, setEditingClass] = useState(null); // State for editing a class

    useEffect(() => {
        fetchClasses();
        fetchTeachers();
    }, []);

    // Fetch all classes
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

    // Fetch all teachers
    const fetchTeachers = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/teachers?page=1&per_page=100");
            const data = await response.json();

            if (Array.isArray(data.teachers)) {
                const formattedTeachers = data.teachers.map((teacher) => ({
                    id: teacher.id,
                    name: `${teacher.first_name} ${teacher.last_name}`,
                }));
                setTeachers(formattedTeachers);
            } else {
                console.error("Unexpected response format:", data);
                setTeachers([]);
            }
        } catch (error) {
            console.error("Error fetching teachers:", error);
            toast.error("Failed to load teachers!");
        }
    };

    // Handle form input changes
    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle class creation
    const handleCreateClass = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:5000/classes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                fetchClasses(); // Refresh class list
                setFormData({ class_name: "", teacher_id: "" });
                toast.success("Class created successfully!");
            } else {
                toast.error("Failed to create class!");
            }
        } catch (error) {
            console.error("Error creating class:", error);
            toast.error("An unexpected error occurred!");
        }
    };

    // Handle class deletion
    const handleDeleteClass = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/classes/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                fetchClasses();
                toast.success("Class deleted successfully!");
            } else {
                toast.error("Failed to delete class!");
            }
        } catch (error) {
            console.error("Error deleting class:", error);
            toast.error("An unexpected error occurred!");
        }
    };

    // Handle class editing
    const handleEditClass = (class_) => {
        setEditingClass(class_);
    };

    const handleUpdateClass = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://127.0.0.1:5000/classes/${editingClass.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingClass),
            });
            if (response.ok) {
                fetchClasses(); // Refresh class list
                setEditingClass(null);
                toast.success("Class updated successfully!");
            } else {
                toast.error("Failed to update class!");
            }
        } catch (error) {
            console.error("Error updating class:", error);
            toast.error("An unexpected error occurred!");
        }
    };

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Classes Management</h1>

            {/* Create Class Form */}
            <form className="mb-4" onSubmit={handleCreateClass}>
                <h2 className="text-lg font-bold mb-2">Create Class</h2>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="class_name"
                        placeholder="Class Name"
                        className="border p-2"
                        value={formData.class_name}
                        onChange={handleFormChange}
                    />
                    <select
                        name="teacher_id"
                        value={formData.teacher_id}
                        onChange={handleFormChange}
                        className="border p-2"
                    >
                        <option value="">Select a Teacher</option>
                        {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                                {teacher.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 mt-4 w-full"
                >
                    Create Class
                </button>
            </form>

            {/* Classes Table */}
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">ID</th>
                        <th className="border border-gray-300 p-2">Class Name</th>
                        <th className="border border-gray-300 p-2">Teacher</th>
                        <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {classes.map((class_) => (
                        <tr key={class_.id}>
                            <td className="border border-gray-300 p-2">{class_.id}</td>
                            <td className="border border-gray-300 p-2">{class_.class_name}</td>
                            <td className="border border-gray-300 p-2">
                                {teachers.find((teacher) => teacher.id === class_.teacher_id)?.name || "N/A"}
                            </td>
                            <td className="border border-gray-300 p-2">
                                <button
                                    className="bg-yellow-500 text-white p-1 mr-2 hover:bg-yellow-700"
                                    onClick={() => handleEditClass(class_)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white p-1 hover:bg-red-700"
                                    onClick={() => handleDeleteClass(class_.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Edit Class Form */}
            {editingClass && (
                <form className="mt-4" onSubmit={handleUpdateClass}>
                    <h2 className="text-lg font-bold mb-2">Edit Class</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="class_name"
                            placeholder="Class Name"
                            className="border p-2"
                            value={editingClass.class_name}
                            onChange={(e) => setEditingClass({ ...editingClass, class_name: e.target.value })}
                        />
                        <select
                            name="teacher_id"
                            value={editingClass.teacher_id || ""}
                            onChange={(e) => setEditingClass({ ...editingClass, teacher_id: e.target.value })}
                            className="border p-2"
                        >
                            <option value="">Select a Teacher</option>
                            {teachers.map((teacher) => (
                                <option key={teacher.id} value={teacher.id}>
                                    {teacher.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="bg-green-500 text-white p-2 mt-4"
                    >
                        Update Class
                    </button>
                </form>
            )}
        </div>
    );
};

export default ClassesPage;
