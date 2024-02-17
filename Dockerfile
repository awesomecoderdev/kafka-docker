# Use the official Node.js image with the latest LTS version
FROM node:lts

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose any necessary ports
EXPOSE 3000

# Command to run the application
CMD ["node", "app.js"]
