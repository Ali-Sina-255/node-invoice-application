# 1. Define a build argument for the Node.js version
ARG NODE_VERSION=16-alpine3.12

# 2. Use the official Node.js image as base
FROM node:${NODE_VERSION}

# 3. Metadata about the image
LABEL name="mern-invoice"
LABEL description="MERN invoice image"

# 4. Set environment variable
ENV NODE_ENV=development

# 5. Define a build-time variable for the app directory (fixed the syntax)
ARG APP_HOME=/app

# 6. Set the working directory inside the container
WORKDIR ${APP_HOME}

# 7. Create a system group and user for better security
RUN addgroup --system invoice \
    && adduser --system --ingroup invoice invoice

# 8. Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# 9. Install dependencies
RUN npm install

# 10. Copy all app files into the container and set proper ownership
COPY --chown=invoice:invoice . ${APP_HOME}

# 11. Explicitly set ownership again (may be redundant but ensures permissions)
RUN chown invoice:invoice ${APP_HOME}

# 12. Switch to the non-root user
USER invoice

# 13. Default command to run the app in dev mode
CMD [ "npm", "run", "dev" ]
