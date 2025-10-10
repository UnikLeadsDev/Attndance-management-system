import express from "express";
import { db } from "../config/db.js";

const router = express.Router();

// --------------------
// Get all holidays
// --------------------
router.get("/", async (req, res) => {
  try {
    const [holidays] = await db.query(
      "SELECT * FROM holidays ORDER BY date ASC"
    );
    res.json({ holidays });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// --------------------
// Add new holiday (Admin Only)
// --------------------
router.post("/add", async (req, res) => {
  try {
    const { date, name, type } = req.body;

    // Check if holiday already exists
    const [existing] = await db.query(
      "SELECT * FROM holidays WHERE date = ?",
      [date]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Holiday already exists for this date" });
    }

    // Insert holiday
    await db.query(
      "INSERT INTO holidays (date, name, type) VALUES (?, ?, ?)",
      [date, name, type || "Festival"]
    );

    res.json({ message: "Holiday added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
