import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const formatRupiah = (amount) => {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(amount).replace(/\s/g, " ");
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Jakarta",
  });
};

const formatTime = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toISOString().slice(11, 16);
};

function MonthlyReportKhusus() {
  const [reports, setReports] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const reportRef = useRef(null);

  useEffect(() => {
    fetchReport();
  }, [selectedMonth, selectedYear]);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DATABASE_URL}/api/report-khusus/report/monthly`,
        {
          params: { month: selectedMonth, year: selectedYear },
        }
      );
      console.log("Fetched reports:", response.data);
      setReports(response.data);

      if (response.data.length > 0) {
        const validEmployee = response.data.find(
          (report) => report.employee.id === selectedEmployee
        );
        if (!validEmployee) {
          setSelectedEmployee(response.data[0].employee.id);
        }
      } else {
        setSelectedEmployee("");
      }
    } catch (error) {
      console.error("Error fetching monthly report:", error);
      setError("Failed to fetch report. Please try again.");
      setReports([]);
      setSelectedEmployee("");
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeChange = (e) => {
    const newSelectedEmployee = e.target.value;
    setSelectedEmployee(newSelectedEmployee);
    console.log("Selected employee changed to:", newSelectedEmployee);
  };

  const handlePrint = async () => {
    const element = reportRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = pdfHeight;
    let position = 0;
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("monthly_report.pdf");
  };

  const selectedReport = reports.find(
    (report) => report.employee.id.toString() === selectedEmployee.toString()
  );

  console.log("Selected report:", selectedReport);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-900 text-gray-100 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-100">
        Laporan Kehadiran Bulanan
      </h2>
      <div className="flex space-x-4 mb-6">
        <select
          className="block w-full px-4 py-2 text-gray-100 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
        >
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              {new Date(2000, i, 1).toLocaleString("id-ID", { month: "long" })}
            </option>
          ))}
        </select>
        <select
          className="block w-full px-4 py-2 text-gray-100 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          {[...Array(10)].map((_, i) => (
            <option key={i} value={new Date().getFullYear() - 5 + i}>
              {new Date().getFullYear() - 5 + i}
            </option>
          ))}
        </select>
        <select
          className="block w-full px-4 py-2 text-gray-100 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={selectedEmployee}
          onChange={handleEmployeeChange}
        >
          {reports.length === 0 && (
            <option value="">No employees available</option>
          )}
          {reports.map((report) => (
            <option key={report.employee.id} value={report.employee.id}>
              {report.employee.name}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handlePrint}
        className="px-4 py-2 mb-8 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
      >
        Cetak PDF
      </button>
      {selectedReport ? (
        <div ref={reportRef} className="bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-2xl font-semibold mb-4 text-gray-100">
            {selectedReport.employee.name}
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-400">Gaji Bulanan</p>
              <p className="text-lg font-semibold">
                {formatRupiah(selectedReport.employee.monthlySalary)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Potongan</p>
              <p className="text-lg font-semibold text-red-400">
                {formatRupiah(selectedReport.totalDeduction)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Gaji Akhir</p>
              <p className="text-lg font-semibold text-green-400">
                {formatRupiah(selectedReport.finalSalary)}
              </p>
            </div>
          </div>
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Jam Masuk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Jam Keluar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Potongan
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {selectedReport.dailyReports.map((day) => (
                <tr key={day.date}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(day.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{day.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatTime(day.checkIn)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatTime(day.checkOut)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatRupiah(day.deduction)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-100">Pilih karyawan untuk melihat laporan</p>
      )}
    </div>
  );
}

export default MonthlyReportKhusus;
