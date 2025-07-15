import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import axios from "axios";

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState("");
  const [employeeStatus, setEmployeeStatus] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/fetchAllEmployees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      alert("Failed to fetch employees.");
    }
  };

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setFullName(employee.fullName);
    setDepartment(employee.department);
    setDesignation(employee.designation);
    setEmail(employee.email);
    setEmployeeStatus(employee.employeeStatus);
    setIsEditDialogOpen(true);
  };

  const handleUpdateEmployee = async () => {
    try {
      await axios.put("http://localhost:5000/api/updateEmployee", {
        employeeId: selectedEmployee._id,
        fullName,
        department,
        designation,
        email,
        employeeStatus,
      });
      setIsEditDialogOpen(false);
      fetchEmployees();
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      alert("Failed to update employee.");
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await axios.delete("http://localhost:5000/api/deleteEmployee", {
        data: { employeeId },
      });
      fetchEmployees();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete employee.");
    }
  };

  const getStatusColorAndWeight = (status) => {
    switch (status) {
      case "Active":
        return { color: "green", fontWeight: "bold" };
      case "Inactive":
        return { color: "gray", fontWeight: "bold" };
      case "Terminated":
        return { color: "red", fontWeight: "bold" };
      default:
        return { color: "black", fontWeight: "normal" };
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: deepPurple[500], mb: 3 }}>
        Employees List
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="employees table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>No.</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Photo</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Gender</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Designation</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Joining Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Employee Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee, index) => (
              <TableRow key={employee._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {employee.empimage ? (
                    <img
                      src={`http://localhost:5000/${employee.empimage}`}
                      alt={employee.fullName}
                      style={{ width: 100, height: 100, borderRadius: "50%" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/40";
                      }}
                    />
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>{employee.fullName}</TableCell>
                <TableCell>{employee.gender}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.designation}</TableCell>
                <TableCell>
                  {new Date(employee.joiningDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      color: getStatusColorAndWeight(employee.employeeStatus).color,
                      fontWeight: getStatusColorAndWeight(employee.employeeStatus).fontWeight,
                    }}
                  >
                    {employee.employeeStatus}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => handleEditClick(employee)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDeleteEmployee(employee._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 400 }}>
          <TextField
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
          <TextField
            label="Designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />
          <FormControl fullWidth required>
            <InputLabel>Employee Status</InputLabel>
            <Select
              value={employeeStatus}
              label="Employee Status"
              onChange={(e) => setEmployeeStatus(e.target.value)}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="Terminated">Terminated</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateEmployee}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeesList;
