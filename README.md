# ShopSmart 🛍️

[![CI Pipeline](https://github.com/nox-pie/shopsmart/actions/workflows/ci.yml/badge.svg)](https://github.com/nox-pie/shopsmart/actions/workflows/ci.yml)
[![EC2 Deployment](https://github.com/nox-pie/shopsmart/actions/workflows/deploy.yml/badge.svg)](https://github.com/nox-pie/shopsmart/actions/workflows/deploy.yml)
[![Production Build](https://github.com/nox-pie/shopsmart/actions/workflows/build.yml/badge.svg)](https://github.com/nox-pie/shopsmart/actions/workflows/build.yml)

A highly scalable, beautifully designed full-stack e-commerce web application.

---

## Prerequisites
- **Node.js** >= 18 (LTS recommended)
- **npm** >= 9
- **Git**

## Quick Start (Running Locally)

### 1. Setup Backend
```bash
# Terminal 1 - Boot the Express Server
cd server
npm install
npm run dev    # Starts backend typically on Localhost:3000
```

### 2. Setup Frontend
```bash
# Terminal 2 - Boot the Vite React App
cd client
npm install
npm run dev    # Starts frontend typically on Localhost:5173
```

---

## Project Structure
```text
shopsmart/
├── .github/
│   ├── workflows/
│   │   ├── build.yml              # Production bundling and artifact generation
│   │   ├── ci.yml                 # Main CI pipeline (Linting & Testing)
│   │   ├── deploy.yml             # Native EC2 SSH deployment workflow
│   │   ├── recap.yml              # Weekly automated code recap/summary
│   │   └── variables_secrets.yml  # Utility defining environment topologies
│   └── dependabot.yml             # Weekly security & dependency scanner
├── client/                        # React 18 Frontend Workspace
│   ├── src/
│   │   ├── api/                   # Fetch wrappers with Mock Fallbacks
│   │   ├── components/            # Reusable UI (Hero, Navbar)
│   │   ├── pages/                 # SPA Routing Pages (Collection, Cart, FAQ, Blog)
│   │   ├── __tests__/             # Unit and Integration Test Suites
│   │   ├── App.jsx                # Main HashRouter application component
│   │   ├── index.css              # Custom Tailwind directives and animations
│   │   ├── main.jsx               # React DOM rendering entry point
│   │   └── setupTests.js          # Vitest DOM environment configuration
│   ├── tests/e2e/                 # Playwright Web browser specs
│   │   ├── api-mock.spec.js       # Verifies backend offline/mocking states
│   │   ├── category-pills.spec.js # Verifies interactive DOM filters
│   │   ├── homepage.spec.js       # Core visual workflow tests
│   │   ├── navigation.spec.js     # HashRouter URL validation tests
│   │   ├── responsive.spec.js     # Mobile breakpoint simulations
│   │   └── search.spec.js         # Input validation and rendering tests
│   ├── eslint.config.js           # Frontend Linting rules
│   ├── package.json               # Client dependencies
│   ├── playwright.config.js       # Playwright E2E configuration
│   ├── postcss.config.js          # CSS post-processing rules
│   ├── tailwind.config.js         # Core "Premium Minimalist" design tokens
│   └── vite.config.js             # Vite bundler parameters
├── server/                        # Express Backend Workspace
│   ├── src/
│   │   └── index.js               # Primary Express backend logic & REST API
│   ├── eslint.config.mjs          # Backend Linting configuration
│   └── package.json               # Server Node dependencies
├── scripts/
│   ├── deploy.sh                  # Idempotent automated AWS deployment script
│   ├── ec2_health_check.sh        # Uptime and HTTP validation script
│   ├── launch_ec2.sh              # EC2 initialization script
│   └── safe_ec2_control.sh        # Utility to cleanly manage EC2 states
├── ARCHITECTURE.md                # In-depth application architectural footprint
├── CONTRIBUTING.md                # CI/CD and Version Control team guidelines
└── README.md                      # Foundational project documentation!
```

---

## Technical Design Decisions

1. **Premium Minimalist UI (Tailwind CSS)**
   Rather than relying on bloated libraries, a custom "Premium Minimalist" aesthetic was deployed leveraging structural Tailwind CSS. This enabled glassmorphism, dynamic monochrome palettes, and rich micro-animations uniquely defining the brand.
2. **Zero-Dependency Idempotent Scripts**
   The primary `scripts/deploy.sh` avoids manual EC2 configurations. It was hard-coded with a cold-boot sequence checking for `node`, `pm2`, and `nginx`, installing them automatically from standard OS targets if absent.
3. **Frontend API Mocking Fallbacks**
   To increase development velocity and prevent application white-screening, `api.js` has native catch sequences returning rich local dummy data. An offline backend no longer crashes the UI.
4. **HashRouting Paradigm**
   Choosing `HashRouter` solved default Single Page Application `<Route />` bugs common to Nginx instances, preventing `404 Not Found` loops during deep-linking.

---

## GitHub Secrets Required (CI/CD)
To enable the dynamic AWS deployment action, your repository requires these keys:

| Secret Name    | Description                                            |
|----------------|--------------------------------------------------------|
| `EC2_HOST`     | The public IPv4 address of the EC2 instance            |
| `EC2_USER`     | The SSH login username (e.g., `ubuntu` or `ec2-user`)  |
| `EC2_SSH_KEY`  | The unclipped base64 text of the `.pem` private key    |

---

## Challenges and Solutions

| Challenge                                    | Solution                                                                                   |
|----------------------------------------------|--------------------------------------------------------------------------------------------|
| Nginx 404ing on React SPAs                   | Integrated `HashRouter` eliminating server-side deep link parsing bugs.                    |
| Fresh EC2 servers failing `npm ci` scripts   | Rewrote `deploy.sh` to defensively test for `node` and inject `apt-get` bootstrappers globally. |
| E2E Playwright tests hanging on raw fetch    | Intercepted native URLs with `waitUntil: 'domcontentloaded'` allowing tests to bypass spinlocks. |
| Mixed UI styling inconsistencies             | Consolidated everything into strict `theme.extend` classes within `tailwind.config.js`.    |
