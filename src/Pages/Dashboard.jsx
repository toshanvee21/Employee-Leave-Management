import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  CircularProgress,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import WorkIcon from "@mui/icons-material/Work";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useNavigate } from "react-router-dom";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const InfoCard = ({ bg, iconColor, label, IconComponent, count }) => (
  <Card
    sx={{
      flex: "1 1 180px",
      minWidth: 180,
      maxWidth: 220,
      height: 140,
      background: bg,
      color: iconColor,
      borderRadius: 3,
      boxShadow: "0 3px 8px rgba(0, 0, 0, 0.06)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      cursor: "default",
      padding: 2,
      transition: "transform 0.25s ease, box-shadow 0.25s ease",
      "&:hover": {
        transform: "scale(1.05)",
        boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
      },
    }}
  >
    <Box
      sx={{
        mb: 1,
        width: 40,
        height: 40,
        borderRadius: "50%",
        backgroundColor: "rgba(255,255,255,0.85)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
      }}
    >
      <IconComponent sx={{ fontSize: 24 }} />
    </Box>
    <Typography
      variant="subtitle2"
      sx={{ fontWeight: 600, letterSpacing: 0.3, mb: 0.5, fontSize: "0.9rem" }}
    >
      {label}
    </Typography>
    <Typography variant="h5" sx={{ fontWeight: "bold", letterSpacing: 1 }}>
      {count}
    </Typography>
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();

  const [employeeCount, setEmployeeCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, projRes, leaveRes] = await Promise.all([
          axios.get("http://localhost:5000/api/fetchAllEmployees"),
          axios.get("http://localhost:5000/api/fetchallprojects"),
          axios.get("http://localhost:5000/api/fetchAllLeaves"),
        ]);

        const leavesData = Array.isArray(leaveRes.data)
          ? leaveRes.data
          : leaveRes.data.leaves || [];

        setEmployees(empRes.data);
        setEmployeeCount(empRes.data.length);
        setProjects(projRes.data);
        setProjectCount(projRes.data.length);
        setLeaves(leavesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const newHiresCount = employees.filter((emp) => {
    if (!emp.joiningDate) return false;
    const joiningDate = new Date(emp.joiningDate);
    const today = new Date();
    const diffDays = (today - joiningDate) / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
  }).length;

  const departmentCounts = employees.reduce((acc, emp) => {
    const dept = emp.department || "Unknown";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});
  const employeeDeptData = Object.entries(departmentCounts).map(([key, value]) => ({
    name: key,
    value,
  }));

  const completedProjectsCount = projects.filter((p) => p.status === "Completed").length;
  const activeProjectsCount = projects.filter((p) => p.status === "In-Progress").length;
  const pendingProjectsCount = projects.filter((p) => p.status === "Pending").length;

  // Consistent case-insensitive leave status count
  const approvedLeavesCount = leaves.filter((l) => l.leaveStatus === "Approved").length;
  const pendingLeavesCount = leaves.filter((l) => l.leaveStatus === "Pending").length;
  const rejectedLeavesCount = leaves.filter((l) => l.leaveStatus === "Rejected").length;

  const projectStatusData = [
    { name: "Active", count: activeProjectsCount },
    { name: "Pending", count: pendingProjectsCount },
    { name: "Completed", count: completedProjectsCount },
  ];

  const leaveCards = [
    {
      bg: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
      iconColor: "#1976d2",
      label: "Total Leaves",
      icon: EventAvailableIcon,
      count: leaves.length,
    },
    {
      bg: "linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)",
      iconColor: "#2e7d32",
      label: "Approved Leaves",
      icon: AssignmentTurnedInIcon,
      count: approvedLeavesCount,
    },
    {
      bg: "linear-gradient(135deg, #fff9c4 0%, #fff59d 100%)",
      iconColor: "#fbc02d",
      label: "Pending Leaves",
      icon: HourglassEmptyIcon,
      count: pendingLeavesCount,
    },
    {
      bg: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
      iconColor: "#d32f2f",
      label: "Rejected Leaves",
      icon: CancelIcon,
      count: rejectedLeavesCount,
    },
  ];

  const employeeCards = [
    {
      bg: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
      iconColor: "#1976d2",
      label: "Total Employees",
      icon: DashboardIcon,
      count: employeeCount,
    },
    {
      bg: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
      iconColor: "#388e3c",
      label: "New Hires (30 days)",
      icon: WorkIcon,
      count: newHiresCount,
    },
  ];

  const projectCards = [
    {
      bg: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
      iconColor: "#f57c00",
      label: "Total Projects",
      icon: FolderIcon,
      count: projectCount,
    },
    {
      bg: "linear-gradient(135deg, #bbdefb 0%, #90caf9 100%)",
      iconColor: "#1565c0",
      label: "Active Projects",
      icon: WorkIcon,
      count: activeProjectsCount,
    },
    {
      bg: "linear-gradient(135deg, #ffe0b2 0%, #ffcc80 100%)",
      iconColor: "#ef6c00",
      label: "Pending Projects",
      icon: HourglassEmptyIcon,
      count: pendingProjectsCount,
    },
    {
      bg: "linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)",
      iconColor: "#2e7d32",
      label: "Completed Projects",
      icon: AssignmentTurnedInIcon,
      count: completedProjectsCount,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, background: "#f5f7fa", minHeight: "100vh" }}>
      <Box sx={{ position: "fixed", top: 16, right: 16, zIndex: 1000 }}>
        <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Logout
        </Button>
      </Box>

      <Typography variant="h4" fontWeight="bold" mb={4} color="primary">
        Admin Dashboard
      </Typography>

      <Typography variant="h5" sx={{ mb: 2, color: "#1976d2", fontWeight: "bold" }}>
        Projects
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "flex-start", mb: 5 }}>
        {projectCards.map(({ bg, iconColor, label, icon, count }, idx) => (
          <InfoCard key={idx} bg={bg} iconColor={iconColor} label={label} IconComponent={icon} count={count} />
        ))}
      </Box>

      <Typography variant="h5" sx={{ mb: 2, color: "#1976d2", fontWeight: "bold" }}>
        Employees
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "flex-start", mb: 5 }}>
        {employeeCards.map(({ bg, iconColor, label, icon, count }, idx) => (
          <InfoCard key={idx} bg={bg} iconColor={iconColor} label={label} IconComponent={icon} count={count} />
        ))}
      </Box>

      <Typography variant="h5" sx={{ mb: 2, color: "#1976d2", fontWeight: "bold" }}>
        Leaves
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "flex-start", mb: 5 }}>
        {leaveCards.map(({ bg, iconColor, label, icon, count }, idx) => (
          <InfoCard key={idx} bg={bg} iconColor={iconColor} label={label} IconComponent={icon} count={count} />
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ flex: "1 1 300px", minWidth: 300, maxWidth: 600, background: "#fff", p: 3, borderRadius: 3, boxShadow: 2 }}>
          <Typography variant="h6" gutterBottom>
            Employee Distribution by Department
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={employeeDeptData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {employeeDeptData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ flex: "1 1 300px", minWidth: 300, maxWidth: 600, background: "#fff", p: 3, borderRadius: 3, boxShadow: 2 }}>
          <Typography variant="h6" gutterBottom>
            Project Status Overview
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectStatusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
