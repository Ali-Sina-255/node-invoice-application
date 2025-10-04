ARG NODE_VERSION=16-alpine3.12

# 2. Use the official Node.js image as base
FROM node:${NODE_VERSION}

# 3. Metadata about the image
LABEL name="mern-invoice"
LABEL description="MERN invoice image"


ARG APP_HOME=/app


WORKDIR ${APP_HOME}


COPY package*.json ./

# 9. Install dependencies
RUN npm install

CMD [ "npm", "start" ]