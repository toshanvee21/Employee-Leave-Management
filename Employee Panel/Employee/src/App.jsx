import React, { useState, useEffect } from "react";
import MyAppBar from "./components/MyAppBar";
import Login from "./components/Login";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Project from "./components/Project";
import Leave from "./components/Leave";
import Profile from "./components/Profile";
import LeaveHistory from "./components/LeaveHistory";



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    setIsAuthenticated(!!loggedInUser);
  }, []);

  return (
    <div>
      <MyAppBar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      {!isAuthenticated ? (
        <Login setIsAuthenticated={setIsAuthenticated} />
      ) : (
        <div>
          {/* Your dashboard, project, leave, profile routes/components here */}
          <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/project" element={<Project />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/leavehistory" element={<LeaveHistory />} />
        <Route path="/login" element={<Login />} />
      </Routes>
        </div>
      )}
    </div>
  );
}

export default App;
