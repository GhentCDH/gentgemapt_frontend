ARG NODE_VERSION=22

# base
FROM node:${NODE_VERSION} AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# dependenc stage
FROM base AS dependencies
COPY package.json pnpm-lock.yaml /app/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# build stage
FROM base AS build
COPY --from=dependencies /app/node_modules /app/
COPY . .
RUN pnpm run build

# release stage
FROM nginx:alpine
# Copy the built application from the build stage to the Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html/
# Add entrypoint scripts
COPY scripts/build_config.sh /docker-entrypoint.d/90-build_config.sh
COPY scripts/inject_analytics.sh /docker-entrypoint.d/91-inject_analytics.sh
# Expose port 80
EXPOSE 80
# Start Nginx
#CMD ["nginx", "-g", "daemon off;"]
