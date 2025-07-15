import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, AppBar, Toolbar, IconButton, Typography,
  Drawer, List, ListItemIcon, ListItemText, ListItem
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ListAltIcon from "@mui/icons-material/ListAlt";
import EventNoteIcon from "@mui/icons-material/EventNote";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import GroupIcon from "@mui/icons-material/Group";
import LogoutIcon from '@mui/icons-material/Logout';

const AdminDrawer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleLogout = () => {
    // Clear user session or tokens here
    localStorage.clear();
    navigate("/login");
  };

  const LabelWithIcon = ({ icon, text }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {icon}
      <Typography sx={{ fontWeight: 600, fontSize: 16 }}>{text}</Typography>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #4e54c8, #8f94fb)",
          boxShadow: "0px 3px 10px rgba(0,0,0,0.3)"
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Admin Panel
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="logout"
            onClick={handleLogout}
            title="Logout"
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            width: 280,
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            p: 2,
            boxShadow: 5,
            transition: "all 0.3s ease-in-out",
            borderRight: "2px solid #ccc"
          }
        }}
      >
        <List>
          <ListItem
            onClick={() => { navigate("/"); handleDrawerClose(); }}
            sx={{
              cursor: "pointer",
              borderRadius: 2,
              "&:hover": {
                background: "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)",
                color: "white",
              },
              mb: 1,
            }}
          >
            <ListItemIcon>
              <DashboardIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Dashboard"
              primaryTypographyProps={{ fontWeight: "bold" }}
            />
          </ListItem>
        </List>

        <Box sx={{ minHeight: 400, mt: 2 }}>
          <SimpleTreeView
            sx={{
              "& .MuiTreeItem-root": {
                borderRadius: 2,
                my: 0.5,
                "& .MuiTreeItem-content": {
                  borderRadius: 2,
                  paddingLeft: "8px",
                },
              },
              "& .Mui-selected": {
                background: "#81ecec !important",
                color: "#2d3436",
              },
            }}
          >
            <TreeItem
              itemId="employees"
              label={<LabelWithIcon icon={<GroupIcon color="primary" />} text="Employees" />}
            >
              <TreeItem
                itemId="add"
                label={<LabelWithIcon icon={<AddCircleOutlineIcon />} text="Add Employees" />}
                onClick={() => { navigate("/add_employees"); handleDrawerClose(); }}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    background: "linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)",
                    color: "white",
                  },
                }}
              />
              <TreeItem
                itemId="list"
                label={<LabelWithIcon icon={<ListAltIcon />} text="Employees List" />}
                onClick={() => { navigate("/employees_list"); handleDrawerClose(); }}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    background: "linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)",
                    color: "white",
                  },
                }}
              />
            </TreeItem>

            <TreeItem
              itemId="leaves"
              label={<LabelWithIcon icon={<EventNoteIcon color="primary" />} text="Leaves" />}
            >
              <TreeItem
                itemId="approve_reject"
                label={<LabelWithIcon icon={<AddCircleOutlineIcon />} text="Approve/Reject" />}
                onClick={() => { navigate("/leaverequest"); handleDrawerClose(); }}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    background: "linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)",
                    color: "white",
                  },
                }}
              />
              <TreeItem
                itemId="leaves_list"
                label={<LabelWithIcon icon={<ListAltIcon />} text="Leaves History" />}
                onClick={() => { navigate("/leavehistory"); handleDrawerClose(); }}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    background: "linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)",
                    color: "white",
                  },
                }}
              />
            </TreeItem>

            <TreeItem
              itemId="project"
              label={<LabelWithIcon icon={<WorkOutlineIcon color="primary" />} text="Projects" />}
            >
              <TreeItem
                itemId="add_project"
                label={<LabelWithIcon icon={<AddCircleOutlineIcon />} text="Add Project" />}
                onClick={() => { navigate("/add-project"); handleDrawerClose(); }}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    background: "linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)",
                    color: "white",
                  },
                }}
              />
              <TreeItem
                itemId="project_list"
                label={<LabelWithIcon icon={<ListAltIcon />} text="Project List" />}
                onClick={() => { navigate("/projectlist"); handleDrawerClose(); }}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    background: "linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)",
                    color: "white",
                  },
                }}
              />
            </TreeItem>
          </SimpleTreeView>
        </Box>
      </Drawer>
    </>
  );
};

export default AdminDrawer;
