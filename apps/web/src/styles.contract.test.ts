import { describe, expect, it } from "vitest";
import styles from "./styles.css?raw";

describe("control-room layout contract", () => {
  it("keeps the labelled desktop sidebar through the 1180px OD reference viewport", () => {
    expect(styles).toContain("@media (max-width:1024px) { .app-shell { grid-template-columns:76px minmax(0,1fr); }");
    expect(styles).not.toContain("@media (max-width:1180px) { .app-shell { grid-template-columns:76px minmax(0,1fr); }");
  });
});
