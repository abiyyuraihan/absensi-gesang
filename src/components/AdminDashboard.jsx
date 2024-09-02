import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const navItems = [
  { path: "/admin/employees", label: "Karyawan" },
  { path: "/admin/report", label: "Report Bulanan" },
  { path: "/admin/holidays", label: "Hari Libur" },
  { path: "/admin/leaves", label: "Cuti / Izin" },
  { path: "/admin/attendance", label: "Absensi Manual" },
];

function AdminDashboard() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <style>
        {`
          .nav-link {
            display: inline-flex;
            align-items: center;
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
            font-weight: 500;
            color: #a0aec0;
            transition: color 0.2s, border-color 0.2s;
          }
          .nav-link:hover {
            color: #fff;
          }
          .nav-link.active {
            color: #4299e1;
            border-bottom: 2px solid #4299e1;
          }
        `}
      </style>
      <nav className="bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${
                    location.pathname === item.path ? "active" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="">
        <main className="mt-8">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
