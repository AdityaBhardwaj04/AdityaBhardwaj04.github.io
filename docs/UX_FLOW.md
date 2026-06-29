# UX_FLOW.md

# BLACKBOX User Experience Flow

Version 1.0

---

# Philosophy

BLACKBOX should not behave like a website.

It should behave like opening professional desktop software.

Users should never wonder

"Where am I?"

Every interaction should feel predictable.

Every transition should feel intentional.

Every animation should communicate hierarchy.

---

# User Goals

A visitor should be able to

Understand who Aditya is

Explore projects

Review experience

Access GitHub

Download resume

Contact immediately

All within two minutes.

---

# Global UX Rules

Desktop uses a single viewport.

No vertical scrolling.

Navigation is persistent.

Workspace changes.

Sidebar remains fixed.

Quick Panel remains visible.

Only the Workspace changes.

---

# Initial Load

## Step 1

Browser opens.

Entire screen is black.

No logo.

No branding.

No navigation.

---

## Step 2

Text appears.

```
Establishing secure connection...
```

Progress bar begins.

---

## Step 3

Loading messages rotate.

```
Validating TLS certificate...

Loading operator profile...

Loading projects...

Initializing workspace...
```

The messages should feel believable.

No fake hacking terminology.

---

## Step 4

Progress reaches 100%.

```
Workspace Ready.
```

Fade transition.

Dashboard appears.

Loading sequence never appears again until refresh.

---

# Dashboard Flow

Dashboard is the application's home.

Every interaction begins here.

Every interaction returns here.

Dashboard contains

Operator Card

Featured Operations

Mission Summary

Quick Actions

Quick Panel

Navigation

---

# Operator Card

Purpose

Answer

Who is this person?

Contains

Name

Current Role

Short Introduction

Current Focus

Current Employer

CTA

Resume

GitHub

LinkedIn

---

# Featured Operations

Displays

3–6 highlighted projects.

Hover

Card lifts slightly.

Border highlights.

Click

Card expands.

No routing.

No reload.

No page transition.

---

# Module Expansion

Every module follows the same animation.

Card

↓

Scale

↓

Expand

↓

Workspace

↓

Content fades in

This animation becomes the signature interaction of BLACKBOX.

---

# Closing Module

User clicks

Back

or

ESC

or

Sidebar Navigation

Current workspace shrinks.

Returns exactly where it came from.

Dashboard state is preserved.

No unnecessary reloads.

---

# Sidebar Navigation

Always visible.

Desktop only.

Selecting another module

Changes workspace.

Sidebar never moves.

Sidebar never reloads.

---

# Operations Module

Purpose

Show projects.

Landing View

Project Grid

Click

↓

Workspace expands

Project details appear

Contains

Overview

Problem

Solution

Tech Stack

Gallery

GitHub

Lessons Learned

Close

↓

Dashboard

---

# Mission History

Purpose

Professional timeline.

Landing

Timeline.

Click timeline entry

↓

Details expand.

Contains

Role

Responsibilities

Tools

Achievements

Duration

Close

↓

Timeline

Close Timeline

↓

Dashboard

---

# Capabilities

Purpose

Present technical expertise.

Landing

Grouped capability cards.

Examples

Application Security

Networking

Programming

Automation

Cloud

Linux

Selecting a capability

Expands.

Shows

Description

Tools

Experience

Projects using this capability

Related certifications

---

# Certifications

Landing

Certification Grid.

Click

↓

Certification expands.

Displays

Issuer

Skills

Credential

Verification

Related Projects

Close

↓

Grid

---

# Contact

Landing

Minimal.

Email

GitHub

LinkedIn

Resume Download

No contact form.

Primary CTA

"Let's Connect"

---

# Quick Panel

Always visible.

Contains

GitHub

LinkedIn

Hack The Box

Latest Achievement

Current Focus

Resume Download

Quick Panel never changes layout.

Only data updates.

---

# Command Palette

Shortcut

CTRL + K

Overlay opens.

Centered.

Search immediately focused.

Available actions

Dashboard

Operations

Mission History

Capabilities

Certifications

Resume

GitHub

LinkedIn

HTB

ESC closes.

---

# Terminal

Hidden by default.

Activated from

Sidebar

or

Keyboard Shortcut

Slides from bottom.

Occupies

30–40%

of viewport.

Commands

help

resume

github

linkedin

htb

projects

contact

clear

exit

Terminal never replaces dashboard.

It is an assistant.

Not the primary navigation.

---

# Keyboard Navigation

Tab

Moves focus.

Arrow Keys

Sidebar navigation.

Enter

Activate.

ESC

Close current workspace.

CTRL + K

Command Palette.

/

Focus Search (future)

---

# Hover Behavior

Buttons

Brightness increase.

Cards

Border highlight.

Small elevation.

Navigation

Accent indicator.

Icons

Accent color.

No exaggerated motion.

---

# Empty States

Every empty state should explain itself.

Example

"No certifications available."

Instead

"Additional certifications will appear here as they are earned."

---

# Error States

Should remain calm.

Example

"Unable to load GitHub data."

Button

Retry

Never show stack traces.

Never expose implementation details.

---

# Loading States

Skeleton loaders.

Never use long spinners.

Content should feel immediate.

---

# Motion Guidelines

Every animation communicates hierarchy.

Expansion

350ms

Hover

120ms

Fade

180ms

Collapse

300ms

Never use bounce.

Never use elastic.

Never rotate components.

---

# Accessibility Flow

Entire application usable by keyboard.

Visible focus states.

Screen reader labels.

Reduced motion mode.

Accessible color contrast.

---

# Mobile Experience

Not desktop scaled down.

Navigation becomes bottom bar.

Quick Panel becomes drawer.

Workspace becomes swipeable.

Cards become stacked.

Loading experience remains identical.

---

# Exit Flow

There is no logout.

Closing browser ends session.

Application state is not persisted unless required for user preferences.

---

# User Success Journey

Visitor opens site.

↓

Secure connection animation.

↓

Dashboard.

↓

Clicks ReconForges.

↓

Module expands.

↓

Explores project.

↓

Returns.

↓

Views Experience.

↓

Downloads Resume.

↓

Opens GitHub.

↓

Contacts Aditya.

Total time

Under two minutes.

---

# UX Principles

Never surprise the user.

Never waste the user's time.

Never require unnecessary clicks.

Every interaction should reinforce the feeling of using a polished desktop application.

If an interaction does not improve clarity or usability, it should not exist.

End of Document.
