import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const StudentReport = () => {
  const [studentId, setStudentId] = useState("");
  const [term, setTerm] = useState("");
  const [year, setYear] = useState("");
  const [report, setReport] = useState(null);

  const handleFetchReport = async () => {
    if (!studentId || !term || !year) {
      toast.error("Please provide all required fields");
      return;
    }

    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/report/${studentId}/${term}/${year}`
      );
      setReport(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch the report"
      );
      setReport(null);
    }
  };

  const PDFDocument = ({ report }) => (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>Student Report Card</Text>
          <Text>Student ID: {report.student_id}</Text>
          <Text>Term: {report.term}</Text>
          <Text>Year: {report.year}</Text>
          <Text>Average Percentage: {report.average_percentage?.toFixed(2) || "N/A"}%</Text>
          <Text>Average Grade: {report.average_grade || "N/A"}</Text>
          
          <Text style={styles.subHeader}>Subjects:</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.headerCell]}>Subject Name</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Score</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Grade</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Remarks</Text>
            </View>
            {/* Table Rows */}
            {report.subjects.map((subject, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{subject.subject_name}</Text>
                <Text style={styles.tableCell}>{subject.score || "N/A"}</Text>
                <Text style={styles.tableCell}>{subject.grade || "N/A"}</Text>
                <Text style={styles.tableCell}></Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
  

  const styles = StyleSheet.create({
    page: { padding: 30 },
    section: { marginBottom: 10 },
    header: { fontSize: 14, marginBottom: 10, fontWeight: 'bold' },
    subHeader: { fontSize: 12, marginTop: 10, fontWeight: 'bold' },
    table: { display: "table", width: "auto", borderStyle: "solid", borderWidth: 1, borderColor: "#bfbfbf", marginTop: 10 },
    tableRow: { flexDirection: "row" },
    tableCell: { margin: 0, fontSize: 10, flex: 1, textAlign: "center", borderStyle: "solid", borderWidth: 1, borderColor: "#bfbfbf" },
    headerCell: { fontWeight: "bold", backgroundColor: "#f0f0f0" },
  });
  

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Student Report</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
        <h2 className="text-xl font-bold mb-4">Fetch Student Report</h2>
        <div className="grid grid-cols-3 gap-4">
          <input
            type="number"
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="border rounded p-2"
          />
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">Select Term</option>
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
          </select>
          <input
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <button
          onClick={handleFetchReport}
          className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Report
        </button>
      </div>

      {report && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
          <h2 className="text-xl font-bold mb-4">Report Details</h2>
          <p>
            <strong>Student ID:</strong> {report.student_id}
          </p>
          <p>
            <strong>Term:</strong> {report.term}
          </p>
          <p>
            <strong>Year:</strong> {report.year}
          </p>
          <p>
            <strong>Average Percentage:</strong>{" "}
            {report.average_percentage !== null
              ? report.average_percentage.toFixed(2) + "%"
              : "N/A"}
          </p>
          <p>
            <strong>Average Grade:</strong> {report.average_grade || "N/A"}
          </p>
          <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr>
                <th className="border px-4 py-2">Subject Name</th>
                <th className="border px-4 py-2">Score</th>
                <th className="border px-4 py-2">Grade</th>
              </tr>
            </thead>
            <tbody>
              {report.subjects.map((subject, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{subject.subject_name}</td>
                  <td className="border px-4 py-2">{subject.score || "N/A"}</td>
                  <td className="border px-4 py-2">{subject.grade || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <PDFDownloadLink
            document={<PDFDocument report={report} />}
            fileName={`${report.student_id}-report.pdf`}
          >
            {({ loading }) => (
              <button
                className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                {loading ? "Preparing PDF..." : "Download PDF"}
              </button>
            )}
          </PDFDownloadLink>
        </div>
      )}
    </div>
  );
};

export default StudentReport;
