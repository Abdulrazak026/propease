FROM node:22-alpine AS builder
WORKDIR /app
ARG CACHE_DATE=2026-06-05-v4
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build && echo "build-v4"

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
RUN npx prisma generate
EXPOSE 4000
CMD sh -c "npx prisma db push && node dist/index.js -v2"
