FROM node:18-alpine

# Add glibc compatibility for Alpine
RUN apk add --no-cache libc6-compat

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies using npm ci, which is better for reproducible builds
RUN npm ci

# Copy the rest of your application code
COPY . .

# Start the application in development mode
CMD ["npm", "run", "dev"]