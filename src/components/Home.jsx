import React from "react";
import { Link } from "react-router-dom";
import { FaUserTie, FaUserClock } from "react-icons/fa";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold mb-12">GesanG Absensi</h1>
      <div className="space-y-4">
        {/* Page 1: Karyawan Bulanan */}
        <Link
          to="/login-employee"
          className="flex items-center justify-center bg-blue-800 hover:bg-blue-800 text-white font-bold py-6 px-4 mb-14 rounded-md transition duration-300 space-x-3"
        >
          <FaUserTie size={24} />
          <span>Karyawan Bulanan</span>
        </Link>

        {/* Page 2: Karyawan Khusus */}
        <Link
          to="/login-employee-khusus"
          className="flex items-center justify-center bg-green-800 hover:bg-green-800 text-white font-bold py-6 px-4 rounded-md transition duration-300 space-x-3"
        >
          <FaUserClock size={24} />
          <span>Karyawan Khusus (Pulang Bawa Paket)</span>
        </Link>
      </div>
    </div>
  );
};

export default Home;
