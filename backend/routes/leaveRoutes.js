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

// --------------------
// Apply Leave
// --------------------
router.post("/apply", upload.array("attachments", 3), async (req, res) => {
  try {
    const { employee_id, from_date, to_date, leave_type, reason } = req.body;

    // Insert leave request
    const [result] = await db.query(
      "INSERT INTO leave_requests (employee_id, from_date, to_date, leave_type, reason) VALUES (?, ?, ?, ?, ?)",
      [employee_id, from_date, to_date, leave_type, reason]
    );

    const leaveId = result.insertId;

    // Insert attachments
    if (req.files) {
      for (const file of req.files) {
        await db.query(
          "INSERT INTO leave_attachments (leave_id, file_name, file_type, file_path) VALUES (?, ?, ?, ?)",
          [leaveId, file.originalname, file.mimetype, file.path]
        );
      }
    }

    res.json({ status: "pending", message: "Leave request submitted for approval" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// --------------------
// Get Employee Leaves
// --------------------
router.get("/:employee_id", async (req, res) => {
  try {
    const { employee_id } = req.params;

    // Get leaves with attachments
    const [leaves] = await db.query(
      "SELECT * FROM leave_requests WHERE employee_id = ? ORDER BY applied_on DESC",
      [employee_id]
    );

    // Get attachments for each leave
    for (let leave of leaves) {
      const [attachments] = await db.query(
        "SELECT file_name, file_type, file_path FROM leave_attachments WHERE leave_id = ?",
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

// --------------------
// Approve / Reject Leave (Admin Only)
// --------------------
router.patch("/approve/:leave_id", async (req, res) => {
  try {
    const { leave_id } = req.params;
    const { status } = req.body; // "Approved" or "Rejected"

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await db.query(
      "UPDATE leave_requests SET status = ? WHERE id = ?",
      [status, leave_id]
    );

    res.json({ message: `Leave request ${status.toLowerCase()} successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
