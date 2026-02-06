# 1. Use Node 20 LTS Alpine
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json and package-lock.json first
COPY package*.json ./

# 4. Install all dependencies including devDependencies
RUN npm install --legacy-peer-deps

# 5. Copy the rest of the app
COPY . .

# 6. Expose Vite port
EXPOSE 3000

# 7. Start the app
CMD ["npm", "start"]
