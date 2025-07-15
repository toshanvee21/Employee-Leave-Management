import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
  Paper,
  InputLabel,
  FormControl,
  Select,
  CircularProgress
} from "@mui/material";
import axios from "axios";

const AddProject = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [fetchingEmployees, setFetchingEmployees] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/fetchAllEmployees");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
        alert("Failed to fetch employees.");
      } finally {
        setFetchingEmployees(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEmployee) {
      alert("Please select an employee.");
      return;
    }

    setLoading(true);

    const form = e.target;
    const reqData = {
      companyName: form.companyName.value.trim(),
      projectTitle: form.projectTitle.value.trim(),
      projectDescription: form.projectDescription.value.trim(),
      projectType: form.projectType.value,
      status: form.status.value,
      assignDate: form.assignDate.value, // string, backend should parse as Date
      employeeid: selectedEmployee,      // ✅ updated key
    };

    try {
      const response = await axios.post("http://localhost:5000/api/createproject", reqData);
      alert(response.data.message);
      form.reset();
      setSelectedEmployee("");
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error.message);
      alert("Failed to register project. Please try again.");
    }

    setLoading(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
      }}
    >
      <Paper elevation={5} sx={{ p: 4, width: "100%", maxWidth: 600, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
          Add Project
        </Typography>

        <TextField
          name="companyName"
          label="Company Name"
          fullWidth
          required
          margin="normal"
        />
        <TextField
          name="projectTitle"
          label="Project Title"
          fullWidth
          required
          margin="normal"
        />
        <TextField
          name="projectDescription"
          label="Project Description"
          fullWidth
          required
          margin="normal"
        />
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Project Type</InputLabel>
          <Select name="projectType" label="Project Type" required defaultValue="">
            <MenuItem value="Front-End">Front-End</MenuItem>
            <MenuItem value="Back-End">Back-End</MenuItem>
            <MenuItem value="Full-Stack">Full-Stack</MenuItem>
            <MenuItem value="Mobile Development">Mobile Development</MenuItem>
            <MenuItem value="Data Science">Data Science</MenuItem>
          </Select>
        </FormControl>

        <TextField
          name="assignDate"
          label="Assign Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          fullWidth
          required
          margin="normal"
        />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Status</InputLabel>
          <Select name="status" label="Status" required defaultValue="Pending">
            <MenuItem value="In-Progress">In-Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </Select>
        </FormControl>

        {fetchingEmployees ? (
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <CircularProgress />
          </Box>
        ) : employees.length === 0 ? (
          <Typography color="error" sx={{ mb: 3 }}>No employees found. Please add employees first.</Typography>
        ) : (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Employee Name</InputLabel>
            <Select
              name="employee"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              label="Employee Name"
              required
            >
              <MenuItem value="" disabled>Select an employee</MenuItem>
              {employees.map((employee) => (
                <MenuItem key={employee._id} value={employee._id}>
                  {employee.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            mt: 3,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
            textTransform: "none",
            borderRadius: 2,
            backgroundColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Add Project"}
        </Button>
      </Paper>
    </Box>
  );
};

export default AddProject;
