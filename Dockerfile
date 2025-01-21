# Use the official Node.js image based on Debian for better compatibility
FROM node:20-bullseye

# Set environment variables for non-interactive installations
ENV DEBIAN_FRONTEND=noninteractive

# Install additional dependencies needed for Electron
RUN apt-get update && \
    apt-get install -y \
    libgtk-3-dev \
    libx11-dev \
    libxkbfile-dev \
    libgconf-2-4 \
    libnss3 \
    xvfb \
    xauth \
    xinit \
    openbox \
    fonts-dejavu \
    curl \
    wget \
    git \
    bash \
    build-essential

# Install Electron globally
RUN npm install -g electron

# Set the working directory to /app
WORKDIR /app

# Copy the app's package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port (if necessary for your Electron app)
EXPOSE 3000

# Start a lightweight window manager and run the app
CMD ["xvfb-run", "--auto-servernum", "--server-args='-screen 0 1024x768x24'", "openbox", "&", "npm", "start"]
