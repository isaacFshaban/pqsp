import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Box, Snackbar } from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import OutboxOutlinedIcon from "@mui/icons-material/OutboxOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import { useNavigate } from "react-router-dom";
import { downloadFile, getInbox, getOutbox } from "../api/client";
import { useAuth } from "../context/AuthContext";
import TransferTable from "../components/TransferTable";
import SlipComposerPanel from "../components/SlipComposerPanel";
import DashboardSidebar from "../components/DashboardSidebar";
import type { DashboardNavItem } from "../components/DashboardSidebar";
import BankMarkIcon from "../components/BankMarkIcon";
import DashboardHeader from "../components/DashboardHeader";
import DashboardOverview from "../components/DashboardOverview";
import type { FileTransfer } from "../types";

type Section = "dashboard" | "inbox" | "outbox" | "compose";

const NAV_ITEMS: { section: Section; label: string; icon: ReactNode }[] = [
  { section: "dashboard", label: "Dashboard", icon: <DashboardOutlinedIcon /> },
  { section: "inbox", label: "Inbox", icon: <InboxOutlinedIcon /> },
  { section: "outbox", label: "Outbox", icon: <OutboxOutlinedIcon /> },
  { section: "compose", label: "Compose", icon: <DescriptionOutlinedIcon /> },
];

export default function BankDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [section, setSection] = useState<Section>("dashboard");
  const [inbox, setInbox] = useState<FileTransfer[]>([]);
  const [outbox, setOutbox] = useState<FileTransfer[]>([]);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState<string | null>(null);

  const refresh = useCallback(() => {
    if (!user) return;
    getInbox().then(setInbox).catch(() => setSnackbar("Failed to load inbox"));
    getOutbox().then(setOutbox).catch(() => setSnackbar("Failed to load outbox"));
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Real counts only — mirrors DashboardPage's institution-side stats so both dashboards stay
  // predictable (same three metric definitions apply equally to either account type, since
  // both send and receive transfers through the same FileTransfer model).
  const complianceProofCount = useMemo(
    () => [...inbox, ...outbox].filter((t) => t.complianceProofAvailable).length,
    [inbox, outbox],
  );

  const navItems: DashboardNavItem<Section>[] = useMemo(
    () =>
      NAV_ITEMS.map((item) => ({
        ...item,
        label:
          item.section === "inbox"
            ? `Inbox (${inbox.length})`
            : item.section === "outbox"
              ? `Outbox (${outbox.length})`
              : item.label,
      })),
    [inbox.length, outbox.length],
  );

  if (!user) {
    navigate("/bank-login", { replace: true });
    return null;
  }

  async function handleDownload(transfer: FileTransfer) {
    if (!user) return;
    setDownloadingId(transfer.transferId);
    try {
      await downloadFile(transfer.transferId, transfer.originalFilename);
      refresh();
    } catch (err) {
      setSnackbar(err instanceof Error ? err.message : "Download failed");
    } finally {
      setDownloadingId(null);
    }
  }

  function handleLogout() {
    logout();
    navigate("/bank-login", { replace: true });
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <DashboardSidebar
        navItems={navItems}
        activeSection={section}
        onSelect={setSection}
        onLogout={handleLogout}
        brandIcon={<BankMarkIcon color="secondary" />}
        brandLabel="Bank Portal"
      />

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, px: 4 }}>
        <DashboardHeader
          breadcrumb="Bank Portal › Dashboard"
          title="Bank Dashboard"
          userName={user.username}
        />

        {section === "dashboard" && (
          <DashboardOverview
            welcomeTitle={`Welcome back, ${user.username}`}
            welcomeSubtitle="Here's an overview of your institution's file transfer activity."
            stats={[
              { icon: <OutboxOutlinedIcon />, label: "Files Sent", value: String(outbox.length) },
              { icon: <InboxOutlinedIcon />, label: "Files Received", value: String(inbox.length) },
              {
                icon: <VerifiedUserOutlinedIcon />,
                label: "Compliance Proofs",
                value: String(complianceProofCount),
              },
            ]}
            // Only 3 real actions here, not 4: unlike the institution dashboard, this account
            // type has no SendFileDialog / raw-file-upload support (the pre-existing bank
            // dashboard never wired one up), so a 4th tile isn't invented just to force a
            // matching tile count against the institution page or a reference layout.
            quickActions={[
              {
                icon: <DescriptionOutlinedIcon />,
                label: "Compose Slip",
                onClick: () => setSection("compose"),
              },
              { icon: <InboxOutlinedIcon />, label: "View Inbox", onClick: () => setSection("inbox") },
              { icon: <OutboxOutlinedIcon />, label: "View Outbox", onClick: () => setSection("outbox") },
            ]}
            transfers={[...inbox, ...outbox]}
            currentUsername={user.username}
          />
        )}

        {section === "inbox" && (
          <Box sx={{ pb: 4 }}>
            <TransferTable
              mode="inbox"
              transfers={inbox}
              onDownload={handleDownload}
              downloadingId={downloadingId}
            />
          </Box>
        )}

        {section === "outbox" && (
          <Box sx={{ pb: 4 }}>
            <TransferTable mode="outbox" transfers={outbox} />
          </Box>
        )}

        {section === "compose" && (
          <Box sx={{ pb: 4 }}>
            <SlipComposerPanel
              currentUser={user}
              onSent={() => {
                setSnackbar("Slip generated and sent");
                refresh();
                setSection("outbox");
              }}
            />
          </Box>
        )}
      </Box>

      <Snackbar
        open={snackbar !== null}
        autoHideDuration={3000}
        onClose={() => setSnackbar(null)}
        message={snackbar}
      />
    </Box>
  );
}
