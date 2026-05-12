# Claude project instructions

This file is the standing instruction set: **how you work in any project that adopts it**. It is project-portable — the workflow rules, subagent strategy, PM handoff, and memory-promotion discipline below are reusable across projects.

**Project-specific context (project layout, build/test commands, gotchas, architecture rules, scope) lives in [`PROJECT.md`](PROJECT.md).** Read it before answering any question that involves architecture, file placement, commands, or project conventions.

For ongoing project state, read:

- **[README.md](README.md)** — canonical reference for system inventory, component APIs, architecture diagram, JSON schemas. Read before answering "what exists?".
- **[`.claude/docs/STATE.md`](.claude/docs/STATE.md)** — at most ONE task, written by the `Senior Project Manager` subagent when the user requests an end-of-day handoff. Read at session start; if empty, no pre-queued work — wait for the user's first request.

## Bootstrap (fresh project / missing docs)

On session start, if `.claude/docs/` does not exist (or `STATE.md` / `todo.md` inside it is missing), **offer to scaffold the missing files with their canonical headers** and wait for explicit user confirmation before creating anything. Do not silently create files — some projects may not yet have adopted this workflow.

The canonical headers (used only when scaffolding):

- `STATE.md` — `# Next task\n\n> Written only by the Senior Project Manager subagent on user request. At most one task. Empty otherwise.\n\n_No task queued._\n`
- `todo.md` — `# Task Tracking\n\nGranular checklist for the **active** task.\n`

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
- **Plan files live at `.claude/plans/<slug>.md`** (project-local — visible to git, discoverable by future you / a reviewer). If the harness writes the initial plan to a global path, `Read` it after `ExitPlanMode` and `Write` it to `.claude/plans/` before starting implementation.
- **After implementation is fully complete + verified (lint + build green, any browser / runtime checks passed), DELETE the plan file.** The code and commit history become the source of truth from that point on; the plan was scratch space for alignment.

## 2. Subagent Strategy — USE CUSTOM AGENTS HEAVILY

