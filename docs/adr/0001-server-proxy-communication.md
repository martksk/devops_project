# 0001. Server Proxy Communication for Voting

## Context
In a split-hosting architecture where the **Voting Client** resides on Vercel and the **Voting Service** resides on a separate provider (Option A), the client browser needs to communicate changes (e.g., casting a **Vote**). 

We considered two primary pathways:
1. **Client-Direct:** Browser communicates directly with the raw **Voting Service** API.
2. **Server-Proxy (Accepted):** Browser triggers a Next.js Server Action (`'use server'`), which then calls the **Voting Service** server-to-server.

## Decision
We decided to adopt the **Server-Proxy** pattern using **Next.js Server Actions**. 

We rejected direct client-to-backend fetching because:
* Direct fetching exposes the backend **Voting Service** endpoints publicly in the browser's network tab, expanding the attack surface.
* It requires configuring wildcard or dynamic Cross-Origin Resource Sharing (CORS) rules on the Express backend.
* Proxying allows Vercel's edge environment to act as an authentication, validation, and rate-limiting gateway.

## Consequences
* **Security:** The backend URL is hidden; the frontend only exposes relative Server Action endpoints.
* **CORS:** The **Voting Service** can restrict incoming traffic solely to Vercel server IPs or configure simpler CORS since the browser does not call it directly.
* **Cost/Performance:** Negligible extra latency (double-hop) and serverless execution time on Vercel, which is a worthwhile trade-off for improved security and simpler architecture.
