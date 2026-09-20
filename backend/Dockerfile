# =========================
# Build Stage
# =========================
FROM node:22.23.2-alpine3.24 AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY src ./src


# =========================
# Production Stage
# =========================
FROM node:22.23.2-alpine3.24

WORKDIR /app

# Copy only production dependencies
COPY --from=build /app/node_modules ./node_modules

# Copy application source
COPY --from=build /app/src ./src

# Remove package managers from runtime image
RUN rm -f /usr/local/bin/npm \
          /usr/local/bin/npx \
          /usr/local/bin/corepack \
          /usr/bin/npm \
          /usr/bin/npx \
          /usr/bin/corepack \
    && rm -rf /usr/local/lib/node_modules/npm \
              /usr/local/lib/node_modules/corepack

# Run as non-root user
USER node

EXPOSE 5100

CMD ["node", "src/server.js"]
