import { Employee } from "../models/EmployeeSchema.js";
import { Leave } from "../models/LeaveSchema.js";
import { Project } from "../models/ProjectSchema.js";
// Add Employee
let createEmployee = async (req, res) => {
    let reqData = req.body;
    console.log("employeeData", reqData);
    try {
      {let fillPath = req.file.path.replace('\\','/')
        console.log("FILE", fillPath)
        let result = await Employee.create({...req.body, empimage: fillPath})
        res.status(200).json({
            data: result,
            message: "Employee added successfully"
        })
    }} catch (error) {
        res.status(500).json({
            message: "Failed to add employee",
            error: error.message
        });
    }
};

// Get all Employees
let fetchAllEmployees = async (req, res) => {
    try {
        let result = await Employee.find();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error });
    }
};

// Delete Employee by ID
let deleteEmployee = async (req, res) => {
    try {
        let { employeeId } = req.body;
        let result = await Employee.findByIdAndDelete({ _id: employeeId });
        res.status(200).json({
            message: "Employee deleted"
        });
    } catch (error) {
        res.status(500).json(error);
        console.log("error", error);
    }
};

// Update Employee fields
let updateEmployee = async (req, res) => {
    try {
      const { employeeId, fullName, department, designation, email, employeeStatus } = req.body;
  
      const result = await Employee.findByIdAndUpdate(
        employeeId,
        {
          fullName,
          department,
          designation,
          email,
          employeeStatus
        },
        { new: true } // return updated document
      );
  
      res.status(200).json({
        data: result,
        message: "Employee details updated successfully"
      });
    } catch (error) {
      res.status(500).json({ message: "Update failed", error });
    }
  };
  
let loginEmployee = async (req, res) => {
  const { email, password } = req.body;

  try {
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (employee.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Fetch projects assigned to this employee
    const projects = await Project.find({ employeeid: employee._id });

    // Fetch leaves assigned to this employee
    const leaves = await Leave.find({ employeeid: employee._id });

    res.status(200).json({
      message: "Login successful",
      data: {
        id: employee._id,
        empimage: employee.empimage,
        fullName: employee.fullName,
        gender: employee.gender,
        phone: employee.phone,
        address: employee.address,
        joiningDate: employee.joiningDate,
        email: employee.email,
        designation: employee.designation,
        department: employee.department,
        projects: projects,
        leaves: leaves     // <--- added here
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};
const getEmployeeWithProjects = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const employeeData = await Employee.findById(employeeId);

    const projects = await Project.find({ employeeid: employeeId });

    res.status(200).json({
      employee: employeeData,
      projects: projects
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch employee with projects", error: error.message });
  }
};


const getEmployeeWithLeave = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const employeeData = await Employee.findById(employeeId);

    const leaves = await Leave.find({ employeeid: employeeId });

    res.status(200).json({
      employee: employeeData,
      leaves: leaves
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch employee with leave", error: error.message });
  }
};

export { createEmployee, fetchAllEmployees, deleteEmployee, updateEmployee, loginEmployee, getEmployeeWithProjects, getEmployeeWithLeave };
