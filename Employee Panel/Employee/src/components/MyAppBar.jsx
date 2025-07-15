import React from 'react';
import { AppBar, Toolbar, Typography, Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import LogoutIcon from '@mui/icons-material/Logout';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import LoginIcon from '@mui/icons-material/Login';
import HistoryIcon from '@mui/icons-material/History';
const MyAppBar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setIsAuthenticated(false);
    navigate("/");
  };

  // Items to show after login
  const authNavItems = [
    { label: 'Dashboard', path: "/", icon: <DashboardIcon /> },
    { label: 'Project', path: '/project', icon: <WorkIcon /> },
    { label: 'Leave', path: '/leave', icon: <BeachAccessIcon /> },
    { label: 'Leave History', path: '/leavehistory', icon: <HistoryIcon  /> },
    { label: 'Profile', path: '/profile', icon: <PersonIcon /> },

  ];

  // Items to show before login
  const guestNavItems = [
    { label: 'Login', path: '/login', icon: <LoginIcon /> },
    // You can add Register or other links here if needed
  ];

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1877f2', px: 2 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', cursor: 'pointer', color: 'white' }}
          onClick={() => navigate('/')}
        >
          Employee
        </Typography>

        <Stack direction="row" spacing={1.5} alignItems="center">
          {(isAuthenticated ? authNavItems : guestNavItems).map((item) => (
            <Button
              key={item.label}
              onClick={() => navigate(item.path)}
              startIcon={item.icon}
              sx={{
                color: 'white',
                backgroundColor: 'transparent',
                borderRadius: '20px',
                px: 2,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                },
              }}
            >
              {item.label}
            </Button>
          ))}

          {isAuthenticated && (
            <Button
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{
                color: 'white',
                backgroundColor: '#e53935',
                borderRadius: '20px',
                px: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#d32f2f',
                },
              }}
            >
              Logout
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default MyAppBar;
