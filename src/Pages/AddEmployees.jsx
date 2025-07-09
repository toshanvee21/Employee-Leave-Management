import React, { useState } from "react";
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
} from "@mui/material";
import axios from "axios";

const departmentDesignations = {
  "Software Development": [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
  ],
  "IT Support": ["System Administrator"],
  "Network Administration": ["Network Engineer"],
  Cybersecurity: ["Cybersecurity Analyst"],
  "Database Administration": ["Database Administrator"],
  "Project Management": ["Project Manager"],
  "Business Analysis": ["Business Analyst"],
  "Quality Assurance": ["QA Engineer"],
  "Cloud Computing": ["Cloud Engineer", "DevOps Engineer"],
  "Data Science": ["Data Scientist"],
};

const AddEmployee = () => {
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [SelectedImage ,setSelectedImage] = useState(null);
  //const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    if (SelectedImage) {
      formData.set('empimage', SelectedImage);
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/createEmployee",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert(response.data.message);
      e.target.reset();
      setDepartment("");
      setDesignation("");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to register user.");
    } finally {
      setLoading(false);
    }
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
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          Add New Employee
        </Typography>

        {/* Basic Info */}
        <TextField name="fullName" label="Full Name" fullWidth required margin="normal" />
        <FormControl fullWidth required margin="normal">
          <InputLabel>Gender</InputLabel>
          <Select name="gender" label="Gender">
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
        <TextField name="email" label="Email" type="email" fullWidth required margin="normal" />
        <TextField name="phone" label="Phone" fullWidth required margin="normal" />
        <TextField name="address" label="Address" fullWidth required margin="normal" />

        {/* Department Dropdown */}
        <FormControl fullWidth required margin="normal">
          <InputLabel>Employee Department</InputLabel>
          <Select
            name="department"
            label="Employee Department"
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setDesignation("");
            }}
          >
            {Object.keys(departmentDesignations).map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Designation Dropdown */}
        <FormControl fullWidth required margin="normal" disabled={!department}>
          <InputLabel>Employee Designation</InputLabel>
          <Select
            name="designation"
            label="Employee Designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          >
            {departmentDesignations[department]?.map((desig) => (
              <MenuItem key={desig} value={desig}>
                {desig}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Other Fields */}
        <TextField
          name="joiningDate"
          label="Joining Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          fullWidth
          required
          margin="normal"
        />

        <FormControl fullWidth required margin="normal">
          <InputLabel>Employee Status</InputLabel>
          <Select name="employeeStatus" label="Employee Status" defaultValue="Active">
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
            <MenuItem value="Terminated">Terminated</MenuItem>
          </Select>
        </FormControl>

        <TextField
          name="password"
          label="Password"
          type="password"
          fullWidth
          required
          margin="normal"
        />

        {/* Image Upload */}
         <TextField variant="outlined" component="label" hidden
            type="file"
            name="empimage"
            accept="image/*"
            onChange={(e) => setSelectedImage(e.target.files[0])}/>
        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={loading}
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
        >
          {loading ? "Adding..." : "Add Employee"}
        </Button>
      </Paper>
    </Box>
  );
};

export default AddEmployee;
