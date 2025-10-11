import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { db } from "./config/db.js"; 


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test DB connection
try {
  const [rows] = await db.query("SELECT 1");
  console.log("✅ MySQL Connected Successfully:", rows);
} catch (err) {
  console.error("❌ DB connection test failed:", err);
}

// Default route
app.get("/", (req, res) => {
  res.send("🚀 Attendance & Leave Management Backend Running...");
});

// // Import routes (to be created)
import attendanceRoutes from "./routes/attendanceRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import holidayRoutes from "./routes/holidayRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminpayrollRoutes from "./routes/adminpayrollRoutes.js";

// // Use routes
 app.use("/attendance", attendanceRoutes);
 app.use("/leave", leaveRoutes);
 app.use("/holidays", holidayRoutes);
 app.use("/api/admin", adminRoutes);
app.use("/api/admin/adminpayroll", adminpayrollRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
