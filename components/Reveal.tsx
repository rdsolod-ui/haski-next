import type { ReactNode, ElementType, CSSProperties } from "react";

export type RevealVariant = "rise" | "clip" | "scale" | "left" | "right" | "soft";

/** Server-rendered motion marker. Content is never hidden until PageMotion enhances it. */
export default function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  variant = "rise",
  className = "",
  style,
  ...rest
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  variant?: RevealVariant;
  className?: string;
  style?: CSSProperties;
  [key: string]: unknown;
}) {
  const motionStyle = { ...style, "--motion-delay": `${delay}ms` } as CSSProperties;
  return <Tag className={`reveal reveal--${variant} ${className}`} style={motionStyle} {...rest}>{children}</Tag>;
}
