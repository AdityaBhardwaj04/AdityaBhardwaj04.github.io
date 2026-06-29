# BLUEPRINT.md

# BLACKBOX Product Blueprint

Version 1.0

Author: Aditya Bhardwaj

Status: Product Architecture Complete

---

# Purpose

This document defines the application at the product level.

Unlike PROJECT.md, which explains the vision, this blueprint explains **exactly how the product should be built**.

If every source file disappeared tomorrow, this document should contain enough information for another engineer to rebuild the application.

---

# Product Identity

BLACKBOX is a desktop-first interactive portfolio.

It should feel like opening a premium security workspace.

The interface communicates engineering quality, organization, and professionalism.

It does not attempt to simulate hacking.

It does not attempt to entertain.

It exists to communicate trust.

---

# Primary Screen

The entire desktop application consists of one fixed viewport.

There are no pages.

There are no route transitions.

The application behaves like professional desktop software.

The layout remains constant.

Only the Workspace changes.

---

# Viewport Layout

Reference Resolution

1920 × 1080

Structure

```
┌──────────────────────────────────────────────────────────────┐
│ Header                                                       │
├──────────────┬───────────────────────────────┬───────────────┤
│              │                               │               │
│ Sidebar      │        Workspace              │ Quick Panel   │
│              │                               │               │
│              │                               │               │
│              │                               │               │
│              │                               │               │
├──────────────┴───────────────────────────────┴───────────────┤
│ Status Bar                                                   │
└──────────────────────────────────────────────────────────────┘
```

---

# Layout Dimensions

Header

72px

Sidebar

260px

Workspace

Flexible

Quick Panel

340px

Status Bar

32px

Outer Padding

24px

Grid Gap

24px

---

# Startup Sequence

State 1

Black screen.

No UI.

Duration

200ms

---

State 2

Loading text fades in.

```
Establishing secure connection...
```

Progress bar begins.

---

State 3

Messages rotate.

```
Validating certificate...

Loading profile...

Loading workspace...

Synchronizing projects...
```

Duration

1.5 seconds

---

State 4

Progress reaches 100%.

Workspace fades in.

Dashboard loads.

Loading screen removed completely.

---

# Dashboard

Dashboard is permanent.

The dashboard is never destroyed.

Modules expand over it.

When closed, the dashboard is restored instantly.

---

# Dashboard Layout

Workspace contains

```
Operator Card

Mission Summary

Featured Operations

Recent Achievement

Current Focus
```

Everything fits inside one viewport.

No scrolling.

---

# Sidebar

Always visible.

Contains

Dashboard

Operations

Mission History

Capabilities

Certifications

Contact

Resume

Terminal

Theme Toggle

Sidebar never animates.

Only active indicator changes.

---

# Header

Minimal.

Contains

Current Workspace

Breadcrumb

Current Time

Settings

Search

No unnecessary controls.

---

# Status Bar

Bottom of screen.

Displays

Connection

Version

Keyboard Shortcut Hint

Status

Example

```
Connected

Version 1.0

Press Ctrl + K

Ready
```

---

# Quick Panel

Purpose

Provide immediate access to important information.

Contains

GitHub

LinkedIn

Hack The Box

Resume

Latest Achievement

Quick Contact

Never exceeds one screen height.

---

# Workspace Behavior

Workspace is the only dynamic region.

Changing sections never changes the overall layout.

Instead

Workspace updates.

Sidebar remains.

Header remains.

Quick Panel remains.

Status Bar remains.

---

# Module Expansion

Every module expands identically.

Sequence

Card selected

↓

Scale to 101%

↓

Workspace transition

↓

Content fade

↓

Interactive state

Close

↓

Collapse

↓

Dashboard restored

Animation Duration

320ms

---

# Operator Card

Top priority component.

Contains

Name

Current Position

Short Introduction

Mission Statement

Primary Actions

Resume

GitHub

LinkedIn

