import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const commonStyles = `
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #1a202c;
    padding: 1rem;
  }
  .login-box {
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    background-color: #2d3748;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  }
  .login-title {
    color: #fff;
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  .input-field {
    width: 100%;
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    background-color: #4a5568;
    border: 1px solid #4a5568;
    border-radius: 0.25rem;
    color: #fff;
    font-size: 1rem;
    transition: border-color 0.2s;
  }
  .input-field:focus {
    outline: none;
    border-color: #63b3ed;
  }
  .login-button {
    width: 100%;
    padding: 0.75rem 1rem;
    background-color: #4299e1;
    color: #fff;
    border: none;
    border-radius: 0.25rem;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  .login-button:hover {
    background-color: #3182ce;
  }
  .error-message {
    color: #fc8181;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    text-align: center;
  }
`;

function LoginEmployee() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DATABASE_URL}/api/employees/login-employee`,
        { username, password }
      );
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        navigate("/terms-and-conditions"); // Arahkan ke halaman persetujuan
      }
    } catch (error) {
      setError("Username atau Password Salah");
      console.error("Login failed:", error);
    }
  };

  return (
    <>
      <style>{commonStyles}</style>
      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">Login Karyawan</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className="input-field"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="input-field"
            />
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginEmployee;
