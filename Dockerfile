# Use Node.js LTS version as base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the app files
COPY . .

# Expose port 3000 (the same as in calculator.js)
EXPOSE 3000

# Start the server
CMD ["node", "src/calculator.js"]