Visual hierarchy

Name

↓

Role

↓

Mission

↓

Buttons

---

# Featured Operations

Grid

2 columns

3 rows maximum

Maximum six cards

Every card contains

Title

Short Description

Technology

Status

Hover State

Border highlight

Elevation

Click

Expand

---

# Operations Workspace

Structure

```
Header

Overview

Problem

Approach

Technology Stack

Architecture

Gallery

GitHub

Lessons Learned
```

No scrolling preferred.

Tabs if necessary.

---

# Mission History

Displayed as timeline.

Timeline occupies left.

Details occupy right.

Selecting timeline entry updates details.

No page transitions.

---

# Capabilities

Grouped.

Never alphabetized.

Groups

Application Security

Offensive Security

Programming

Networking

Automation

Operating Systems

Cloud

Every capability card expands.

Shows

Description

Projects

Experience

Tools

---

# Certifications

Grid

Three columns

Expandable cards

Expanded view contains

Certificate

Issuer

Date

Skills

Credential

Related Experience

---

# Contact

Minimal.

Centered.

Contains

Email

GitHub

LinkedIn

Resume

Calendar (future)

No contact form.

---

# Command Palette

Shortcut

CTRL + K

Centered overlay

Search auto focused

Commands

Dashboard

Projects

Resume

GitHub

HTB

LinkedIn

Contact

Close

ESC

---

# Terminal

Secondary feature.

Not primary navigation.

Slides from bottom.

Height

35%

Viewport.

Supported Commands

help

resume

projects

github

linkedin

htb

contact

clear

exit

Terminal state persists until closed.

---

# Visual Hierarchy

Level 1

Workspace Title

Level 2

Operator Card

Level 3

Operations

Level 4

Quick Panel

Level 5

Metadata

Never compete for attention.

---

# Empty States

Every empty panel explains itself.

Example

"No certifications available yet."

Instead

"This section will automatically update as new certifications are earned."

---

# Error States

Small.

Calm.

No red screens.

Message

Retry

Dismiss

---

# Loading States

Skeletons.

Never spinning loaders.

Content should appear progressively.

---

# Keyboard Navigation

TAB

Move

ENTER

Select

ESC

Close Module

CTRL + K

Command Palette

T

Toggle Terminal

---

# Animation Timeline

Hover

120ms

Expand

320ms

Collapse

280ms

Fade

180ms

Loading

1800ms

---

# Information Density

Dashboard

Maximum six visible cards.

Operations

Maximum five content sections.

Capabilities

Maximum seven groups.

Quick Panel

Maximum six widgets.

Avoid overwhelming the user.

---

# Responsive Strategy

Desktop

Reference experience.

Laptop

Minor scaling only.

Tablet

Sidebar becomes collapsible.

Quick Panel becomes overlay.

Mobile

Bottom navigation.

Workspace occupies full screen.

Terminal disabled.

---

# Future Modules

Blog

Research

Writeups

Publications

Speaking

Each future module follows the exact same workspace pattern.

---

# Implementation Order

Phase 1

Application Shell

Phase 2

Dashboard

Phase 3

Sidebar

Phase 4

Quick Panel

Phase 5

Operations

Phase 6

Mission History

Phase 7

Capabilities

Phase 8

Certifications

Phase 9

Contact

Phase 10

Command Palette

Phase 11

Terminal

Phase 12

Animations

Phase 13

Accessibility

Phase 14

Performance

Phase 15

Final Polish

---

# Final Product Test

Before shipping, ask these questions:

* Does this feel like software rather than a website?
* Can a recruiter understand the key information in under two minutes?
* Is every animation purposeful?
* Can the application be fully navigated with a keyboard?
* Does every module follow the same interaction model?
* Would this still look modern in five years?

If the answer to any of these is **no**, iterate before shipping.

---

# Product Motto

**Security isn't about looking complex. It's about making complexity feel simple.**

End of Document.
