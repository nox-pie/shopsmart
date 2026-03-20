# ShopSmart Architecture

This document outlines the high-level architecture and infrastructure of the **ShopSmart** application.

## 1. High-Level System Architecture
ShopSmart is a modern full-stack web application cleanly separated into a client-side frontend and a server-side backend API.

*   **Frontend (Client):** 
    *   **Framework:** React 18 powered by Vite.
    *   **Styling:** Tailwind CSS for a premium, responsive, utility-first design system.
    *   **Routing:** React Router DOM (HashRouter) enabling a seamless Single Page Application (SPA) experience without requiring complex server-side route rewriting.
    *   **State & Icons:** React Context/Hooks for state management and `lucide-react` for lightweight SVG iconography.

*   **Backend (Server):**
    *   **Runtime:** Node.js (v20+).
    *   **Framework:** Express.js providing a lightweight, fast REST API.
    *   **Process Management:** PM2 is utilized in production to daemonize the Node.js process, ensuring 100% uptime, automatic restarts on failure, and efficient log management.

## 2. Infrastructure & Deployment
The application is deployed on **AWS (Amazon Web Services)** utilizing an elastic, predictable compute architecture.

*   **Compute:** AWS EC2 (Elastic Compute Cloud) running Ubuntu Server 24.04 LTS.
*   **Web Server (Reverse Proxy):** Nginx. 
    *   Nginx serves the static compiled assets (`/dist`) of the React frontend directly to users for maximum speed.
    *   It operates as a Reverse Proxy, securely forwarding all incoming `/api/*` traffic internally to the PM2-managed Express server running on port `3000`.
*   **Continuous Deployment (CD):** GitHub Actions automatically SSHs into the EC2 instance, runs an idempotent bash script (`scripts/deploy.sh`) to seamlessly pull the latest code, execute builds, and restart processes without manual intervention.

## 3. Testing Architecture
Quality assurance is baked into multiple layers of the application:
*   **Unit Tests:** Vitest (Frontend) and Jest (Backend) isolate and test individual components and logic paths.
*   **Integration Tests:** React Testing Library simulates complex component interactions (like the API-to-Cart data flow).
*   **End-to-End (E2E):** Playwright runs automated browsers (Chromium, WebKit, Firefox) asserting real-world usability from the homepage to dynamic category filtering.
