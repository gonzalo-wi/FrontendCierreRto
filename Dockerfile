# syntax=docker/dockerfile:1

# 1) Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# 2) Runtime stage (Nginx)
FROM nginx:alpine

# Nginx conf with API proxy to backend on 8001
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
