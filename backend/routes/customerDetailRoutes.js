import express from "express";
import multer from "multer";
import mysql from "mysql2/promise";
import { db } from "../config/db.js";

const router = express.Router();

// Setup storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to store files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

const upload = multer({ storage });

// =====================
// POST: Add new customer
// =====================
router.post("/addcustomer", upload.single("supporting_document"), async (req, res) => {
  try {
    const {
      name,
      mobile_number,
      visit_purpose,
      reschedule_datetime,
      visit_datetime,
      location_text,
      location_url,
      remarks,
      employee_id
    } = req.body;

    const supporting_document = req.file ? req.file.path : null;

    // 🧩 Validation
    if (!name || !mobile_number || !visit_purpose || !visit_datetime || !location_text || !employee_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 🧾 Insert query
    const [result] = await db.execute(
      `INSERT INTO customer_details 
      (name, mobile_number, visit_purpose, reschedule_datetime, visit_datetime, location_text, location_url, remarks, supporting_document, employee_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        mobile_number,
        visit_purpose,
        reschedule_datetime || null,
        visit_datetime,
        location_text,
        location_url || null,
        remarks || null,
        supporting_document,
        employee_id
      ]
    );

    res.status(201).json({
      message: "Customer visit added successfully",
      customerId: result.insertId
    });

  } catch (error) {
    console.error("❌ Error inserting customer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// =====================
// GET: Fetch all customers
// =====================
router.get("/getcustomer", async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT c.*, e.name AS employee_name, e.department 
       FROM customer_details c
       JOIN employees e ON c.employee_id = e.employee_id
       ORDER BY c.visit_datetime DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getallcustomer",async (req,res)=>{
  try {
    const [rows] = await db.execute(
      `SELECT * FROM customer_details ORDER BY visit_datetime DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})



// =====================
// GET: Fetch single customer by ID
// =====================
router.get("/getcustomerbyid/:employee_id", async (req, res) => {
  try {
    const { employee_id } = req.params;

    const [rows] = await db.execute(
      `SELECT c.*, e.name AS employee_name, e.department
       FROM customer_details c
       JOIN employees e ON c.employee_id = e.employee_id
       WHERE c.employee_id = ?`,
      [employee_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No customers found for this employee" });
    }

    res.json(rows);
  } catch (error) {
    console.error("Error fetching customers by employee:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




export default router;