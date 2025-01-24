import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [summary, setSummary] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [subjectPopularity, setSubjectPopularity] = useState([]);
  const [quickLinks, setQuickLinks] = useState([]);
  const [loading, setLoading] = useState(true); // General loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, notificationsRes, enrollmentRes, subjectRes, linksRes] = await Promise.all([
          axios.get("https://school-back-z4bc.onrender.com/dashboard/summary"),
          axios.get("https://school-back-z4bc.onrender.com/dashboard/notifications"),
          axios.get("https://school-back-z4bc.onrender.com/dashboard/chart/enrollment"),
          axios.get("https://school-back-z4bc.onrender.com/dashboard/chart/subject-popularity"),
          axios.get("https://school-back-z4bc.onrender.com/dashboard/quick-links"),
        ]);

        setSummary(summaryRes.data || {});
        setNotifications(Array.isArray(notificationsRes.data) ? notificationsRes.data : []);
        setEnrollmentData(Array.isArray(enrollmentRes.data) ? enrollmentRes.data : []);
        setSubjectPopularity(Array.isArray(subjectRes.data) ? subjectRes.data : []);
        setQuickLinks(linksRes.data.quick_links || []);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {["total_students", "total_teachers", "total_classes", "total_subjects"].map((key, idx) => (
          <div key={idx} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">
              {key.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </h2>
            <p className="text-2xl font-bold text-blue-600">{summary[key] || "N/A"}</p>
          </div>
        ))}
      </div>

      {/* Notifications */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Recent Admissions</h2>
        <ul className="bg-white p-4 rounded shadow divide-y">
          {notifications.length > 0 ? (
            notifications.map((student) => (
              <li key={student.id} className="py-2">
                <span className="font-semibold">{student.name}</span> - Admitted on{" "}
                <span className="text-gray-600">{student.date_of_admission}</span>
              </li>
            ))
          ) : (
            <p className="text-gray-600">No recent admissions.</p>
          )}
        </ul>
      </div>

      {/* Charts and Quick Links */}
      <ChartSection title="Monthly Enrollment" data={enrollmentData} />
      <ChartSection title="Subject Popularity" data={subjectPopularity} />

      <div>
        <h2 className="text-xl font-bold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              className="bg-blue-600 text-white p-4 rounded shadow text-center"
            >
              <p className="text-lg font-bold">{link.name}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const ChartSection = ({ title, data }) => (
  <div className="mb-6">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    <div className="bg-white p-4 rounded shadow">
      {data.length > 0 ? (
        <ul>
          {data.map((entry, idx) => (
            <li key={idx}>
              {entry.subject_name || entry.month}: <strong>{entry.count}</strong>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No data available.</p>
      )}
    </div>
  </div>
);

export default Dashboard;
