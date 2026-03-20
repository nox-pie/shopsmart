# ShopSmart Architecture

This document outlines the high-level architecture, technology stack, and infrastructure of the **ShopSmart** application.

## 1. System Architecture Diagram

```text
+------------------------------------------------------------------+
|                     GitHub Actions CI/CD                         |
|  +---------------------------+    +--------------------------+   |
|  | CI Pipeline (ci.yml)      |    | EC2 Deploy (deploy.yml)  |   |
|  | (Vitest, Jest, Playwright)|    | (SSH + Idempotent Script)|   |
|  +---------------------------+    +--------------------------+   |
+------------------------------------------------------------------+
                                        | (Secure SSH)
                                        v
+------------------------------------------------------------------+
|                AWS EC2 Instance (Ubuntu 24.04 LTS)               |
|                                                                  |
|  +----------------------+        +----------------------------+  |
|  | Nginx Reverse Proxy  |        | PM2 Node Process Manager   |  |
|  | (Port 80/443)        | =====> | Express.js REST API        |  |
|  | Serves Static /dist  |        | Localhost:3000             |  |
|  +----------------------+        +----------------------------+  |
+------------------------------------------------------------------+
```

## 2. Technology Stack

| Layer        | Technologies                                                   |
|--------------|----------------------------------------------------------------|
| **Frontend** | React 18, Vite 5, Tailwind CSS, `lucide-react`, React Router   |
| **Backend**  | Node.js 20+, Express.js, In-Memory Arrays (Mock DB)            |
| **Testing**  | Vitest (Client), Jest (Server), Playwright (E2E UI Validation) |
| **DevOps**   | GitHub Actions CI/CD, Dependabot, ESLint, Prettier             |
| **Deploy**   | AWS EC2 via SSH, PM2 daemon, Nginx Web Server                  |

## 3. High-Level Component Design
ShopSmart is cleanly separated into two distinct spaces:

*   **Frontend (Client):** 
    *   **SPA Structure:** React component architecture focusing on reusability (Categories, Product Cards, Cart Drawer).
    *   **Routing:** React Router DOM configured uniquely as a `HashRouter` (`/#/`) enabling deep-linking on raw Nginx implementations without necessitating complex server-side rewriting rules.
    *   **Fallback Resilience:** The `api.js` frontend layer uses a dynamic `catch` mechanism to seamlessly return local fallback data if the Express backend goes offline, enhancing frontend testability and uptime.

*   **Backend (Server):**
    *   **REST API:** Lightweight, highly isolated route architecture providing CRUD capabilities over products and user carts.
    *   **PM2 Daemonization:** PM2 guarantees 100% process uptime, natively logging backend errors and automatically gracefully restarting the Express server during deployments or failures.
