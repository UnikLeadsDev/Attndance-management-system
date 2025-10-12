import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  X, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  UserPlus,
  AlertCircle
} from 'lucide-react';

const EmployeesPage = () => {
  // State management
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewEmployee, setViewEmployee] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    joining_date: '',
    base_salary: '',
    address: '',
    status: 'active'
  });

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Search filter effect
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(emp => 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
    setCurrentPage(1); // Reset to first page on search
  }, [searchQuery, employees]);

  // Fetch all employees
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin/employees');
      setEmployees(response.data);
      setFilteredEmployees(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching employees:', err);
      // Use mock data if API fails
      const mockData = generateMockEmployees();
      setEmployees(mockData);
      setFilteredEmployees(mockData);
      setError('Using mock data - API not connected');
    } finally {
      setLoading(false);
    }
  };

  // Generate mock employees data
  const generateMockEmployees = () => {
    return [
      {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@nexarge.com',
        phone: '+1 234-567-8901',
        department: 'IT',
        role: 'Software Engineer',
        joinDate: '2022-01-15',
        salary: 75000,
        address: '123 Main St, New York, NY',
        status: 'active'
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.j@nexarge.com',
        phone: '+1 234-567-8902',
        department: 'HR',
        role: 'HR Manager',
        joinDate: '2021-03-20',
        salary: 65000,
        address: '456 Oak Ave, Boston, MA',
        status: 'active'
      },
      {
        id: 3,
        name: 'Michael Brown',
        email: 'm.brown@nexarge.com',
        phone: '+1 234-567-8903',
        department: 'Finance',
        role: 'Accountant',
        joinDate: '2022-06-10',
        salary: 60000,
        address: '789 Pine Rd, Chicago, IL',
        status: 'inactive'
      },
      {
        id: 4,
        name: 'Emily Davis',
        email: 'emily.d@nexarge.com',
        phone: '+1 234-567-8904',
        department: 'Marketing',
        role: 'Marketing Specialist',
        joinDate: '2023-02-01',
        salary: 55000,
        address: '321 Elm St, Austin, TX',
        status: 'active'
      },
      {
        id: 5,
        name: 'David Wilson',
        email: 'd.wilson@nexarge.com',
        phone: '+1 234-567-8905',
        department: 'Operations',
        role: 'Operations Manager',
        joinDate: '2021-09-15',
        salary: 70000,
        address: '654 Maple Dr, Seattle, WA',
        status: 'active'
      },
      {
        id: 6,
        name: 'Lisa Anderson',
        email: 'lisa.a@nexarge.com',
        phone: '+1 234-567-8906',
        department: 'Sales',
        role: 'Sales Executive',
        joinDate: '2023-01-10',
        salary: 58000,
        address: '987 Cedar Ln, Miami, FL',
        status: 'active'
      },
      {
        id: 7,
        name: 'Robert Taylor',
        email: 'robert.t@nexarge.com',
        phone: '+1 234-567-8907',
        department: 'IT',
        role: 'System Administrator',
        joinDate: '2022-08-20',
        salary: 68000,
        address: '147 Birch St, Denver, CO',
        status: 'active'
      },
      {
        id: 8,
        name: 'Jennifer Martinez',
        email: 'jennifer.m@nexarge.com',
        phone: '+1 234-567-8908',
        department: 'HR',
        role: 'Recruiter',
        joinDate: '2023-04-05',
        salary: 52000,
        address: '258 Walnut Ave, Portland, OR',
        status: 'inactive'
      }
    ];
  };

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Handle add employee
  const handleAddEmployee = () => {
    setModalMode('add');
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: '',
      role: '',
      joinDate: '',
      salary: '',
      address: '',
      status: 'active'
    });
    setShowModal(true);
  };

  // Handle edit employee
  const handleEditEmployee = (employee) => {
    setModalMode('edit');
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      role: employee.role,
      joinDate: employee.joinDate,
      salary: employee.salary,
      address: employee.address,
      status: employee.status
    });
    setShowModal(true);
  };

  // Handle view employee
  const handleViewEmployee = async (employee) => {
    try {
      // In real app, fetch detailed data
      const response = await axios.get(`/api/employees/${employee.id}`);
      setViewEmployee(response.data);
    } catch (err) {
      // Use existing data if API fails
      setViewEmployee(employee);
    }
    setShowViewModal(true);
  };

  // Handle form submit
 const handleFormSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      modalMode === 'add'
        ? 'http://localhost:5000/api/admin/employees'   // add route
        : `http://localhost:5000/api/admin/employees/${formData.id}`,  // update route
      {
        method: modalMode === 'add' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();
    console.log('✅ Response:', data);

    if (response.ok) {
      alert(modalMode === 'add' ? 'Employee added!' : 'Employee updated!');
      setShowModal(false);
    } else {
      console.error('❌ Error from backend:', data);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
};


  // Handle status toggle
  const handleStatusToggle = async (employee) => {
    try {
      const newStatus = employee.status === 'active' ? 'inactive' : 'active';
      await axios.patch(`/api/employees/${employee.id}/status`, { status: newStatus });
      
      setEmployees(employees.map(emp => 
        emp.id === employee.id ? { ...emp, status: newStatus } : emp
      ));
      showToast(`Employee ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`, 'success');
    } catch (err) {
      // Mock success
      const newStatus = employee.status === 'active' ? 'inactive' : 'active';
      setEmployees(employees.map(emp => 
        emp.id === employee.id ? { ...emp, status: newStatus } : emp
      ));
      showToast(`Employee ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`, 'success');
    }
  };

  // Handle delete employee
  const handleDeleteEmployee = async (employee) => {
    if (!window.confirm(`Are you sure you want to delete ${employee.name}?`)) {
      return;
    }

    try {
      await axios.delete(`/api/employees/${employee.id}`);
      setEmployees(employees.filter(emp => emp.id !== employee.id));
      showToast('Employee deleted successfully!', 'success');
    } catch (err) {
      // Mock success
      setEmployees(employees.filter(emp => emp.id !== employee.id));
      showToast('Employee deleted successfully!', 'success');
    }
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Toast Notification */}
        {toast.show && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white animate-slide-in`}>
            {toast.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{toast.message}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Employee Management</h1>
            <p className="text-gray-600 mt-1">Manage your team members and their information</p>
            {error && (
              <p className="text-orange-600 text-sm mt-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            )}
          </div>
          <button
            onClick={handleAddEmployee}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add Employee
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, department, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Employees Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.length > 0 ? (
                  currentItems.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{employee.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {employee.name.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {employee.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
                          {employee.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {employee.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          employee.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {employee.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewEmployee(employee)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEditEmployee(employee)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-150"
                            title="Edit Employee"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleStatusToggle(employee)}
                            className={`p-2 rounded-lg transition-colors duration-150 ${
                              employee.status === 'active'
                                ? 'text-orange-600 hover:bg-orange-50'
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={employee.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            {employee.status === 'active' ? <X className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                            title="Delete Employee"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <UserPlus className="w-12 h-12 text-gray-300 mb-3" />
                        <p className="text-lg font-medium">No employees found</p>
                        <p className="text-sm mt-1">Try adjusting your search or add a new employee</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredEmployees.length > itemsPerPage && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredEmployees.length)} of {filteredEmployees.length} employees
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {modalMode === 'add' ? 'Add New Employee' : 'Edit Employee'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="+1 234-567-8900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  >
                    <option value="">Select Department</option>
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Join Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.joining_date}
                    onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.base_salary}
                    onChange={(e) => setFormData({ ...formData, base_salary: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="50000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                  placeholder="123 Main Street, City, State, ZIP"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all duration-150"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-150 flex items-center gap-2"
                >
                  {modalMode === 'add' ? <Plus className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                  {modalMode === 'add' ? 'Add Employee' : 'Update Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Employee Modal */}
      {showViewModal && viewEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-2xl font-bold">Employee Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-150"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {viewEmployee.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{viewEmployee.name}</h3>
                  <p className="text-gray-600">{viewEmployee.role}</p>
                  <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                    viewEmployee.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {viewEmployee.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Employee ID</p>
                  <p className="text-lg text-gray-800">#{viewEmployee.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                  <p className="text-lg text-gray-800">{viewEmployee.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Phone</p>
                  <p className="text-lg text-gray-800">{viewEmployee.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Department</p>
                  <p className="text-lg text-gray-800">{viewEmployee.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Join Date</p>
                  <p className="text-lg text-gray-800">{viewEmployee.joinDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Salary</p>
                  <p className="text-lg text-gray-800">${viewEmployee.salary?.toLocaleString()}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500 mb-1">Address</p>
                  <p className="text-lg text-gray-800">{viewEmployee.address}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditEmployee(viewEmployee);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-150 flex items-center gap-2"
                >
                  <Edit className="w-5 h-5" />
                  Edit Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesPage;