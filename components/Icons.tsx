/* Ультра-тонкие линейные иконки (без Lucide/Material). 1.6px stroke. */
import type { SVGProps } from "react";

const base = {
  viewBox: "0 0 24 24",
  "aria-hidden": true,
  focusable: false,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const IconHome = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M3.5 11 12 4l8.5 7" /><path d="M5.5 9.5V20h13V9.5" /></svg>
);
export const IconSearch = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-3.8-3.8" /></svg>
);
export const IconHeart = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M12 20.5 4.4 12.9a4.7 4.7 0 0 1 6.65-6.65l.95.95.95-.95a4.7 4.7 0 0 1 6.65 6.65L12 20.5Z" /></svg>
);
export const IconHeartFill = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}><path d="M12 20.5 4.4 12.9a4.7 4.7 0 0 1 6.65-6.65l.95.95.95-.95a4.7 4.7 0 0 1 6.65 6.65L12 20.5Z" /></svg>
);
export const IconGrid = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><rect x="4" y="4" width="7" height="7" rx="1.8" /><rect x="13" y="4" width="7" height="7" rx="1.8" /><rect x="4" y="13" width="7" height="7" rx="1.8" /><rect x="13" y="13" width="7" height="7" rx="1.8" /></svg>
);
export const IconTicket = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M4 9.5A2.5 2.5 0 0 1 6.5 7H18a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 16.5v-7Z" /><path d="M9 7v10" strokeDasharray="2 2.4" /></svg>
);
export const IconArrow = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M5 12h13" /><path d="m12.5 5.5 6.5 6.5-6.5 6.5" /></svg>
);
export const IconArrowUpRight = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>
);
export const IconClose = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="m6 6 12 12M18 6 6 18" /></svg>
);
export const IconSun = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v2.3M12 19.2v2.3M21.5 12h-2.3M4.8 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9 5.3 5.3" /></svg>
);
export const IconMoon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M19.5 14.8A8.5 8.5 0 0 1 9.2 4.5a8.5 8.5 0 1 0 10.3 10.3Z" /></svg>
);
export const IconChevron = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="m9 6 6 6-6 6" /></svg>
);
export const IconShare = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><circle cx="6" cy="12" r="2.4" /><circle cx="18" cy="6" r="2.4" /><circle cx="18" cy="18" r="2.4" /><path d="m8.1 10.9 7.8-3.8M8.1 13.1l7.8 3.8" /></svg>
);
export const IconPaw = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><circle cx="7" cy="9" r="1.7" /><circle cx="12" cy="7" r="1.7" /><circle cx="17" cy="9" r="1.7" /><path d="M8.5 16.5c0-2.4 1.6-4 3.5-4s3.5 1.6 3.5 4c0 1.7-1.6 2.5-3.5 2.5s-3.5-.8-3.5-2.5Z" /></svg>
);
export const IconSparkle = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="M12 3.5c.6 3.7 1.8 5 5.5 5.5-3.7.6-4.9 1.8-5.5 5.5-.6-3.7-1.8-4.9-5.5-5.5 3.7-.6 4.9-1.8 5.5-5.5Z" /><path d="M18.5 14c.3 1.7.9 2.3 2.5 2.5-1.7.3-2.2.9-2.5 2.5-.3-1.7-.9-2.2-2.5-2.5 1.7-.3 2.2-.9 2.5-2.5Z" /></svg>
);
export const IconMountain = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}><path d="m3 19 6-11 4 7 2-3 6 7H3Z" /><circle cx="17.5" cy="6.5" r="2" /></svg>
);
