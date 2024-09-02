import React, { useState, useEffect } from "react";
import axios from "axios";

const formatRupiah = (amount) => {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(amount).replace(/\s/g, " ");
};

function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    username: "",
    password: "",
    monthlySalary: "",
  });
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DATABASE_URL}/api/employees`
      );
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to fetch employees. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingEmployee) {
      setEditingEmployee({ ...editingEmployee, [name]: value });
    } else {
      setNewEmployee({ ...newEmployee, [name]: value });
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_DATABASE_URL}/api/employees`,
        newEmployee
      );
      setNewEmployee({
        name: "",
        username: "",
        password: "",
        monthlySalary: "",
      });
      fetchEmployees();
      setError("");
    } catch (error) {
      console.error("Error adding employee:", error);
      setError("Failed to add employee. Please try again.");
    }
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${process.env.REACT_APP_DATABASE_URL}/api/employees/${editingEmployee.id}`,
        editingEmployee
      );
      setEditingEmployee(null);
      fetchEmployees();
      setError("");
    } catch (error) {
      console.error("Error updating employee:", error);
      setError("Failed to update employee. Please try again.");
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_DATABASE_URL}/api/employees/${id}`
        );
        fetchEmployees();
        setError("");
      } catch (error) {
        console.error("Error deleting employee:", error);
        setError("Failed to delete employee. Please try again.");
      }
    }
  };

  return (
    <div className="bg-gray-800 text-gray-100 p-6 rounded-lg shadow-lg">
      <style>
        {`
          .input-field {
            background-color: #2d3748;
            border: 1px solid #4a5568;
            color: #fff;
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            width: 100%;
          }
          .input-field:focus {
            outline: none;
            border-color: #4299e1;
          }
          .submit-button {
            background-color: #4299e1;
            color: #fff;
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            transition: background-color 0.2s;
          }
          .submit-button:hover {
            background-color: #3182ce;
          }
          .error-message {
            color: #fc8181;
            margin-top: 0.5rem;
          }
          table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
          }
          th, td {
            padding: 1rem;
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
        `}
      </style>
      <h2 className="text-2xl font-bold mb-6">Pengaturan Karyawan</h2>
      <form
        onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
        className="mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="name"
            value={editingEmployee ? editingEmployee.name : newEmployee.name}
            onChange={handleInputChange}
            placeholder="Nama"
            className="input-field"
            required
          />
          <input
            type="text"
            name="username"
            value={
              editingEmployee ? editingEmployee.username : newEmployee.username
            }
            onChange={handleInputChange}
            placeholder="Username"
            className="input-field"
            required
          />
          <input
            type="password"
            name="password"
            value={
              editingEmployee ? editingEmployee.password : newEmployee.password
            }
            onChange={handleInputChange}
            placeholder="Password"
            className="input-field"
            required={!editingEmployee}
          />
          <input
            type="number"
            name="monthlySalary"
            value={
              editingEmployee
                ? editingEmployee.monthlySalary
                : newEmployee.monthlySalary
            }
            onChange={handleInputChange}
            placeholder="Gaji Bulanan"
            className="input-field"
            required
          />
        </div>
        <button type="submit" className="submit-button">
          {editingEmployee ? "Edit Karyawan" : "Tambah Karyawan"}
        </button>
        {editingEmployee && (
          <button
            type="button"
            className="submit-button ml-2"
            onClick={() => setEditingEmployee(null)}
          >
            Cancel
          </button>
        )}
      </form>
      {error && <p className="error-message">{error}</p>}
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Nama</th>
              <th>Username</th>
              <th>Gaji Bulanan</th>
              <th>Pilihan</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.username}</td>
                <td>{formatRupiah(employee.monthlySalary)}</td>
                <td>
                  <button
                    onClick={() => setEditingEmployee(employee)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEmployee(employee.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeManagement;
