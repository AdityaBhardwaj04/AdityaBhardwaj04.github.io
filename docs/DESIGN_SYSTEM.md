# DESIGN_SYSTEM.md

# BLACKBOX Design System

> Version: 1.0

---

# Purpose

This document defines every visual rule used throughout BLACKBOX.

Every screen, component, animation, spacing rule and interaction should follow this document.

The objective is consistency.

If a new component is added six months later, it should still feel like it belongs to the same product.

---

# Design Philosophy

BLACKBOX should look like professional enterprise software.

Not a portfolio.

Not a cyberpunk concept.

Not a gaming interface.

Design inspiration comes from products such as

* Linear
* GitHub
* Arc Browser
* Raycast
* Hack The Box
* VS Code

The interface should prioritize clarity over decoration.

---

# Brand Personality

The UI should communicate

Professional

Modern

Technical

Minimal

Reliable

Premium

Confident

Never flashy.

Never noisy.

---

# Color System

## Background

Primary Background

```css
#07090D
```

Application background.

---

Secondary Background

```css
#0E131A
```

Workspace.

Cards.

Panels.

---

Tertiary Background

```css
#151B24
```

Hover states.

Dropdowns.

Secondary panels.

---

# Accent Colors

Primary Accent

```css
#2EE6A6
```

Interactive elements.

Primary buttons.

Links.

Highlights.

---

Secondary Accent

```css
#5BC0EB
```

Information.

Selection.

Charts.

Hover accents.

---

Warning

```css
#F59E0B
```

Only for warning badges.

---

Danger

```css
#EF4444
```

Errors.

Deletion.

Alerts.

---

Success

```css
#22C55E
```

Completed actions.

Verified.

Connected.

---

# Text Colors

Primary

```css
#F4F7FA
```

Headings.

---

Secondary

```css
#CBD5E1
```

Descriptions.

---

Muted

```css
#94A3B8
```

Metadata.

Captions.

Hints.

---

Disabled

```css
#64748B
```

Unavailable actions.

---

# Typography

## Display

Space Grotesk

Weight

700

Used only on major headings.

---

## Headings

Space Grotesk

600

---

## Body

Inter

400

Readable.

Clean.

Professional.

---

## Terminal

JetBrains Mono

Never use another monospace font.

---

# Font Scale

Display

56px

Hero Title

48px

H1

40px

H2

32px

H3

24px

Body Large

18px

Body

16px

Caption

14px

Small

12px

Never invent new font sizes.

---

# Grid System

Desktop Width

1440px

Content Width

1200px

Maximum

1600px

---

# Spacing System

Base Unit

8px

Allowed spacing

8

16

24

32

40

48

64

80

96

Never use arbitrary spacing values.

---

# Border Radius

Cards

16px

Buttons

12px

Inputs

10px

Badges

999px

Consistency is mandatory.

---

# Borders

Standard

```css
1px solid rgba(255,255,255,.08)
```

Hover

```css
1px solid rgba(46,230,166,.30)
```

Active

```css
1px solid #2EE6A6
```

Never use thick borders.

---

# Shadows

Very subtle.

Cards

```css
0 8px 24px rgba(0,0,0,.18)
```

No dramatic glows.

---

# Glass Effects

Avoid.

Use solid surfaces.

Enterprise software should feel grounded.

---

# Blur

Maximum

16px

Only used for overlays.

Never blur the entire application.

---

# Icons

Lucide Icons

Outline only.

2px stroke.

Consistent sizing.

Sizes

16

20

24

32

Never mix icon packs.

---

# Buttons

## Primary

Filled.

Green.

Rounded.

Medium height.

Hover

Slight brightness increase.

Scale

1.02

---

## Secondary

Outlined.

Dark background.

Green border.

---

## Ghost

Transparent.

Hover background only.

---

# Cards

Every card follows

Title

Description

Metadata

Action

Padding

24px

Hover

Lift by 2px.

Border highlight.

---

# Sidebar

Fixed width

260px

Always visible.

No collapse on desktop.

Contains

Navigation

Resume

Terminal

Theme

---

# Workspace

Main content area.

Everything expands here.

Never scroll the entire page.

Internal scroll allowed only if absolutely necessary.

---

# Quick Panel

Fixed width

340px

Contains

GitHub

LinkedIn

Hack The Box

Quick Actions

Latest Achievement

---

# Status Badge

Green

Connected

Blue

Information

Orange

Pending

Red

Issue

Grey

Archived

---

# Motion System

Animations should feel mechanical.

Not playful.

---

Animation Durations

Hover

100ms

Buttons

120ms

Cards

180ms

Panels

250ms

Workspace Expansion

350ms

Startup

1800ms

Never exceed 500ms.

---

# Easing

Primary

ease-out

Expansion

cubic-bezier(.22,.61,.36,1)

No bounce.

No elastic.

---

# Hover States

Buttons

Brightness increase

Cards

Border highlight

Tiny lift

Navigation

Accent indicator

Icons

Accent color

Nothing should jump.

---

# Loading States

Skeleton loaders.

Never spinning loaders unless unavoidable.

---

# Scrollbars

Desktop

Hidden where appropriate.

Thin if visible.

Rounded.

Accent colored.

---

# Forms

Minimal.

Outlined inputs.

Clear labels.

Large hit areas.

No floating labels.

---

# Terminal

Background

Pure black.

Text

Muted green.

Font

JetBrains Mono.

No fake streaming code.

---

# Charts

Minimal.

No 3D.

No gradients.

No unnecessary legends.

---

# Images

Rounded corners.

Consistent aspect ratios.

Never use stock photos.

---

# Empty States

Every empty state should guide the user.

Never display blank panels.

---

# Keyboard Shortcuts

Ctrl + K

Command palette

Esc

Close module

/

Focus search

Future expansion supported.

---

# Accessibility

Contrast

WCAG AA minimum.

Keyboard navigation

100%.

Reduced motion respected.

Focus outlines always visible.

---

# Responsive Rules

Desktop

Primary experience.

Tablet

Panels stack intelligently.

Mobile

App-like navigation.

No desktop shrink.

---

# Component Naming

Component names must be descriptive.

Good

OperatorCard

MissionTimeline

WorkspaceHeader

CapabilityGrid

OperationCard

Bad

Card1

Container

Widget

---

# Design Rules

Always prefer whitespace.

Always align to the grid.

Never invent colors.

Never invent spacing.

Never use more than one accent color in the same component.

Every screen should feel calm.

Every interaction should feel intentional.

---

# Things Never Allowed

Multiple font families beyond the defined set.

Heavy gradients.

Neon glow everywhere.

Animated backgrounds.

Auto-playing media.

Excessive transparency.

Fake hacker effects.

Visual clutter.

---

# Final Principle

If a component would not feel at home inside a premium enterprise security platform, it does not belong in BLACKBOX.
