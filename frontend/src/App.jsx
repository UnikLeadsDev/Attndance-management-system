import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import EmployeesPage from './pages/EmployeesPage';
import AttendancePage from './pages/AttendancePage';
 import LeavePage from './pages/LeavesPage';
// import Holidays from './pages/Holidays';
// import Login from './pages/Login';

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 lg:ml-60">
          <Routes>
            {/* <Route path="/admin/login" element={<Login />} /> */}
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/employees" element={<EmployeesPage />} /> 
            <Route path="/admin/attendance" element={<AttendancePage />} />
            <Route path="/admin/leaves" element={<LeavePage />} />
            {/* <Route path="/admin/holidays" element={<Holidays />} />  */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;