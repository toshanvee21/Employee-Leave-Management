import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MyAppBar from './MyAppBar';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Project from './Project';
import Leave from './Leave';
import LeaveHistory from './LeaveHistory';
import Register from './Register';
import Login from './Login';

const MyRoutes = () => {
  return (
    <div>
      <MyAppBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/project" element={<Project />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/leavehistory" element={<LeaveHistory />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default MyRoutes;
