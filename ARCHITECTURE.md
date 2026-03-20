# ShopSmart Architecture

This document outlines the high-level architecture, technology stack, and infrastructure of the **ShopSmart** application.

---

## 1. System Architecture Diagram

```text
                              +---------------------+
                              |      Developer      |
                              |  (git push / PR)    |
                              +----------+----------+
                                         |
                                         v
+------------------------------------------------------------------------+
|                        GitHub Repository (nox-pie/shopsmart)           |
|                                                                        |
|  +------------------+  +------------------+  +-----------------------+ |
|  | ci.yml           |  | build.yml        |  | deploy.yml            | |
|  | (Lint + Test)    |  | (Vite Build)     |  | (EC2 SSH Deployment)  | |
|  |                  |  |                  |  |                       | |
|  | - ESLint Server  |  | - npm ci         |  | - appleboy/ssh-action | |
|  | - ESLint Client  |  | - npm run build  |  | - git clone/pull     | |
|  | - Jest (Backend) |  | - Artifact Check |  | - scripts/deploy.sh  | |
|  | - Vitest (Client)|  |                  |  |                       | |
|  +------------------+  +------------------+  +-----------+-----------+ |
|                                                          |             |
|  +------------------+  +------------------+              |             |
|  | recap.yml        |  | dependabot.yml   |              |             |
|  | (Weekly Summary) |  | (Security Scan)  |              |             |
|  +------------------+  +------------------+              |             |
+------------------------------------------------------------------------+
                                                           |
                                              (Secure SSH via .pem Key)
                                                           |
                                                           v
+------------------------------------------------------------------------+
|                  AWS EC2 Instance (Ubuntu 24.04 LTS)                   |
|                                                                        |
|  +---------------------------+                                         |
|  |   scripts/deploy.sh       |  (Idempotent Bootstrap)                |
|  |                           |                                         |
|  |  1. Check & Install Node  |                                         |
|  |  2. Check & Install PM2   |                                         |
|  |  3. Check & Install Nginx |                                         |
|  |  4. git pull origin main  |                                         |
|  |  5. npm ci (server)       |                                         |
|  |  6. npm ci + build (client)|                                        |
|  |  7. Copy /dist to webroot |                                         |
|  |  8. Restart PM2 + Nginx   |                                         |
|  +---------------------------+                                         |
|                                                                        |
|  +----------------------------+       +-----------------------------+  |
|  |  Nginx Web Server          |       |  PM2 Process Manager        |  |
|  |  (Port 80 / 443)           |       |                             |  |
|  |                            |       |  +------------------------+ |  |
|  |  / ──────> Static /dist    |       |  | Express.js REST API    | |  |
|  |            (React SPA)     |       |  | (Localhost:3000)       | |  |
|  |                            |       |  |                        | |  |
|  |  /api/* ──> Reverse Proxy ─+──────>|  | GET  /api/products     | |  |
|  |             to :3000       |       |  | POST /api/cart          | |  |
|  |                            |       |  | GET  /api/categories   | |  |
|  +----------------------------+       |  +------------------------+ |  |
|                                       |  Auto-restart on crash      |  |
|                                       |  Log management             |  |
|                                       +-----------------------------+  |
+------------------------------------------------------------------------+
                          |
                          v
+------------------------------------------------------------------------+
|                       End User (Browser)                               |
|                                                                        |
|   URL: http://<EC2_PUBLIC_IP>                                          |
|                                                                        |
|   +-------------------------------+   +-----------------------------+  |
|   | React 18 SPA (HashRouter)     |   | REST API Responses          |  |
|   |                               |   |                             |  |
|   | /#/           -> Home (Hero)  |   | /api/products -> JSON[]     |  |
|   | /#/collection -> Product Grid |   | /api/cart     -> Cart State |  |
|   | /#/about      -> About Page   |   | /api/categories -> Tags[]  |  |
|   | /#/blog       -> Blog Page    |   |                             |  |
|   | /#/faq        -> FAQ Page     |   | On API Failure:             |  |
|   | /#/cart       -> Cart Page    |   |  -> Fallback Mock Data      |  |
|   | /#/profile    -> Profile Page |   |     (Graceful Degradation)  |  |
|   +-------------------------------+   +-----------------------------+  |
+------------------------------------------------------------------------+
```

