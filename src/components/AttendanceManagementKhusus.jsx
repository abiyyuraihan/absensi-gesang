import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

function AttendanceManagementKhusus() {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [error, setError] = useState("");

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DATABASE_URL}/api/employees-khusus`
      );
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to fetch employees. Please try again.");
    }
  }, []);

  const fetchAttendance = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DATABASE_URL}/api/attendance-khusus`,
        {
          params: { month: selectedMonth, year: selectedYear },
        }
      );
      setAttendance(response.data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setError("Failed to fetch attendance. Please try again.");
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleAttendanceUpdate = async (employeeId, date, field, value) => {
    try {
      const utcDate = new Date(Date.UTC(selectedYear, selectedMonth - 1, date));
      const formattedDate = utcDate.toISOString().split("T")[0];
      const currentRecord = attendance.find(
        (a) =>
          a.employeeId === employeeId && new Date(a.date).getUTCDate() === date
      );
      const dataToSend = {
        employeeId,
        date: formattedDate,
        checkIn: currentRecord?.checkIn?.slice(11, 16) || null,
        checkOut: currentRecord?.checkOut?.slice(11, 16) || null,
      };
      dataToSend[field] = value;

      await axios.put(
        `${process.env.REACT_APP_DATABASE_URL}/api/attendance-khusus`,
        dataToSend
      );
      fetchAttendance();
    } catch (error) {
      console.error("Error updating attendance:", error);
      setError("Error updating attendance. Please try again.");
    }
  };

  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

  return (
    <div className="bg-gray-800 text-gray-100 p-6 rounded-lg shadow-lg">
      <style>
        {`
          .select-field {
            background-color: #2d3748;
            border: 1px solid #4a5568;
            color: #fff;
            padding: 0.5rem;
            border-radius: 0.25rem;
          }
          .select-field:focus {
            outline: none;
            border-color: #4299e1;
          }
          .time-input {
            background-color: #2d3748;
            border: 1px solid #4a5568;
            color: #fff;
            padding: 0.25rem;
            border-radius: 0.25rem;
            width: 5rem;
          }
          .time-input:focus {
            outline: none;
            border-color: #4299e1;
          }
          table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
          }
          th, td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid #4a5568;
          }
          th {
            background-color: #2d3748;
            font-weight: bold;
          }
          tr:hover {
            background-color: #2d3748;
          }
          .error-message {
            color: #fc8181;
            margin-top: 0.5rem;
          }
        `}
      </style>
      <h2 className="text-2xl font-bold mb-6">
        Absensi Manual{" "}
        <small className="text-sm font-normal">
          (Jika Terjadi Masalah Di Server / HP Karyawan)
        </small>
      </h2>
      <div className="mb-6 flex space-x-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className="select-field"
        >
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              {new Date(2000, i, 1).toLocaleString("default", {
                month: "long",
              })}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="select-field"
        >
          {[...Array(10)].map((_, i) => (
            <option key={i} value={new Date().getFullYear() - 5 + i}>
              {new Date().getFullYear() - 5 + i}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Tanggal</th>
              {employees.map((employee) => (
                <th key={employee.id}>{employee.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(daysInMonth)].map((_, index) => {
              const day = index + 1;
              return (
                <tr key={day}>
                  <td>{day}</td>
                  {employees.map((employee) => {
                    const attendanceRecord = attendance.find(
                      (a) =>
                        a.employeeId === employee.id &&
                        new Date(a.date).getUTCDate() === day
                    );
                    return (
                      <td key={employee.id}>
                        <input
                          type="time"
                          value={attendanceRecord?.checkIn?.slice(11, 16) || ""}
                          onChange={(e) =>
                            handleAttendanceUpdate(
                              employee.id,
                              day,
                              "checkIn",
                              e.target.value
                            )
                          }
                          className="time-input mr-2"
                        />
                        <input
                          type="time"
                          value={
                            attendanceRecord?.checkOut?.slice(11, 16) || ""
                          }
                          onChange={(e) =>
                            handleAttendanceUpdate(
                              employee.id,
                              day,
                              "checkOut",
                              e.target.value
                            )
                          }
                          className="time-input"
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AttendanceManagementKhusus;
