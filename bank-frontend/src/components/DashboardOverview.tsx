import type { ReactNode } from "react";
import { Box, Paper, Typography } from "@mui/material";
import type { FileTransfer } from "../types";
import DashboardStatCard from "./DashboardStatCard";
import DashboardQuickAction from "./DashboardQuickAction";
import RecentTransactions from "./RecentTransactions";

interface StatDef {
  icon: ReactNode;
  label: string;
  value: string;
}

interface QuickActionDef {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

interface DashboardOverviewProps {
  welcomeTitle: string;
  welcomeSubtitle: string;
  stats: StatDef[];
  quickActions: QuickActionDef[];
  transfers: FileTransfer[];
  currentUsername: string;
}

/**
 * The "Dashboard" landing section shared by both the institution and bank pages. Section
 * order — stats, then actions, then history — follows the reference layout's own structure
 * (state, then what you can do, then detail); only the branding and the specific numbers
 * shown were changed from that reference, not this ordering.
 *
 * Stats render as equal-weight peers rather than forcing one to dominate the Squint Test:
 * component-patterns.md's "don't give every stat tile equal weight" guidance applies when
 * tiles differ in actual importance, but Files Sent / Files Received / Compliance Proofs are
 * three genuinely equal counts with no natural primary among them — manufacturing a false
 * hierarchy would misrepresent the data. Hierarchy is instead established at the section
 * level (stats and actions both outrank in prominence the history section that follows).
 */
export default function DashboardOverview({
  welcomeTitle,
  welcomeSubtitle,
  stats,
  quickActions,
  transfers,
  currentUsername,
}: DashboardOverviewProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pb: 4 }}>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          {welcomeTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {welcomeSubtitle}
        </Typography>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: `repeat(${stats.length}, 1fr)` },
          gap: 2,
        }}
      >
        {stats.map((s) => (
          <DashboardStatCard key={s.label} icon={s.icon} label={s.label} value={s.value} />
        ))}
      </Box>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Quick Actions
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {quickActions.map((a) => (
            <DashboardQuickAction key={a.label} icon={a.icon} label={a.label} onClick={a.onClick} />
          ))}
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Recent Transactions
        </Typography>
        <RecentTransactions transfers={transfers} currentUsername={currentUsername} />
      </Paper>
    </Box>
  );
}
