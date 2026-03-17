import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { Fragment, useState } from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-pink-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          KIDS-OWN
        </Link>
        <nav className="flex items-center space-x-4">
          <DropdownMenu />
        </nav>
      </div>
    </header>
  );
};

export default Header;

const DropdownMenu = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (action: string) => {
    switch (action) {
      case "logout":
        setUser(null);
        localStorage.clear();
        console.log("the log out option clicked");
        break;
      case "settings":
        console.log("settings option clicked!");
        break;
      case "profile":
        console.log("profile option clicked");
        break;

      default:
        break;
    }
  };

  return (
    <Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Typography sx={{ minWidth: 100 }} onClick={() => navigate("/")}>
          Home
        </Typography>
        <Typography
          sx={{ minWidth: 100 }}
          onClick={() => navigate("/products")}
        >
          Products
        </Typography>
        <Typography
          sx={{ minWidth: 100 }}
          onClick={() => navigate("/contacts")}
        >
          Contact
        </Typography>
        <Typography sx={{ minWidth: 100 }} onClick={() => navigate("/cart")}>
          Cart
        </Typography>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            {user ? (
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.name.charAt(0)}
              </Avatar>
            ) : (
              <button className="" onClick={() => navigate("/login")}>
                Login
              </button>
            )}
          </IconButton>
        </Tooltip>
      </Box>
      {user && (
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={() => handleItemClick("profile")}>
            <Avatar /> Profile
          </MenuItem>
          <MenuItem onClick={() => handleItemClick("myaccount")}>
            <Avatar /> My account
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleItemClick("another")}>
            <ListItemIcon>
              <PersonAdd fontSize="small" />
            </ListItemIcon>
            Add another account
          </MenuItem>
          <MenuItem onClick={() => handleItemClick("settings")}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem onClick={() => handleItemClick("logout")}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      )}
    </Fragment>
  );
};
