import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [editSubjectId, setEditSubjectId] = useState(null);
  const [editSubjectName, setEditSubjectName] = useState("");

  // Fetch all subjects
  const fetchSubjects = async () => {
    try {
      const response = await fetch("https://school-back-z4bc.onrender.com/subjects");
      if (response.ok) {
        const data = await response.json();
        setSubjects(data);
      } else {
        console.error("Failed to fetch subjects");
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Add a new subject
  const addSubject = async () => {
    try {
      const response = await fetch("https://school-back-z4bc.onrender.com/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject_name: newSubjectName }),
      });

      if (response.ok) {
        toast.success("Subject added successfully!");
        const newSubject = await response.json();
        setSubjects([...subjects, newSubject]);
        setNewSubjectName("");
      } else {
        toast.error("Failed to add subject!")
        console.error("Failed to add subject");
      }
    } catch (error) {
      console.error("Error adding subject:", error);
    }
  };

  // Update a subject
  const updateSubject = async (subjectId) => {
    try {
      const response = await fetch(`https://school-back-z4bc.onrender.com/subjects/${subjectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject_name: editSubjectName }),
      });

      if (response.ok) {
        toast.success("Subject updated successfully!");
        const updatedSubject = await response.json();
        setSubjects(subjects.map((subject) =>
          subject.id === subjectId ? updatedSubject : subject
        ));
        setEditSubjectId(null);
        setEditSubjectName("");
      } else {
        toast.error("Failed to update subject!");
        console.error("Failed to update subject");
      }
    } catch (error) {
      console.error("Error updating subject:", error);
    }
  };

  // Delete a subject
  const deleteSubject = async (subjectId) => {
    try {
      const response = await fetch(`https://school-back-z4bc.onrender.com/subjects/${subjectId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSubjects(subjects.filter((subject) => subject.id !== subjectId));
      } else {
        console.error("Failed to delete subject");
      }
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Subjects</h1>
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Subject</h2>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Subject Name"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            className="border border-gray-300 rounded p-2 flex-1"
          />
          <button
            onClick={addSubject}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Subject List</h2>
        <ul className="space-y-4">
          {subjects.map((subject) => (
            <li key={subject.id} className="flex items-center gap-4">
              {editSubjectId === subject.id ? (
                <>
                  <input
                    type="text"
                    value={editSubjectName}
                    onChange={(e) => setEditSubjectName(e.target.value)}
                    className="border border-gray-300 rounded p-2 flex-1"
                  />
                  <button
                    onClick={() => updateSubject(subject.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditSubjectId(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1">{subject.subject_name}</span>
                  <button
                    onClick={() => {
                      setEditSubjectId(subject.id);
                      setEditSubjectName(subject.subject_name);
                    }}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteSubject(subject.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


export default SubjectsPage;
