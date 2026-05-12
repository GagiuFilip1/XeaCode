# Claude project instructions

This file is the standing instruction set: **how you work in any project that adopts it**. It is project-portable — the workflow rules, subagent strategy, phase lifecycle, and lessons-capture discipline below are reusable across projects.

**Project-specific context (project layout, build/test commands, gotchas, architecture rules, scope) lives in [`PROJECT.md`](PROJECT.md).** Read it before answering any question that involves architecture, file placement, commands, or project conventions.

For ongoing project state, read:

- **[README.md](README.md)** — canonical reference for system inventory, component APIs, architecture diagram, JSON schemas. Read before answering "what exists?".
- **[`.claude/docs/STATE.md`](.claude/docs/STATE.md)** — the ONE active board story (phase status, test count, scope, AC, DoD). Read at session start to know what is being worked on right now.
- **[`.claude/docs/COMPLETED.md`](.claude/docs/COMPLETED.md)** — reverse-chronological log of shipped work as one-liners. Read when you need to know what was already done.
- **[`.claude/docs/lessons.md`](.claude/docs/lessons.md)** — codebase-specific corrections from past sessions. Review before non-trivial work.

## Bootstrap (fresh project / missing docs)

On session start, if `.claude/docs/` does not exist (or any of `STATE.md` / `COMPLETED.md` / `lessons.md` / `todo.md` inside it is missing), **offer to scaffold the missing files with their canonical headers** and wait for explicit user confirmation before creating anything. Do not silently create files — some projects may not yet have adopted this workflow.

The canonical headers (used only when scaffolding):

- `STATE.md` — `# Project State\n\n> The ONE active board story. Completed work moves to COMPLETED.md.\n`
- `COMPLETED.md` — `# Completed Work\n\nReverse-chronological log of shipped work. One-liners only — full detail belongs in plan documents and commit history.\n`
- `lessons.md` — `# Lessons Learned\n\nPatterns and corrections captured during development. Review at session start.\n`
- `todo.md` — `# Task Tracking\n\nGranular checklists for the **active** phase.\n`

---

# Workflow Orchestration

## 1. Plan Mode is Mandatory

- **Before any file change, you MUST present a plan and wait for explicit user approval.** No exceptions for "small," "obvious," or "trivial" fixes — the user reviews everything before it lands.
- Use Claude Code plan mode: if not already in plan mode, enter it (`EnterPlanMode`), draft the plan, present via `ExitPlanMode`, then wait for approval. Only after approval may you edit, write, or run state-changing commands.
- **`ExitPlanMode` is the only approval gate before code lands.** When an upstream skill (e.g. `superpowers:brainstorming`) presents a design and asks "approve?", treat that as plan-mode prep — its output feeds into the plan doc — not a separate approval gate. Do not double-prompt the user.
- Plans must be detailed enough to remove ambiguity: which files change, which custom agents will execute parts, which tests verify the outcome, what order the steps run in.
- Use plan mode for verification steps too, not just building (e.g. "run these tests, inspect this log, check this scene").
- If something goes sideways mid-execution, STOP and re-plan immediately — don't keep pushing through.
- Write detailed specs upfront to reduce ambiguity.

## 2. Subagent Strategy — USE CUSTOM AGENTS HEAVILY

- **Every plan must explicitly identify which custom agents will execute parts of it.** This is non-negotiable and the user will check.
- Browse the available custom agents at the start of every non-trivial task and pick the best matches. Don't default to doing it all in the main loop.
- Offload research, exploration, parallel analysis to subagents — keep the main context window clean.
- For complex problems, throw more compute at them via parallel subagents (one tool message, multiple agent calls).
- One task per subagent, focused execution.
- Common picks (refine per project — see [PROJECT.md](PROJECT.md) for project-specific subagent recommendations):
  - `Senior Project Manager` — authors the `STATE.md` board story at the start of every new phase / substantial feature (see "Phase Lifecycle" section below)
  - `Explore` — broad codebase research and "where is X defined?"
  - `Plan` — implementation strategy before coding
  - `Code Reviewer` — independent second-opinion review of diffs
  - `Software Architect` — system-design and architectural-decision questions
  - `Test Results Analyzer` — diagnosing test failures and coverage gaps
  - `Backend Architect` — Core/Infrastructure C# implementation work
  - `Refactor`-style agents (`Senior Developer`, `Code Reviewer`) — reviewing changes before commit

