# ShopSmart - E-Commerce Platform
A highly scalable, beautifully designed full-stack e-commerce web application.

## Key Design Decisions
Throughout the development of ShopSmart, strict architectural and user-experience design decisions were made to prioritize performance, aesthetics, and reliability:

### 1. Premium Minimalist UI Design
Instead of relying on heavy CSS frameworks like Bootstrap, **Tailwind CSS** was selected. 
*   **Decision:** A custom "Premium Minimalist" aesthetic was designed utilizing glassmorphism, tailored monochrome palettes with subtle accents, and micro-animations exclusively via Tailwind.
*   **Impact:** The user interface feels incredibly modern, fast, and visually distinct, moving away from generic templates to a truly bespoke browsing experience.

### 2. Frontend API Mocking Fallbacks
Reliability is prioritized. During the early stages of development or when the backend is unreachable/cold-booting, the frontend shouldn't hard-crash.
*   **Decision:** The frontend `api.js` wrapper is constructed with a dynamic `catch` layer. If the `fetch` request fails (e.g., an offline Express server), it instantly intercepts the failure and returns a rich set of "Fallback Mock Products".
*   **Impact:** This ensures the UI components (`Collection.jsx`, `Hero.jsx`) render flawlessly regardless of strict backend availability, greatly enhancing offline development and E2E testing speed.

### 3. HashRouter for SPA Navigation
*   **Decision:** We actively chose to use `HashRouter` over `BrowserRouter` for React Router DOM.
*   **Impact:** When deploying SPAs manually to generalized web servers (like Nginx on AWS EC2), traditional browser routing causes `404 Not Found` errors if a user refreshes a page directly (e.g., refreshing `/collection`), because the server tries to search for a physical `/collection` directory. By utilizing a URL Hash (`/#/collection`), all traffic inherently resolves to `index.html`, eliminating the need for complex server-level URL rewrites and guaranteeing seamless deep-linking out of the box.

### 4. Zero-Dependency Deployment Idempotency
*   **Decision:** The primary deployment script (`scripts/deploy.sh`) was written to be completely standalone and idempotent. It natively checks for Node.js, `pm2`, and Nginx installations before executing logic.
*   **Impact:** Developers do not have to manually pre-configure AWS AMIs or run extensive setup scripts during server creation. A completely empty EC2 Ubuntu server can natively clone the project, execute the script, bootstrap its own environment, and safely launch to production in a single unattended command.

## Quick Start (Local Development)
1. **Clone** the repository.
2. **Start Backend**: `cd server && npm install && npm run dev` (Runs on Port 3000)
3. **Start Frontend**: `cd client && npm install && npm run dev` (Runs on Port 5173)
