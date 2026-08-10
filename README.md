# StackUnderflow — Frontend

A Stack Overflow–style Q&A platform, rebuilt from scratch as a modern Vue 3 single-page application. This is the public-facing client — browsing, asking, answering, voting, and everything else a visitor does — consuming a separate Laravel API.

This project is a portfolio rebuild of an older Laravel 6 + Vue 2 (Options API) application, redone with a modern stack and proper architecture: Vue 3 Composition API, Pinia for state, and a component-driven design system, rather than a line-by-line port of the legacy code.

## Tech stack

- **Vue 3** (`<script setup>`, Composition API)
- **Vite** — dev server and build tool
- **Pinia** — state management (auth store)
- **Vue Router 4** — routing, navigation guards, route-based code splitting
- **Tailwind CSS 4** (CSS-first config via `@theme`) + `@tailwindcss/typography` for rendering markdown content
- **Axios** — HTTP client, with a request interceptor that attaches the Sanctum bearer token
- **marked** — client-side markdown preview for the question/answer editor
- **vue3-toastify** — toast notifications
- **Vitest** + **Vue Test Utils** — unit/component testing

## Features

- Browse, search (by title or author), and filter questions by tag
- Full markdown question/answer authoring with a Write/Preview editor
- Voting on questions and answers, with optimistic UI and toggle-to-undo
- Accepting a best answer (question owner only)
- Bookmarking/favoriting questions
- Threaded comments on both questions and answers, with delete support
- Full auth flow: register, login, logout, forgot/reset password
- Edit/delete your own questions and answers, respecting backend authorization rules (e.g. a question with existing answers can't be deleted; a closed question can't receive new answers)
- "My Posts" activity page (your questions + answers, filterable)
- Reputation displayed alongside usernames throughout
- Responsive layout, skeleton loading states, and accessible interactive controls (ARIA labels/focus states on icon-only buttons)

## Getting started

### Prerequisites

- Node.js 22.18+ or 24.12+ (see `engines` in `package.json`)
- The companion [`stackunderflow-backend`](../stackunderflow-backend) Laravel API running locally (this app is only the client — it has no backend of its own)

### Setup

```sh
npm install
cp .env.example .env
```

Edit `.env` and point `VITE_API_BASE_URL` at your running backend's API, e.g.:

```
VITE_API_BASE_URL=http://stackunderflow-backend.test/api/v1
```

### Development server

```sh
npm run dev
```

### Production build

```sh
npm run build
npm run preview   # preview the production build locally
```

### Tests

```sh
npm run test:unit
```

### Lint & format

```sh
npm run lint
npm run format
```

## Project structure

```
src/
├── api/            One file per backend resource (questions.js, answers.js, auth.js, ...) —
│                    thin wrappers around the shared Axios client, no business logic.
├── assets/         Global CSS, including the Tailwind theme tokens (colors, fonts).
├── components/     Reusable UI: BaseButton, BaseInput, VoteButtons, CommentList, skeletons, etc.
├── composables/    Shared reactive logic (e.g. useVote, used by both question and answer voting).
├── router/         Route table, auth guard, and dynamic page titles.
├── stores/         Pinia stores (currently: auth).
├── utils/          Small framework-agnostic helpers (e.g. shared API error message formatting).
└── views/          One component per route — the actual pages.
```

## Architecture notes

- **Auth**: plain Sanctum bearer tokens, not cookie-based SPA auth. The token lives in Pinia (persisted to `localStorage`) and is attached to every request by an Axios interceptor in `api/client.js`.
- **Design system**: a small set of Tailwind theme tokens (`--color-paper`, `--color-ink`, `--color-accent`, etc.) defined once in `assets/main.css`, plus a handful of reusable base components (`BaseButton`, `BaseInput`, `PageContainer`), rather than one-off utility classes scattered per page.
- **Filtering/search**: the questions list uses the URL's query string (`?tag=`, `?search=`, `?page=`) as the source of truth, driven by a `watch` on the route rather than local component state — so filtered views are bookmarkable and back-button-friendly.
- **Testing**: unit/component tests focus on logic that's easy to get subtly wrong (store state transitions, the vote-toggle composable, ownership-gated UI) rather than chasing full coverage.
