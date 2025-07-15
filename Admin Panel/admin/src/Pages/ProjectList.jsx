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
import { deepPurple } from "@mui/material/colors";

const getProjectStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "green";
    case "In-Progress":
      return "orange";
    case "Pending":
      return "red";
    default:
      return "black";
  }
};

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [status, setStatus] = useState("");

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/fetchallprojects");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      alert("Failed to fetch projects.");
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/fetchAllEmployees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      alert("Failed to fetch employees.");
    }
  };

  const getEmployeeFullName = (employeeId) => {
    if (!employeeId) return "Unknown Employee";
    const id = typeof employeeId === "string" ? employeeId : employeeId._id;
    const employee = employees.find((emp) => emp._id === id);
    return employee ? employee.fullName : "Unknown Employee";
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

  const handleDeleteProject = async (projectId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

    try {
      await axios.delete("http://localhost:5000/api/deleteproject", {
        data: { projectId },
      });
      fetchProjects();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete project.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProjects(), fetchEmployees()]);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: deepPurple[500], mb: 3 }}>
        Project List
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="project list table">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bold" }}>No.</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Company Name</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Project Name</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Employee Name</TableCell>
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
                  <TableCell>{getEmployeeFullName(project.employeeid)}</TableCell>
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
                      sx={{ mr: 1 }}
                      onClick={() => handleEditClick(project)}
                      disabled={loading}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteProject(project._id)}
                      disabled={loading}
                    >
                      Delete
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
              <MenuItem value="In-Progress">In Progress</MenuItem>
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

export default ProjectList;
