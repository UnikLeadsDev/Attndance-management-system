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

    // Find today's attendance
    const [records] = await db.query(
      "SELECT * FROM attendance WHERE employee_id = ? AND date = ?",
      [employee_id, date]
    );

    if (records.length === 0 || !records[0].check_in_time) {
      return res.status(400).json({ message: "Check-in first before checkout" });
    }

    // Calculate working hours
    const checkIn = new Date(`${date}T${records[0].check_in_time}`);
    const checkOut = new Date(`${date}T${check_out_time}`);
    let workingHours = (checkOut - checkIn) / 1000 / 3600; // hours
    workingHours = workingHours < 0 ? 0 : parseFloat(workingHours.toFixed(2));

    // Determine status (Miss Punch if hours < 0.5 maybe)
    const status = workingHours > 0 ? "Present" : "Miss Punch";

    // Update record
    await db.query(
      "UPDATE attendance SET check_out_time = ?, working_hours = ?, status = ? WHERE employee_id = ? AND date = ?",
      [check_out_time, workingHours, status, employee_id, date]
    );

    res.json({ message: "Check-out successful", working_hours: workingHours });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
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

export default router;
