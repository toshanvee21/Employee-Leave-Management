import express from "express";
import {
  createLeave,
  fetchAllLeaves,
  getLeavesByEmployee,
  updateLeaveStatus,
} from "../controllers/LeaveController.js";

const leaveRouter = express.Router();

leaveRouter.get("/fetchallleaves", fetchAllLeaves);
leaveRouter.post("/createleave", createLeave);
leaveRouter.patch("/updateleavestatus/:leaveId", updateLeaveStatus);
leaveRouter.get("/LeaveByEmployee/:employeeId", getLeavesByEmployee);

export { leaveRouter };
