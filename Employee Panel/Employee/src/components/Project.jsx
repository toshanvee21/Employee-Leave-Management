import React, { useState, useEffect } from "react";
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { deepPurple, green, orange, red } from "@mui/material/colors";

const getProjectStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return green[600];
    case "In-Progress":
      return orange[500];
    case "Pending":
      return red[500];
    default:
      return "gray";
  }
};

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const employee = JSON.parse(localStorage.getItem("employee"));
  const employeeId = employee?.id || "";

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [status, setStatus] = useState("");

  const fetchProjects = async () => {
    if (!employeeId) return;
    try {
      const response = await axios.get(`http://localhost:5000/api/projectsByEmployee/${employeeId}`);
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      alert("Failed to fetch projects.");
    }
  };

  const handleEditClick = (project) => {
    setSelectedProject(project);
    setStatus(project.status);
    setEditDialogOpen(true);
  };

  const handleUpdateProject = async () => {
    try {
      await axios.put("http://localhost:5000/api/updateprojectstatus", {
        projectId: selectedProject._id,
        projectStatus: status,
      });
      setEditDialogOpen(false);
      fetchProjects();
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update project.");
    }
  };

  useEffect(() => {
    if (!employeeId) {
      alert("Unauthorized access. Please log in.");
      return;
    }
    setLoading(true);
    fetchProjects().finally(() => setLoading(false));
  }, [employeeId]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: deepPurple[500], mb: 3 }}>
        My Assigned Projects
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : projects.length === 0 ? (
        <Typography>No projects assigned to you.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="project list table">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bold" }}>No.</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Company Name</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Project Name</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Description</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Project Type</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Assign Date</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project, index) => (
                <TableRow key={project._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{project.companyName}</TableCell>
                  <TableCell>{project.projectTitle}</TableCell>
                  <TableCell>{project.projectDescription}</TableCell>
                  <TableCell>{project.projectType}</TableCell>
                  <TableCell>{new Date(project.assignDate).toLocaleDateString()}</TableCell>
                  <TableCell
                    sx={{
                      color: getProjectStatusColor(project.status),
                      fontWeight: "bold",
                    }}
                  >
                    {project.status}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleEditClick(project)}
                      disabled={loading}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Project Status</DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} label="Status">
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In-Progress">In-Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateProject}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Project;
