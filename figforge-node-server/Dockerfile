# Use a minimal Node.js image as a base
FROM node:18.18-alpine

# Install Git on Container
RUN apk --no-cache add git

# Set up Git user information
RUN git config --global user.email "i200426@nu.edu.pk" && \
    git config --global user.name "Mahad Ahmed"

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Expose the port your Node.js app runs on
EXPOSE 3001

# Command to run the Node.js server
CMD ["node", "server.js"]
