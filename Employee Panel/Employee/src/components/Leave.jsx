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
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const Leave = () => {
  const employee = JSON.parse(localStorage.getItem("employee")) || {};
  const employeeId = employee._id || employee.id;

  const [formData, setFormData] = useState({
    leaveType: "",
    reason: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const leaveTypes = ["sick", "vacation", "personal", "other"];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
    setSuccess("");
  };

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!employeeId) {
      setError("Employee ID is missing");
      setLoading(false);
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError("Start Date cannot be after End Date");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        employeeid: employeeId,
      };

      await axios.post("http://localhost:5000/api/createleave", payload);

      setSuccess("Leave request submitted successfully!");
      setFormData({
        leaveType: "",
        reason: "",
        startDate: "",
        endDate: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit leave request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        minHeight: "75vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
      }}
    >
      <Paper
        elevation={5}
        sx={{ p: 4, width: "100%", maxWidth: 600, borderRadius: 3, padding: '25px' }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          Request Leave
        </Typography>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="leave-type-label">Leave Type</InputLabel>
          <Select
            labelId="leave-type-label"
            id="leave-type-select"
            name="leaveType"
            label="Leave Type"
            value={formData.leaveType}
            onChange={handleChange}
            required
            renderValue={(selected) =>
              selected ? (
                selected.charAt(0).toUpperCase() + selected.slice(1)
              ) : (
                <em style={{ color: "#aaa" }}>Select leave type</em>
              )
            }
          >
            {leaveTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          name="reason"
          label="Reason"
          value={formData.reason}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
          required
          margin="normal"
        />

        <TextField
          name="startDate"
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.startDate}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          inputProps={{ min: today }}
        />

        <TextField
          name="endDate"
          label="End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.endDate}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          inputProps={{ min: formData.startDate || today }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            mt: 3,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
            textTransform: "none",
            borderRadius: 2,
            backgroundColor: "#1976d2",
            "&:hover": { backgroundColor: "#1565c0" },
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Submit Leave Request"
          )}
        </Button>

        {error && (
          <Typography color="error" mt={2} align="center">
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="success.main" mt={2} align="center">
            {success}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Leave;