## 3. Self-Improvement Loop

- After ANY correction from the user: update `.claude/docs/lessons.md` with the pattern.
- Write rules for yourself that prevent the same mistake.
- Ruthlessly iterate on these lessons until mistake rate drops.
- Review lessons at session start for relevant project context.

## 3a. Memory & Promotion (self-improving-agent skill)

The `self-improving-agent` plugin is installed. It adds slash commands for
curating Claude's auto-memory into durable project knowledge:

- `/si:status` — memory health dashboard (line counts, capacity, stale refs)
- `/si:review` — surface promotion candidates, stale entries, consolidation opportunities
- `/si:promote <pattern>` — graduate a learning from MEMORY.md → `CLAUDE.md` or `.claude/rules/<topic>.md`
- `/si:remember <fact>` — explicitly save important knowledge to auto-memory
- `/si:extract <pattern>` — turn a recurring pattern into a standalone reusable skill

### Knowledge sinks — pick the right home

| Sink | Owner | Scope | When to use |
|---|---|---|---|
| `MEMORY.md` (auto) | Claude (auto) | Project, NOT checked in | Background observations — auto-captured |
| `.claude/docs/lessons.md` | You + me (manual) | Project, checked in | Curated corrections with narrative ("why we don't do X") |
| `CLAUDE.md` | You + me (manual, or `/si:promote`) | Project, checked in | Enforced workflow rules every session loads |
| `PROJECT.md` | You + me (manual) | Project, checked in | Enforced project-specific rules (layout, commands, gotchas) |
| `.claude/rules/<topic>.md` | You + me (or `/si:promote --target rules/...`) | Path-scoped, checked in | Rules that only apply to specific files |

### Workflow integration

- After a phase ships (Phase Lifecycle step 6): run `/si:review` to surface anything auto-memory caught that's ripe for promotion.
- When you correct me on something I should never forget: capture in `.claude/docs/lessons.md` as today, AND if it's an enforced rule, propose `/si:promote` to `CLAUDE.md` (workflow) or `PROJECT.md` (project-specific).
- Same gotcha in 2+ sessions → it's a promotion candidate. Graduate it.
- Path-scoped patterns (e.g., "all `EntityNode` subclasses must add behaviors before `base._Ready()`") that ONLY apply to certain file types belong in `.claude/rules/`, not the top-level docs, so they only load when relevant.

## 4. Verification Before Done

- Never mark a task complete without proving it works.
- Run tests, check logs, demonstrate correctness.
- Diff behavior between main and your changes when relevant.
- Ask yourself: "Would a staff engineer approve this?"
- If something cannot be verified from CLI (e.g. game-engine scene visuals), say so explicitly rather than implying success.

## 5. Demand Elegance (Balanced)

- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: stop, use everything you know, implement the elegant solution.
- Skip this gate for simple, obvious fixes — don't over-engineer.
- Challenge your own work before presenting it.

## 6. Autonomous Bug Fixing

- When given a bug report: just fix it. Don't ask for hand-holding.
- Point at logs, errors, failing tests — then resolve them.
- Zero context switching for the user.
- Go fix failing CI tests without being told how.
- (Plan mode rule still applies: present the fix as a plan first, then execute on approval.)

## 7. Superpowers Plugin — Integration Rules

The `superpowers@claude-plugins-official` plugin (v5.1.0, community, Jesse Vincent) is installed. Its `SessionStart` hook auto-loads the `using-superpowers` bootstrap, which auto-triggers other skills. To prevent conflicting rituals with the existing workflow, use it **selectively**:

