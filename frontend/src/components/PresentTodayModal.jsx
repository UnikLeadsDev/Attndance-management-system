import React, { useState } from "react";
import { X } from "lucide-react";

const PresentTodayModal = ({ open, onClose, data }) => {
  const [selectedDept, setSelectedDept] = useState("All");

  if (!open) return null;

  const departments = ["All", ...new Set(data.map(emp => emp.department))];
  const filteredData =
    selectedDept === "All"
      ? data
      : data.filter(emp => emp.department === selectedDept);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-11/12 md:w-3/4 lg:w-2/3 rounded-2xl shadow-xl p-6 overflow-y-auto max-h-[80vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Present Employees — {filteredData.length}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter Dropdown */}
        <div className="mb-4 flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">
            Filter by Department:
          </label>
          <select
            className="border border-gray-300 rounded-lg p-2 text-sm"
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2 border">Emp ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Department</th>
                <th className="p-2 border">Check In</th>
                <th className="p-2 border">Check Out</th>
                <th className="p-2 border">Working Hours</th>
                <th className="p-2 border">Overtime</th>
                <th className="p-2 border">Location</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((emp, index) => (
                  <tr key={index} className="text-center hover:bg-gray-50">
                    <td className="p-2 border">{emp.employee_id}</td>
                    <td className="p-2 border">{emp.name}</td>
                    <td className="p-2 border">{emp.department}</td>
                    <td className="p-2 border">{emp.check_in_time}</td>
                    <td className="p-2 border">{emp.check_out_time}</td>
                    <td className="p-2 border">{emp.working_hours}</td>
                    <td className="p-2 border">{emp.overtime_hours}</td>
                    <td className="p-2 border">{emp.location}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-4 text-gray-500">
                    No employees found for this department.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PresentTodayModal;
