# syntax=docker/dockerfile:1

ARG NODE_VERSION
FROM node:${NODE_VERSION}

WORKDIR /code

RUN apt-get update && apt-get install -y \
    ghostscript \
    graphicsmagick \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY . .

CMD /bin/sh -c '\
    echo "Running migrations..." && \
    npm run migrate && \
    echo "Running seeds..." && \
    npm run seed && \
    echo "Starting application..." && \
    npm run dev:docker'

EXPOSE ${API_PORT}
