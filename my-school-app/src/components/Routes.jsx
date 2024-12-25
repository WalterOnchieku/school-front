import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import StudentsPage from '../pages/Students';
import TeachersPage from '../pages/Teachers';
import SubjectsPage from '../pages/Subjects';
import Scores from '../pages/Scores';
import ClassesPage from '../pages/Classes';
import StudentReport from '../pages/Reports';
import Dashboard from '../pages/Dashboard';

// const Students = () => <h2>Students Page</h2>;
// const Teachers = () => <h2>Teachers Page</h2>;
// const Dashboard = () => <h2>Welcome to the Dashboard</h2>;
// const Subjects = () => <h2>Welcome to the Subjects page</h2>;
// const Scores = () => <h2>Welcome to the Scores page</h2>;


const AppRoutes = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/teachers" element={<TeachersPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/scores" element={<Scores />} />
        <Route path="/classes" element={<ClassesPage />} />
        <Route path="/reports" element={<StudentReport />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;