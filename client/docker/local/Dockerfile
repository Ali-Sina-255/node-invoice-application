# 1. Use a modern Node.js LTS version
ARG NODE_VERSION=20-alpine
FROM node:${NODE_VERSION}

# 2. Metadata
LABEL name="mern-invoice"
LABEL description="MERN invoice image"

# 3. Set working directory
ARG APP_HOME=/app
WORKDIR ${APP_HOME}

# 4. Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# 5. Configure npm for network issues (optional)
# RUN npm config set registry https://registry.npmjs.org/ \
#     && npm config set fetch-timeout 60000 \
#     && npm config set network-timeout 60000

# 6. Install dependencies
RUN npm install

# 7. Copy the rest of the app
COPY . .

# 8. Expose the port (if needed, e.g., 3000)
EXPOSE 3000

# 9. Start the app
CMD [ "npm", "start" ]
