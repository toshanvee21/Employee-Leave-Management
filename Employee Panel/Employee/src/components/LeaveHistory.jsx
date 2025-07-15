import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  CircularProgress,
  Chip,
} from "@mui/material";
import { deepPurple, green, orange, red } from "@mui/material/colors";

const getLeaveStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return green[600];
    case "pending":
      return orange[500];
    case "rejected":
      return red[500];
    default:
      return "gray";
  }
};

const calculateDays = (start, end) => {
  if (!start || !end) return "N/A";
  const s = new Date(start);
  const e = new Date(end);
  return Math.round((e - s) / (1000 * 3600 * 24)) + 1;
};

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const employee = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("employee") || "{}");
    } catch {
      return {};
    }
  }, []);

  const employeeId = employee?.id || "";

  const fetchLeaves = useCallback(async () => {
    if (!employeeId) {
      setError("Unauthorized access. Please log in.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/leavebyemployee/${employeeId}`
      );

      const leavesData = Array.isArray(data) ? data : data?.data || [];

      if (!Array.isArray(leavesData)) {
        throw new Error("Unexpected data format from server.");
      }

      const sortedLeaves = leavesData.sort(
        (a, b) => new Date(b.startDate) - new Date(a.startDate)
      );

      setLeaves(sortedLeaves);
    } catch (err) {
      console.error("Error fetching leaves:", err);
      setError("Failed to fetch leave records.");
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    if (employeeId) {
      fetchLeaves();
    } else {
      setError("Unauthorized access. Please log in.");
      setLoading(false);
    }
  }, [employeeId, fetchLeaves]);

  if (loading) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" variant="h6" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: deepPurple[500], mb: 3 }}
      >
        My Leave History
      </Typography>

      {leaves.length === 0 ? (
        <Typography
          align="center"
          sx={{ mt: 4, fontStyle: "italic", color: "text.secondary" }}
        >
          No leave records found.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="leave history table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>No.</TableCell>
                {/* <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Designation</TableCell> */}
                <TableCell sx={{ fontWeight: "bold" }}>Leave Type</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Reason</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Start Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>End Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Days</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaves.map((leave, index) => (
                <TableRow key={leave._id || index}>
                  <TableCell>{index + 1}</TableCell>
                  {/* <TableCell>{leave.employeeid?.fullName || "N/A"}</TableCell>
                  <TableCell>{leave.employeeid?.email || "N/A"}</TableCell>
                  <TableCell>{leave.employeeid?.department || "N/A"}</TableCell>
                  <TableCell>{leave.employeeid?.designation || "N/A"}</TableCell> */}
                  <TableCell>{leave.leaveType || "N/A"}</TableCell>
                  <TableCell>{leave.reason || "N/A"}</TableCell>
                  <TableCell>
                    {leave.startDate
                      ? new Date(leave.startDate).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {leave.endDate
                      ? new Date(leave.endDate).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>{calculateDays(leave.startDate, leave.endDate)}</TableCell>
                  <TableCell>
                    <Chip
                      label={leave.leaveStatus || leave.requestStatus || "N/A"}
                      sx={{
                        backgroundColor: getLeaveStatusColor(
                          leave.leaveStatus || leave.requestStatus
                        ),
                        color: "white",
                        fontWeight: "bold",
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default LeaveHistory;
