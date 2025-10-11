// controllers/adminController.js
import {db} from "../config/db.js";

// 🧍 EMPLOYEE MANAGEMENT
export const getAllEmployees = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM employees");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addEmployee = async (req, res) => {
  const { employee_id, name, email, department, role, password_hash } = req.body;
  try {
    await db.query(
      "INSERT INTO employees (employee_id, name, email, department, role, password_hash) VALUES (?,?,?,?,?,?)",
      [employee_id, name, email, department, role, password_hash]
    );
    res.status(201).json({ message: "Employee added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmployeeDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM employees WHERE id = ?", [id]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, department, role, status } = req.body;
  try {
    await db.query(
      "UPDATE employees SET name=?, department=?, role=?, status=? WHERE id=?",
      [name, department, role, status, id]
    );
    res.json({ message: "Employee updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changeEmployeeStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await db.query("UPDATE employees SET status=? WHERE id=?", [status, id]);
    res.json({ message: `Employee ${status} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🕒 ATTENDANCE MANAGEMENT
export const getAllAttendance = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM attendance");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAttendance = async (req, res) => {
  const { id } = req.params;
  const { check_in, check_out } = req.body;
  try {
    await db.query(
      "UPDATE attendance SET check_in_time=?, check_out_time=? WHERE id=?",
      [check_in, check_out, id]
    );
    res.json({ message: "Attendance updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveMissPunch = (req, res) => res.json({ message: "Miss punch approved" });
export const rejectMissPunch = (req, res) => res.json({ message: "Miss punch rejected" });

// 🌴 LEAVE MANAGEMENT
export const getAllLeaves = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM leaves");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveLeave = (req, res) => res.json({ message: "Leave approved" });
export const rejectLeave = (req, res) => res.json({ message: "Leave rejected" });

// 🎉 HOLIDAY MANAGEMENT
export const getAllHolidays = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM holidays");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addHoliday = async (req, res) => {
  const { name, date } = req.body;
  try {
    await db.query("INSERT INTO holidays (name, date) VALUES (?,?)", [name, date]);
    res.status(201).json({ message: "Holiday added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteHoliday = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM holidays WHERE id=?", [id]);
    res.json({ message: "Holiday deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📊 DASHBOARD SUMMARY
export const getDashboardSummary = async (req, res) => {
  res.json({
    totalEmployees: 10,
    presentToday: 7,
    onLeave: 2,
    pendingLeaves: 1,
  });
};
