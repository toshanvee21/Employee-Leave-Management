import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Box, Typography, Paper } from "@mui/material";
import { FiBriefcase, FiCalendar, FiCheckCircle, FiClock } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const employee = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("employee"));
    } catch {
      return null;
    }
  }, []);

  const employeeId = employee?._id || employee?.id || "";

  const totalLeavesQuota = 24; // your annual quota

  // Fetch projects
  const fetchProjects = async () => {
    setError("");
    if (!employeeId) {
      setError("Employee not logged in.");
      return;
    }
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/projectsByEmployee/${employeeId}`
      );
      setProjects(data || []);
    } catch {
      setError("Failed to fetch projects.");
    }
  };

  // Fetch leaves
  const fetchLeaves = async () => {
    setError("");
    if (!employeeId) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/LeaveByEmployee/${employeeId}`
      );
      setLeaves(res.data.data || []);
    } catch {
      setError("Failed to fetch leaves.");
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchProjects(), fetchLeaves()]);
      setLoading(false);
    };
    if (employeeId) {
      load();
    } else {
      setLoading(false);
      setError("Employee data missing. Please login.");
    }
  }, [employeeId]);

  // Derived stats using useMemo for performance
  const approvedLeaves = useMemo(
    () =>
      leaves.filter((l) => l.leaveStatus?.toLowerCase() === "approved").length,
    [leaves]
  );
  const rejectedLeaves = useMemo(
    () =>
      leaves.filter((l) => l.leaveStatus?.toLowerCase() === "rejected").length,
    [leaves]
  );
  const pendingRequests = useMemo(
    () => leaves.filter((l) => l.leaveStatus?.toLowerCase() === "pending").length,
    [leaves]
  );
  const remainingLeaves = totalLeavesQuota - approvedLeaves;

  // Project stats
  const completedCount = useMemo(
    () => projects.filter((p) => p.status === "Completed").length,
    [projects]
  );
  const inProgressCount = useMemo(
    () => projects.filter((p) => p.status === "In-Progress").length,
    [projects]
  );
  const pendingProjectsCount = useMemo(
    () => projects.filter((p) => p.status === "Pending").length,
    [projects]
  );
  const growthData = useMemo(
    () =>
      projects.map((p) => ({
        name: p.projectTitle,
        growth:
          p.status === "Completed"
            ? 40
            : p.status === "In-Progress"
            ? 25
            : 10,
      })),
    [projects]
  );

  const getStatusColor = (st) =>
    ({
      Completed: "green",
      "In-Progress": "orange",
      "On-Hold": "gray",
      Approved: "green",
      Rejected: "red",
      Pending: "orange",
    }[st] || "black");

  if (loading)
    return <Typography sx={{ p: 5, textAlign: "center" }}>Loading dashboard...</Typography>;
  if (error)
    return (
      <Typography sx={{ p: 5, color: "error.main", textAlign: "center" }}>
        {error}
      </Typography>
    );

  return (
    <Box sx={{ background: "#f7fafc", minHeight: "100vh", p: 4, color: "#2d3748" }}>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
        Welcome, {employee?.fullName || "Employee"}!
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "#718096", mb: 5 }}>
        Here's your latest overview
      </Typography>

      {/* Leave & Project Cards */}
      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 5 }}>
        <Card icon={<FiCalendar />} title="Annual Quota" value={totalLeavesQuota} color="#2b6cb0" />
        <Card
          icon={<FiCheckCircle />}
          title="Approved Leaves"
          value={approvedLeaves}
          color="#2f855a"
        />
        <Card
          icon={<FiBriefcase />}
          title="Rejected Requests"
          value={rejectedLeaves}
          color="#e53e3e"
        />
        <Card icon={<FiClock />} title="Pending Requests" value={pendingRequests} color="#dd6b20" />
        <Card
          icon={<FiClock />}
          title="Leaves Remaining"
          value={remainingLeaves > 0 ? remainingLeaves : 0}
          color="#d69e2e"
        />
        <Card
          icon={<FiCheckCircle />}
          title="Completed Projects"
          value={completedCount}
          color="#2f855a"
        />
        <Card
          icon={<FiBriefcase />}
          title="Active Projects"
          value={inProgressCount}
          color="#6b46c1"
        />
        {/* New Card for Pending Projects */}
        <Card
          icon={<FiClock />}
          title="Pending Projects"
          value={pendingProjectsCount}
          color="#dd6b20"
        />
      </Box>

      {/* Charts & Project List */}
      <Box sx={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        <Paper sx={{ flex: 1, p: 3, borderRadius: 2, boxShadow: "0 4px 10px rgb(0 0 0 / 0.1)" }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Project Growth
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={growthData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="growth" fill="#5A67D8" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        <Paper sx={{ flex: 1, p: 3, borderRadius: 2, boxShadow: "0 4px 10px rgb(0 0 0 / 0.1)" }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Your Projects
          </Typography>
          <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
            {projects.length === 0 && (
              <Typography sx={{ color: "#718096", fontStyle: "italic" }}>
                No projects assigned to you.
              </Typography>
            )}
            {projects.map((proj) => (
              <Box
                component="li"
                key={proj._id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  p: 1.5,
                  mb: 1.5,
                  bgcolor: "#edf2f7",
                  borderRadius: 1,
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#e2e8f0" },
                  cursor: "pointer",
                }}
              >
                <span>{proj.projectTitle}</span>
                <span style={{ color: getStatusColor(proj.status), fontWeight: "bold" }}>
                  {proj.status}
                </span>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

const Card = ({ icon, title, value, color }) => (
  <Box
    sx={{
      flex: "1 1 200px",
      display: "flex",
      alignItems: "center",
      gap: 2,
      bgcolor: "white",
      p: 3,
      borderRadius: 2,
      boxShadow: "0 4px 8px rgb(0 0 0 / 0.1)",
      color,
      cursor: "default",
      transition: "box-shadow 0.2s ease-in-out",
      "&:hover": { boxShadow: "0 6px 15px rgb(0 0 0 / 0.15)" },
    }}
  >
    {React.cloneElement(icon, { style: { fontSize: "2.5rem", flexShrink: 0 } })}
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#4a5568" }}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, fontSize: "2rem" }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

export default Dashboard;
