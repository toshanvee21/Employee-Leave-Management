import { Project } from "../models/ProjectSchema.js";

// Create a new project
const createProject = async (req, res) => {
  const projectData = req.body;
  console.log("Creating Project:", projectData);

  try {
    const result = await Project.create(projectData);
    res.status(200).json({
      data: result,
      message: "Project created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create project",
      error: error.message,
    });
  }
};

// Fetch all projects
const fetchAllProjects = async (req, res) => {
  try {
    const result = await Project.find().populate("employeeid", "fullName");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete project by ID
const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.body;
    await Project.findByIdAndDelete(projectId);
    res.status(200).json({
      message: "Project Deleted",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error:", error.message);
  }
};

// Update project status
const updateProjectStatus = async (req, res) => {
  try {
    const { projectId, projectStatus } = req.body;
    const result = await Project.findByIdAndUpdate(
      projectId,
      { status: projectStatus },
      { new: true }
    );
    res.status(200).json({
      data: result,
      message: "Project Status is Updated",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get projects assigned to an employee (employeeId from URL param)
const getProjectByEmployee = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const result = await Project.find({ employeeid: employeeId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get projects",
      error: error.message,
    });
  }
};

export {
  createProject,
  fetchAllProjects,
  deleteProject,
  updateProjectStatus,
  getProjectByEmployee,
};
