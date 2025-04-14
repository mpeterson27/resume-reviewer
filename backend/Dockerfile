# Use an official Node.js image
FROM node:18-slim

# Install poppler-utils (for pdf-poppler to work)
RUN apt-get update && \
    apt-get install -y poppler-utils && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source
COPY . .

# Build the project
RUN npm run build

# Set the command to run your app
CMD ["node", "dist/index.js"]
