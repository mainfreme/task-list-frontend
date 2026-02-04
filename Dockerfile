# ================================
# Stage 1: Build
# ================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build arguments for environment variables (passed during build)
ARG VITE_API_URL
ARG VITE_JWT_TOKEN

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_JWT_TOKEN=$VITE_JWT_TOKEN

# Build the application
RUN npm run build

# ================================
# Stage 2: Production (nginx)
# ================================
FROM nginx:alpine AS production

# Copy built files from builder stage to /task-list/ subdirectory
COPY --from=builder /app/dist /usr/share/nginx/html/task-list

# Copy custom nginx config
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# ================================
# Stage 3: Development (optional)
# ================================
FROM node:18-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
