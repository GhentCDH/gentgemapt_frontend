
# Build node application
ARG NODE_VERSION=19

# build container
FROM node:${NODE_VERSION} AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .
RUN yarn build

# nginx container
FROM nginx:alpine
# Copy the built application from the build stage to the Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html/
# Expose port 80
EXPOSE 80
# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
