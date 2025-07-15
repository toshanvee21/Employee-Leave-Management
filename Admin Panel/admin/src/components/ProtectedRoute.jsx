import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin");
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  return children;
};

export default PrivateRoute;
