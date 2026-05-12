/**
 * Tech Stack marquee tile labels (Phase 3 — design handoff).
 *
 * Per design: a single 14-tile list, used twice (row 1 forward, row 2 reversed).
 * Plain string array — no `category` field, no per-tile type — so the data
 * crosses the RSC → Client boundary as a serializable primitive (Phase 1.2
 * lesson). Real brand SVGs are out of scope this phase; tiles render as
 * HTML pill labels per kit.css `.tile`.
 */
export const STACK_TILES: readonly string[] = [
  ".NET 8",
  "C# 12",
  "TYPESCRIPT",
  "NEXT.JS",
  "REACT",
  "SWIFT",
  "KOTLIN",
  "POSTGRES",
  "REDIS",
  "AZURE",
  "AWS",
  "TERRAFORM",
  "GRAFANA",
  "PLAYWRIGHT",
];
