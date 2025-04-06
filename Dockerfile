# Use the official Node.js 22 image
FROM node:22

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app source code
COPY . .

# Expose Vite's default dev server port
EXPOSE 5173

# Start the Vite dev server
CMD ["npm", "run", "dev"]
