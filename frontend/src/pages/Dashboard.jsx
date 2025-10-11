import React, { useState, useEffect } from "react";
import axios from "axios";
import { format, subDays } from "date-fns";
import {
  Users,
  UserCheck,
  Clock,
  AlertCircle,
  Calendar,
  TrendingUp,
  RefreshCw
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

// StatCard Component
function StatCard({ title, value, icon: Icon, color, tooltip }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div 
      className="relative bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-xl shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-10">
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}

// Main Dashboard Component
export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    presentToday: 0,
    pendingLeaves: 0,
    missPunchRequests: 0,
    upcomingHolidays: 0
  });

  const [attendanceTrend, setAttendanceTrend] = useState([]);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [recentMissPunch, setRecentMissPunch] = useState([]);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Fetch dashboard summary
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/dashboard/summary');
      
      setDashboardData({
        totalEmployees: response.data.totalEmployees || 0,
        presentToday: response.data.presentToday || 0,
        pendingLeaves: response.data.pendingLeaves || 0,
        missPunchRequests: response.data.missPunchRequests || 0,
        upcomingHolidays: response.data.upcomingHolidays || 0
      });

      setAttendanceTrend(response.data.attendanceTrend || generateDummyTrend());
      setRecentLeaves(response.data.recentLeaves || []);
      setRecentMissPunch(response.data.recentMissPunch || []);
      
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use dummy data for development
      setDashboardData({
        totalEmployees: 45,
        presentToday: 38,
        pendingLeaves: 5,
        missPunchRequests: 3,
        upcomingHolidays: 2
      });
      setAttendanceTrend(generateDummyTrend());
      setRecentLeaves(generateDummyLeaves());
      setRecentMissPunch(generateDummyMissPunch());
    } finally {
      setLoading(false);
    }
  };

  // Generate dummy attendance trend data
  const generateDummyTrend = () => {
    const trendData = [];
    for (let i = 29; i >= 0; i--) {
      const dateShort = format(subDays(new Date(), i), 'MMM dd');
      trendData.push({
        date: dateShort,
        present: Math.floor(Math.random() * 10) + 30,
        absent: Math.floor(Math.random() * 5),
        late: Math.floor(Math.random() * 8)
      });
    }
    return trendData;
  };

  // Generate dummy leave data
  const generateDummyLeaves = () => {
    return [
      {
        id: 1,
        employee_name: "John Smith",
        leave_type: "sick",
        start_date: "2025-01-25",
        end_date: "2025-01-26",
        status: "pending"
      },
      {
        id: 2,
        employee_name: "Sarah Johnson",
        leave_type: "casual",
        start_date: "2025-01-28",
        end_date: "2025-01-30",
        status: "approved"
      },
      {
        id: 3,
        employee_name: "Michael Brown",
        leave_type: "annual",
        start_date: "2025-02-01",
        end_date: "2025-02-05",
        status: "pending"
      },
      {
        id: 4,
        employee_name: "Emily Davis",
        leave_type: "sick",
        start_date: "2025-01-22",
        end_date: "2025-01-22",
        status: "rejected"
      },
      {
        id: 5,
        employee_name: "David Wilson",
        leave_type: "casual",
        start_date: "2025-01-20",
        end_date: "2025-01-21",
        status: "approved"
      }
    ];
  };

  // Generate dummy miss punch data
  const generateDummyMissPunch = () => {
    return [
      {
        id: 1,
        employee_name: "Robert Taylor",
        punch_type: "check_in",
        date: "2025-01-20",
        status: "pending"
      },
      {
        id: 2,
        employee_name: "Lisa Anderson",
        punch_type: "check_out",
        date: "2025-01-19",
        status: "approved"
      },
      {
        id: 3,
        employee_name: "Jennifer Martinez",
        punch_type: "both",
        date: "2025-01-18",
        status: "pending"
      },
      {
        id: 4,
        employee_name: "Chris Evans",
        punch_type: "check_in",
        date: "2025-01-17",
        status: "pending"
      },
      {
        id: 5,
        employee_name: "Anna White",
        punch_type: "check_out",
        date: "2025-01-16",
        status: "rejected"
      }
    ];
  };

  // Auto-refresh every 2 minutes
  useEffect(() => {
    fetchDashboardData();
    
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 120000); // 120000ms = 2 minutes

    return () => clearInterval(interval);
  }, []);

  // Manual refresh
  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (loading && attendanceTrend.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Attendance & Leave Management System</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">
              Last updated: {format(lastRefresh, 'HH:mm:ss')}
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-all duration-200 text-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
          <StatCard
            title="Total Employees"
            value={dashboardData.totalEmployees}
            icon={Users}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            tooltip="Total number of active employees"
          />
          <StatCard
            title="Present Today"
            value={dashboardData.presentToday}
            icon={UserCheck}
            color="bg-gradient-to-br from-green-500 to-green-600"
            tooltip="Employees who checked in today"
          />
          <StatCard
            title="Pending Leaves"
            value={dashboardData.pendingLeaves}
            icon={Calendar}
            color="bg-gradient-to-br from-orange-500 to-orange-600"
            tooltip="Leave requests awaiting approval"
          />
          <StatCard
            title="Miss Punch Requests"
            value={dashboardData.missPunchRequests}
            icon={Clock}
            color="bg-gradient-to-br from-red-500 to-red-600"
            tooltip="Pending miss punch requests"
          />
          <StatCard
            title="Upcoming Holidays"
            value={dashboardData.upcomingHolidays}
            icon={AlertCircle}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            tooltip="Holidays scheduled ahead"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Attendance Trend Bar Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Attendance Trends</h2>
                <p className="text-sm text-gray-500">Last 30 days overview</p>
              </div>
              <TrendingUp className="w-6 h-6 text-blue-500" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  interval={Math.floor(attendanceTrend.length / 6)}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="present" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="late" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span className="text-sm text-gray-600">Late</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-600">Absent</span>
              </div>
            </div>
          </div>

          {/* Attendance Line Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Daily Attendance Rate</h2>
                <p className="text-sm text-gray-500">Percentage of present employees</p>
              </div>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  interval={Math.floor(attendanceTrend.length / 6)}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="present" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Leave Applications */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Leave Applications</h2>
            <div className="space-y-3">
              {recentLeaves.length > 0 ? (
                recentLeaves.map((leave) => (
                  <div 
                    key={leave.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{leave.employee_name}</p>
                      <p className="text-sm text-gray-600">
                        {leave.leave_type.charAt(0).toUpperCase() + leave.leave_type.slice(1)} Leave
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(leave.start_date), 'MMM dd')} - {format(new Date(leave.end_date), 'MMM dd')}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      leave.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                      leave.status === 'approved' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No leave applications yet</p>
              )}
            </div>
          </div>

          {/* Recent Miss Punch Requests */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Miss Punch Requests</h2>
            <div className="space-y-3">
              {recentMissPunch.length > 0 ? (
                recentMissPunch.map((request) => (
                  <div 
                    key={request.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{request.employee_name}</p>
                      <p className="text-sm text-gray-600">
                        Missed: {request.punch_type.replace('_', ' ').toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(request.date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      request.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                      request.status === 'approved' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No miss punch requests yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}