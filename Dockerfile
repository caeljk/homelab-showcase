# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build the project
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-slim

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy the built files and the server entry point
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./server.js

# Expose the internal port (Express default 3001)
EXPOSE 3001

# Set environment variable for port
ENV PORT=3001

# Start the server
CMD ["npm", "start"]
