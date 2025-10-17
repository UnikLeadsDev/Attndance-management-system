import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db } from "../config/db.js";

const router = express.Router();

// --------------------
// Multer configuration
// --------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { files: 3 },
  fileFilter: function (req, file, cb) {
    const allowed = [".jpg", ".jpeg", ".png", ".pdf"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) return cb(new Error("Only JPG/PNG/PDF files allowed"));
    cb(null, true);
  },
});

// ======================================================
//  LEAVE REQUEST ROUTES (using unified attachments table)
// ======================================================

// Apply Leave
router.post("/apply", upload.array("attachments", 3), async (req, res) => {
  try {
    const { employee_id, from_date, to_date, leave_type, reason } = req.body;

    // Insert into leave_requests
    const [result] = await db.query(
      "INSERT INTO leave_requests (employee_id, from_date, to_date, leave_type, reason) VALUES (?, ?, ?, ?, ?)",
      [employee_id, from_date, to_date, leave_type, reason]
    );

    const leaveId = result.insertId;

    // Insert attachments (unified table)
    if (req.files?.length > 0) {
      for (const file of req.files) {
        await db.query(
          `INSERT INTO attachments 
           (request_type, request_id, file_name, file_type, file_path, uploaded_by) 
           VALUES ('leave', ?, ?, ?, ?, ?)`,
          [leaveId, file.originalname, file.mimetype, file.path, employee_id]
        );
      }
    }

    res.json({ status: "pending", message: "Leave request submitted for approval" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get Employee Leave Requests (with attachments)
router.get("/:employee_id", async (req, res) => {
  try {
    const { employee_id } = req.params;

    const [leaves] = await db.query(
      "SELECT * FROM leave_requests WHERE employee_id = ? ORDER BY applied_on DESC",
      [employee_id]
    );

    for (let leave of leaves) {
      const [attachments] = await db.query(
        `SELECT file_name, file_type, file_path 
         FROM attachments 
         WHERE request_type = 'leave' AND request_id = ?`,
        [leave.id]
      );
      leave.attachments = attachments;
    }

    res.json({ leaves });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ======================================================
//  MISS PUNCH REQUEST ROUTES
// ======================================================

// Apply Miss Punch Request
router.post("/misspunch/apply", upload.array("attachments", 3), async (req, res) => {
  try {
    const { emp_id, attendance_date, punch_type, reason } = req.body;

    // Insert into miss_punch_requests
    const [result] = await db.query(
      `INSERT INTO miss_punch_requests 
       (emp_id, attendance_date, punch_type, reason) 
       VALUES (?, ?, ?, ?)`,
      [emp_id, attendance_date, punch_type, reason]
    );

    const missPunchId = result.insertId;

    // Insert attachments
    if (req.files?.length > 0) {
      for (const file of req.files) {
        await db.query(
          `INSERT INTO attachments 
           (request_type, request_id, file_name, file_type, file_path, uploaded_by)
           VALUES ('miss_punch', ?, ?, ?, ?, ?)`,
          [missPunchId, file.originalname, file.mimetype, file.path, emp_id]
        );
      }
    }

    res.json({ status: "pending", message: "Miss Punch request submitted for approval" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get Miss Punch Requests for Employee
router.get("/misspunch/:emp_id", async (req, res) => {
  try {
    const { emp_id } = req.params;

    const [requests] = await db.query(
      "SELECT * FROM miss_punch_requests WHERE emp_id = ? ORDER BY created_at DESC",
      [emp_id]
    );

    for (let reqItem of requests) {
      const [attachments] = await db.query(
        `SELECT file_name, file_type, file_path 
         FROM attachments 
         WHERE request_type = 'miss_punch' AND request_id = ?`,
        [reqItem.id]
      );
      reqItem.attachments = attachments;
    }

    res.json({ miss_punch_requests: requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
