# ===== Build =====
FROM node:20-bookworm-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# 1) Build args مع افتراضات آمنة
ARG NEXT_PUBLIC_API_BASE=/api
ARG SSR_API_BASE=http://platform-api.default.svc.cluster.local:8000

# 2) اجعلها متاحة داخل build (Next.js سيُضمّن NEXT_PUBLIC_* في الباندل)
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

# 3) لو عندك صفحات تستخدم SSR وتستدعي الـAPI من الخادم،
#    مرّر SSR_API_BASE هنا أيضاً (Runtime)
ENV SSR_API_BASE=http://platform-api.default.svc.cluster.local:8000
# (اختياري) مرّر NEXT_PUBLIC_API_BASE أيضاً لأغراض التشخيص
ENV NEXT_PUBLIC_API_BASE=/api

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
#COPY --from=builder /app/.next/static ./static
COPY --from=builder /app/.next/static ./.next/static


EXPOSE 3000


CMD ["node", "server.js"]



