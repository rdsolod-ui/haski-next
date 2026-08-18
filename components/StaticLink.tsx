import type { AnchorHTMLAttributes } from "react";

type StaticLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/**
 * Internal navigation for the static Nginx export.
 *
 * The site is deployed as immutable HTML on Nginx, so a normal document
 * navigation is the smallest and most reliable contract. It never requests
 * App Router RSC payloads and still preserves every public URL.
 */
export default function StaticLink(props: StaticLinkProps) {
  return <a {...props} />;
}
