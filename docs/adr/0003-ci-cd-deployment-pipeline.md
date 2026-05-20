# 0003. Unified CI/CD Deployment Pipeline with Vercel and Render

**Status: Accepted**

## Context
We need to automate the deployments of both the **Voting Client** (on Vercel) and the **Voting Service** (on Render) so that they deploy automatically when code is pushed to GitHub, ensuring that deployments only succeed if the automated test suite passes.

We previously favored Vercel's Native Git integration (ADR-0002). However, to achieve a unified, test-gated deployment process for both frontend and backend microservices under a single pipeline platform, we need to transition to GitHub Actions-driven deployments.

## Decision
We decided to orchestrate our full continuous deployment (CD) pipeline inside our GitHub Actions workflow [ci.yml](file:///Users/martksk/Documents/GitHub/devops_project/.github/workflows/ci.yml):

1. **Backend Deployment (Render):**
   * Triggered on pushes to `main` after the `test-backend` job completes successfully.
   * Triggered by hitting Render's service **Deploy Hook** via an HTTP `POST` request using `curl`.
2. **Frontend Deployment (Vercel):**
   * Managed via the **Vercel CLI** within GitHub Actions.
   * Pull requests trigger a **Vercel Preview** deployment.
   * Pushes to `main` trigger a **Vercel Production** deployment.
   * Execution is gated by successful completion of the `test-frontend` job.

## Consequences
* **Unified Control:** Developers can track the exact status of both tests and deployments from a single interface (GitHub Actions).
* **Guaranteed Integrity:** No code can be deployed to production (or even previewed in PRs for the frontend) unless the respective test suite passes first.
* **Secrets Management:** The repository owner must configure the following secrets in GitHub:
  * `RENDER_DEPLOY_HOOK_URL` (From the Render dashboard)
  * `VERCEL_TOKEN` (Vercel Access Token)
  * `VERCEL_ORG_ID` (Vercel Team/User ID)
  * `VERCEL_PROJECT_ID` (Vercel Project ID)
