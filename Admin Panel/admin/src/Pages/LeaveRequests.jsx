import React, { useEffect, useState } from "react";
import axios from "axios";
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

const LeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/fetchallleaves");
      setLeaveRequests(res.data);
    } catch (error) {
      alert("Error fetching leave requests");
    }
  };

  // Utility to convert string to Title Case
  const toTitleCase = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const handleUpdateStatus = async (leaveId, status) => {
    try {
      const formattedStatus = toTitleCase(status);
      await axios.patch(
        `http://localhost:5000/api/updateleavestatus/${leaveId}`,
        { leaveStatus: formattedStatus }
      );
      fetchLeaves(); // Refresh list after update
    } catch (error) {
      alert("Failed to update leave status");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: deepPurple[500], mb: 3 }}
      >
        Leave Requests
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="leave request table">
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell>Days</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaveRequests.map((req, idx) => (
              <TableRow key={req._id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{req.employeeid?.fullName || "Unknown"}</TableCell>
                <TableCell>{req.employeeid?.email || "N/A"}</TableCell>
                <TableCell>{req.employeeid?.department || "N/A"}</TableCell>
                <TableCell>{req.reason}</TableCell>
                <TableCell
                  sx={{
                    color: getStatusColor(req.leaveStatus),
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  {req.leaveStatus}
                </TableCell>
                <TableCell>{new Date(req.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(req.endDate).toLocaleDateString()}</TableCell>
                <TableCell>{calculateDays(req.startDate, req.endDate)}</TableCell>
                <TableCell>
                  {req.leaveStatus.toLowerCase() === "pending" ? (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <button
                        style={buttonStyle("green")}
                        onClick={() => handleUpdateStatus(req._id, "Approved")}
                      >
                        Approve
                      </button>
                      <button
                        style={buttonStyle("red")}
                        onClick={() => handleUpdateStatus(req._id, "Rejected")}
                      >
                        Reject
                      </button>
                    </Box>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "bold",
                        color: getStatusColor(req.leaveStatus),
                        textTransform: "capitalize",
                      }}
                    >
                      {req.leaveStatus}
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
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
  switch (status.toLowerCase()) {
    case "approved":
      return "green";
    case "rejected":
      return "red";
    case "pending":
      return "orange";
    default:
      return "black";
  }
};

const buttonStyle = (color) => ({
  backgroundColor: color,
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "12px",
});

export default LeaveRequests;
