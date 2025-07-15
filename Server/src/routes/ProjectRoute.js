import express from "express";
import { createProject, fetchAllProjects, deleteProject, updateProjectStatus, getProjectByEmployee } from "../controllers/ProjectController.js";

const projectRouter = express.Router();

projectRouter.post("/createproject", createProject);
projectRouter.get("/fetchallprojects", fetchAllProjects);
projectRouter.delete("/deleteproject", deleteProject);
projectRouter.put("/updateprojectstatus", updateProjectStatus);
projectRouter.get("/projectsByEmployee/:employeeId", getProjectByEmployee);

export { projectRouter };