### Use Superpowers skills for:
- **`brainstorming`** — invoke BEFORE entering plan mode for non-trivial features. Sits *upstream* of CLAUDE.md §1, never replaces it. Its output feeds into the Plan subagent / `.claude/docs/todo.md`.
- **`systematic-debugging`** — use after the first failed fix attempt. Codifies the root-cause discipline §6 demands but doesn't structure.
- **`test-driven-development`** — apply ONLY where xUnit-style unit tests are feasible. Game-engine integration layers (see [PROJECT.md](PROJECT.md) for which folders qualify) are exempt because they can't run in isolated unit tests.
- **`verification-before-completion`** — reinforces §4. Let it fire.

### Defer to existing equivalents (do NOT use Superpowers' version):
| Superpowers skill | Use this instead |
|---|---|
| `executing-plans`, `writing-plans` | Mandatory plan-mode workflow + `.claude/docs/todo.md` + `Plan` subagent |
| `requesting-code-review`, `receiving-code-review`, `subagent-driven-development` | `Code Reviewer` custom subagent + `/review` + `/ultrareview` |
| `writing-skills` | `anthropic-skills:skill-creator` and `/si:extract` |
| `dispatching-parallel-agents` | Already mandated by §2 — redundant framing |
| `finishing-a-development-branch` | Phase Lifecycle "On phase completion" checklist |
| `using-git-worktrees` | `Plan` / agent `isolation: "worktree"` parameter when wanted |

### Precedence when rituals conflict:
1. CLAUDE.md §1 (plan mode mandatory) is final. Brainstorming feeds into it, not around it.
2. CLAUDE.md §2 (custom subagent strategy) wins over Superpowers' subagent skills.
3. Phase Lifecycle (Senior Project Manager authors `STATE.md`) is unchanged.
4. `self-improving-agent` (§3a) and Superpowers operate independently — `/si:*` commands and Superpowers skills do not compete.

### Trial period:
Run for the next phase after the active `STATE.md` board story closes. If rituals fight existing workflow, uninstall via `/plugin uninstall superpowers@claude-plugins-official`. Capture findings in `.claude/docs/lessons.md` either way.

---

# Task Management

1. **Plan First** — write the plan to `.claude/docs/todo.md` with checkable items, then present via `ExitPlanMode`.
2. **Verify Plans** — wait for user approval before starting implementation.
3. **Track Progress** — mark items complete as you go.
4. **Explain Changes** — high-level summary at each step.
5. **Document Results** — add a review section to `.claude/docs/todo.md` when done.
6. **Capture Lessons** — update `.claude/docs/lessons.md` after corrections.

---

# Phase Lifecycle (board story workflow)

[`.claude/docs/STATE.md`](.claude/docs/STATE.md) holds **one** active board story at a time. New phases and substantial features get a PM-produced story written there; finished work moves to [`.claude/docs/COMPLETED.md`](.claude/docs/COMPLETED.md). This keeps cold-start sessions oriented in seconds.

## When to invoke the Senior Project Manager subagent

**Use `Senior Project Manager` to author/refresh `STATE.md` whenever you start:**
- A new numbered phase (e.g., Phase 7, Phase 8).
- A substantial cross-cutting feature (multi-file scope, multi-day effort, multiple AC).
- Anything else where a new contributor would benefit from a board-shaped Summary / Context / Scope / AC / DoD spec.

**Do NOT invoke it for:**
- Single-file bug fixes, typo corrections, dependency bumps.
- Follow-up tweaks within a phase that's already in flight.
- Pure research / exploration tasks.

The judgment is "would a board ticket help a new contributor here?" — if the answer is no, skip the agent and just do the work.

## Required `STATE.md` story shape (produced by the PM agent)

1. **Title** (one line, under 80 chars).
2. **Summary** (2–3 sentences).
3. **Background / Context** (why now, ties to prior/next phases).
4. **Detailed scope** (checkboxes grouped by layer — group names are project-specific; see [PROJECT.md](PROJECT.md)).
5. **Acceptance criteria** (numbered, testable).
6. **Out of scope** (explicit non-goals).
7. **Estimated effort** (story points or dev-days).
8. **Dependencies / risks** (what blocks this; what could go wrong).
9. **Definition of done** (concrete completion signal).
10. **References** (plan file path, related Phase N work, key file:line pointers).

