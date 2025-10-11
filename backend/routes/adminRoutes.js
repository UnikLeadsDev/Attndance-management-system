// routes/adminRoutes.js
import express from "express";
import {
  getAllEmployees,
  addEmployee,
  updateEmployee,
  changeEmployeeStatus,
  getEmployeeDetails,
  getAllAttendance,
  updateAttendance,
  approveMissPunch,
  rejectMissPunch,
  getAllLeaves,
  approveLeave,
  rejectLeave,
  getAllHolidays,
  addHoliday,
  deleteHoliday,
  getDashboardSummary,
} from "../controllers/adminController.js";

const router = express.Router();

// 🧍 EMPLOYEE MANAGEMENT
router.get("/employees", getAllEmployees);
router.post("/employees", addEmployee);
router.get("/employees/:id", getEmployeeDetails);
router.put("/employees/:id", updateEmployee);
router.patch("/employees/:id/status", changeEmployeeStatus);

// 🕒 ATTENDANCE MANAGEMENT
router.get("/attendance", getAllAttendance);
router.put("/attendance/:id", updateAttendance);
router.patch("/misspunch/:id/approve", approveMissPunch);
router.patch("/misspunch/:id/reject", rejectMissPunch);

// 🌴 LEAVE MANAGEMENT
router.get("/leaves", getAllLeaves);
router.patch("/leaves/:id/approve", approveLeave);
router.patch("/leaves/:id/reject", rejectLeave);

// 🎉 HOLIDAY MANAGEMENT
router.get("/holidays", getAllHolidays);
router.post("/holidays", addHoliday);
router.delete("/holidays/:id", deleteHoliday);

// 📊 DASHBOARD
router.get("/dashboard/summary", getDashboardSummary);

export default router;
