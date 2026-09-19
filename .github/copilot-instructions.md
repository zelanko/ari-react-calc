# Copilot Instructions

## Project

- This is a small React 19 calculator app built with Vite.
- The main UI and calculator behavior live in `src/App.jsx`.
- Global reset styles are in `src/index.css`; calculator styles are in `src/App.css`.
- Keep the app client-side and dependency-light.

## Coding Guidelines

- Preserve the existing calculator behavior: arithmetic operators, decimals, percent, delete, clear, equals, divide-by-zero handling, and keyboard input.
- Prefer small, focused React changes. Avoid adding abstractions for one-off behavior.
- Keep accessible button labels and the live calculator display intact.
- Remove unused scaffold files and styles when replacing generated Vite content.
- Match the existing visual language: dark background, warm light text, lime accent, responsive layout, and restrained motion.
- Use ASCII in source files unless a visible UI character is required.

## Validation

- Run `npm run lint` after source changes.
- Run `npm run build` before considering a change complete.
- For UI changes, verify the app in the local Vite dev server at `http://localhost:5173/` when available.
