# Project Overview
This is a modern character voting application built with **Next.js 16** (App Router) and **React 19**. It utilizes a separate **Express Backend** for data persistence and business logic.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS 4, PostCSS
- **API Communication:** Fetch API
- **Testing:** Jest, React Testing Library
- **Deployment:** Docker (Standalone output)

## Architecture
- `app/`: Contains the main application routes and logic.
  - `layout.js`: Root layout with Geist font integration and global styles.
  - `page.tsx`: Main character voting dashboard (Client Component).
  - `actions.ts`: Server Actions for handling proxying votes to the backend and cache revalidation.
  - `leaderboard/`: Rank-based visualization of character statistics.
- `__tests__/`: Unit and integration tests using Jest.
- `public/`: Static assets.

# Building and Running

## Prerequisites
- Node.js 20+
- Backend service running (default: http://localhost:4000)

## Environment Variables
Create a `.env.local` file with the following:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Development
To start the development server:
```bash
npm run dev
```

## Production Build
To create an optimized production build (using standalone output):
```bash
npm run build
```

## Running Production
To start the production server:
```bash
npm run start
```

## Testing
To run tests (ensure Jest is configured):
```bash
npx jest
```

## Linting
To run the linter:
```bash
npm run lint
```

# Development Conventions

## Guidelines
- **App Router:** Follow Next.js App Router conventions (e.g., `page.js`, `layout.js`, `loading.js`).
- **Backend API:** All database and state-changing operations MUST go through the backend API. Do NOT use direct database clients in the frontend.
- **Server Actions:** Use `'use server'` in `app/actions.ts` to wrap backend API calls when server-side logic or cache revalidation is needed.
- **Styling:** Prefer Tailwind CSS 4 utility classes.
- **Type Safety:** Use TypeScript for components and utility functions.
- **Imports:** Use the `@/` alias for absolute imports from the project root.

## Special Instructions for AI Agents
> [!IMPORTANT]
> This project uses a version of Next.js that may have breaking changes or conventions differing from standard training data. 
> - Read the relevant guide in `node_modules/next/dist/docs/` before writing any code.
> - Heed all deprecation notices.
> - Always refer to `AGENTS.md` for the latest agent-specific rules.

## Deployment
The project is configured for containerized deployment via the `Dockerfile`. It uses a multi-stage build and the Next.js `standalone` output for efficiency. Build-time argument `NEXT_PUBLIC_API_URL` is required.
