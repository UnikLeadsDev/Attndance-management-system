import {db} from "../config/db.js";

// 🧮 Generate Payroll for an Employee
export const generatePayroll = async (req, res) => {
  const { employee_id, month, year } = req.body;

  if (!employee_id || !month || !year) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Step 1: Fetch base salary from employees table
    const [empResult] = await db.query(
      "SELECT base_salary FROM employees WHERE employee_id = ?",
      [employee_id]
    );

    if (empResult.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const baseSalary = empResult[0].base_salary;

    // Step 2: Fetch attendance summary
    const [attendance] = await db.query(
      `SELECT 
         COUNT(*) AS total_working_days,
         SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) AS total_present_days,
         SUM(CASE WHEN status = 'Full-Day Leave' OR status = 'Half-Day Leave' THEN 1 ELSE 0 END) AS total_leaves,
         SUM(overtime_hours) AS total_overtime_hours
       FROM attendance
       WHERE employee_id = ? AND MONTH(date) = ? AND YEAR(date) = ?`,
      [employee_id, month, year]
    );

    const data = attendance[0];
    const totalWorkingDays = data.total_working_days || 0;
    const totalPresentDays = data.total_present_days || 0;
    const totalLeaves = data.total_leaves || 0;
    const totalOvertimeHours = data.total_overtime_hours || 0;

    // Step 3: Salary calculations
    const perDaySalary = baseSalary / totalWorkingDays;
    const leaveDeduction = totalLeaves * perDaySalary;
    const overtimeBonus = totalOvertimeHours * 100; // ₹100/hour
    const finalSalary = baseSalary + overtimeBonus - leaveDeduction;

    // Step 4: Insert or Update Payroll record
    await db.query(
      `INSERT INTO payroll 
        (employee_id, month, year, base_salary, total_working_days, total_present_days, total_leaves, total_overtime_hours, overtime_bonus, leave_deduction, final_salary)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
        total_working_days = VALUES(total_working_days),
        total_present_days = VALUES(total_present_days),
        total_leaves = VALUES(total_leaves),
        total_overtime_hours = VALUES(total_overtime_hours),
        overtime_bonus = VALUES(overtime_bonus),
        leave_deduction = VALUES(leave_deduction),
        final_salary = VALUES(final_salary),
        last_updated = CURRENT_TIMESTAMP`,
      [
        employee_id,
        month,
        year,
        baseSalary,
        totalWorkingDays,
        totalPresentDays,
        totalLeaves,
        totalOvertimeHours,
        overtimeBonus,
        leaveDeduction,
        finalSalary,
      ]
    );

    // Step 5: Respond
    res.status(200).json({
      message: "Payroll generated successfully",
      data: {
        employee_id,
        month,
        year,
        baseSalary,
        totalWorkingDays,
        totalPresentDays,
        totalLeaves,
        totalOvertimeHours,
        leaveDeduction,
        overtimeBonus,
        finalSalary,
      },
    });
  } catch (error) {
    console.error("Payroll Generation Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
