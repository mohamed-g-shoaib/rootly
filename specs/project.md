# Project Configuration and Preferences

## Configuration and Preferences

1- Project is using shadcn/ui components with Radix UI and Lyra styling applied, do not override or ignore the existing styling of components.
2- All shadcn/ui components are installed, styled, and configured, dark mode is configured, and tooltip is also configured.
3- Project is using Oxc (Oxfmt and Oxlint) for formatting and linting. Full type-aware linting is enabled via `oxlint-tsgolint`, and `oxfmt` is configured with auto-sorting for imports, Tailwind classes, and `package.json`.
4- VS Code is configured for automatic fix-on-save and format-on-save using the Oxc extension.
5- Project uses Phosphor Icons.

## Project Context
Rootly Notes is a **learning notebook for developers** — a personal tool that helps you capture, organize, and review knowledge while you're actively learning.

## The Core Problem It Solves

When developers are mid-course or mid-video, they need to quickly jot down what they're learning without losing focus. Rootly Notes acts as that structured capture layer — not just a dumbed-down notes app, but one designed specifically around the way developers learn.

## What You Can Do With It

The app is built around a few interconnected workflows:

- **Take Q&A notes** — each note has a question, answer, optional code snippet, and an understanding level (1–5) so you can gauge how well you actually grasp something
- **Organize by course** — notes are attached to courses you're following, each with an instructor, topics, and resource links
- **Log daily study sessions** — track your study time, mood (1–5), and reflective notes for each day
- **Review and practice** — a spaced-repetition-style review mode where you hide answers, test your memory, then rate your recall to adjust your understanding level up or down
- **Visualize progress** — a dashboard with charts covering study sessions over time, mood trends, course mastery, and understanding progress

## Who It's For

It's aimed at self-taught developers and learners who consume a lot of online courses, tutorials, or documentation and want a single structured place to retain what they learn — not scattered across Notion, Google Docs, or random text files. It's for those who want to be more intentional about their learning process, track their progress, and have a tool that fits seamlessly into their workflow without being a distraction.