# CODEX_RULES.md

# BLACKBOX Engineering Rules

Version 1.0

---

# Purpose

This document defines the engineering standards for BLACKBOX.

Every contribution must follow these rules.

If a change conflicts with this document, the change is rejected.

Consistency is more important than cleverness.

---

# Philosophy

BLACKBOX is software.

Not a landing page.

Not a portfolio template.

Not a CSS experiment.

Every implementation decision should reinforce this philosophy.

---

# Engineering Priorities

Priority Order

1. User Experience
2. Performance
3. Accessibility
4. Maintainability
5. Visual Polish
6. New Features

Never sacrifice higher priorities for lower ones.

---

# Architecture

Use feature-based architecture.

Never create large generic folders.

Preferred

```
features/
    dashboard/
    operations/
    mission-history/
    capabilities/
    certifications/
    contact/
```

Avoid

```
pages/
components/
misc/
helpers/
random/
```

Features own their own UI.

---

# Folder Structure

```
app/

components/

features/

hooks/

lib/

styles/

animations/

types/

content/

public/

data/
```

Every folder has a single responsibility.

---

# Component Philosophy

Components should be

Reusable

Predictable

Small

Focused

Avoid components over 300 lines whenever possible.

Split responsibilities.

---

# Naming Rules

Good

```
OperatorCard

MissionTimeline

WorkspaceHeader

ProjectCard

CommandPalette
```

Bad

```
Card

Box

Widget

Component

Container
```

Names should describe purpose.

---

# File Naming

React Components

PascalCase

```
OperatorCard.tsx
```

Hooks

camelCase

```
useTerminal.ts
```

Utilities

camelCase

```
formatDate.ts
```

Types

```
operator.ts
project.ts
```

---

# State Management

Prefer local state.

Only lift state when required.

Avoid unnecessary global state.

Use Context sparingly.

No Redux unless genuinely required.

---

# Styling Rules

Tailwind CSS only.

No inline styles.

No custom CSS unless impossible with Tailwind.

Avoid arbitrary values.

Use design tokens.

---

# Color Rules

Never invent colors.

Only use values defined in

DESIGN_SYSTEM.md

If a new color is required

Update the design system first.

---

# Typography Rules

Never invent font sizes.

Never mix font families.

Only

Space Grotesk

Inter

JetBrains Mono

---

# Animation Rules

Every animation must answer

"What does this communicate?"

If the answer is

"Nothing"

Delete it.

---

Allowed animations

Fade

Expand

Collapse

Slide

Opacity

Scale (subtle)

---

Forbidden

Bounce

Elastic

Flash

Shake

Spin

Flip

Rotate

Parallax overload

---

# Motion Timing

Hover

100–120ms

Card Expansion

300–350ms

Fade

180ms

Workspace Transition

350ms

Never exceed 500ms.

---

# Layout Rules

Desktop

Single viewport.

No vertical scrolling.

Sidebar fixed.

Quick Panel fixed.

Workspace changes.

Only module content may scroll if absolutely necessary.

---

# Mobile Rules

Do not shrink desktop.

Redesign for mobile.

Navigation becomes bottom navigation.

Quick Panel becomes drawer.

---

# Data Rules

Never hardcode content inside components.

Use structured data.

Preferred

```
content/

projects.json

experience.json

certifications.json

timeline.json
```

UI reads data.

Data never lives inside JSX.

---

# Content Rules

Content belongs in JSON or MDX.

Components display content.

Components never own content.

---

# Performance Rules

Lazy load heavy components.

Optimize images.

Avoid unnecessary re-renders.

Use dynamic imports when appropriate.

No large animation libraries beyond Framer Motion.

---

# Accessibility Rules

Keyboard navigation required.

Visible focus states required.

Semantic HTML required.

ARIA labels where appropriate.

Reduced motion supported.

No exceptions.

---

# Error Handling

Never expose stack traces.

Display user-friendly messages.

Example

"Unable to load GitHub activity."

Provide retry option.

---

# API Rules

External APIs must fail gracefully.

GitHub unavailable?

Hide widget.

Do not break dashboard.

Same for Hack The Box.

---

# Icons

Lucide Icons only.

Do not mix icon libraries.

Consistent sizing.

---

# Images

Use optimized Next.js Image component.

Never use stock hacker images.

Use real screenshots only.

---

# Terminal Rules

Terminal is optional.

Never force interaction.

Commands must perform useful actions.

No fake Linux shell.

No simulated hacking.

Supported commands

help

resume

github

linkedin

htb

contact

projects

clear

exit

Nothing else unless approved.

---

# Command Palette

Should behave similarly to

VS Code

Linear

Raycast

Fast.

Keyboard-first.

Search immediately focused.

---

# Loading Rules

Skeleton loaders preferred.

Avoid spinners.

Loading should feel immediate.

---

# Component Checklist

Before merging a component

✓ Responsive

✓ Accessible

✓ Keyboard navigable

✓ Uses design tokens

✓ Typed

✓ No console logs

✓ No dead code

✓ No duplicated logic

---

# Code Quality

Use TypeScript strictly.

Avoid any.

Prefer explicit types.

Prefer composition.

Avoid deeply nested JSX.

Extract reusable logic.

---

# Git Rules

Meaningful commits.

Examples

```
feat: add operator dashboard

fix: improve workspace animation

refactor: simplify project card

docs: update design system
```

Never use

```
update

changes

fix

asdf

test
```

---

# Testing Philosophy

Critical interactions should be testable.

Command Palette

Workspace transitions

Navigation

Module expansion

Resume download

---

# Security

Never expose secrets.

Never expose API keys.

Never trust external data.

Validate user input.

Escape rendered content.

---

# SEO

Every module should have

Meaningful title

Description

Open Graph

Twitter metadata

Structured data where appropriate.

---

# Things Never Allowed

Matrix rain.

Fake terminal spam.

Fake CPU metrics.

Fake RAM metrics.

Anonymous masks.

Skulls.

Excessive glow.

Infinite scrolling.

Heavy particle effects.

Auto-playing audio.

Unnecessary popups.

---

# Definition of Done

A feature is complete only if

It matches PROJECT.md

It follows DESIGN_SYSTEM.md

It follows UX_FLOW.md

It follows this document

It passes accessibility checks

It performs well

It feels like BLACKBOX

---

# Final Rule

Whenever making a design or engineering decision, ask:

> **"Would this belong inside a premium enterprise security product?"**

If the answer is **no**, do not implement it.

Every line of code should move BLACKBOX closer to feeling like polished software—not just a portfolio.

End of Document.
