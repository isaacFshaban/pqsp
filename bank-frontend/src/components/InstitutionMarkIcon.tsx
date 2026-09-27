import type { SvgIconProps } from "@mui/material";
import { SvgIcon } from "@mui/material";
import { emblemAccent } from "../theme";

interface InstitutionMarkIconProps extends SvgIconProps {
  /** Gold accent colour for the inner ring/keystone/keyhole. Defaults to the
   *  white-background tone (emblemAccent); the login pages override this to
   *  glassTokens.emblemAccent (a lighter tint) since the base gold is too
   *  close in value to their dark badge background — see theme.ts. */
  accentColor?: string;
}

/**
 * Institution account-type mark, v3. Built in three passes based on direct feedback on the
 * earlier versions:
 *  v1: straight-edged shield outline, document+checkmark glyph, single navy/teal colour.
 *  v2 ("premium professional"): replaced the straight polygon with a refined curved shield
 *      (cubic beziers) plus a faint inner ring — the double-line "seal" cue crests and
 *      medals use.
 *  v3 (this one — "a [something] signifying security", "don't stick to blue only", "as it
 *      would be designed by a human"): added a small keyhole detail at the shield's point
 *      (a literal, unambiguous security signifier alongside the shield's more abstract one —
 *      and the same device this app's own SecurityHighlights component already uses) and a
 *      gold "keystone" dot at the top; the inner ring is now gold instead of low-opacity
 *      navy. Gold+navy is a deliberate second colour family, not the app's reserved
 *      teal/amber (those stay meaningful for real transfer-status — see theme.ts) — chosen
 *      because it's the classic pairing on crests, medals and premium seals, which is also
 *      why the keyhole/keystone/ring read as one coordinated "emblem" rather than three
 *      unrelated additions.
 *
 * Interior glyph is a document with a checkmark: it stands for issuing/signing a payslip,
 * the actual function of an Institution account here, rather than an abstract shape.
 *
 * Every path uses stroke="currentColor" for the shield/glyph (fill="none") so this inherits
 * color/fontSize from props exactly like every other icon in this app — e.g.
 * <InstitutionMarkIcon color="secondary" /> in the sidebar. Only the gold accent elements use
 * an explicit colour (accentColor), since they're a fixed second hue, not meant to follow
 * the currentColor prop the way the primary shape does.
 */
export default function InstitutionMarkIcon({ accentColor = emblemAccent, ...props }: InstitutionMarkIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      {/* Outer shield: refined curved silhouette (cubic beziers). */}
      <path
        d="M4.5,6.2 C4.5,4.6 5.6,3.7 7.2,3.35 C9.3,2.75 14.7,2.75 16.8,3.35 C18.4,3.7 19.5,4.6 19.5,6.2 L19.5,10.8 C19.5,15.6 16.4,19.3 12,21.3 C7.6,19.3 4.5,15.6 4.5,10.8 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      {/* Inner concentric ring, gold — the double-line "seal/emblem" cue used on official
          crests, coins and medals. */}
      <path
        d="M6.1,6.9 C6.1,5.7 6.9,5.1 8.1,4.85 C9.7,4.5 14.3,4.5 15.9,4.85 C17.1,5.1 17.9,5.7 17.9,6.9 L17.9,10.5 C17.9,14.2 15.5,17.1 12,18.5 C8.5,17.1 6.1,14.2 6.1,10.5 Z"
        fill="none"
        stroke={accentColor}
        strokeWidth={0.7}
        opacity={0.9}
      />
      {/* Keystone: a small gold dot at the shield's top, like a rivet or set jewel. */}
      <circle cx={12} cy={3.0} r={0.55} fill={accentColor} />
      <rect
        x={9}
        y={7.6}
        width={6}
        height={6.6}
        rx={0.5}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
      />
      <polyline
        points="10.1,10.9 11.3,12.1 13.9,9.2"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Keyhole at the shield's point: a literal security signifier alongside the shield
          itself, echoing the lock icon SecurityHighlights.tsx already uses elsewhere. */}
      <circle cx={12} cy={19.3} r={0.75} fill="none" stroke={accentColor} strokeWidth={0.55} />
      <path d="M11.65,19.9 L12.35,19.9 L12.6,20.9 L11.4,20.9 Z" fill={accentColor} />
    </SvgIcon>
  );
}
