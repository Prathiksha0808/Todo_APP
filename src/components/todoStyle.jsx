import { styled } from "@mui/system";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
// Styles

export const TodoContainer = styled(Box)(({ isdue }) => ({
  padding: "16px",
  borderRadius: "12px",
  marginTop: "16px",
  display: "flex",
  alignItems: "center",
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderLeft: isdue === "true" ? "6px solid #e53e3e" : "6px solid #48bb78",
  transition: "all 0.2s ease-in-out",

  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
  },
}));

export const ButtonContainer = styled(Box)({
  display: "flex",
  gap: "8px",
  alignItems: "center",
});

export const FormContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "14px",
});

export const EditForm = styled("form")({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  width: "100%",
});

export const PageWrapper = styled(Box)({
  minHeight: "100vh",
  backgroundColor: "#f5f7fb", // soft professional background
});

export const Wrapper = styled(Box)({
  // Changed Box to Paper for automatic shadow
  padding: "32px",
  borderRadius: "16px",
  boxShadow: "0px 15px 35px rgba(0,0,0,0.05)",
  backgroundColor: "#ffffff",
});

export const StyledAppBar = styled(AppBar)({
  backgroundColor: "#2563eb",
});

export const MainCard = styled(Box)({
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  padding: "24px",
  marginTop: "32px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
});

export const NavToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

export const NavActions = styled(Box)({
  display: "flex",
  gap: "8px",
});

export const NavTitle = styled(Typography)({
  fontWeight: 600,
});
