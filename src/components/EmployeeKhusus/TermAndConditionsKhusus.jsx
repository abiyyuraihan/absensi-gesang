import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function TermsAndConditions() {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (agreed) {
      navigate("/employee-khusus");
    }
  };

  return (
    <div className="terms-container">
      <style>{`
        .terms-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #1a202c;
          padding: 1rem;
        }
        .terms-box {
          width: 100%;
          max-width: 600px;
          padding: 2rem;
          background-color: #e53e3e; /* Red background */
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
          color: #fff;
        }
        .terms-title {
          font-size: 1.75rem; /* Larger title */
          font-weight: bold;
          margin-bottom: 1rem;
          text-align: center;
        }
        .terms-text {
          margin-bottom: 1.5rem;
          font-size: 1rem;
        }
        .terms-text b {
          font-weight: bold;
        }
        .terms-checkbox {
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
        }
        .terms-checkbox input {
          margin-right: 0.5rem;
        }
        .terms-button {
          width: 100%;
          padding: 0.75rem 1rem;
          background-color: #2d3748; 
          color: #fff;
          border: none;
          border-radius: 0.25rem;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .terms-button:hover {
          background-color: #2b6cb0; /* Darker blue for hover effect */
        }
        .terms-text p {
          margin: 0.5rem 0; /* Margin for each line */
        }
      `}</style>
      <div className="terms-box">
        <h2 className="terms-title">Syarat dan Ketentuan</h2>
        <div className="terms-text">
          <p>
            <b>1.</b> Tombol Check-in dan Check-out hanya bisa diklik ketika
            Karyawan berada di lingkungan Kantor.
          </p>
          <p>
            <b>2.</b> Check In paling lambat jam 07:05 pagi, checkout diantara
            jam 14.00 sd 15.00.
          </p>
          <p>
            <b>3.</b> Bila Karyawan telat Check-in atau terlalu cepat checkout,
            maka akan dikenakan potongan dari gaji setiap menitnya.
          </p>
          <p>
            <b>4.</b> Pastikan Lokasi HP dinyalakan sebelum Check-in dan
            Check-out.
          </p>
        </div>
        <div className="terms-checkbox">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <label> Saya telah membaca & memahami ketentuan diatas</label>
        </div>
        <button
          className="terms-button"
          onClick={handleContinue}
          disabled={!agreed}
        >
          Lanjutkan
        </button>
      </div>
    </div>
  );
}

export default TermsAndConditions;
