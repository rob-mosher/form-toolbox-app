# syntax=docker/dockerfile:1

ARG NODE_VERSION
FROM node:${NODE_VERSION}

WORKDIR /code

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE ${WEB_PORT}
