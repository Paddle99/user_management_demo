# Use Node 20 LTS
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies (using npm ci for reproducible builds)
RUN npm ci

# Copy rest of the project (node_modules excluded via .dockerignore)
COPY . .

# Expose Vite server port
EXPOSE 5173

# Start server
CMD ["npm", "run", "dev", "--", "--host"]

