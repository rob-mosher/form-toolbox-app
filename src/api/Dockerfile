# syntax=docker/dockerfile:1

FROM node:18.18.1

WORKDIR /code

RUN apt-get update && apt-get install -y \
    ghostscript \
    graphicsmagick \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE ${API_PORT}
