import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    joiningDate: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, email, phone, department, designation, joiningDate, password } = formData;
    if (!fullName || !email || !phone || !department || !designation || !joiningDate || !password) {
      setError('All fields are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/createEmployee', formData);
      setSuccessMessage(response.data.message || 'Employee registered successfully!');
      setError('');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        department: '',
        designation: '',
        joiningDate: '',
        password: '',
      });
    } catch (err) {
      setError('Failed to register user.');
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper
        elevation={4}
        sx={{
          borderRadius: 3,
          p: 4,
          backgroundColor: '#fff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Typography variant="h4" align="center" color="#1877f2" fontWeight="bold" gutterBottom>
          Register Employee
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            sx={{ mb: 2 }}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            sx={{ mb: 2 }}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            sx={{ mb: 2 }}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            sx={{ mb: 2 }}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            sx={{ mb: 2 }}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Joining Date"
            name="joiningDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.joiningDate}
            onChange={handleChange}
            sx={{ mb: 2 }}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            sx={{ mb: 3 }}
            variant="outlined"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: '#1877f2',
              fontWeight: 'bold',
              fontSize: '16px',
              ':hover': { backgroundColor: '#165edb' },
              py: 1.5,
              borderRadius: 2,
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Paper>

      <Typography align="center" sx={{ mt: 3 }} color="text.secondary">
        Already have an Register? <a href="/login" style={{ color: '#1877f2', textDecoration: 'none' }}>Log In</a>
      </Typography>
    </Container>
  );
};

export default Register;
