# ==========================================
# Phase 1: Builder (Node.js)
# ==========================================
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy the entire project context
COPY . .

# Change to the frontend directory
WORKDIR /app/ai-portal-ui

# Set npm registry to a faster one if needed (optional)
# RUN npm config set registry https://registry.npmmirror.com

# Install dependencies
# Use 'npm install' instead of 'npm ci' if package-lock.json is out of sync
RUN npm install

# Build the application
RUN npm run build

# ==========================================
# Phase 2: Runner (Nginx Alpine)
# ==========================================
FROM nginx:stable-alpine

# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static assets from builder stage
COPY --from=builder /app/ai-portal-ui/dist .

# Copy custom nginx configuration
COPY --from=builder /app/ai-portal-ui/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
