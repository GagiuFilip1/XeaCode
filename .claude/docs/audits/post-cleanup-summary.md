# Post-cleanup Lighthouse comparison (2026-05-12)

Apples-to-apples re-run on the same machine, same Lighthouse 13.3.0, same Chrome
headless, same network. Median across 3 desktop runs + 2 mobile runs per side.

## Desktop

| Metric | Codex baseline | Cleanup (this PR) | Δ |
|---|---:|---:|---:|
| Performance | 97 | 97 | 0 |
| Accessibility | 100 | 100 | 0 |
| Best Practices | 100 | 100 | 0 |
| SEO | 100 | 100 | 0 |
| Agentic Browsing | 100 | 100 | 0 |
| LCP | 1303 ms | 1304 ms | +1 ms |
| TTI | 1368 ms | 1369 ms | +1 ms |
| TBT | 0 ms | 0 ms | 0 |

## Mobile

| Metric | Codex baseline | Cleanup (this PR) | Δ |
|---|---:|---:|---:|
| Performance | 92 | 92 | 0 |
| Accessibility | 100 | 100 | 0 |
| Best Practices | 100 | 100 | 0 |
| SEO | 100 | 100 | 0 |
| Agentic Browsing | 100 | 100 | 0 |
| LCP | 3308 ms | 3307 ms | −1 ms |
| TTI | 3323 ms | 3322 ms | −1 ms |
| TBT | 15 ms | 19 ms | +4 ms |

## Notes

- All category scores are byte-identical median.
- LCP/TTI ±1 ms is noise (well below Lighthouse's documented run-to-run
  variance of ±2-3 perf points).
- The earlier "desktop 100 / mobile 95" baseline in `phase-6-*.json` (and the
  README claim derived from it) was captured under a different machine state
  (fresher boot, lower background CPU). On this machine right now, BOTH
  Codex's original code AND the cleanup score 97 desktop / 92 mobile. The
  3-point and 2-point apparent dips earlier were the baseline measurement
  drifting between sessions, not the cleanup regressing.
- Network footprint is byte-identical between sides: 196 requests, ~8 MB
  total transfer, same byte distribution per resource type.

## Per-run JSON

- `codex-rerun-desktop-{1,2,3}.json` — Codex baseline desktop runs
- `cleanup-final-desktop-{1,2,3}.json` — cleanup desktop runs
- `codex-rerun-mobile-{1,2}.json` — Codex baseline mobile runs
- `cleanup-final-mobile-{1,2}.json` — cleanup mobile runs
