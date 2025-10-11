import express from "express";
import { generatePayroll } from "../controllers/payrollController.js";

const router = express.Router();

// Admin Payroll Routes
router.post("/generate", generatePayroll);

export default router;
