# ------------------------------
# 1. Build Stage
# ------------------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy only package files first (to leverage Docker cache)
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the project
COPY . .

# Build the Next.js app
RUN yarn build

# ------------------------------
# 2. Runtime Stage
# ------------------------------
FROM node:18-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Install only production dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# Copy built files from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/package.json ./

# Next.js needs a non-root user in prod
RUN addgroup --system --gid 1001 nextjs && \
    adduser --system --uid 1001 nextjs

USER nextjs

# Expose default Next.js port
EXPOSE 3000

# Start Next.js
CMD ["yarn", "start"]


