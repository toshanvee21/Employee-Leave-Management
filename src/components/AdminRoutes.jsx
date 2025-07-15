import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";
import AdminDrawer from "./AdminDrawer";
import AddEmployee from "../Pages/AddEmployees";
import EmployeesList from "../Pages/EmployeesList";
import LeaveRequests from "../Pages/LeaveRequests";
import LeaveHistory from "../Pages/LeaveHistory";
import ProjectList from "../Pages/ProjectList";
import AddProject from "../Pages/AddProject";
import AdminLogin from "../components/AdminLogin";
import ProtectedRoute from "../components/ProtectedRoute";

const AdminRoutes = () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const location = useLocation();

  return (
    <>
      {isAdmin && location.pathname !== "/" && <AdminDrawer />}
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add_employees"
          element={
            <ProtectedRoute>
              <AddEmployee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees_list"
          element={
            <ProtectedRoute>
              <EmployeesList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaverequest"
          element={
            <ProtectedRoute>
              <LeaveRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leavehistory"
          element={
            <ProtectedRoute>
              <LeaveHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-project"
          element={
            <ProtectedRoute>
              <AddProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projectlist"
          element={
            <ProtectedRoute>
              <ProjectList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default AdminRoutes;
