import React, { useState, useEffect } from "react";
import axios from "axios";
import Clock from "./Clock";
import { formatInTimeZone } from "date-fns-tz";

const timeZone = "Asia/Jakarta"; // Tentukan timezone kamu

function EmployeeAttendance() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_DATABASE_URL}/api/attendance/today`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        setIsCheckedIn(response.data.checkIn && !response.data.checkOut);
        setCheckInTime(
          response.data.checkIn ? response.data.checkIn.slice(11, 16) : ""
        );
        setCheckOutTime(
          response.data.checkOut ? response.data.checkOut.slice(11, 16) : ""
        );
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setError("Silahkan Login Ulang !!!");
    }
  };

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  const handleAttendance = async (type) => {
    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      const token = localStorage.getItem("token");

      // Tangkap waktu sekarang
      const now = new Date();

      // Format waktu di timezone yang kamu tentukan menggunakan formatInTimeZone
      const formattedTime = formatInTimeZone(
        now,
        timeZone,
        "yyyy-MM-dd HH:mm:ss zzzz"
      );

      const response = await axios.put(
        `${process.env.REACT_APP_DATABASE_URL}/api/attendance/${type}`,
        { latitude, longitude, time: formattedTime },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (type === "checkin") {
        setIsCheckedIn(true);
        setCheckInTime(formattedTime);
      } else {
        setCheckOutTime(formattedTime);
      }
      setError(null);
    } catch (error) {
      console.error(`${type} failed:`, error);
      setError(error.response?.data?.error || `${type} failed`);
    }
  };

  const handleCheckIn = () => handleAttendance("checkin");
  const handleCheckOut = () => handleAttendance("checkout");

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 rounded-lg shadow-xl text-white">
      <h2 className="text-2xl font-bold mb-6 text-center pb-4 border-b-2">
        Absensi GesanG
      </h2>
      <Clock />
      {error && <p className="text-red-400 mb-4">{error}</p>}
      <div className="mb-10 flex items-center justify-center">
        <button
          onClick={handleCheckIn}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-4"
          disabled={isCheckedIn}
        >
          Masuk
        </button>
        {checkInTime && (
          <span className="text-lg font-semibold text-gray-300">
            Jam Masuk : {checkInTime}
          </span>
        )}
      </div>
      <div className="mb-10 flex items-center justify-center">
        <button
          onClick={handleCheckOut}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-4"
        >
          Keluar
        </button>
        {checkOutTime && (
          <span className="text-lg font-semibold text-gray-300">
            Jam Keluar : {checkOutTime}
          </span>
        )}
      </div>
      <p className="mt-4">
        {isCheckedIn
          ? `Masuk Jam : ${checkInTime}`
          : `Keluar Jam : ${checkOutTime}`}
      </p>
    </div>
  );
}

export default EmployeeAttendance;
