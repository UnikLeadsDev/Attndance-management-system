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



export default router;
