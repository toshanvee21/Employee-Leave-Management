import express from "express";
import {
createEmployee,
deleteEmployee,
fetchAllEmployees,
updateEmployee,
loginEmployee
} from "../controllers/EmployeeController.js";
import { upload } from "../MiddleWare/FileUploadMiddleware.js";

const employeeRouter = express.Router();

employeeRouter.get("/fetchAllEmployees", fetchAllEmployees);
employeeRouter.post("/createEmployee",upload.single("empimage"), createEmployee);
employeeRouter.delete("/deleteEmployee", deleteEmployee);
employeeRouter.put("/updateEmployee", updateEmployee);
employeeRouter.post("/loginEmployee", loginEmployee);

export { employeeRouter };