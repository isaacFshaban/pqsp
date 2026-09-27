import type { SvgIconProps } from "@mui/material";
import { SvgIcon } from "@mui/material";
import { emblemAccent } from "../theme";

interface BankMarkIconProps extends SvgIconProps {
  /** Gold accent colour for the inner ring/keystone/keyhole — see
   *  InstitutionMarkIcon.tsx's matching prop for the full reasoning. */
  accentColor?: string;
}

/**
 * Bank account-type mark, v3 — same shield, ring, keystone and keyhole treatment as
 * InstitutionMarkIcon.tsx (see that file's comment for the full version history and
 * reasoning); only the interior glyph differs.
 *
 * Interior glyph is a pediment-and-columns pictogram — the conventional "bank" symbol (the
 * same composition as most icon sets' bank/account-balance glyph), kept deliberately
 * recognisable over novel per Jakob's Law.
 */
export default function BankMarkIcon({ accentColor = emblemAccent, ...props }: BankMarkIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        d="M4.5,6.2 C4.5,4.6 5.6,3.7 7.2,3.35 C9.3,2.75 14.7,2.75 16.8,3.35 C18.4,3.7 19.5,4.6 19.5,6.2 L19.5,10.8 C19.5,15.6 16.4,19.3 12,21.3 C7.6,19.3 4.5,15.6 4.5,10.8 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <path
        d="M6.1,6.9 C6.1,5.7 6.9,5.1 8.1,4.85 C9.7,4.5 14.3,4.5 15.9,4.85 C17.1,5.1 17.9,5.7 17.9,6.9 L17.9,10.5 C17.9,14.2 15.5,17.1 12,18.5 C8.5,17.1 6.1,14.2 6.1,10.5 Z"
        fill="none"
        stroke={accentColor}
        strokeWidth={0.7}
        opacity={0.9}
      />
      <circle cx={12} cy={3.0} r={0.55} fill={accentColor} />
      <polyline
        points="8.4,9.6 12,6.6 15.6,9.6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1={8} y1={9.6} x2={16} y2={9.6} stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
      <line x1={9.6} y1={10.9} x2={9.6} y2={14.3} stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
      <line x1={12} y1={10.9} x2={12} y2={14.3} stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
      <line x1={14.4} y1={10.9} x2={14.4} y2={14.3} stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
      <line x1={7.8} y1={14.6} x2={16.2} y2={14.6} stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
      <circle cx={12} cy={19.3} r={0.75} fill="none" stroke={accentColor} strokeWidth={0.55} />
      <path d="M11.65,19.9 L12.35,19.9 L12.6,20.9 L11.4,20.9 Z" fill={accentColor} />
    </SvgIcon>
  );
}
