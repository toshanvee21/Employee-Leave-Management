import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Box, Typography, CircularProgress } from "@mui/material";

const Profile = () => {
  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const employeeRaw = localStorage.getItem("employee");
  const employee = employeeRaw ? JSON.parse(employeeRaw) : null;
  const employeeId = employee?._id || employee?.id;

  const totalLeavesQuota = employee?.totalLeaves ?? 24;

  const fetchLeaves = async () => {
    setError("");
    if (!employeeId) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/LeaveByEmployee/${employeeId}`
      );
      setLeaves(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch leaves.");
    }
  };

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
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch projects.");
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchLeaves(), fetchProjects()]);
      setLoading(false);
    };
    if (employeeId) {
      load();
    } else {
      setLoading(false);
      setError("Employee data missing. Please login.");
    }
  }, [employeeId]);

  const approvedLeaves = useMemo(
    () =>
      leaves.filter((l) => l.leaveStatus?.toLowerCase() === "approved").length,
    [leaves]
  );

  // Your project counts exactly as provided:
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

  const remainingLeaves = Math.max(0, totalLeavesQuota - approvedLeaves);

  if (!employee) {
    return (
      <Box sx={{ p: 5, textAlign: "center", fontFamily: "'Segoe UI', sans-serif" }}>
        <Typography variant="h6" color="error" mb={2}>
          You are not logged in.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/login")}>
          Go to Login
        </Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ p: 5, textAlign: "center" }}>
        <CircularProgress />
        <Typography mt={2}>Loading your profile data…</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 5, textAlign: "center" }}>
        <Typography color="error" mb={2}>
          {error}
        </Typography>
        <Button
          onClick={() => {
            setError("");
            setLoading(true);
            Promise.all([fetchLeaves(), fetchProjects()]).finally(() =>
              setLoading(false)
            );
          }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  const joinDate = employee.joiningDate
    ? new Date(employee.joiningDate)
    : null;
  const joinDateStr = joinDate ? joinDate.toLocaleDateString() : "N/A";

  return (
    <>
      <style>{`
        .profile {
          padding: 1px 60px;
          font-family: 'Segoe UI', sans-serif;
          background: #f1f5f9;
          min-height: 70vh;
        }
        .profile h1 {
          font-size: 2.2rem;
          margin-bottom: 30px;
          color: #1e293b;
        }
        .profile-card {
          background: white;
          display: flex;
          align-items: flex-start;
          gap: 30px;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
          margin-bottom: 40px;
        }
        .profile-card img {
          width: 160px;
          height: 200px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #e2e8f0;
        }
        .profile-card .info {
          flex: 1;
        }
        .profile-card .info h2 {
          margin: 0;
          font-size: 1.6rem;
          color: #0f172a;
        }
        .profile-card .info p {
          margin: 6px 0;
          color: #475569;
        }
        .stats {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }
        .stat {
          background: white;
          padding: 24px;
          border-radius: 14px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
          flex: 1 1 200px;
          text-align: center;
        }
        .stat h3 {
          font-size: 1rem;
          color: #64748b;
          margin-bottom: 10px;
        }
        .stat p {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
        }
      `}</style>

      <div className="profile">
        <h1>Employee Profile</h1>

        <div className="profile-card">
          {employee.empimage ? (
            <img
              src={`http://localhost:5000/${employee.empimage}`}
              alt={employee.fullName || "Profile Picture"}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/160";
              }}
            />
          ) : (
            <img src="https://via.placeholder.com/160" alt="No Profile" />
          )}

          <div className="info">
            <h2>Name: {employee.fullName}</h2>
            <p>
              <strong>Gender:</strong> {employee.gender}
            </p>
            <p>
              <strong>Department:</strong> {employee.department}
            </p>
            <p>
              <strong>Designation:</strong> {employee.designation}
            </p>
            <p>
              <strong>Email:</strong> {employee.email}
            </p>
            <p>
              <strong>Phone:</strong> {employee.phone}
            </p>
            <p>
              <strong>Address:</strong> {employee.address}
            </p>
            <p>
              <strong>Join Date:</strong> {joinDateStr}
            </p>
          </div>
        </div>

        <div className="stats">
          <div className="stat">
            <h3>Annual Leave Quota</h3>
            <p>{totalLeavesQuota}</p>
          </div>
          <div className="stat">
            <h3>Approved Leaves</h3>
            <p>{approvedLeaves}</p>
          </div>
          <div className="stat">
            <h3>Leaves Remaining</h3>
            <p>{remainingLeaves}</p>
          </div>
          <div className="stat">
            <h3>Active Projects</h3>
            <p>{inProgressCount}</p>
          </div>
          <div className="stat">
            <h3>Completed Projects</h3>
            <p>{completedCount}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
