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
import HolidayPage from "./components/HolidayPage";
import LeavePage from "./components/LeavePage";
import LoginEmployee from "./components/Employee/LoginEmployee";
import EmployeeAttendance from "./components/Employee/EmployeeAttendance";
import TermsAndConditions from "./components/Employee/TermAndConditions";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginEmployee />} />
          <Route path="/login-admin" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<Navigate to="employees" replace />} />
            <Route path="employees" element={<EmployeeManagement />} />
            <Route path="attendance" element={<AttendanceManagement />} />
            <Route path="report" element={<MonthlyReport />} />
            <Route path="holidays" element={<HolidayPage />} />
            <Route path="leaves" element={<LeavePage />} />
          </Route>
          <Route path="/employee" element={<EmployeeAttendance />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