---

## 2. Technology Stack

| Layer        | Technologies                                                   |
|--------------|----------------------------------------------------------------|
| **Frontend** | React 18, Vite 5, Tailwind CSS, `lucide-react`, React Router  |
| **Backend**  | Node.js 20+, Express.js, In-Memory Arrays (Mock DB)           |
| **Testing**  | Vitest (Client), Jest (Server), Playwright (E2E Browser Tests) |
| **DevOps**   | GitHub Actions CI/CD, Dependabot, ESLint, Prettier             |
| **Deploy**   | AWS EC2 via SSH, PM2 daemon, Nginx Reverse Proxy               |

---

## 3. Testing Architecture

```text
+------------------------------------------------------------------------+
|                       Three-Tier Testing Pyramid                       |
|                                                                        |
|                          /‾‾‾‾‾‾‾‾‾‾‾‾‾\                              |
|                         /   E2E Tests    \    Playwright (Chromium)     |
|                        /   (6 spec files) \   Real browser automation  |
|                       /___________________\                            |
|                      /                     \                           |
|                     /  Integration Tests    \  React Testing Library   |
|                    /   (API, App, Navbar)    \ Async state validation  |
|                   /_________________________\                          |
|                  /                           \                         |
|                 /      Unit Tests             \ Vitest + Jest          |
|                /  (Hero, Navbar, App, Server)  \ Isolated components  |
|               /_________________________________\                      |
+------------------------------------------------------------------------+
```

| Tier            | Frontend (Client)                      | Backend (Server)              |
|-----------------|----------------------------------------|-------------------------------|
| **Unit**        | Vitest: Hero, Navbar, App components   | Jest: Route handlers, logic   |
| **Integration** | API flow, Cart state, Navbar routing   | Middleware chain validation   |
| **E2E**         | Playwright: 6 browser spec files       | —                             |

---

## 4. High-Level Component Design

ShopSmart is cleanly separated into two distinct workspaces:

### Frontend (Client)

- **SPA Structure:** React component architecture focusing on reusability (Hero, Navbar, Product Cards, Category Pills, Cart Drawer).
- **Routing:** React Router DOM configured as a `HashRouter` (`/#/`) enabling deep-linking on raw Nginx without requiring complex server-side URL rewriting rules.
- **Fallback Resilience:** The `api.js` frontend wrapper uses a dynamic `catch` mechanism to seamlessly return local fallback mock data if the Express backend goes offline, enhancing frontend testability and uptime.
- **Styling:** Tailwind CSS with a custom "Premium Minimalist" design system featuring glassmorphism, micro-animations, and responsive breakpoints.

### Backend (Server)

- **REST API:** Lightweight Express.js providing CRUD capabilities over products and user carts via in-memory arrays.
- **PM2 Daemonization:** PM2 guarantees 100% process uptime, automatically restarting the Express server during crashes or deployments.
- **Stateless Design:** No external database dependency. Data is served from in-memory arrays making the server instantly portable and zero-configuration.

---

## 5. CI/CD Pipeline Flow

```text
Developer Push
      |
      v
+-- ci.yml --------+     +-- build.yml ----+     +-- deploy.yml ------+
| 1. Lint Server   |     | 1. npm ci       |     | 1. SSH into EC2   |
| 2. Lint Client   |     | 2. Vite Build   |     | 2. git clone/pull |
| 3. Jest Tests    |     | 3. Verify /dist |     | 3. Bootstrap deps |
| 4. Vitest Tests  |     +------ PASS -----+     | 4. npm ci + build |
+------ PASS ------+                              | 5. Restart PM2    |
                                                  | 6. Reload Nginx   |
                                                  +--- LIVE ON EC2 ---+
```
