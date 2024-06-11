# Use the official Node.js 20 image.
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose the application port
EXPOSE 8000

# Run initial migration and then start the application
CMD ["sh", "-c", "npx prisma migrate dev --name init && npx prisma migrate deploy && npm start"]


