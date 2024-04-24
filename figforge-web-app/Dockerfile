# Use a minimal Node.js image as a base
FROM node:18.18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Expose the port your Node.js app runs on
EXPOSE 3000

# Command to run the Node.js server
CMD ["npm", "run", "dev"]
