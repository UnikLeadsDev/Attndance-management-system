import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  Download,
  X,
  Filter,
  Search,
  User,
  Briefcase,
  Home,
  Plane,
  Heart,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// Toast Component
const Toast = ({ message, type, onClose }) => (
  <div
    className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-lg transform transition-all duration-300 ${
      type === "success" 
        ? "bg-gradient-to-r from-emerald-500 to-emerald-600" 
        : "bg-gradient-to-r from-rose-500 to-rose-600"
    } text-white`}
  >
    {type === "success" ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
    <span className="font-medium">{message}</span>
    <button onClick={onClose} className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors">
      <X className="w-4 h-4" />
    </button>
  </div>
);

// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, color, subtitle }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
      </div>
      <div className={`p-4 rounded-xl bg-gradient-to-br ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

// Attachment Modal
const AttachmentModal = ({ isOpen, onClose, attachment }) => {
  if (!isOpen || !attachment) return null;

  const isImage = attachment.type === "image";
  const isPDF = attachment.type === "pdf";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">{attachment.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-auto max-h-[calc(90vh-100px)]">
          {isImage && (
            <img 
              src={attachment.url} 
              alt={attachment.name}
              className="w-full rounded-2xl shadow-lg"
            />
          )}
          {isPDF && (
            <div className="bg-gray-100 rounded-2xl p-12 text-center">
              <FileText className="w-20 h-20 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-700 font-medium mb-2">PDF Document</p>
              <p className="text-gray-500 text-sm mb-6">{attachment.name}</p>
              <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 shadow-lg shadow-indigo-500/30 transition-all font-semibold inline-flex items-center gap-2">
                <Download className="w-5 h-5" />
                Download PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Leave Details Modal
const LeaveDetailsModal = ({ isOpen, onClose, leave, onApprove, onReject }) => {
  if (!isOpen || !leave) return null;

  const getLeaveIcon = (type) => {
    switch(type) {
      case "Sick Leave": return Heart;
      case "Casual Leave": return Briefcase;
      case "Vacation": return Plane;
      case "Work From Home": return Home;
      default: return Calendar;
    }
  };

  const LeaveIcon = getLeaveIcon(leave.type);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{leave.employee_name}</h2>
                <p className="text-indigo-100">Employee ID: {leave.employee_id}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <LeaveIcon className="w-5 h-5" />
                <span className="text-sm font-semibold">Leave Type</span>
              </div>
              <p className="text-gray-900 font-bold text-lg">{leave.type}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-semibold">Duration</span>
              </div>
              <p className="text-gray-900 font-bold text-lg">{leave.days} Days</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-2 block">Leave Period</label>
              <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">From</p>
                  <p className="font-bold text-gray-900">{leave.start_date}</p>
                </div>
                <div className="w-12 h-0.5 bg-gray-300"></div>
                <div className="flex-1 text-right">
                  <p className="text-xs text-gray-500 mb-1">To</p>
                  <p className="font-bold text-gray-900">{leave.end_date}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 mb-2 block">Reason</label>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700 leading-relaxed">{leave.reason}</p>
              </div>
            </div>

            {leave.attachments && leave.attachments.length > 0 && (
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-2 block">Attachments</label>
                <div className="flex flex-wrap gap-2">
                  {leave.attachments.map((att, index) => (
                    <button
                      key={index}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span className="text-sm font-medium">{att.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-gray-600 mb-2 block">Applied On</label>
              <p className="text-gray-700">{leave.applied_date}</p>
            </div>
          </div>

          {leave.status === "Pending" && (
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  onReject(leave.id);
                  onClose();
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl hover:from-rose-600 hover:to-rose-700 font-semibold shadow-lg shadow-rose-500/30 transition-all flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Reject Leave
              </button>
              <button
                onClick={() => {
                  onApprove(leave.id);
                  onClose();
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 font-semibold shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Approve Leave
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function LeavesPage() {
  // Dummy Data - Replace with API calls
  const [leaves, setLeaves] = useState([
    {
      id: 1,
      employee_id: "EMP001",
      employee_name: "John Doe",
      type: "Sick Leave",
      start_date: "2025-10-15",
      end_date: "2025-10-17",
      days: 3,
      reason: "Suffering from viral fever and need rest as per doctor's advice.",
      status: "Pending",
      applied_date: "2025-10-10",
      attachments: [
        { name: "medical_certificate.pdf", type: "pdf", url: "#" }
      ]
    },
    {
      id: 2,
      employee_id: "EMP002",
      employee_name: "Sarah Smith",
      type: "Vacation",
      start_date: "2025-10-20",
      end_date: "2025-10-27",
      days: 8,
      reason: "Family vacation to Goa. Pre-planned trip with family members.",
      status: "Approved",
      applied_date: "2025-09-25",
      attachments: []
    },
    {
      id: 3,
      employee_id: "EMP003",
      employee_name: "Michael Johnson",
      type: "Casual Leave",
      start_date: "2025-10-12",
      end_date: "2025-10-12",
      days: 1,
      reason: "Personal work - need to visit bank for loan documentation.",
      status: "Approved",
      applied_date: "2025-10-09",
      attachments: []
    },
    {
      id: 4,
      employee_id: "EMP004",
      employee_name: "Emily Davis",
      type: "Work From Home",
      start_date: "2025-10-14",
      end_date: "2025-10-16",
      days: 3,
      reason: "Home renovation work ongoing. Will work remotely during this period.",
      status: "Pending",
      applied_date: "2025-10-11",
      attachments: []
    },
    {
      id: 5,
      employee_id: "EMP005",
      employee_name: "Robert Brown",
      type: "Sick Leave",
      start_date: "2025-10-08",
      end_date: "2025-10-09",
      days: 2,
      reason: "Food poisoning",
      status: "Rejected",
      applied_date: "2025-10-08",
      attachments: []
    },
    {
      id: 6,
      employee_id: "EMP006",
      employee_name: "Lisa Anderson",
      type: "Vacation",
      start_date: "2025-11-01",
      end_date: "2025-11-05",
      days: 5,
      reason: "Attending cousin's wedding in Delhi",
      status: "Pending",
      applied_date: "2025-10-11",
      attachments: [
        { name: "wedding_invitation.jpg", type: "image", url: "https://via.placeholder.com/800x600" }
      ]
    },
    {
      id: 7,
      employee_id: "EMP007",
      employee_name: "David Wilson",
      type: "Casual Leave",
      start_date: "2025-10-18",
      end_date: "2025-10-19",
      days: 2,
      reason: "Attending parent-teacher meeting at child's school",
      status: "Pending",
      applied_date: "2025-10-12",
      attachments: []
    },
    {
      id: 8,
      employee_id: "EMP008",
      employee_name: "Jennifer Martinez",
      type: "Sick Leave",
      start_date: "2025-10-13",
      end_date: "2025-10-14",
      days: 2,
      reason: "Migraine and severe headache",
      status: "Approved",
      applied_date: "2025-10-13",
      attachments: []
    }
  ]);

  const [filters, setFilters] = useState({ status: "all", search: "", type: "all" });
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(6);

  // Fetch leaves from API (replace with actual API call)
  const fetchLeaves = async () => {
    // TODO: Replace with actual API call
    // const res = await fetch("/api/admin/leaves");
    // const data = await res.json();
    // setLeaves(data);
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Filter leaves
  const filteredLeaves = leaves.filter((leave) => {
    if (filters.status !== "all" && leave.status !== filters.status) return false;
    if (filters.type !== "all" && leave.type !== filters.type) return false;
    if (filters.search && !leave.employee_name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLeaves.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = filteredLeaves.slice(startIndex, startIndex + recordsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Calculate stats
  const stats = {
    total: leaves.length,
    pending: leaves.filter(l => l.status === "Pending").length,
    approved: leaves.filter(l => l.status === "Approved").length,
    rejected: leaves.filter(l => l.status === "Rejected").length,
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = async (id) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/admin/leaves/${id}/approve`, { method: 'PATCH' });
      setLeaves(leaves.map(l => l.id === id ? { ...l, status: "Approved" } : l));
      showToast("Leave approved successfully", "success");
    } catch {
      showToast("Failed to approve leave", "error");
    }
  };

  const handleReject = async (id) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/admin/leaves/${id}/reject`, { method: 'PATCH' });
      setLeaves(leaves.map(l => l.id === id ? { ...l, status: "Rejected" } : l));
      showToast("Leave rejected successfully", "success");
    } catch {
      showToast("Failed to reject leave", "error");
    }
  };

  const viewDetails = (leave) => {
    setSelectedLeave(leave);
    setIsDetailsModalOpen(true);
  };

  const viewAttachment = (attachment) => {
    setSelectedAttachment(attachment);
    setIsAttachmentModalOpen(true);
  };

  const getStatusBadge = (status) => {
    const badges = {
      Pending: { color: "from-yellow-400 to-amber-500", icon: Clock },
      Approved: { color: "from-emerald-500 to-emerald-600", icon: CheckCircle },
      Rejected: { color: "from-rose-500 to-rose-600", icon: XCircle }
    };
    const badge = badges[status];
    const Icon = badge.icon;
    return (
      <span className={`px-3 py-1.5 rounded-full text-white text-xs font-bold inline-flex items-center gap-1 bg-gradient-to-r ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const getLeaveTypeIcon = (type) => {
    switch(type) {
      case "Sick Leave": return <Heart className="w-4 h-4" />;
      case "Casual Leave": return <Briefcase className="w-4 h-4" />;
      case "Vacation": return <Plane className="w-4 h-4" />;
      case "Work From Home": return <Home className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                Leave Management
              </h1>
              <p className="text-gray-600">Review and manage employee leave applications</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 shadow-lg shadow-indigo-500/30 transition-all font-semibold">
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              icon={FileText}
              label="Total Applications"
              value={stats.total}
              color="from-blue-500 to-blue-600"
              subtitle="All time"
            />
            <StatsCard
              icon={Clock}
              label="Pending"
              value={stats.pending}
              color="from-amber-500 to-amber-600"
              subtitle="Awaiting review"
            />
            <StatsCard
              icon={CheckCircle}
              label="Approved"
              value={stats.approved}
              color="from-emerald-500 to-emerald-600"
              subtitle="This month"
            />
            <StatsCard
              icon={XCircle}
              label="Rejected"
              value={stats.rejected}
              color="from-rose-500 to-rose-600"
              subtitle="This month"
            />
          </div>

          {/* Search and Filters */}
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

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  >
                    <option value="all">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                
                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Leave Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  >
                    <option value="all">All Types</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Vacation">Vacation</option>
                    <option value="Work From Home">Work From Home</option>
                  </select>
                </div>
              </div>
            )}

            {(filters.status !== "all" || filters.type !== "all" || filters.search) && (
              <button
                onClick={() => setFilters({ status: "all", search: "", type: "all" })}
                className="mt-4 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Leave Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {currentRecords.map((leave) => (
            <div 
              key={leave.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                      {leave.employee_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{leave.employee_name}</h3>
                      <p className="text-sm text-gray-500">ID: {leave.employee_id}</p>
                    </div>
                  </div>
                  {getStatusBadge(leave.status)}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    {getLeaveTypeIcon(leave.type)}
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Leave Type</p>
                      <p className="font-bold text-gray-900">{leave.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Duration</p>
                      <p className="font-bold text-indigo-600">{leave.days} Days</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Period</p>
                      <p className="font-semibold text-gray-900 text-sm">
                        {leave.start_date} → {leave.end_date}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-600 mb-1">Reason</p>
                    <p className="text-sm text-gray-700 line-clamp-2">{leave.reason}</p>
                  </div>

                  {leave.attachments && leave.attachments.length > 0 && (
                    <div className="flex items-center gap-2">
                      {leave.attachments.map((att, index) => (
                        <button
                          key={index}
                          onClick={() => viewAttachment(att)}
                          className="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-xs font-medium"
                        >
                          <FileText className="w-4 h-4" />
                          {att.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => viewDetails(leave)}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  
                  {leave.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleReject(leave.id)}
                        className="px-4 py-2.5 bg-gradient-to-r from-rose-100 to-rose-200 text-rose-700 rounded-xl hover:from-rose-200 hover:to-rose-300 font-semibold transition-all"
                        title="Reject"
                      >
                        <XCircle className="w-5 h-5" />

                                              </button>
                      <button
                        onClick={() => handleApprove(leave.id)}
                        className="px-4 py-2.5 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 rounded-xl hover:from-emerald-200 hover:to-emerald-300 font-semibold transition-all"
                        title="Approve"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {currentRecords.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">No leave applications found.</p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 inline-block" /> Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next <ChevronRight className="w-4 h-4 inline-block" />
            </button>
          </div>
        )}
      </div>

      {/* Leave Details Modal */}
      <LeaveDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        leave={selectedLeave}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Attachment Modal */}
      <AttachmentModal
        isOpen={isAttachmentModalOpen}
        onClose={() => setIsAttachmentModalOpen(false)}
        attachment={selectedAttachment}
      />

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
