import { Circle } from "lucide-react";
import type { ReactNode } from "react";

type Tone = "positive" | "warning" | "negative" | "neutral";

export function StatusBadge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return <span className={`status-badge status-badge--${tone}`}><Circle aria-hidden="true" size={7} fill="currentColor" />{children}</span>;
}
