CREATE DATABASE attendance_system;
USE attendance_system;

CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    department VARCHAR(50),
    role VARCHAR(20) DEFAULT 'Employee',
    password_hash VARCHAR(255) NOT NULL,
    joining_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Active','Inactive') DEFAULT 'Active'
);


INSERT INTO employees (employee_id, name, email, department, role, password_hash, joining_date, status) VALUES
('EMP001', 'John Doe', 'john.doe@example.com', 'IT', 'Employee', 'hashedPassword1', '2025-01-10 09:00:00', 'Active'),
('EMP002', 'Jane Smith', 'jane.smith@example.com', 'HR', 'Employee', 'hashedPassword2', '2025-02-15 09:30:00', 'Active'),
('EMP003', 'Robert Brown', 'robert.brown@example.com', 'Finance', 'Employee', 'hashedPassword3', '2025-03-05 10:00:00', 'Active'),
('EMP004', 'Emily Johnson', 'emily.johnson@example.com', 'Marketing', 'Employee', 'hashedPassword4', '2025-04-20 09:15:00', 'Active'),
('EMP005', 'Michael Lee', 'michael.lee@example.com', 'Operations', 'Employee', 'hashedPassword5', '2025-05-01 08:45:00', 'Active');


CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    working_hours DECIMAL(4,2) DEFAULT 0,
    status ENUM('Present','Absent','Miss Punch','Holiday','Leave','Pending') DEFAULT 'Pending',
    location VARCHAR(100),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE leave_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    leave_type ENUM('Full-Day','Half-Day') NOT NULL,
    reason VARCHAR(255),
    status ENUM('Pending','Approved','Rejected') DEFAULT 'Pending',
    applied_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE leave_attachments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    leave_id INT NOT NULL,
    file_name VARCHAR(255),
    file_type VARCHAR(50),
    file_path VARCHAR(255),
    FOREIGN KEY (leave_id) REFERENCES leave_requests(id)
);
CREATE TABLE holidays (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    type ENUM('Festival','Weekend') DEFAULT 'Festival'
);

INSERT INTO holidays (date, name, type) VALUES
('2025-01-26', 'Republic Day', 'Festival'),
('2025-08-15', 'Independence Day', 'Festival'),
('2025-10-02', 'Gandhi Jayanti', 'Festival'),
('2025-10-20', 'Diwali', 'Festival');