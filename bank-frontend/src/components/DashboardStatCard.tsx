import type { ReactNode } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

interface DashboardStatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
}

/**
 * A single at-a-glance count (e.g. "Files Sent: 12"). Outlined, not shadow-elevated: every
 * existing Paper in this app's dashboards uses `variant="outlined"` (see the pre-existing
 * inbox/outbox panel), so that in-app precedent wins over the UI/UX skill's generic "Raised
 * shadow" card default — Jakob's Law applies within a product just as much as across products.
 *
 * The icon circle uses a neutral grey tint rather than the brand navy or teal: navy is
 * reserved elsewhere in this app for interactive elements (see DashboardSidebar's selected
 * state), and teal doubles as this app's real transfer-status colour (StatusChip's "Received"
 * state) — a static, non-interactive, non-status count like this shouldn't borrow either
 * colour's meaning just for decoration (component-patterns.md: system/brand colours carry
 * meaning, never decorative).
 */
export default function DashboardStatCard({ icon, label, value }: DashboardStatCardProps) {
  return (
    <Paper variant="outlined" sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
      <Box
        sx={(t) => ({
          width: 48,
          height: 48,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          bgcolor: alpha(t.palette.text.primary, 0.06),
          color: "text.secondary",
        })}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" color="text.secondary" noWrap>
          {label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      </Box>
    </Paper>
  );
}
