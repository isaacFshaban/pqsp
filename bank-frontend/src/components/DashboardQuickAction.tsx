import type { ReactNode } from "react";
import { Box, ButtonBase, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

interface DashboardQuickActionProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

/**
 * One shortcut tile in the dashboard's Quick Actions panel. All tiles on a given dashboard
 * are genuinely equal peers (different tasks, not two ways to do the same thing — contrast
 * with the outbox empty state's Compose/Send button pair, which *is* that kind of pair and
 * stays equally-weighted for that reason), so every tile here gets identical visual weight;
 * nothing here should read as more "correct" than the others (07-buttons.md's "genuinely
 * equal importance" guidance, already applied once elsewhere in this app).
 *
 * The icon circle uses the brand navy tint because these tiles are genuinely interactive —
 * theme.ts reserves navy specifically for interactive elements "so people learn what's
 * clickable," which is exactly what a quick-action tile is (unlike the neutral, static
 * DashboardStatCard).
 */
export default function DashboardQuickAction({ icon, label, onClick }: DashboardQuickActionProps) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={(t) => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        width: 132,
        py: 2.5,
        px: 1.5,
        borderRadius: 1,
        border: "1px solid",
        borderColor: t.palette.divider,
        "&:hover": { bgcolor: alpha(t.palette.primary.main, 0.04) },
      })}
    >
      <Box
        sx={(t) => ({
          width: 44,
          height: 44,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: alpha(t.palette.primary.main, 0.08),
          color: t.palette.primary.main,
        })}
      >
        {icon}
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 600, textAlign: "center" }}>
        {label}
      </Typography>
    </ButtonBase>
  );
}
