# syntax=docker/dockerfile:1
# Multi-stage image: Vite client build + Express API + static SPA (college rubric: multi-stage, non-root, HEALTHCHECK).

# --- Stage 1: build React client (same-origin /api in container) ---
FROM node:20-bookworm-slim AS frontend-build
WORKDIR /build/client
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# --- Stage 2: production server dependencies only ---
FROM node:20-bookworm-slim AS server-deps
WORKDIR /build/server
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev

# --- Stage 3: minimal runtime ---
FROM node:20-bookworm-slim AS runtime
RUN apt-get update \
  && apt-get install -y --no-install-recommends curl \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd --system --gid 10001 shopsmart \
  && useradd --system --uid 10001 --gid shopsmart --home-dir /app --no-create-home --shell /usr/sbin/nologin shopsmart

WORKDIR /app
COPY --from=server-deps /build/server/node_modules ./node_modules
COPY server/package.json ./
COPY server/src ./src
COPY --from=frontend-build /build/client/dist ./static

ENV NODE_ENV=production
ENV PORT=5001
ENV HOST=0.0.0.0
ENV SHOPSMART_STATIC_DIR=/app/static

USER shopsmart
EXPOSE 5001

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD curl -fsS http://127.0.0.1:5001/api/health >/dev/null || exit 1

CMD ["node", "src/index.js"]
