# PROJECT.md

# Project BLACKBOX

> **Internal Codename:** BLACKBOX
> **Public Name:** TBD
> **Version:** 1.0
> **Author:** Aditya Bhardwaj & ChatGPT

---

# 1. Overview

BLACKBOX is a desktop-first interactive portfolio that presents the professional journey of Aditya Bhardwaj through the experience of a modern security application.

It is **not** intended to resemble a traditional personal website.

Instead, visitors should feel as though they have opened an enterprise-grade security workspace where every module represents a part of Aditya's career, projects, experience, and achievements.

The goal is not to impress with visual effects.

The goal is to impress with craftsmanship.

---

# 2. Vision Statement

> Build a portfolio that feels like software.

Visitors should immediately feel that this is a carefully engineered product rather than another portfolio template.

Every interaction should communicate professionalism, attention to detail, and engineering quality.

---

# 3. Core Principles

## 3.1 Desktop First

The primary experience is designed for laptops and desktop computers.

Desktop is the reference design.

Mobile adapts the experience rather than shrinking it.

---

## 3.2 Zero Scroll Philosophy

The desktop experience must not rely on vertical scrolling.

Everything important must fit inside a single viewport.

Navigation happens by changing workspaces instead of moving down a page.

---

## 3.3 Application, Not Website

The user should feel like they opened software.

Not a landing page.

Not a blog.

Not a portfolio template.

Think:

* VS Code
* GitHub Desktop
* Linear
* Arc Browser
* Hack The Box Dashboard

Instead of

* Bootstrap Portfolio
* One Page Resume
* Landing Page

---

## 3.4 Authenticity

Everything displayed should represent real work.

No fake hacking.

No fake terminals.

No fake CPU usage.

No fake IP addresses.

No fake "Access Granted" animations.

If something is shown, it should represent something real.

---

## 3.5 Simplicity

The interface should never become visually noisy.

Minimal animations.

Minimal colors.

Minimal distractions.

The work should remain the focus.

---

# 4. Product Goals

The website should answer five questions within two minutes.

Who is Aditya?

What does he currently do?

What has he built?

What experience does he have?

How can I contact him?

Nothing should distract from these answers.

---

# 5. Target Audience

Primary Audience

* Recruiters
* Hiring Managers
* Technical Interviewers

Secondary Audience

* Security Engineers
* Pentesters
* Developers
* Open Source Maintainers
* CTF Players

---

# 6. Design Inspiration

The visual language is inspired by modern software rather than "hacker aesthetics."

Reference Products

* Linear
* GitHub
* Arc Browser
* Raycast
* Hack The Box
* VS Code

The interface should feel clean, structured, and purposeful.

---

# 7. User Journey

## Stage 1

Visitor opens website.

Black screen.

Minimal loading interface appears.

```
Establishing secure connection...

████████████░░░░

Validating certificate...

Loading operator profile...

Initializing workspace...

Ready.
```

Duration should remain under two seconds.

---

## Stage 2

Dashboard appears.

The visitor immediately sees

* Operator summary
* Current role
* Featured projects
* Quick links
* Navigation

No scrolling required.

---

## Stage 3

Selecting a module expands it into the workspace.

Instead of loading a new page, the module smoothly enlarges until it occupies the main workspace.

Closing the module returns the visitor to the dashboard.

---

# 8. Navigation Model

Desktop Navigation

Dashboard

Operations

Mission History

Capabilities

Certifications

Contact

Navigation remains visible at all times.

---

# 9. Dashboard

The dashboard is the home base.

Every interaction begins and ends here.

Information displayed includes

Current Position

Current Focus

Featured Operations

Recent Achievement

GitHub

Hack The Box

Resume

Quick Contact

---

# 10. Operations

Projects are referred to as Operations.

Each operation behaves like an application inside the workspace.

Selecting an operation expands it.

Closing returns to Dashboard.

Example operations

ReconForges

Secure File Management System

Materials Tool

Medicine Inventory

Future projects should require no UI redesign.

---

# 11. Mission History

Professional experience is presented as an operational timeline.

Rather than reading like a résumé, it should feel like a chronological deployment history.

Each milestone contains

Role

Organization

Duration

Responsibilities

Technologies

Impact

---

# 12. Capabilities

Instead of rating skills with percentages, capabilities are grouped into categories.

Example

Application Security

API Security

Recon Automation

Networking

Programming

Linux

Cloud

Security Testing

This avoids subjective skill ratings while remaining informative.

---

# 13. Certifications

Displayed as secure documents.

Each certification includes

Issuer

Date

Skills Acquired

Credential Link

Verification (if available)

---

# 14. Contact

The contact module remains intentionally minimal.

GitHub

LinkedIn

Email

Resume Download

No unnecessary contact form.

---

# 15. Motion Philosophy

Animations should communicate structure rather than decoration.

Examples

Module expansion

Workspace transition

Hover elevation

Button feedback

Panel fade

Animation should never delay usability.

---

# 16. Performance Goals

First Contentful Paint under 1.5 seconds.

Lighthouse targets

Performance: 100

Accessibility: 100

SEO: 100

Best Practices: 100

The portfolio should feel as fast as a desktop application.

---

# 17. Accessibility

Keyboard navigation must be fully supported.

High contrast colors.

Reduced motion support.

ARIA labels where appropriate.

Focus indicators visible.

Accessibility is a feature, not an afterthought.

---

# 18. Content Strategy

Content should remain concise.

Recruiters skim.

Security engineers explore.

Every sentence should provide value.

Avoid long autobiographies.

Show the work.

---

# 19. Technical Stack

Framework

Next.js

Language

TypeScript

Styling

Tailwind CSS

Animations

Framer Motion

UI Components

shadcn/ui

Icons

Lucide

Deployment

Vercel

---

# 20. Future Roadmap

Potential future additions

GitHub API Integration

Hack The Box API

Write-up Section

Blog

Research Notes

Dark Theme Variants

Analytics Dashboard

RSS Feed

Command Palette Enhancements

These should integrate naturally without changing the overall architecture.

---

# 21. Non-Goals

The project intentionally avoids

Hollywood hacker visuals

Matrix rain

Anonymous masks

Fake command spam

Fake cybersecurity metrics

Progress bars for skills

Infinite scrolling

Autoplay videos

Heavy particle effects

The portfolio should feel timeless rather than trendy.

---

# 22. Definition of Success

The project succeeds when:

* A recruiter understands Aditya's profile in under two minutes.
* A technical interviewer remembers the experience after leaving the site.
* The interface communicates professionalism without unnecessary spectacle.
* The design remains maintainable as new projects and achievements are added.
* Visitors leave with the impression that the same level of care shown in the portfolio is reflected in Aditya's engineering work.

---

# Motto

> **Build trust through clarity. Impress through craftsmanship.**

End of Document
