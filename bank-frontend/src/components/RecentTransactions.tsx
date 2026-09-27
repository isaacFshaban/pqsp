import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import type { FileTransfer } from "../types";
import StatusChip from "./StatusChip";
import { dataFontFamily } from "../theme";

interface RecentTransactionsProps {
  transfers: FileTransfer[];
  currentUsername: string;
  /** @default 5 */
  limit?: number;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString();
}

function truncateHash(hash: string | undefined): string {
  if (!hash) return "—";
  return hash.length > 14 ? `${hash.slice(0, 14)}…` : hash;
}

/**
 * A dashboard-landing preview of recent activity — inbox and outbox combined, newest first,
 * capped at `limit` (the full history lives on the Inbox/Outbox pages this only teases).
 *
 * No Amount column: this app has no balance/ledger concept — it transfers signed documents,
 * not money — so a currency figure here would have to be invented, which was deliberately
 * not done. The Reference column reuses each transfer's real fileHash instead of a synthetic
 * transaction id, for the same reason: a real cryptographic value the app already computes,
 * not a fabricated-looking one. component-patterns.md's Dashboards rule to right-align
 * numeric data doesn't apply to any column here — Date isn't a magnitude to compare,
 * Reference is a truncated hash string, and Status is a chip.
 */
export default function RecentTransactions({ transfers, currentUsername, limit = 5 }: RecentTransactionsProps) {
  const recent = [...transfers]
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
    .slice(0, limit);

  if (recent.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          No transfers yet.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Reference</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recent.map((t) => {
            const outgoing = t.senderUsername === currentUsername;
            return (
              <TableRow key={t.transferId} hover>
                <TableCell sx={{ fontFamily: dataFontFamily, fontSize: "0.8rem" }}>
                  {formatDate(t.sentAt)}
                </TableCell>
                <TableCell>
                  {outgoing ? `Sent to ${t.receiverUsername}` : `Received from ${t.senderUsername}`}
                  <Typography component="span" variant="body2" color="text.secondary">
                    {" — "}
                    {t.originalFilename}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontFamily: dataFontFamily, fontSize: "0.8rem", color: "text.secondary" }}>
                  {truncateHash(t.fileHash)}
                </TableCell>
                <TableCell>
                  <StatusChip status={t.status} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
