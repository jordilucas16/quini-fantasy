# Claude Code Agents

This document describes the available agents in Claude Code for Quini Fantasy development.

## Built-in Agents

### Explore

Specialized agent for exploring the codebase. Searches files by patterns, finds keywords in code, and answers questions about the architecture.

**When to use:**
- Understand how a part of the code works
- Find specific files or functions
- Get an overview of the project structure

### Plan

Software architect agent for designing implementation plans. Analyzes the codebase, identifies critical files, and considers architectural trade-offs.

**When to use:**
- Plan a new feature before implementing it
- Design the implementation strategy for a complex change
- Evaluate different approaches before writing code

### frontend-architect

Agent specialized in frontend code: React components, CSS/Tailwind, accessibility, UI performance, and component architecture.

**When to use:**
- Create or modify React components
- Review frontend code
- Optimize frontend performance
- Improve accessibility (WCAG)
- Design responsive layouts

## Custom Agents

### backend-architect

Agent specialized in backend architecture and design for Python systems. Defined in `.claude/agents/backend-architect.md`.

**Model:** Sonnet

**When to use:**
- Design API architecture with FastAPI
- Review backend code quality and structure
- Technology stack decisions
- Containerization and deployment strategies
- Establish coding standards and best practices
- Coordinate backend-frontend integration patterns

**Core competencies:**
- Modern Python (3.11+), FastAPI, Pydantic, SQLAlchemy
- Design patterns and SOLID principles
- Testing with pytest
- Docker/containerization
- Production: logging, error handling, security, performance

## Creating New Agents

Custom agents are defined as Markdown files in `.claude/agents/`. Each file must include a YAML frontmatter:

```yaml
---
name: agent-name
description: "Agent description and when to use it"
model: sonnet  # or opus, haiku
color: yellow  # indicator color
---
```

Followed by the agent's system prompt in Markdown.
