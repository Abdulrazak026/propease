FROM node:22-alpine AS builder
WORKDIR /app
ARG CACHE_DATE=2026-06-05-v5
COPY backend/package*.json ./
RUN npm ci
COPY backend/ .
RUN npx prisma generate && npm run build && echo "build-v5"

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
RUN npx prisma generate
EXPOSE 4000
CMD sh -c "node dist/migrate-listing-status.js && npx prisma db push && node dist/index.js"