The approved plan document lives at `~/.claude/plans/<slug>.md` and is the long-form source of truth; `STATE.md`'s board story is the tracker-shaped summary that points back to it.

## Splitting large phases into sub-phases

If the implementation plan (Plan-agent output, "Implementation sequence" section) naturally contains **3 or more numbered internal phases (A, B, C, …)**, offer to split the work into sub-phases before entering plan-mode approval. Each internal phase is a candidate sub-phase boundary.

### How the split works

1. Show the user the proposed sub-phase split derived from the plan's internal phases. Group them however the natural seams suggest — usually one internal phase per sub-phase, but contiguous internal phases can be grouped (e.g., "7.1 = A + B + C; 7.2 = D + E; 7.3 = F + G").
2. Ask: *"Which sub-phases do you want to take in this session? The rest queue for later."* User picks one or more contiguous sub-phases.
3. The Senior PM agent re-authors the **active sub-phase's** full board story (focused scope, narrower AC, smaller projected delta). The queued sub-phases get a one-line entry each in the phase-status table — NOT a full board story.
4. Plan documents are per-sub-phase: `~/.claude/plans/phase-<N>-<sub>-<slug>.md`.
5. On sub-phase completion, run the normal Phase Lifecycle "On phase completion" steps, then: if a queued sub-phase remains, the PM agent authors its board story and replaces STATE.md's active section. If none remain, place a one-line placeholder.

### Re-splitting

The same offer fires when a queued sub-phase becomes active and its plan still has ≥3 internal phases. Phase 7.2's plan may itself trip the trigger → split it into 7.2 (slimmer) + 7.3 (leftover). **Always sequential, never nested** — there is no Phase 7.1.1.

### When NOT to split

- The plan has fewer than 3 internal phases.
- User explicitly waves off the offer ("just do the whole thing").
- The plan's internal phases are tightly coupled (e.g., a `SaveData` schema change that spans 3 internal phases but is one atomic refactor — splitting would create incoherent intermediate states). In this case, flag it but still ask the user.

### Anti-bloat for splits

- One active sub-phase board story in `STATE.md` at a time (unchanged from base rule).
- Queued sub-phases are table entries only, not narrative.
- `COMPLETED.md` gets one line per sub-phase shipped — don't roll them up at the end.
- The phase-status table keeps split entries forever; it's the historical ledger.

## On phase completion

When the active board story's Definition of Done is satisfied:

1. Re-run the full test suite, record the new count in `.claude/docs/STATE.md`.
2. Add ONE line to [`.claude/docs/COMPLETED.md`](.claude/docs/COMPLETED.md) at the top: date, phase title, test delta, plan-file link, brief impact summary. Do NOT copy the full board story — the long-form lives in the plan document.
3. Bump the phase-status table in `.claude/docs/STATE.md` to **Done**.
4. Replace `STATE.md`'s "Active board story" section with the next phase's PM-agent-produced story, OR a one-line placeholder if no next phase is queued.
5. Update [`README.md`](README.md) system inventory + "Phase Completion Status" table.
6. Capture any user corrections in [`.claude/docs/lessons.md`](.claude/docs/lessons.md).

## Anti-bloat rules

- `STATE.md` holds exactly one board story. Do not append shipped entries there.
- `COMPLETED.md` entries are **one-liners**. Full detail belongs in `~/.claude/plans/<slug>.md` and commit history.
- Don't re-author the PM story mid-phase unless scope materially changed — small adjustments go in `.claude/docs/todo.md`.

---

# Core Principles

- **Simplicity First** — make every change as simple as possible. Impact minimal code.
- **No Laziness** — find root causes. No temporary fixes. Senior-developer standards.
- **Minimal Impact** — changes only touch what's necessary. Avoid introducing bugs.
- **Custom Agents** — browse installed custom agents and choose the ones best suited to finalize the task. Use them as much as possible when designing a plan.
