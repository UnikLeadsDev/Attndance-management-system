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
  try {
    console.log('Request Body:', req.body); // Debugging line
    const { name, email, phone, department, role, joining_date, base_salary, status, address } = req.body;

    // 🧩 Validation
    if (!name || !email || !phone || !department || !role || !joining_date || !base_salary) {
      return res.status(400).json({ message: 'All required fields must be filled!' });
    }

    // 🧮 Step 1: Get latest employee_id
    const [rows] = await db.query(
      "SELECT employee_id FROM employees ORDER BY id DESC LIMIT 1"
    );

    let newEmployeeId = "EMP001"; // default for first record
    if (rows.length > 0) {
      const lastId = rows[0].employee_id; // e.g., 'EMP007'
      const numericPart = parseInt(lastId.replace('EMP', '')); // → 7
      const nextNum = numericPart + 1;
      newEmployeeId = `EMP${String(nextNum).padStart(3, '0')}`; // → EMP008
    }

    // 🧾 Step 2: Insert new record
    const query = `
      INSERT INTO employees 
      (employee_id, name, email, phone, department, role, joining_date, base_salary, status, address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      newEmployeeId,
      name,
      email,
      phone,
      department,
      role,
      joining_date,
      base_salary,
      status || 'Active',
      address || null
    ];

    await db.query(query, values);

    res.status(201).json({
      message: '✅ Employee added successfully',
      employee_id: newEmployeeId
    });
  } catch (err) {
    console.error('❌ Error adding employee:', err);
    res.status(500).json({ message: 'Internal server error' });
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


import { subDays, format } from "date-fns";

export const getDashboardSummary = async (req, res) => {
  try {
    // 1️⃣ Summary Counts
    const [totalEmployees] = await db.query(
      "SELECT COUNT(*) AS total FROM employees"
    );

    const [presentToday] = await db.query(
      "SELECT COUNT(*) AS present FROM attendance WHERE date = CURDATE() AND status = 'present'"
    );

    const [pendingLeaves] = await db.query(
      "SELECT COUNT(*) AS pending FROM leave_requests WHERE status = 'pending'"
    );

    const [onLeave] = await db.query(
      "SELECT COUNT(*) AS onLeave FROM leave_requests WHERE CURDATE() BETWEEN from_date AND to_date"
    );

    // 2️⃣ Attendance Trend (Last 30 days)
    const [trendRows] = await db.query(`
      SELECT
        DATE_FORMAT(date, '%b %d') AS date,
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) AS present,
        SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) AS absent,
        SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) AS late
      FROM attendance
      WHERE date >= CURDATE() - INTERVAL 30 DAY
      GROUP BY date
      ORDER BY date ASC;
    `);

    const trendData = [];
    for (let i = 29; i >= 0; i--) {
      const dateKey = format(subDays(new Date(), i), 'MMM dd');
      const dayData = trendRows.find(row => row.date === dateKey);
      trendData.push(dayData || { date: dateKey, present: 0, absent: 0, late: 0 });
    }

    // 3️⃣ Recent Leaves (last 5 requests)
    const [recentLeaves] = await db.query(`
                    SELECT 
            lr.id, 
            e.name AS employeeName, 
            lr.from_date, 
            lr.to_date, 
            lr.status,
            lr.leave_type
          FROM leave_requests lr
          JOIN employees e ON lr.employee_id = e.employee_id
          ORDER BY lr.applied_on DESC
          LIMIT 5;


    `);

    // 4️⃣ Recent Miss Punch (attendance with missing punch)
    const [recentMissPunch] = await db.query(`
      SELECT 
        a.id, e.name AS employeeName, a.date, a.status
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
      WHERE a.status = 'miss_punch'
      ORDER BY a.date DESC
      LIMIT 5;
    `);

    // 5️⃣ Final Response
    res.json({
      totalEmployees: totalEmployees[0].total,
      presentToday: presentToday[0].present,
      pendingLeaves: pendingLeaves[0].pending,
      onLeave: onLeave[0].onLeave,
      attendanceTrend: trendData,
      recentLeaves: recentLeaves || [],
      recentMissPunch: recentMissPunch || [],
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({ error: "Server error" });
  }
};

