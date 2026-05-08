# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**India Political Landscape** — early-stage project, currently in the proposal/design phase with no source code yet.

## OpenSpec Workflow

This project uses the [OpenSpec](openspec/config.yaml) spec-driven workflow for structured feature development:

- `/opsx:explore` — think through ideas and clarify requirements before proposing changes
- `/opsx:propose` — create a new change with design, specs, and tasks in one step
- `/opsx:apply` — implement tasks from an existing OpenSpec change
- `/opsx:archive` — archive a completed change after implementation

All OpenSpec artifacts live under the `openspec/` directory. Update `openspec/config.yaml` to add project context (tech stack, conventions, domain knowledge) that will inform AI when generating specs.
