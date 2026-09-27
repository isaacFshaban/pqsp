import { Avatar, Box, Typography } from "@mui/material";

interface DashboardHeaderProps {
  breadcrumb: string;
  title: string;
  userName: string;
}

function initialsOf(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

/**
 * Three-column page header: a breadcrumb for orientation (left), the page title centred and
 * bold as the single most prominent text on the row (Squint Test), and a "Welcome, {name}" +
 * avatar identity block (right). Purely informational — no engagement/growth mechanism — so
 * the UI/UX skill's ethics-check step doesn't apply here (05-ethics-and-responsible-design.md
 * scopes that step to features with a conversion/retention goal; a page header has none).
 */
export default function DashboardHeader({ breadcrumb, title, userName }: DashboardHeaderProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", py: 2.5 }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {breadcrumb}
        </Typography>
      </Box>
      <Box sx={{ flex: 1, textAlign: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1.5 }}>
        <Typography variant="body2" color="text.secondary">
          Welcome, {userName}
        </Typography>
        <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main", fontSize: "0.85rem", fontWeight: 700 }}>
          {initialsOf(userName)}
        </Avatar>
      </Box>
    </Box>
  );
}
