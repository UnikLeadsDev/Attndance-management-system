import express from "express";
import { db } from "../config/db.js";

const router = express.Router();

/**
 * @route POST /attendance/checkin
 * @desc Employee check-in
 */
router.post("/checkin", async (req, res) => {
  try {
    const { employee_id, date, check_in_time, location } = req.body;

    // Check if already checked in
    const [existing] = await db.query(
      "SELECT * FROM attendance WHERE employee_id = ? AND date = ?",
      [employee_id, date]
    );

    if (existing.length > 0 && existing[0].check_in_time) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    // Insert or update attendance
    if (existing.length > 0) {
      await db.query(
        "UPDATE attendance SET check_in_time = ?, status = 'Present', location = ? WHERE employee_id = ? AND date = ?",
        [check_in_time, location || null, employee_id, date]
      );
    } else {
      await db.query(
        "INSERT INTO attendance (employee_id, date, check_in_time, status, location) VALUES (?, ?, ?, 'Present', ?)",
        [employee_id, date, check_in_time, location || null]
      );
    }

    res.json({ message: "Check-in successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @route POST /attendance/checkout
 * @desc Employee check-out
 */
router.post("/checkout", async (req, res) => {
  try {
    const { employee_id, date, check_out_time } = req.body;

    // 🧩 Validate input
    if (!employee_id || !date || !check_out_time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 🔍 Find today's attendance record
    const [records] = await db.query(
      "SELECT * FROM attendance WHERE employee_id = ? AND date = ?",
      [employee_id, date]
    );

    if (records.length === 0 || !records[0].check_in_time) {
      return res.status(400).json({ message: "Check-in first before checkout" });
    }

    // 🕐 Function to parse 12-hour or 24-hour time string
    const parseTime = (timeStr) => {
      if (!timeStr) return null;

      // If it's already in HH:mm:ss or HH:mm (24-hour)
      if (/^\d{2}:\d{2}(:\d{2})?$/.test(timeStr)) {
        const [hours, minutes] = timeStr.split(":").map(Number);
        return { hours, minutes };
      }

      // Handle 12-hour AM/PM format (e.g. "12:07 PM")
      const [time, modifier] = timeStr.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
      return { hours, minutes };
    };

    const inTime = parseTime(records[0].check_in_time);
    const outTime = parseTime(check_out_time);

    if (!inTime || !outTime) {
      return res.status(400).json({ message: "Invalid time format" });
    }

    // 🕒 Create Date objects with correct time
    const checkIn = new Date(date);
    checkIn.setHours(inTime.hours, inTime.minutes, 0, 0);

    const checkOut = new Date(date);
    checkOut.setHours(outTime.hours, outTime.minutes, 0, 0);

    // ⏱️ Calculate working hours
    let workingHours = (checkOut - checkIn) / (1000 * 3600); // hours
    if (isNaN(workingHours) || workingHours < 0) workingHours = 0;
    workingHours = parseFloat(workingHours.toFixed(2));

    // 🟢 Determine attendance status
    const status = workingHours > 0 ? "Present" : "Miss Punch";

    // 💾 Update attendance record
    await db.query(
      "UPDATE attendance SET check_out_time = ?, working_hours = ?, status = ? WHERE employee_id = ? AND date = ?",
      [check_out_time, workingHours, status, employee_id, date]
    );

    // ✅ Send response
    res.json({
      message: "Check-out successful",
      working_hours: workingHours,
      status,
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});


/**
 * @route GET /attendance/:employee_id/:month
 * @desc Get monthly attendance for employee
 */
router.get("/:employee_id/:month", async (req, res) => {
  try {
    const { employee_id, month } = req.params; // month format: YYYY-MM

    const [records] = await db.query(
      "SELECT * FROM attendance WHERE employee_id = ? AND DATE_FORMAT(date,'%Y-%m') = ? ORDER BY date ASC",
      [employee_id, month]
    );

    res.json({ attendance: records });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


//Daily attendance summary
router.get("/daily-summary", async (req, res) => {
  try {
    // Query: get all present employees with their attendance + employee details
    const [rows] = await db.execute(
      `
      SELECT 
          e.id AS emp_id,
          e.employee_id,
          e.name,
          e.email,
          e.department,
          e.role,
          e.phone,
          e.address,
          e.status AS employee_status,
          e.base_salary,
          a.date,
          a.check_in_time,
          a.check_out_time,
          a.working_hours,
          a.overtime_hours,
          a.status AS attendance_status,
          a.location
      FROM employees e
      JOIN attendance a ON e.employee_id = a.employee_id
      WHERE a.date = CURDATE()
      AND a.status = 'Present'
      `
    );

    // Count total present employees
    const totalPresent = rows.length;

    res.status(200).json({
      date: new Date().toISOString().slice(0, 10),
      total_present: totalPresent,
      present_employees: rows,
    });
  } catch (error) {
    console.error("Error fetching daily attendance summary:", error);
    res.status(500).json({ message: "Server error while fetching attendance summary." });
  }
});





export default router;
