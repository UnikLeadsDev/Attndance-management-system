import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, Loader2, Calendar, Users, Clock, Filter, X, Search, Download, CheckCircle, XCircle, Edit3, TrendingUp } from "lucide-react";

// Toast Component with Animation
const Toast = ({ message, type, onClose }) => (
  <div
    className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-lg transform transition-all duration-300 ${
      type === "success" 
        ? "bg-gradient-to-r from-emerald-500 to-emerald-600" 
        : "bg-gradient-to-r from-rose-500 to-rose-600"
    } text-white`}
  >
    {type === "success" ? (
      <CheckCircle className="w-5 h-5" />
    ) : (
      <XCircle className="w-5 h-5" />
    )}
    <span className="font-medium">{message}</span>
    <button onClick={onClose} className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors">
      <X className="w-4 h-4" />
    </button>
  </div>
);

// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, color, trend }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-sm text-emerald-600 font-medium">{trend}</span>
          </div>
        )}
      </div>
      <div className={`p-4 rounded-xl bg-gradient-to-br ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

// Edit Attendance Modal with Enhanced UI
const EditAttendanceModal = ({ isOpen, onClose, attendance, onSave }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  useEffect(() => {
    if (attendance) {
      setCheckIn(attendance.check_in || "");
      setCheckOut(attendance.check_out || "");
    }
  }, [attendance]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ check_in: checkIn, check_out: checkOut });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl transform transition-all">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Attendance</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="block mb-2 font-semibold text-gray-700 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Check-In Time
            </label>
            <input
              type="time"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
          
          <div>
            <label className="block mb-2 font-semibold text-gray-700 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Check-Out Time
            </label>
            <input
              type="time"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-semibold shadow-lg shadow-blue-500/30 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filters, setFilters] = useState({ date: "", department: "all", status: "all", search: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/admin/attendance");
      setAttendanceRecords(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch attendance records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const filteredRecords = attendanceRecords.filter((r) => {
    if (filters.date && r.date !== filters.date) return false;
    if (filters.department !== "all" && r.department !== filters.department) return false;
    if (filters.status !== "all" && r.status !== filters.status) return false;
    if (filters.search && !r.employee_name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, startIndex + recordsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEdit = (record) => {
    setEditingAttendance(record);
    setIsModalOpen(true);
  };

  const handleSave = async (data) => {
    try {
      await axios.put(`/api/admin/attendance/${editingAttendance.id}`, data);
      fetchAttendance();
      setIsModalOpen(false);
      showToast("Attendance updated successfully", "success");
    } catch {
      showToast("Failed to update attendance", "error");
    }
  };

  const handleMissPunch = async (record, action) => {
    try {
      await axios.patch(`/api/admin/misspunch/${record.id}/${action}`);
      fetchAttendance();
      showToast(`Miss Punch ${action}d successfully`, "success");
    } catch {
      showToast(`Failed to ${action} miss punch`, "error");
    }
  };

  // Calculate stats
  const stats = {
    total: filteredRecords.length,
    present: filteredRecords.filter(r => r.status === "Present").length,
    absent: filteredRecords.filter(r => r.status === "Absent").length,
    pending: filteredRecords.filter(r => r.status === "Pending" || r.status === "Miss Punch").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                Attendance Management
              </h1>
              <p className="text-gray-600">Monitor and manage employee attendance records</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 shadow-lg shadow-indigo-500/30 transition-all font-semibold">
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              icon={Users}
              label="Total Records"
              value={stats.total}
              color="from-blue-500 to-blue-600"
              trend="+12% this week"
            />
            <StatsCard
              icon={CheckCircle}
              label="Present"
              value={stats.present}
              color="from-emerald-500 to-emerald-600"
            />
            <StatsCard
              icon={XCircle}
              label="Absent"
              value={stats.absent}
              color="from-rose-500 to-rose-600"
            />
            <StatsCard
              icon={Clock}
              label="Pending"
              value={stats.pending}
              color="from-amber-500 to-amber-600"
            />
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by employee name..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
              >
                <Filter className="w-5 h-5" />
                Filters
                {showFilters && <X className="w-4 h-4" />}
              </button>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Date</label>
                  <input
                    type="date"
                    value={filters.date}
                    onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Department</label>
                  <select
                    value={filters.department}
                    onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  >
                    <option value="all">All Departments</option>
                    <option value="HR">HR</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>
                
                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  >
                    <option value="all">All Status</option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Pending">Pending</option>
                    <option value="Miss Punch">Miss Punch</option>
                  </select>
                </div>
              </div>
            )}

            {(filters.date || filters.department !== "all" || filters.status !== "all" || filters.search) && (
              <button
                onClick={() => setFilters({ date: "", department: "all", status: "all", search: "" })}
                className="mt-4 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <Loader2 className="animate-spin w-12 h-12 mx-auto text-indigo-600 mb-4" />
            <p className="text-gray-600 font-medium">Loading attendance records...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl p-6 flex items-center gap-3">
            <XCircle className="w-6 h-6 text-red-600" />
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Employee</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Check-in</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Check-out</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentRecords.map((record, index) => (
                    <tr 
                      key={record.id} 
                      className="hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        {record.date}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {/* {record.employee_name.charAt(0)} */}
                          </div>
                          <span className="font-medium text-gray-900">{record.employee_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{record.check_in || "-"}</td>
                      <td className="px-6 py-4 text-gray-700">{record.check_out || "-"}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1.5 rounded-full text-white text-xs font-bold inline-flex items-center gap-1 ${
                            record.status === "Present"
                              ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                              : record.status === "Absent"
                              ? "bg-gradient-to-r from-rose-500 to-rose-600"
                              : record.status === "Pending"
                              ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                              : "bg-gradient-to-r from-amber-500 to-amber-600"
                          }`}
                        >
                          {record.status === "Present" && <CheckCircle className="w-3 h-3" />}
                          {record.status === "Absent" && <XCircle className="w-3 h-3" />}
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(record)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {record.status === "Miss Punch" && (
                            <>
                              <button
                                onClick={() => handleMissPunch(record, "approve")}
                                className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-xs font-semibold"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleMissPunch(record, "reject")}
                                className="px-3 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors text-xs font-semibold"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + recordsPerPage, filteredRecords.length)} of {filteredRecords.length} records
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-xl font-semibold transition-all ${
                          currentPage === i + 1
                            ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/30"
                            : "bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <EditAttendanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        attendance={editingAttendance}
        onSave={handleSave}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}