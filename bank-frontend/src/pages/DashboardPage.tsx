import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Box, Snackbar } from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import OutboxOutlinedIcon from "@mui/icons-material/OutboxOutlined";
import SendIcon from "@mui/icons-material/SendOutlined";
import DescriptionIcon from "@mui/icons-material/DescriptionOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import { useNavigate } from "react-router-dom";
import { downloadFile, getInbox, getOutbox } from "../api/client";
import { useAuth } from "../context/AuthContext";
import TransferTable from "../components/TransferTable";
import SendFileDialog from "../components/SendFileDialog";
import SlipComposerDialog from "../components/SlipComposerDialog";
import DashboardSidebar from "../components/DashboardSidebar";
import type { DashboardNavItem } from "../components/DashboardSidebar";
import InstitutionMarkIcon from "../components/InstitutionMarkIcon";
import DashboardHeader from "../components/DashboardHeader";
import DashboardOverview from "../components/DashboardOverview";
import type { FileTransfer } from "../types";

type Section = "dashboard" | "inbox" | "outbox";

const NAV_ITEMS: { section: Section; label: string; icon: ReactNode }[] = [
  { section: "dashboard", label: "Dashboard", icon: <DashboardOutlinedIcon /> },
  { section: "inbox", label: "Inbox", icon: <InboxOutlinedIcon /> },
  { section: "outbox", label: "Outbox", icon: <OutboxOutlinedIcon /> },
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [section, setSection] = useState<Section>("dashboard");
  const [inbox, setInbox] = useState<FileTransfer[]>([]);
  const [outbox, setOutbox] = useState<FileTransfer[]>([]);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [slipDialogOpen, setSlipDialogOpen] = useState(false);
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

  // Real counts only — see DashboardOverview's doc comment on why these three stats aren't
  // ranked against each other, and RecentTransactions' comment on why there's no fabricated
  // "Amount" figure anywhere on this page.
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
    // Guarded by the router, but keeps this component safe to render standalone too.
    navigate("/login", { replace: true });
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
    navigate("/login", { replace: true });
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <DashboardSidebar
        navItems={navItems}
        activeSection={section}
        onSelect={setSection}
        onLogout={handleLogout}
        brandIcon={<InstitutionMarkIcon color="secondary" />}
        brandLabel="Institution Portal"
      />

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, px: 4 }}>
        <DashboardHeader
          breadcrumb="Institution Portal › Dashboard"
          title="Institution Dashboard"
          userName={user.username}
        />

        {section === "dashboard" && (
          <DashboardOverview
            welcomeTitle={`Welcome back, ${user.username}`}
            welcomeSubtitle="Here's what's happening with your file transfers today."
            stats={[
              { icon: <OutboxOutlinedIcon />, label: "Files Sent", value: String(outbox.length) },
              { icon: <InboxOutlinedIcon />, label: "Files Received", value: String(inbox.length) },
              {
                icon: <VerifiedUserOutlinedIcon />,
                label: "Compliance Proofs",
                value: String(complianceProofCount),
              },
            ]}
            quickActions={[
              { icon: <DescriptionIcon />, label: "Compose Slip", onClick: () => setSlipDialogOpen(true) },
              { icon: <SendIcon />, label: "Send File", onClick: () => setSendDialogOpen(true) },
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
            <TransferTable
              mode="outbox"
              transfers={outbox}
              onComposeSlip={() => setSlipDialogOpen(true)}
              onSendFile={() => setSendDialogOpen(true)}
            />
          </Box>
        )}
      </Box>

      <SendFileDialog
        open={sendDialogOpen}
        onClose={() => setSendDialogOpen(false)}
        onSent={() => {
          setSnackbar("File sent");
          refresh();
        }}
        currentUser={user}
      />

      <SlipComposerDialog
        open={slipDialogOpen}
        onClose={() => setSlipDialogOpen(false)}
        onSent={() => {
          setSnackbar("Slip generated and sent");
          refresh();
        }}
        currentUser={user}
      />

      <Snackbar
        open={snackbar !== null}
        autoHideDuration={3000}
        onClose={() => setSnackbar(null)}
        message={snackbar}
      />
    </Box>
  );
}
