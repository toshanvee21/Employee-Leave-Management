import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const isEmailValid = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!isEmailValid(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (!password.trim()) {
      setMessage("Password cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/loginEmployee", {
        email,
        password,
      });

      const employeeData = res.data.data;

      localStorage.setItem("employee", JSON.stringify(employeeData));
      localStorage.setItem("employeeId", employeeData._id);
      console.log(localStorage.getItem("employeeId"));
      setIsAuthenticated(true);
      setMessage("Login successful!");

      navigate("/");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
      setPassword(""); // Clear password on error
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = email.trim() !== "" && password.trim() !== "" && isEmailValid(email);

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{
        minHeight: "75vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
      }}
    >
      <Paper
        elevation={5}
        sx={{ p: 4, width: "100%", maxWidth: 400, borderRadius: 3 }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          Employee Login
        </Typography>

        {message && (
          <Alert
            severity={message === "Login successful!" ? "success" : "error"}
            sx={{ mb: 2 }}
          >
            {message}
          </Alert>
        )}

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          margin="normal"
          autoComplete="email"
          disabled={loading}
          error={email && !isEmailValid(email)}
          helperText={email && !isEmailValid(email) ? "Invalid email format" : ""}
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          margin="normal"
          autoComplete="current-password"
          disabled={loading}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={loading || !isFormValid}
          sx={{
            mt: 3,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
            textTransform: "none",
            borderRadius: 2,
            backgroundColor: "#1976d2",
            "&:hover": { backgroundColor: "#1565c0" },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
