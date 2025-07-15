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
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import axios from "axios";

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/fetchallleaves");
      setLeaves(response.data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
      alert("Failed to fetch leave history.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: deepPurple[500], mb: 3 }}>
        Leave History
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="leave history table">
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Designation</TableCell> {/* Added designation */}
              <TableCell>Leave Type</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Days</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaves.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  No leave records found.
                </TableCell>
              </TableRow>
            ) : (
              leaves.map((leave, index) => (
                <TableRow key={leave._id || index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{leave.employeeid?.fullName || "N/A"}</TableCell>
                  <TableCell>{leave.employeeid?.email || "N/A"}</TableCell>
                  <TableCell>{leave.employeeid?.department || "N/A"}</TableCell>
                  <TableCell>{leave.employeeid?.designation || "N/A"}</TableCell> {/* designation */}
                  <TableCell>{leave.leaveType || "N/A"}</TableCell>
                  <TableCell>{leave.reason || "N/A"}</TableCell>
                  <TableCell>{new Date(leave.startDate).toLocaleDateString() || "N/A"}</TableCell>
                  <TableCell>{new Date(leave.endDate).toLocaleDateString() || "N/A"}</TableCell>
                  <TableCell>{calculateDays(leave.startDate, leave.endDate)}</TableCell>
                  <TableCell style={{ color: getStatusColor(leave.leaveStatus), fontWeight: "bold" }}>
                    {leave.leaveStatus || "N/A"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Utils
const calculateDays = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  return Math.round((e - s) / (1000 * 3600 * 24)) + 1;
};

const getStatusColor = (status) => {
  switch (status) {
    case "Approved":
      return "green";
    case "Rejected":
      return "red";
    case "Pending":
      return "orange";
    default:
      return "black";
  }
};

export default LeaveHistory;
