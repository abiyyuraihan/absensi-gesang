import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const HolidayPage = () => {
  const [holidays, setHolidays] = useState([]);
  const [newHoliday, setNewHoliday] = useState({
    date: "",
    description: "",
    type: "",
  });
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  const fetchHolidays = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DATABASE_URL}/api/holidays`
      );
      setHolidays(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching holidays:", error);
      setError("Failed to load holidays. Please try again later.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHolidays();
  }, [fetchHolidays]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingHoliday) {
      setEditingHoliday({ ...editingHoliday, [name]: value });
    } else {
      setNewHoliday({ ...newHoliday, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedDate = new Date(
        editingHoliday ? editingHoliday.date : newHoliday.date
      )
        .toISOString()
        .split("T")[0];
      const holidayData = editingHoliday
        ? { ...editingHoliday, date: formattedDate }
        : { ...newHoliday, date: formattedDate };

      if (editingHoliday) {
        await axios.put(
          `${process.env.REACT_APP_DATABASE_URL}/api/holidays/${editingHoliday.id}`,
          holidayData
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_DATABASE_URL}/api/holidays`,
          holidayData
        );
      }
      await fetchHolidays();
      setNewHoliday({ date: "", description: "", type: "" });
      setEditingHoliday(null);
    } catch (error) {
      console.error("Error adding/updating holiday:", error);
      setError("Failed to add/update holiday. Please try again.");
    }
  };

  const handleEdit = (holiday) => {
    setEditingHoliday(holiday);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this holiday?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_DATABASE_URL}/api/holidays/${id}`
        );
        await fetchHolidays();
      } catch (error) {
        console.error("Error deleting holiday:", error);
        setError("Failed to delete holiday. Please try again.");
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

  const filteredHolidays = holidays.filter((holiday) =>
    holiday.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHolidays.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-8">Pengaturan Hari Libur</h1>

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
          {editingHoliday ? "Edit Hari Libur" : "Tambah Hari Libur"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2">Tanggal</label>
            <input
              type="date"
              name="date"
              value={
                editingHoliday
                  ? editingHoliday.date.split("T")[0]
                  : newHoliday.date
              }
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Deskripsi</label>
            <input
              type="text"
              name="description"
              value={
                editingHoliday
                  ? editingHoliday.description
                  : newHoliday.description
              }
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Jenis Hari Libur</label>
            <select
              name="type"
              value={editingHoliday ? editingHoliday.type : newHoliday.type}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded"
            >
              <option value="">Pilih Jenis</option>
              <option value="Tanggal Merah">Tanggal Merah</option>
              <option value="Tahun Baru">Tahun Baru</option>
              <option value="Hari Raya">Hari Raya</option>
              <option value="DLL">Dll.</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingHoliday ? "Edit Hari Libur" : "Tambah Hari Libur"}
        </button>
        {editingHoliday && (
          <button
            type="button"
            onClick={() => setEditingHoliday(null)}
            className="mt-4 ml-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">List Hari Libur</h2>
        <div className="mb-4"></div>
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-3 px-6 text-left">Tanggal</th>
                <th className="py-3 px-6 text-left">Deskripsi</th>
                <th className="py-3 px-6 text-left">Jenis Hari Libur</th>
                <th className="py-3 px-6 text-left">Pilihan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {currentItems.map((holiday) => (
                <tr key={holiday.id} className="hover:bg-gray-700">
                  <td className="py-4 px-6">{formatDate(holiday.date)}</td>
                  <td className="py-4 px-6">{holiday.description}</td>
                  <td className="py-4 px-6">{holiday.type}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleEdit(holiday)}
                      className="bg-yellow-600 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-700 transition duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(holiday.id)}
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
            {Math.min(indexOfLastItem, filteredHolidays.length)} of{" "}
            {filteredHolidays.length} entries
          </div>
          <div>
            {Array.from(
              { length: Math.ceil(filteredHolidays.length / itemsPerPage) },
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

export default HolidayPage;
