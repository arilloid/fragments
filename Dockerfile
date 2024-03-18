# Stage 0: Install the base dependencies + copy the source code
FROM node:20.11.1@sha256:e06aae17c40c7a6b5296ca6f942a02e6737ae61bbbf3e2158624bb0f887991b5 AS base

# Use /app as the working directory
WORKDIR /app 

# Copy package.json, package-lock.json 
COPY package* .
# Install the dependencies
RUN npm ci --only=production

# Copy src to /app/src/
COPY ./src ./src

######################################################

FROM node:20.11.1-alpine3.18@sha256:876514790dabd49fae7d9c4dfbba027954bd91d8e7d36da76334466533bc6b0c AS production

LABEL maintainer="Arina Kolodeznikova <arilloid>" \
    description="Fragments node.js microservice"

# Install tini from Alpine's package repository
RUN apk add --no-cache tini=0.19.0-r1 curl=8.5.0-r0

ENV PORT=8080 \
    NPM_CONFIG_LOGLEVEL=warn \
    NPM_CONFIG_COLOR=false \
    NODE_ENV=production

# Use /app as the working directory
WORKDIR /app 

# Copy built artifacts from the build stage
COPY --from=base /app .

# Ensure that files are owned by the 'node' user
RUN chown -R node:node /app

# Set health check for the server 
HEALTHCHECK --interval=15s --timeout=30s --start-period=10s --retries=3 \
  CMD curl --fail http://localhost:${PORT}/ || exit 1

# Set tini as the entry point to handle signals and zombie processes
ENTRYPOINT ["/sbin/tini", "--"]

# Switch to 'node' user before starting the app
USER node
CMD ["node", "src/index.js"]

EXPOSE 8080