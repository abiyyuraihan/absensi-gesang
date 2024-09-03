import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import EmployeeManagement from "./components/EmployeeManagement";
import AttendanceManagement from "./components/AttendanceManagement";
import MonthlyReport from "./components/MonthlyReport";
import MonthlyReportKhusus from "./components/MonthlyReportKhusus";
import HolidayPage from "./components/HolidayPage";
import LeavePage from "./components/LeavePage";
import LeaveKhususPage from "./components/LeaveKhususPage";
import LoginEmployee from "./components/Employee/LoginEmployee";
import LoginEmployeeKhusus from "./components/EmployeeKhusus/LoginEmployeeKhusus";
import EmployeeAttendance from "./components/Employee/EmployeeAttendance";
import TermsAndConditions from "./components/Employee/TermAndConditions";
import TermsAndConditionsKhusus from "./components/EmployeeKhusus/TermAndConditionsKhusus";
import EmployeeAttendanceKhusus from "./components/EmployeeKhusus/EmployeeAttendanceKhusus";
import AttendanceManagementKhusus from "./components/AttendanceManagementKhusus";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login-employee" element={<LoginEmployee />} />
          <Route
            path="/login-employee-khusus"
            element={<LoginEmployeeKhusus />}
          />
          <Route path="/login-admin" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<Navigate to="employees" replace />} />
            <Route path="employees" element={<EmployeeManagement />} />
            <Route path="attendance" element={<AttendanceManagement />} />
            <Route
              path="attendance-khusus"
              element={<AttendanceManagementKhusus />}
            />
            <Route path="report" element={<MonthlyReport />} />
            <Route path="report-khusus" element={<MonthlyReportKhusus />} />
            <Route path="holidays" element={<HolidayPage />} />
            <Route path="leaves" element={<LeavePage />} />
            <Route path="leaves-khusus" element={<LeaveKhususPage />} />
          </Route>
          <Route path="/employee" element={<EmployeeAttendance />} />
          <Route
            path="/employee-khusus"
            element={<EmployeeAttendanceKhusus />}
          />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route
            path="/terms-and-conditions-khusus"
            element={<TermsAndConditionsKhusus />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
