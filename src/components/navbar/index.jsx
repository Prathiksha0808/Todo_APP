import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import TodayIcon from "@mui/icons-material/Today";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";

const StyledAppBar = styled(AppBar)({
  backgroundColor: "#2563eb",
});

const NavToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

const NavActions = styled(Box)({
  display: "flex",
  gap: "8px",
});

const NavTitle = styled(Typography)({
  fontWeight: 600,
});

const Navbar = () => {
  return (
    <StyledAppBar position="static">
      <NavToolbar>
        <NavTitle variant="h6">Todo App</NavTitle>

        <NavActions>
          <IconButton color="inherit">
            <TodayIcon />
          </IconButton>

          <IconButton color="inherit">
            <EventNoteIcon />
          </IconButton>

          <IconButton color="inherit">
            <CheckCircleOutlineIcon />
          </IconButton>

          <IconButton color="inherit">
            <AccountCircleIcon />
          </IconButton>
        </NavActions>
      </NavToolbar>
    </StyledAppBar>
  );
};

export default Navbar;
