# ===== Build =====
FROM node:20-bookworm-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

ARG NEXT_PUBLIC_API_BASE=/api
ARG SSR_API_BASE=http://platform-api.default.svc.cluster.local:8000

ENV NEXT_PUBLIC_API_BASE=${NEXT_PUBLIC_API_BASE}
ENV SSR_API_BASE=${SSR_API_BASE}

RUN echo ">> BUILD: NEXT_PUBLIC_API_BASE=${NEXT_PUBLIC_API_BASE} ; SSR_API_BASE=${SSR_API_BASE}"

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build    # Next.js يبني هنا

# ===== Runtime (standalone) =====
FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1


ENV SSR_API_BASE=http://platform-api.default.svc.cluster.local:8000

ENV NEXT_PUBLIC_API_BASE=/api

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
#COPY --from=builder /app/.next/static ./static
COPY --from=builder /app/.next/static ./.next/static


EXPOSE 3000


CMD ["node", "server.js"]



