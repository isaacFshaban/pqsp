import type { ReactNode } from "react";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";

// Shared by every page that renders this sidebar, so a page's own layout math (if it ever
// needs any) uses the same number instead of a locally-copied magic constant.
export const DRAWER_WIDTH = 240;

export interface DashboardNavItem<Section extends string> {
  section: Section;
  label: string;
  icon: ReactNode;
}

interface DashboardSidebarProps<Section extends string> {
  navItems: DashboardNavItem<Section>[];
  activeSection: Section;
  onSelect: (section: Section) => void;
  onLogout: () => void;
  // Account-type mark + label for the brand block. Required (not defaulted to the old
  // ShieldOutlinedIcon) so both call sites — DashboardPage and BankDashboardPage — stay
  // explicit about which account type's mark they're showing; a silent default would let
  // a future third dashboard forget to set this and inherit whichever type happened to be
  // last, rather than the compiler catching the omission.
  brandIcon: ReactNode;
  brandLabel: string;
}

/**
 * Shared left-nav chrome for every dashboard in the app (institution and bank today) — one
 * learned layout reused everywhere rather than two screens that merely resemble each other
 * (Jakob's Law: people carry expectations between screens of the *same* product just as much
 * as between products). A permanent, always-visible Drawer rather than a collapsible one:
 * the UI/UX skill's component-patterns.md Navigation guidance is to keep primary nav visible
 * whenever there's room and collapse only when space genuinely runs out — both dashboards
 * target desktop widths, and this mirrors the permanent Drawer the bank dashboard already
 * used before this change.
 *
 * The selected item gets a tinted background *and* bold weight *and* the brand colour — never
 * colour alone, per the same guidance — using navy specifically because theme.ts documents
 * navy as reserved for interactive elements ("so people learn what's clickable"), while
 * teal/success stays reserved for real transfer status elsewhere (StatusChip's "Received"
 * state) instead of being reused here just for decoration.
 *
 * Branding: brandIcon/brandLabel are passed in by each page rather than hardcoded here, so
 * the Institution and Bank dashboards can each show their own account-type mark (see
 * InstitutionMarkIcon / BankMarkIcon) instead of one shared icon standing in for both. Both
 * marks are this app's own design — a generic role label and a shield-family glyph, not a
 * new invented company brand or any real institution's — see the project's research notes
 * for why a reference screenshot's real bank branding and government title weren't
 * reproduced, and why the payslip template's logo was replaced for the same reason.
 */
export default function DashboardSidebar<Section extends string>({
  navItems,
  activeSection,
  onSelect,
  onLogout,
  brandIcon,
  brandLabel,
}: DashboardSidebarProps<Section>) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          borderRight: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, px: 2.5, py: 2.75 }}>
        {brandIcon}
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {brandLabel}
        </Typography>
      </Box>
      <Divider />

      {/* flexGrow claims the drawer's remaining height so Sign out lands at the bottom
          without a dedicated spacer element — MuiDrawer-paper is already a column flexbox
          by default. */}
      <List sx={{ flexGrow: 1, py: 1 }}>
        {navItems.map((item) => {
          const selected = activeSection === item.section;
          return (
            <ListItemButton
              key={item.section}
              selected={selected}
              onClick={() => onSelect(item.section)}
              sx={(t) => ({
                mx: 1,
                borderRadius: 1,
                "&.Mui-selected": {
                  bgcolor: alpha(t.palette.primary.main, 0.08),
                  "&:hover": { bgcolor: alpha(t.palette.primary.main, 0.14) },
                },
              })}
            >
              <ListItemIcon sx={{ minWidth: 40, color: selected ? "primary.main" : "text.secondary" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: selected ? 600 : 400, color: selected ? "primary.main" : "text.primary" }}
                  >
                    {item.label}
                  </Typography>
                }
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider />
      <List sx={{ py: 1 }}>
        <ListItemButton onClick={onLogout} sx={{ mx: 1, borderRadius: 1 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Sign out" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
