import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const LeavePage = () => {
  const [leaves, setLeaves] = useState([]);
  const [newLeave, setNewLeave] = useState({
    employeeId: "",
    date: "",
    reason: "",
  });
  const [editingLeave, setEditingLeave] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  const fetchLeaves = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DATABASE_URL}/api/leaves`
      );
      setLeaves(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leaves:", error);
      setError("Failed to load leaves. Please try again later.");
      setLoading(false);
    }
  }, []);

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DATABASE_URL}/api/employees`
      );
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to load employees. Please try again later.");
    }
  }, []);

  useEffect(() => {
    fetchLeaves();
    fetchEmployees();
  }, [fetchLeaves, fetchEmployees]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingLeave) {
      setEditingLeave({ ...editingLeave, [name]: value });
    } else {
      setNewLeave({ ...newLeave, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedDate = new Date(
        editingLeave ? editingLeave.date : newLeave.date
      )
        .toISOString()
        .split("T")[0];
      const leaveData = editingLeave
        ? { ...editingLeave, date: formattedDate }
        : { ...newLeave, date: formattedDate };

      if (editingLeave) {
        await axios.put(
          `${process.env.REACT_APP_DATABASE_URL}/api/leaves/${editingLeave.id}`,
          leaveData
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_DATABASE_URL}/api/leaves`,
          leaveData
        );
      }
      await fetchLeaves();
      setNewLeave({ employeeId: "", date: "", reason: "" });
      setEditingLeave(null);
    } catch (error) {
      console.error("Error adding/updating leave:", error);
      setError("Failed to add/update leave. Please try again.");
    }
  };

  const handleEdit = (leave) => {
    setEditingLeave(leave);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this leave?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_DATABASE_URL}/api/leaves/${id}`
        );
        await fetchLeaves();
      } catch (error) {
        console.error("Error deleting leave:", error);
        setError("Failed to delete leave. Please try again.");
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        Loading...
      </div>
    );

  const filteredLeaves = leaves.filter(
    (leave) =>
      leave.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLeaves.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-8">Pengaturan Cuti / Izin</h1>

      {error && (
        <div
          className="bg-red-800 border border-red-600 text-red-100 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          {editingLeave ? "Edit Cuti / Izin" : "Tambah Cuti / Izin"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2">Karyawan</label>
            <select
              name="employeeId"
              value={
                editingLeave ? editingLeave.employeeId : newLeave.employeeId
              }
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded"
            >
              <option value="">Pilih Karyawan</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">Tanggal</label>
            <input
              type="date"
              name="date"
              value={
                editingLeave ? editingLeave.date.split("T")[0] : newLeave.date
              }
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Alasan</label>
            <input
              type="text"
              name="reason"
              value={editingLeave ? editingLeave.reason : newLeave.reason}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingLeave ? "Edit Cuti / Izin" : "Tambah Cuti / Izin"}
        </button>
        {editingLeave && (
          <button
            type="button"
            onClick={() => setEditingLeave(null)}
            className="mt-4 ml-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">List Cuti / Izin</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Cari cuti/izin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded"
          />
        </div>
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-3 px-6 text-left">Karyawan</th>
                <th className="py-3 px-6 text-left">Tanggal</th>
                <th className="py-3 px-6 text-left">Alasan</th>
                <th className="py-3 px-6 text-left">Pilihan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {currentItems.map((leave) => (
                <tr key={leave.id} className="hover:bg-gray-700">
                  <td className="py-4 px-6">{leave.employee.name}</td>
                  <td className="py-4 px-6">{formatDate(leave.date)}</td>
                  <td className="py-4 px-6">{leave.reason}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleEdit(leave)}
                      className="bg-yellow-600 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-700 transition duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(leave.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div>
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, filteredLeaves.length)} of{" "}
            {filteredLeaves.length} entries
          </div>
          <div>
            {Array.from(
              { length: Math.ceil(filteredLeaves.length / itemsPerPage) },
              (_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`mx-1 px-3 py-1 rounded ${
                    currentPage === i + 1 ? "bg-blue-600" : "bg-gray-700"
                  } hover:bg-blue-700 transition duration-300`}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeavePage;
