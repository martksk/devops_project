# 0002. Native Vercel Integration with GitHub Status Checks

## Context
We need to automate deployments of the **Voting Client** to Vercel while ensuring that failing tests block unstable code from reaching the production environment (`main`).

We considered two execution workflows:
1. **Custom CI/CD Deploy:** Run tests via GitHub Actions; if successful, push to Vercel via Vercel CLI.
2. **Vercel Native + GitHub Status Checks (Accepted):** Use Vercel's native GitHub app for instant Git-push preview deployments, combined with GitHub Actions to enforce automated tests before merging to `main`.

## Decision
We decided to adopt **Vercel's Native Git Integration** paired with a GitHub Actions **Required Status Check**. 

We rejected Custom CI/CD deployment scripting because:
* Vercel's native Git-push integration is optimized for speed, reliable caching, and provides integrated pull request comments.
* Creating a custom deployment job requires managing CLI secrets (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`) which increases security overhead and configuration complexity.
* Branch protection rules on GitHub allow us to make the test suite a hard gate before PRs can be merged into `main`. This maintains absolute safety for the production environment while retaining the benefits of automatic preview deployments on Vercel.

## Consequences
* **Developer Experience:** Developers get instant feedback loops with live previews on every PR.
* **Safety:** Code can only be merged to `main` (Production) if all Jest unit and integration tests pass.
* **Security:** No Vercel deployment credentials need to be stored in GitHub Secrets.