- **Default to using custom agents heavily — for BOTH planning AND implementation.** The main loop is for orchestration: route the work to specialist agents (e.g. `Frontend Developer` writes the React component, `Senior Developer` builds the Laravel/Livewire feature, `Backend Architect` ships the C# service, `Rapid Prototyper` spins the MVP), then verify and integrate the results. Don't default to writing the code yourself.
- **Every plan must propose specific agents** for the work, inside the plan doc. Suggest, don't decide: phrase it as "the best custom agents would be X, Y, Z" and wait for user confirmation before dispatching.
- **If you think the task is small enough that no agent is needed, say so explicitly and ASK** before skipping. Don't unilaterally decide a task is "too simple" for an agent — the user has the final word on every plan, including the no-agent path.
- Offload research, exploration, parallel analysis to subagents — keep the main context window clean.
- For complex problems, throw more compute at them via parallel subagents (one tool message, multiple agent calls).
- One task per subagent, focused execution.
- Common picks (refine per project — see [PROJECT.md](PROJECT.md) for project-specific subagent recommendations):
  - `Senior Project Manager` — overwrites `STATE.md` with the ONE next task when the user explicitly asks for a handoff (e.g. "prep tomorrow's task", "queue this for next session"). NOT triggered automatically — see "PM handoff" section below.
  - `Explore` — broad codebase research and "where is X defined?"
  - `Plan` — implementation strategy before coding
  - `Frontend Developer` — React / Vue / Angular / TS-heavy UI implementation
  - `Senior Developer` — premium implementation work (Laravel / Livewire / advanced CSS / Three.js)
  - `Mobile App Builder` — native iOS/Android + cross-platform implementation
  - `Rapid Prototyper` — fast MVP / proof-of-concept implementation
  - `Backend Architect` — scalable server-side / microservices / cloud implementation
  - `AI Engineer` — ML model dev, deployment, intelligent feature integration
  - `Code Reviewer` — independent second-opinion review of diffs
  - `Software Architect` — system-design and architectural-decision questions
  - `Test Results Analyzer` — diagnosing test failures and coverage gaps
  - `Refactor`-style agents (`Senior Developer`, `Code Reviewer`) — reviewing changes before commit

## 3. Self-Improvement Loop

- After ANY correction from the user: capture the pattern in auto-memory (MEMORY.md) via `/si:remember` if it's a fact, or by editing the relevant memory file directly. The harness auto-loads MEMORY.md so the next session sees it.
- If the correction is an enforced rule (not a one-off observation), graduate it to `CLAUDE.md` (workflow) or `PROJECT.md` (project-specific) or `.claude/rules/<topic>.md` (path-scoped) via `/si:promote`.
- Same gotcha in 2+ sessions → promotion candidate. Graduate it.
- The legacy `.claude/docs/lessons.md` is archived (`lessons-archive.md`) — do NOT add new entries there. See §3a below for the canonical knowledge sinks.

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
| `CLAUDE.md` | You + me (manual, or `/si:promote`) | Project, checked in | Enforced workflow rules every session loads |
| `PROJECT.md` | You + me (manual) | Project, checked in | Enforced project-specific rules (layout, commands, gotchas) |
| `.claude/rules/<topic>.md` | You + me (or `/si:promote --target rules/...`) | Path-scoped, checked in | Rules that only apply to specific files |

### Workflow integration

- After a meaningful chunk of work ships (PR merged, feature deployed, or end-of-day natural break): run `/si:review` to surface anything auto-memory caught that's ripe for promotion.
- When you correct me on something I should never forget: capture in MEMORY.md via `/si:remember` (or direct edit). If it's an enforced rule, propose `/si:promote` to `CLAUDE.md` (workflow) or `PROJECT.md` (project-specific) or `.claude/rules/<topic>.md` (path-scoped).
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
- **`systematic-debugging`** — ALWAYS use for debugging tasks. Fire it the moment you encounter any bug, test failure, unexpected behaviour, build failure, or performance issue — before proposing any fix. The skill enforces root-cause-first discipline and prevents guess-and-check thrashing. This supersedes §6 ("Autonomous Bug Fixing") in HOW you investigate; §6 still governs that you don't ask for hand-holding.
- **`test-driven-development`** — apply ONLY where xUnit-style unit tests are feasible. Game-engine integration layers (see [PROJECT.md](PROJECT.md) for which folders qualify) are exempt because they can't run in isolated unit tests.
- **`verification-before-completion`** — reinforces §4. Let it fire.

### Defer to existing equivalents (do NOT use Superpowers' version):
| Superpowers skill | Use this instead |
|---|---|
| `executing-plans`, `writing-plans` | Mandatory plan-mode workflow + `.claude/docs/todo.md` + `Plan` subagent |
| `requesting-code-review`, `receiving-code-review`, `subagent-driven-development` | `Code Reviewer` custom subagent + `/review` + `/ultrareview` |
| `writing-skills` | `anthropic-skills:skill-creator` and `/si:extract` |
| `dispatching-parallel-agents` | Already mandated by §2 — redundant framing |
| `finishing-a-development-branch` | Plan-mode cleanup (§1 plan-file deletion) + optionally invoking the PM agent to queue the next task |
| `using-git-worktrees` | `Plan` / agent `isolation: "worktree"` parameter when wanted |

### Precedence when rituals conflict:
1. CLAUDE.md §1 (plan mode mandatory) is final. Brainstorming feeds into it, not around it.
2. CLAUDE.md §2 (custom subagent strategy) wins over Superpowers' subagent skills.
3. PM handoff is opt-in only (see "When to invoke the Senior Project Manager subagent" below). Superpowers' planning skills do not flip that to auto-invoke.
4. `self-improving-agent` (§3a) and Superpowers operate independently — `/si:*` commands and Superpowers skills do not compete.

### Trial period:
Run for the next handoff cycle (next time the PM agent queues a task in `STATE.md`, or the next user-driven chunk of work if no handoff). If rituals fight existing workflow, uninstall via `/plugin uninstall superpowers@claude-plugins-official`. Capture findings in MEMORY.md via `/si:remember` either way.

---

# Task Management

1. **Plan First** — write the plan to `.claude/docs/todo.md` with checkable items, then present via `ExitPlanMode`.
2. **Verify Plans** — wait for user approval before starting implementation.
3. **Track Progress** — mark items complete as you go.
4. **Explain Changes** — high-level summary at each step.
5. **Document Results** — add a review section to `.claude/docs/todo.md` when done.
6. **Capture Corrections** — after any user correction, capture in MEMORY.md (via `/si:remember` or direct edit). If it's a rule that should fire across sessions, propose `/si:promote` to CLAUDE.md / PROJECT.md / `.claude/rules/`.

---

# PM handoff (STATE.md)

[`.claude/docs/STATE.md`](.claude/docs/STATE.md) holds **at most one task** — the next thing the next Claude Code session should pick up. It is written exclusively by the `Senior Project Manager` subagent, exclusively when the user asks for it.

## When to invoke the Senior Project Manager subagent

**Only when the user explicitly asks for it.** Examples of explicit asks:

- "Prep a task for tomorrow's session."
- "Write up a handoff spec I can come back to."
- "Queue this as the next task."
- "Plan tomorrow's work" (the words "plan" + "tomorrow" / "next session" combined).

**Never auto-invoke**, even when starting a substantial feature. The user runs the iterative loop directly through plan-mode (`EnterPlanMode` / `ExitPlanMode`) and the `Plan` subagent — the PM-agent handoff is reserved for end-of-day queueing.

When invoked, the PM agent **overwrites** STATE.md with a single task block in the shape below. There is no append, no history, no list — at most ONE task at a time.

## Required `STATE.md` task shape (produced by the PM agent)

1. **Title** (one line, under 80 chars).
2. **Summary** (2–3 sentences — what the next session is picking up + why).
3. **Background / Context** (relevant prior work, file pointers, current state).
4. **Acceptance criteria** (numbered, testable — what "done" looks like).
5. **Out of scope** (explicit non-goals so the next session doesn't sprawl).
6. **References** (file:line pointers, related PRs / commits, any links).

The task block is overwritten on each PM invocation. When the next session picks up the task and ships it, STATE.md is reset to `_No task queued._` (either by the next PM invocation or as the last step of the work).

## Anti-bloat

- STATE.md holds AT MOST one task. Never a list, never a history.
- No COMPLETED.md, no shipped-work log — `git log` is authoritative.
- Plan files live at `.claude/plans/<slug>.md` during the work and are deleted on completion (see §1).

---

# Core Principles

- **Simplicity First** — make every change as simple as possible. Impact minimal code.
- **No Laziness** — find root causes. No temporary fixes. Senior-developer standards.
- **Minimal Impact** — changes only touch what's necessary. Avoid introducing bugs.
- **Custom Agents** — browse installed custom agents and choose the ones best suited to finalize the task. Use them as much as possible when designing a plan.
